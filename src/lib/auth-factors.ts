import { hashBackupCode, normalizeBackupCode, verifyTotp } from "@/lib/totp";
import { decryptTotpSecret } from "@/lib/totp-encryption";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export type FactorMatch =
  | { type: "totp"; step: bigint }
  | { type: "backup"; backupCodeId: string };

export async function findFactorMatch(
  userId: string,
  encryptedSecret: string | null,
  submittedCode: string
): Promise<FactorMatch | null> {
  const code = submittedCode.trim();

  if (/^\d{6}$/.test(code) && encryptedSecret) {
    const secret = decryptTotpSecret(encryptedSecret);
    const step = verifyTotp(secret, code);
    if (step !== null) {
      return { type: "totp", step: BigInt(step) };
    }
  }

  const normalizedCode = normalizeBackupCode(code);
  if (!/^[A-F0-9]{20}$/.test(normalizedCode)) {
    return null;
  }

  const backupCode = await prisma.backupCode.findUnique({
    where: {
      userId_codeHash: {
        userId,
        codeHash: hashBackupCode(normalizedCode),
      },
    },
    select: { id: true },
  });

  return backupCode ? { type: "backup", backupCodeId: backupCode.id } : null;
}

export async function consumeFactorMatch(
  transaction: Prisma.TransactionClient,
  userId: string,
  match: FactorMatch
) {
  if (match.type === "backup") {
    const result = await transaction.backupCode.deleteMany({
      where: { id: match.backupCodeId, userId },
    });
    return result.count === 1;
  }

  const result = await transaction.user.updateMany({
    where: {
      id: userId,
      OR: [
        { twoFactorLastUsedStep: null },
        { twoFactorLastUsedStep: { lt: match.step } },
      ],
    },
    data: { twoFactorLastUsedStep: match.step },
  });

  return result.count === 1;
}
