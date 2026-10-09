import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentCustomer } from "@/lib/customers/getCurrentCustomer";

export default async function AccountPage() {
  const customer = await getCurrentCustomer();

  if (!customer) {
    redirect("/login");
  }

  return (
    <main className="mx-auto max-w-5xl space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold">
          My Account
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Manage your account information and
          addresses.
        </p>
      </div>

      {/* Customer Information */}
      <section className="rounded-xl border bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              Profile
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your account information
            </p>
          </div>

          <Link
            href="/account/profile"
            className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-gray-50"
          >
            Edit Profile
          </Link>
        </div>

        <div className="mt-6 space-y-3">
          <div>
            <p className="text-sm text-gray-500">
              Name
            </p>

            <p className="font-medium">
              {customer.user.name}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Email
            </p>

            <p className="font-medium">
              {customer.user.email}
            </p>
          </div>
        </div>
      </section>

      {/* Addresses */}
      <section className="rounded-xl border bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              Addresses
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage your shipping and billing
              addresses.
            </p>
          </div>

          <Link
            href="/account/addresses"
            className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-gray-50"
          >
            Manage Addresses
          </Link>
        </div>

        <div className="mt-6">
          <p className="text-sm text-gray-500">
            You have{" "}
            <span className="font-medium text-gray-900">
              {customer.addresses.length}
            </span>{" "}
            saved address
            {customer.addresses.length !== 1
              ? "es"
              : ""}
            .
          </p>
        </div>
      </section>
    </main>
  );
}