import { createHmac, randomBytes, timingSafeEqual, createHash } from "node:crypto";

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const TOTP_STEP_SECONDS = 30;

export function generateTotpSecret(bytes = 20) {
  const input = randomBytes(bytes);
  let bits = 0;
  let value = 0;
  let output = "";

  for (const byte of input) {
    value = (value << 8) | byte;
    bits += 8;

    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  }

  return output;
}

function decodeBase32(value: string) {
  const normalized = value.replace(/[=\s-]/g, "").toUpperCase();
  if (!normalized || !/^[A-Z2-7]+$/.test(normalized)) {
    throw new Error("Invalid TOTP secret");
  }

  let bits = 0;
  let buffer = 0;
  const bytes: number[] = [];

  for (const character of normalized) {
    buffer = (buffer << 5) | BASE32_ALPHABET.indexOf(character);
    bits += 5;

    if (bits >= 8) {
      bytes.push((buffer >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return Buffer.from(bytes);
}

export function createTotp(secret: string, timeMs = Date.now()) {
  const step = Math.floor(timeMs / (TOTP_STEP_SECONDS * 1000));
  const counter = Buffer.alloc(8);
  counter.writeBigUInt64BE(BigInt(step));

  const digest = createHmac("sha1", decodeBase32(secret))
    .update(counter)
    .digest();
  const offset = digest[digest.length - 1] & 0x0f;
  const binary =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff);

  return {
    code: String(binary % 1_000_000).padStart(6, "0"),
    step,
  };
}

export function verifyTotp(
  secret: string,
  code: string,
  timeMs = Date.now(),
  window = 1
) {
  if (!/^\d{6}$/.test(code)) {
    return null;
  }

  const currentStep = Math.floor(timeMs / (TOTP_STEP_SECONDS * 1000));

  for (const offset of [0, -1, 1]) {
    if (Math.abs(offset) > window) continue;

    const step = currentStep + offset;
    const expected = createTotp(secret, step * TOTP_STEP_SECONDS * 1000).code;
    const expectedBytes = Buffer.from(expected);
    const suppliedBytes = Buffer.from(code);

    if (timingSafeEqual(expectedBytes, suppliedBytes)) {
      return step;
    }
  }

  return null;
}

export function createTotpUri(secret: string, email: string, issuer = "My Store") {
  const label = encodeURIComponent(`${issuer}:${email}`);
  const query = new URLSearchParams({
    secret,
    issuer,
    algorithm: "SHA1",
    digits: "6",
    period: String(TOTP_STEP_SECONDS),
  });

  return `otpauth://totp/${label}?${query.toString()}`;
}

export function generateBackupCodes(count = 10) {
  return Array.from({ length: count }, () =>
    randomBytes(10).toString("hex").toUpperCase().match(/.{1,4}/g)!.join("-")
  );
}

export function normalizeBackupCode(code: string) {
  return code.replace(/[\s-]/g, "").toUpperCase();
}

export function hashBackupCode(code: string) {
  return createHash("sha256").update(normalizeBackupCode(code)).digest("hex");
}
