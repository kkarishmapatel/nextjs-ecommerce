import Link from "next/link";
import { redirect } from "next/navigation";

import CustomerAddressForm from "@/components/account/CustomerAddressForm";
import { getCurrentCustomer } from "@/lib/customers/getCurrentCustomer";

export default async function NewAddressPage() {
  const customer = await getCurrentCustomer();

  if (!customer) {
    redirect("/login");
  }

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-6">
      <div>
        <Link
          href="/account/addresses"
          className="text-sm underline"
        >
          ← Back to Addresses
        </Link>

        <h1 className="mt-3 text-3xl font-semibold">
          Add Address
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Add a new shipping address to your account.
        </p>
      </div>

      <section className="rounded-lg border p-6">
        <CustomerAddressForm />
      </section>
    </main>
  );
}