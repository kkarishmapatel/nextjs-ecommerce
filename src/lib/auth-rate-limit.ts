import { createHash } from "node:crypto";

import { prisma } from "@/lib/prisma";

const FAILURE_LIMIT = 5;
const FAILURE_WINDOW_MS = 15 * 60 * 1000;

function rateLimitKey(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const digest = createHash("sha256").update(normalizedEmail).digest("hex");
  return `account:${digest}`;
}

export async function isAuthRateLimited(email: string) {
  const record = await prisma.authRateLimit.findUnique({
    where: { key: rateLimitKey(email) },
    select: { blockedUntil: true },
  });

  return Boolean(record?.blockedUntil && record.blockedUntil > new Date());
}

export async function recordAuthFailure(email: string) {
  const key = rateLimitKey(email);
  const now = new Date();
  const resetBefore = new Date(now.getTime() - FAILURE_WINDOW_MS);
  const blockedUntil = new Date(now.getTime() + FAILURE_WINDOW_MS);

  // A single upsert keeps concurrent failures from resetting or skipping the
  // database-backed account lockout counter.
  await prisma.$executeRaw`
    INSERT INTO "AuthRateLimit" ("key", "failedAttempts", "windowStartedAt", "blockedUntil", "updatedAt")
    VALUES (${key}, 1, ${now}, NULL, ${now})
    ON CONFLICT ("key") DO UPDATE SET
      "failedAttempts" = CASE
        WHEN "AuthRateLimit"."windowStartedAt" <= ${resetBefore} THEN 1
        ELSE "AuthRateLimit"."failedAttempts" + 1
      END,
      "windowStartedAt" = CASE
        WHEN "AuthRateLimit"."windowStartedAt" <= ${resetBefore} THEN ${now}
        ELSE "AuthRateLimit"."windowStartedAt"
      END,
      "blockedUntil" = CASE
        WHEN CASE
          WHEN "AuthRateLimit"."windowStartedAt" <= ${resetBefore} THEN 1
          ELSE "AuthRateLimit"."failedAttempts" + 1
        END >= ${FAILURE_LIMIT} THEN ${blockedUntil}
        WHEN "AuthRateLimit"."windowStartedAt" <= ${resetBefore} THEN NULL
        ELSE "AuthRateLimit"."blockedUntil"
      END,
      "updatedAt" = ${now}
  `;
}

export async function clearAuthFailures(email: string) {
  await prisma.authRateLimit.deleteMany({
    where: { key: rateLimitKey(email) },
  });
}
