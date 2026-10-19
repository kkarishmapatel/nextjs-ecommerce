"use client";

import { useState, type FormEvent } from "react";

import {
  confirmTwoFactorEnrollment,
  disableTwoFactor,
  regenerateTwoFactorBackupCodes,
  startTwoFactorEnrollment,
} from "@/actions/two-factor";

type SetupData = { qrCode: string; manualSecret: string };

export default function TwoFactorSettings({
  initiallyEnabled,
  initiallyConfigured,
}: {
  initiallyEnabled: boolean;
  initiallyConfigured: boolean;
}) {
  const [enabled, setEnabled] = useState(initiallyEnabled);
  const [configured, setConfigured] = useState(initiallyConfigured);
  const [setup, setSetup] = useState<SetupData | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function beginSetup() {
    setBusy(true);
    setError("");
    setMessage("");
    const result = await startTwoFactorEnrollment();
    setBusy(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    setSetup({ qrCode: result.qrCode, manualSecret: result.manualSecret });
  }

  async function submitEnrollment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const result = await confirmTwoFactorEnrollment(new FormData(event.currentTarget));
    setBusy(false);
    if (!result.success) {
      setError(result.error);
      return;
    }

    setEnabled(true);
    setConfigured(true);
    setSetup(null);
    setBackupCodes(result.backupCodes);
    setMessage("Two-factor authentication is enabled.");
  }

  async function submitDisable(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const result = await disableTwoFactor(new FormData(event.currentTarget));
    setBusy(false);
    if (!result.success) {
      setError(result.error);
      return;
    }

    setEnabled(false);
    setConfigured(false);
    setSetup(null);
    setBackupCodes(null);
    setMessage("Two-factor authentication is disabled.");
  }

  async function submitRegeneration(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const result = await regenerateTwoFactorBackupCodes(new FormData(event.currentTarget));
    setBusy(false);
    if (!result.success) {
      setError(result.error);
      return;
    }

    setBackupCodes(result.backupCodes);
    setMessage("Your previous backup codes have been replaced.");
  }

  return (
    <section className="space-y-6 rounded-xl border bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold">Authenticator app</h2>
        <p className="mt-1 text-sm text-gray-600">
          {enabled && configured
            ? "Enabled. Sign-ins require a code from your authenticator app or a backup code."
            : enabled
              ? "Setup is required before your next sign-in."
              : "Disabled. You can enable an authenticator app for added sign-in protection."}
        </p>
      </div>

      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      {message && <p role="status" className="text-sm text-green-700">{message}</p>}

      {backupCodes && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4">
          <h3 className="font-semibold">Save your backup codes</h3>
          <p className="mt-1 text-sm text-gray-700">
            Each code works once. This list is shown only now; store it somewhere safe.
          </p>
          <textarea
            aria-label="Backup codes"
            className="mt-3 min-h-36 w-full rounded border bg-white p-3 font-mono text-sm"
            readOnly
            value={backupCodes.join("\n")}
          />
          <button
            className="mt-2 text-sm font-medium underline"
            onClick={() => setBackupCodes(null)}
            type="button"
          >
            I saved these codes
          </button>
        </div>
      )}

      {!setup && !enabled && !backupCodes && (
        <button
          className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          disabled={busy}
          onClick={beginSetup}
          type="button"
        >
          {busy ? "Preparing..." : "Set up authenticator"}
        </button>
      )}

      {enabled && !configured && !setup && (
        <button
          className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          disabled={busy}
          onClick={beginSetup}
          type="button"
        >
          {busy ? "Preparing..." : "Continue setup"}
        </button>
      )}

      {setup && (
        <div className="grid gap-6 md:grid-cols-[auto_1fr]">
          <div>
            <p className="mb-2 text-sm font-medium">Scan this QR code</p>
            {/* The QR contains the one-time setup secret and stays in this authenticated view. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={setup.qrCode} alt="Authenticator setup QR code" width={256} height={256} />
          </div>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              If you cannot scan it, enter this key in your authenticator app:
            </p>
            <code className="block break-all rounded bg-gray-100 p-3 text-sm">{setup.manualSecret}</code>
            <form className="space-y-3" onSubmit={submitEnrollment}>
              <label className="block text-sm font-medium">
                Current password
                <input
                  autoComplete="current-password"
                  className="mt-1 block w-full rounded border p-2"
                  name="password"
                  required
                  type="password"
                />
              </label>
              <label className="block text-sm font-medium">
                Six-digit authenticator code
                <input
                  autoComplete="one-time-code"
                  className="mt-1 block w-full rounded border p-2"
                  inputMode="numeric"
                  maxLength={6}
                  name="code"
                  pattern="[0-9]{6}"
                  required
                />
              </label>
              <button
                className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                disabled={busy}
                type="submit"
              >
                {busy ? "Verifying..." : "Verify and enable"}
              </button>
            </form>
          </div>
        </div>
      )}

      {enabled && configured && !backupCodes && (
        <div className="grid gap-6 border-t pt-5 lg:grid-cols-2">
          <form className="space-y-3" onSubmit={submitDisable}>
            <h3 className="font-medium">Disable two-factor authentication</h3>
            <label className="block text-sm">
              Current password
              <input className="mt-1 block w-full rounded border p-2" name="password" required type="password" />
            </label>
            <label className="block text-sm">
              Authenticator or unused backup code
              <input className="mt-1 block w-full rounded border p-2" name="code" required />
            </label>
            <button className="rounded border border-red-300 px-4 py-2 text-sm text-red-700 disabled:opacity-50" disabled={busy} type="submit">
              Disable 2FA
            </button>
          </form>

          <form className="space-y-3" onSubmit={submitRegeneration}>
            <h3 className="font-medium">Replace backup codes</h3>
            <p className="text-sm text-gray-600">This invalidates every backup code you have now.</p>
            <label className="block text-sm">
              Current password
              <input className="mt-1 block w-full rounded border p-2" name="password" required type="password" />
            </label>
            <label className="block text-sm">
              Authenticator or unused backup code
              <input className="mt-1 block w-full rounded border p-2" name="code" required />
            </label>
            <button className="rounded border px-4 py-2 text-sm disabled:opacity-50" disabled={busy} type="submit">
              Generate new backup codes
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
