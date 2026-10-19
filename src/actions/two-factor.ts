"use server";

import bcrypt from "bcryptjs";
import QRCode from "qrcode";
import { cookies } from "next/headers";

import { consumeFactorMatch, findFactorMatch } from "@/lib/auth-factors";
import {
  clearAuthFailures,
  isAuthRateLimited,
  recordAuthFailure,
} from "@/lib/auth-rate-limit";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import {
  createTotpUri,
  generateBackupCodes,
  generateTotpSecret,
  hashBackupCode,
  verifyTotp,
} from "@/lib/totp";
import { decryptTotpSecret, encryptTotpSecret } from "@/lib/totp-encryption";

const ENROLLMENT_LIFETIME_MS = 10 * 60 * 1000;

type ActionFailure = { success: false; error: string };
type SetupSuccess = { success: true; qrCode: string; manualSecret: string };
type BackupCodesSuccess = { success: true; backupCodes: string[] };

export async function startTwoFactorEnrollment(): Promise<ActionFailure | SetupSuccess> {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { success: false, error: "Sign in to manage your security settings." };
  }

  const now = new Date();
  const pendingIsValid = Boolean(
    currentUser.twoFactorPendingSecret &&
      currentUser.twoFactorPendingExpiresAt &&
      currentUser.twoFactorPendingExpiresAt > now
  );
  const secret = pendingIsValid
    ? decryptTotpSecret(currentUser.twoFactorPendingSecret!)
    : generateTotpSecret();
  const expiresAt = new Date(Date.now() + ENROLLMENT_LIFETIME_MS);

  await prisma.user.update({
    where: { id: currentUser.id },
    data: {
      twoFactorPendingSecret: encryptTotpSecret(secret),
      twoFactorPendingExpiresAt: expiresAt,
    },
  });

  return {
    success: true,
    qrCode: await QRCode.toDataURL(createTotpUri(secret, currentUser.email), {
      width: 256,
      margin: 1,
    }),
    manualSecret: secret,
  };
}

export async function confirmTwoFactorEnrollment(
  formData: FormData
): Promise<ActionFailure | BackupCodesSuccess> {
  const currentUser = await getCurrentUser();
  const password = formData.get("password")?.toString() ?? "";
  const code = formData.get("code")?.toString().trim() ?? "";
  if (!currentUser || !password || !code) {
    return { success: false, error: "Password and authenticator code are required." };
  }

  const user = await prisma.user.findUnique({ where: { id: currentUser.id } });
  if (!user) return { success: false, error: "Your account could not be found." };

  if (await isAuthRateLimited(user.email)) {
    return { success: false, error: "Too many attempts. Try again in 15 minutes." };
  }

  if (!(await bcrypt.compare(password, user.password))) {
    await recordAuthFailure(user.email);
    return { success: false, error: "Password or authenticator code is incorrect." };
  }

  if (user.twoFactorEnabled && user.twoFactorSecret) {
    return { success: false, error: "Two-factor authentication is already enabled." };
  }

  if (
    !user.twoFactorPendingSecret ||
    !user.twoFactorPendingExpiresAt ||
    user.twoFactorPendingExpiresAt <= new Date()
  ) {
    return { success: false, error: "Setup expired. Start authenticator setup again." };
  }

  const secret = decryptTotpSecret(user.twoFactorPendingSecret);
  const step = verifyTotp(secret, code);
  if (step === null) {
    await recordAuthFailure(user.email);
    return { success: false, error: "Password or authenticator code is incorrect." };
  }

  const backupCodes = generateBackupCodes();
  const verifiedAt = new Date();
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  try {
    await prisma.$transaction(async (transaction) => {
      const enabled = await transaction.user.updateMany({
        where: {
          id: user.id,
          twoFactorPendingSecret: user.twoFactorPendingSecret,
          twoFactorPendingExpiresAt: { gt: verifiedAt },
          twoFactorSecret: user.twoFactorSecret,
        },
        data: {
          twoFactorSecret: user.twoFactorPendingSecret,
          twoFactorPendingSecret: null,
          twoFactorPendingExpiresAt: null,
          twoFactorEnabled: true,
          twoFactorLastUsedStep: BigInt(step),
        },
      });
      if (enabled.count !== 1) throw new Error("Setup changed during confirmation");

      await transaction.backupCode.deleteMany({ where: { userId: user.id } });
      await transaction.backupCode.createMany({
        data: backupCodes.map((backupCode) => ({
          userId: user.id,
          codeHash: hashBackupCode(backupCode),
        })),
      });

      if (sessionToken) {
        await transaction.session.updateMany({
          where: { token: sessionToken, userId: user.id },
          data: { mfaVerifiedAt: verifiedAt },
        });
      }
    });
  } catch {
    return { success: false, error: "Setup expired or changed. Start again and retry." };
  }

  await clearAuthFailures(user.email);
  return { success: true, backupCodes };
}

