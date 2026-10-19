import assert from "node:assert/strict";
import { test } from "node:test";

import {
  createTotp,
  generateBackupCodes,
  generateTotpSecret,
  hashBackupCode,
  verifyTotp,
} from "../src/lib/totp.ts";

test("TOTP matches the RFC 6238 SHA-1 six-digit vector", () => {
  const secret = "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ";
  assert.equal(createTotp(secret, 59_000).code, "287082");
  assert.equal(verifyTotp(secret, "287082", 59_000), 1);
  assert.equal(verifyTotp(secret, "000000", 59_000), null);
});

test("TOTP verification accepts adjacent 30-second steps only", () => {
  const secret = generateTotpSecret();
  const adjacentCode = createTotp(secret, 60_000).code;

  assert.equal(verifyTotp(secret, adjacentCode, 90_000), 2);
  assert.equal(verifyTotp(secret, adjacentCode, 150_000), null);
});

test("backup codes have high entropy and normalize consistently before hashing", () => {
  const codes = generateBackupCodes();
  assert.equal(codes.length, 10);
  assert.equal(new Set(codes).size, 10);
  assert.ok(codes.every((code) => /^[A-F0-9]{4}(?:-[A-F0-9]{4}){4}$/.test(code)));
  assert.equal(hashBackupCode(codes[0]), hashBackupCode(codes[0].toLowerCase().replaceAll("-", "")));
  assert.notEqual(hashBackupCode(codes[0]), hashBackupCode(codes[1]));
});
