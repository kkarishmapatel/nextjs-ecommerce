"use server";

import bcrypt from "bcryptjs";
import { createHash, randomBytes } from "node:crypto";
import QRCode from "qrcode";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { consumeFactorMatch, findFactorMatch } from "@/lib/auth-factors";
import {
  clearAuthFailures,
  isAuthRateLimited,
  recordAuthFailure,
} from "@/lib/auth-rate-limit";
import { createAuthenticatedSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import {
  createTotpUri,
  generateBackupCodes,
  generateTotpSecret,
  hashBackupCode,
  verifyTotp,
} from "@/lib/totp";
import { decryptTotpSecret, encryptTotpSecret } from "@/lib/totp-encryption";

const CHALLENGE_COOKIE = "mfa_challenge";
const CHALLENGE_LIFETIME_MS = 10 * 60 * 1000;
const MAX_CHALLENGE_ATTEMPTS = 5;

type LoginFailure = { success: false; error: string };
type LoginSuccess = {
  success: true;
  requiresTwoFactor: true;
  requiresEnrollment: boolean;
};
type EnrollmentSuccess = {
  success: true;
  qrCode: string;
  manualSecret: string;
};
type VerificationSuccess = { success: true; backupCodes: string[] };

function hashChallengeToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function challengeCookieOptions(expires: Date) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    expires,
  };
}

async function clearExistingChallenge() {
  const cookieStore = await cookies();
  const token = cookieStore.get(CHALLENGE_COOKIE)?.value;
  if (token) {
    await prisma.loginChallenge.deleteMany({
      where: { tokenHash: hashChallengeToken(token) },
    });
  }
  cookieStore.delete(CHALLENGE_COOKIE);
}

async function getActiveChallenge() {
  const cookieStore = await cookies();
  const token = cookieStore.get(CHALLENGE_COOKIE)?.value;
  if (!token) return null;

  const challenge = await prisma.loginChallenge.findUnique({
    where: { tokenHash: hashChallengeToken(token) },
    include: { user: true },
  });

  if (!challenge || challenge.expiresAt <= new Date()) {
    if (challenge) {
      await prisma.loginChallenge.deleteMany({
        where: { id: challenge.id },
      });
    }
    cookieStore.delete(CHALLENGE_COOKIE);
    return null;
  }

  return { challenge, cookieStore };
}

async function registerChallengeFailure(
  challengeId: string,
  email: string
) {
  await recordAuthFailure(email);
  const updated = await prisma.loginChallenge.updateMany({
    where: { id: challengeId, attempts: { lt: MAX_CHALLENGE_ATTEMPTS } },
    data: { attempts: { increment: 1 } },
  });

  if (updated.count === 0) {
    await clearExistingChallenge();
    return "Too many verification attempts. Please sign in again.";
  }

  const challenge = await prisma.loginChallenge.findUnique({
    where: { id: challengeId },
    select: { attempts: true },
  });
  if (challenge && challenge.attempts >= MAX_CHALLENGE_ATTEMPTS) {
    await clearExistingChallenge();
    return "Too many verification attempts. Please sign in again.";
  }

  return "The verification code is incorrect or expired.";
}

export async function loginUser(
  formData: FormData
): Promise<LoginFailure | LoginSuccess> {
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { success: false, error: "Email and password are required" };
  }

  if (await isAuthRateLimited(email)) {
    return {
      success: false,
      error: "Too many sign-in attempts. Try again in 15 minutes.",
    };
  }

  const user = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
  });
  const isValid = await bcrypt.compare(
    password,
    user?.password ?? "$2b$10$C6UzMDM.H6dfI/f/IKcEe.5bFrt3/.fEwdNc6I0"
  );

  if (!user || !isValid) {
    await recordAuthFailure(email);
    return { success: false, error: "Invalid credentials" };
  }

  await clearAuthFailures(email);
  await clearExistingChallenge();

  const cookieStore = await cookies();
  const existingSessionToken = cookieStore.get("session")?.value;
  if (existingSessionToken) {
    await prisma.session.deleteMany({
      where: { token: existingSessionToken },
    });
  }
  cookieStore.delete("session");

  if (!user.twoFactorEnabled) {
    await createAuthenticatedSession(user.id, null);
    redirect("/dashboard");
  }

  const rawChallengeToken = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + CHALLENGE_LIFETIME_MS);
  await prisma.loginChallenge.create({
    data: {
      tokenHash: hashChallengeToken(rawChallengeToken),
      userId: user.id,
      expiresAt,
    },
  });
  cookieStore.set(
    CHALLENGE_COOKIE,
    rawChallengeToken,
    challengeCookieOptions(expiresAt)
  );

  return {
    success: true,
    requiresTwoFactor: true,
    requiresEnrollment: !user.twoFactorSecret,
  };
}

export async function startLoginTwoFactorEnrollment(): Promise<
  LoginFailure | EnrollmentSuccess
