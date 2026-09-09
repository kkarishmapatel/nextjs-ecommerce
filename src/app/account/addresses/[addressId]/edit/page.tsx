import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import CustomerAddressForm from "@/components/account/CustomerAddressForm";
import { getCurrentCustomer } from "@/lib/customers/getCurrentCustomer";

type EditAddressPageProps = {
  params: Promise<{
    addressId: string;
  }>;
};

export default async function EditAddressPage({
  params,
}: EditAddressPageProps) {
  const { addressId } = await params;

  const customer =
    await getCurrentCustomer();

  if (!customer) {
    redirect("/login");
  }

  const address =
    customer.addresses.find(
      (item) => item.id === addressId
    );

  if (!address) {
    notFound();
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
          Edit Address
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Update your saved address.
        </p>
      </div>

      <section className="rounded-lg border p-6">
        <CustomerAddressForm
          mode="edit"
          address={address}
        />
      </section>
    </main>
  );
}