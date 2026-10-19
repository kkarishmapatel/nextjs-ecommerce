import { redirect } from "next/navigation";

import TwoFactorSettings from "@/components/account/TwoFactorSettings";
import { getCurrentUser } from "@/lib/session";

export default async function SecurityPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-10 sm:px-6">
      <p className="text-sm font-medium text-gray-500">ACCOUNT SETTINGS</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Security</h1>
      <p className="mt-3 mb-8 text-gray-600">
        Manage authenticator sign-in and recovery codes for your {user.role === "ADMIN" ? "administrator" : "customer"} account.
      </p>
      <TwoFactorSettings
        initiallyEnabled={user.twoFactorEnabled}
        initiallyConfigured={Boolean(user.twoFactorSecret)}
      />
    </main>
  );
}