> {
  const active = await getActiveChallenge();
  if (!active || !active.challenge.user.twoFactorEnabled) {
    return { success: false, error: "Your sign-in challenge expired. Please sign in again." };
  }

  const { challenge, cookieStore } = active;
  if (challenge.user.twoFactorSecret) {
    return { success: false, error: "An authenticator is already configured. Enter its code." };
  }

  const now = new Date();
  const pendingIsValid = Boolean(
    challenge.user.twoFactorPendingSecret &&
      challenge.user.twoFactorPendingExpiresAt &&
      challenge.user.twoFactorPendingExpiresAt > now
  );
  const secret = pendingIsValid
    ? decryptTotpSecret(challenge.user.twoFactorPendingSecret!)
    : generateTotpSecret();
  const expiresAt = new Date(Date.now() + CHALLENGE_LIFETIME_MS);

  if (!pendingIsValid) {
    await prisma.user.update({
      where: { id: challenge.userId },
      data: {
        twoFactorPendingSecret: encryptTotpSecret(secret),
        twoFactorPendingExpiresAt: expiresAt,
      },
    });
  } else {
    await prisma.user.update({
      where: { id: challenge.userId },
      data: { twoFactorPendingExpiresAt: expiresAt },
    });
  }

  await prisma.loginChallenge.update({
    where: { id: challenge.id },
    data: { expiresAt },
  });
  cookieStore.set(CHALLENGE_COOKIE, cookieStore.get(CHALLENGE_COOKIE)!.value, challengeCookieOptions(expiresAt));

  const uri = createTotpUri(secret, challenge.user.email);
  return {
    success: true,
    qrCode: await QRCode.toDataURL(uri, { width: 256, margin: 1 }),
    manualSecret: secret,
  };
}

export async function verifyLoginTwoFactor(
  formData: FormData
): Promise<LoginFailure | VerificationSuccess> {
  const code = formData.get("code")?.toString().trim() ?? "";
  const active = await getActiveChallenge();

  if (!active) {
    return { success: false, error: "Your sign-in challenge expired. Please sign in again." };
  }

  const { challenge, cookieStore } = active;
  const user = challenge.user;
  if (await isAuthRateLimited(user.email)) {
    return {
      success: false,
      error: "Too many verification attempts. Try again in 15 minutes.",
    };
  }

  const completingEnrollment = !user.twoFactorSecret;
  let match: Awaited<ReturnType<typeof findFactorMatch>> = null;

  if (completingEnrollment) {
    const pendingSecret = user.twoFactorPendingSecret;
    if (!pendingSecret || !user.twoFactorPendingExpiresAt || user.twoFactorPendingExpiresAt <= new Date()) {
      return {
        success: false,
        error: "Authenticator setup expired. Start setup again.",
      };
    }
    const secret = decryptTotpSecret(pendingSecret);
    const step = verifyTotp(secret, code);
    if (step !== null) {
      match = { type: "totp", step: BigInt(step) };
    }
  } else {
    match = await findFactorMatch(user.id, user.twoFactorSecret, code);
  }

  if (!match) {
    return {
      success: false,
      error: await registerChallengeFailure(challenge.id, user.email),
    };
  }

  const sessionToken = randomBytes(32).toString("hex");
  const sessionExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const verifiedAt = new Date();
  const rawChallengeToken = cookieStore.get(CHALLENGE_COOKIE)?.value;
  let issuedBackupCodes: string[] = [];

  try {
    issuedBackupCodes = await prisma.$transaction(async (transaction) => {
      const claimedChallenge = await transaction.loginChallenge.deleteMany({
        where: {
          id: challenge.id,
          tokenHash: rawChallengeToken
            ? hashChallengeToken(rawChallengeToken)
            : "",
          expiresAt: { gt: verifiedAt },
          attempts: { lt: MAX_CHALLENGE_ATTEMPTS },
        },
      });
      if (claimedChallenge.count !== 1) {
        throw new Error("Challenge already used");
      }

      if (completingEnrollment) {
        const pendingSecret = user.twoFactorPendingSecret!;
        const updatedUser = await transaction.user.updateMany({
          where: {
            id: user.id,
            twoFactorPendingSecret: pendingSecret,
            twoFactorPendingExpiresAt: { gt: verifiedAt },
            twoFactorSecret: null,
          },
          data: {
            twoFactorSecret: pendingSecret,
            twoFactorPendingSecret: null,
            twoFactorPendingExpiresAt: null,
            twoFactorEnabled: true,
            twoFactorLastUsedStep: match!.type === "totp" ? match!.step : null,
          },
        });
        if (updatedUser.count !== 1) {
          throw new Error("Authenticator setup expired");
        }

        const backupCodes = generateBackupCodes();
        await transaction.backupCode.createMany({
          data: backupCodes.map((backupCode) => ({
            userId: user.id,
            codeHash: hashBackupCode(backupCode),
          })),
        });
        await transaction.session.create({
          data: {
            token: sessionToken,
            userId: user.id,
            expiresAt: sessionExpiresAt,
            mfaVerifiedAt: verifiedAt,
          },
        });
        return backupCodes;
      }

      const consumed = await consumeFactorMatch(transaction, user.id, match!);
      if (!consumed) {
        throw new Error("Verification code already used");
      }

      await transaction.session.create({
        data: {
          token: sessionToken,
          userId: user.id,
          expiresAt: sessionExpiresAt,
          mfaVerifiedAt: verifiedAt,
        },
      });
      return [] as string[];
    });
    cookieStore.delete(CHALLENGE_COOKIE);
    cookieStore.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: sessionExpiresAt,
    });
    await clearAuthFailures(user.email);
  } catch {
    return {
      success: false,
      error: "This verification code has expired or was already used. Please try again.",
    };
  }

  if (completingEnrollment) {
    return { success: true, backupCodes: issuedBackupCodes };
  }

  redirect("/dashboard");
}

export async function cancelLoginTwoFactor() {
  await clearExistingChallenge();
  return { success: true };
}
