import Link from "next/link";
import { redirect } from "next/navigation";

import ProfileForm from "@/components/account/ProfileForm";
import { getCurrentCustomer } from "@/lib/customers/getCurrentCustomer";

export default async function ProfilePage() {
  const customer = await getCurrentCustomer();

  if (!customer) {
    redirect("/login");
  }

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-6">
      {/* Header */}
      <div>
        <Link
          href="/account"
          className="text-sm underline"
        >
          ← Back to My Account
        </Link>

        <h1 className="mt-3 text-3xl font-semibold">
          Edit Profile
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Update your name, email, or password.
        </p>
      </div>

      {/* Profile Form */}
      <section className="rounded-lg border p-6">
        <ProfileForm
          initialData={{
            name: customer.user.name,
            email: customer.user.email,
          }}
        />
      </section>
    </main>
  );
}