export async function disableTwoFactor(
  formData: FormData
): Promise<ActionFailure | { success: true }> {
  const currentUser = await getCurrentUser();
  const password = formData.get("password")?.toString() ?? "";
  const code = formData.get("code")?.toString().trim() ?? "";
  if (!currentUser || !password || !code) {
    return { success: false, error: "Password and authenticator or backup code are required." };
  }

  const user = await prisma.user.findUnique({ where: { id: currentUser.id } });
  if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
    return { success: false, error: "Two-factor authentication is not configured." };
  }

  if (await isAuthRateLimited(user.email)) {
    return { success: false, error: "Too many attempts. Try again in 15 minutes." };
  }

  if (!(await bcrypt.compare(password, user.password))) {
    await recordAuthFailure(user.email);
    return { success: false, error: "Password or authenticator code is incorrect." };
  }

  const match = await findFactorMatch(user.id, user.twoFactorSecret, code);
  if (!match) {
    await recordAuthFailure(user.email);
    return { success: false, error: "Password or authenticator code is incorrect." };
  }

  try {
    await prisma.$transaction(async (transaction) => {
      if (!(await consumeFactorMatch(transaction, user.id, match))) {
        throw new Error("Factor was already used");
      }

      await transaction.user.update({
        where: { id: user.id },
        data: {
          twoFactorEnabled: false,
          twoFactorSecret: null,
          twoFactorPendingSecret: null,
          twoFactorPendingExpiresAt: null,
          twoFactorLastUsedStep: null,
        },
      });
      await transaction.backupCode.deleteMany({ where: { userId: user.id } });
    });
  } catch {
    await recordAuthFailure(user.email);
    return { success: false, error: "Password or authenticator code is incorrect." };
  }

  await clearAuthFailures(user.email);
  return { success: true };
}

export async function regenerateTwoFactorBackupCodes(
  formData: FormData
): Promise<ActionFailure | BackupCodesSuccess> {
  const currentUser = await getCurrentUser();
  const password = formData.get("password")?.toString() ?? "";
  const code = formData.get("code")?.toString().trim() ?? "";
  if (!currentUser || !password || !code) {
    return { success: false, error: "Password and authenticator or backup code are required." };
  }

  const user = await prisma.user.findUnique({ where: { id: currentUser.id } });
  if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
    return { success: false, error: "Enable an authenticator before generating backup codes." };
  }

  if (await isAuthRateLimited(user.email)) {
    return { success: false, error: "Too many attempts. Try again in 15 minutes." };
  }

  if (!(await bcrypt.compare(password, user.password))) {
    await recordAuthFailure(user.email);
    return { success: false, error: "Password or authenticator code is incorrect." };
  }

  const match = await findFactorMatch(user.id, user.twoFactorSecret, code);
  if (!match) {
    await recordAuthFailure(user.email);
    return { success: false, error: "Password or authenticator code is incorrect." };
  }

  const backupCodes = generateBackupCodes();
  try {
    await prisma.$transaction(async (transaction) => {
      if (!(await consumeFactorMatch(transaction, user.id, match))) {
        throw new Error("Factor was already used");
      }
      await transaction.backupCode.deleteMany({ where: { userId: user.id } });
      await transaction.backupCode.createMany({
        data: backupCodes.map((backupCode) => ({
          userId: user.id,
          codeHash: hashBackupCode(backupCode),
        })),
      });
    });
  } catch {
    await recordAuthFailure(user.email);
    return { success: false, error: "Password or authenticator code is incorrect." };
  }

  await clearAuthFailures(user.email);
  return { success: true, backupCodes };
}
