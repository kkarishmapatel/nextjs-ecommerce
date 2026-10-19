"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";

import {
  cancelLoginTwoFactor,
  loginUser,
  startLoginTwoFactorEnrollment,
  verifyLoginTwoFactor,
} from "@/actions/login";

type SetupData = { qrCode: string; manualSecret: string };

export default function LoginPage() {
  const [stage, setStage] = useState<"credentials" | "verify" | "enroll" | "backup">("credentials");
  const [setup, setSetup] = useState<SetupData | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRegistered = searchParams.get("registered") === "1";

  async function submitCredentials(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    const result = await loginUser(new FormData(event.currentTarget));
    if (!result.success) {
      setError(result.error);
      setPending(false);
      return;
    }

    if (result.requiresEnrollment) {
      const enrollment = await startLoginTwoFactorEnrollment();
      if (!enrollment.success) {
        setError(enrollment.error);
        setPending(false);
        return;
      }
      setSetup({ qrCode: enrollment.qrCode, manualSecret: enrollment.manualSecret });
      setStage("enroll");
    } else {
      setStage("verify");
    }
    setPending(false);
  }

  async function submitCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const result = await verifyLoginTwoFactor(new FormData(event.currentTarget));
    setPending(false);
    if (!result.success) {
      setError(result.error);
      return;
    }

    if ("backupCodes" in result) {
      setBackupCodes(result.backupCodes);
      setStage("backup");
    }
  }

  async function cancelChallenge() {
    setPending(true);
    await cancelLoginTwoFactor();
    setSetup(null);
    setBackupCodes([]);
    setError("");
    setStage("credentials");
    setPending(false);
  }

  return (
    <div className="mx-auto mt-10 max-w-md px-4 pb-10">
      <h1 className="mb-6 text-2xl font-bold">
        {stage === "credentials" ? "Login" : stage === "verify" ? "Two-factor verification" : stage === "enroll" ? "Set up your authenticator" : "Save your backup codes"}
      </h1>

      {isRegistered && stage === "credentials" && (
        <p className="mb-4 rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          Registration successful. Please log in with your new account.
        </p>
      )}

      {stage === "credentials" && (
        <form onSubmit={submitCredentials} className="space-y-4">
          <input
            autoComplete="username"
            type="email"
            name="email"
            placeholder="Email"
            className="w-full rounded border p-2"
            required
          />
          <input
            autoComplete="current-password"
            type="password"
            name="password"
            placeholder="Password"
            className="w-full rounded border p-2"
            required
          />
          <button disabled={pending} type="submit" className="rounded border px-4 py-2 disabled:opacity-50">
            {pending ? "Checking..." : "Login"}
          </button>
        </form>
      )}

      {stage === "verify" && (
        <form onSubmit={submitCode} className="space-y-4">
          <p className="text-sm text-gray-600">
            Enter a six-digit code from your authenticator app. You can also use one of your unused backup codes.
          </p>
          <input
            autoComplete="one-time-code"
            inputMode="numeric"
            name="code"
            placeholder="Authenticator or backup code"
            className="w-full rounded border p-2"
            required
            autoFocus
          />
          <div className="flex gap-3">
            <button disabled={pending} type="submit" className="rounded border px-4 py-2 disabled:opacity-50">
              {pending ? "Verifying..." : "Verify and sign in"}
            </button>
            <button disabled={pending} onClick={cancelChallenge} type="button" className="rounded border px-4 py-2">
              Cancel
            </button>
          </div>
        </form>
      )}

      {stage === "enroll" && setup && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Two-factor authentication is required for this account. Scan the QR code with an authenticator app, then enter its six-digit code to finish sign-in.
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={setup.qrCode} alt="Authenticator setup QR code" width={256} height={256} className="mx-auto" />
          <div>
            <p className="text-sm font-medium">Or enter this setup key manually</p>
            <code className="mt-1 block break-all rounded bg-gray-100 p-3 text-sm">{setup.manualSecret}</code>
          </div>
          <form onSubmit={submitCode} className="space-y-3">
            <input
              autoComplete="one-time-code"
              inputMode="numeric"
              maxLength={6}
              name="code"
              pattern="[0-9]{6}"
              placeholder="Six-digit code"
              className="w-full rounded border p-2"
              required
              autoFocus
            />
            <div className="flex gap-3">
              <button disabled={pending} type="submit" className="rounded border px-4 py-2 disabled:opacity-50">
                {pending ? "Verifying..." : "Verify and finish setup"}
              </button>
              <button disabled={pending} onClick={cancelChallenge} type="button" className="rounded border px-4 py-2">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {stage === "backup" && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Your account is protected. Save these backup codes somewhere secure. Each code can be used once.
          </p>
          <textarea
            aria-label="Backup codes"
            className="min-h-56 w-full rounded border p-3 font-mono text-sm"
            readOnly
            value={backupCodes.join("\n")}
          />
          <button
            className="rounded border px-4 py-2"
            onClick={() => router.push("/dashboard")}
            type="button"
          >
            I saved these codes, continue
          </button>
        </div>
      )}

      {error && <p role="alert" className="mt-4 text-sm text-red-600">{error}</p>}

      {stage === "credentials" && (
        <p className="mt-6 text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-gray-900 underline">
            Create one
          </Link>
        </p>
      )}
    </div>
  );
}
