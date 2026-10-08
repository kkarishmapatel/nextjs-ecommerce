import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentCustomer } from "@/lib/customers/getCurrentCustomer";
import DeleteAddressButton from "@/components/account/DeleteAddressButton";
import SetDefaultAddressButton from "@/components/account/SetDefaultAddressButton";
export default async function AddressesPage() {
  const customer = await getCurrentCustomer();

  if (!customer) {
    redirect("/login");
  }

  return (
    <main className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/account"
            className="text-sm underline"
          >
            ← Back to My Account
          </Link>

          <h1 className="mt-3 text-3xl font-semibold">
            My Addresses
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage your saved addresses.
          </p>
        </div>

        <Link
          href="/account/addresses/new"
          className="rounded-md border px-4 py-2 text-sm font-medium"
        >
          + Add Address
        </Link>
      </div>

      {customer.addresses.length === 0 ? (
        <section className="rounded-lg border p-8 text-center">
          <p className="text-gray-500">
            You don't have any saved addresses yet.
          </p>

          <Link
            href="/account/addresses/new"
            className="mt-4 inline-block rounded-md border px-4 py-2 text-sm"
          >
            Add Your First Address
          </Link>
        </section>
      ) : (
        <div className="grid gap-4">
          {customer.addresses.map((address) => (
            <section
              key={address.id}
              className="rounded-lg border p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold">
                      {address.firstName}{" "}
                      {address.lastName}
                    </h2>

                    {address.isDefault && (
                      <span className="rounded-full border px-2 py-1 text-xs">
                        Default
                      </span>
                    )}
                  </div>

                  {address.company && (
                    <p className="mt-2">
                      {address.company}
                    </p>
                  )}

                  <p className="mt-2">
                    {address.address1}
                  </p>

                  {address.address2 && (
                    <p>{address.address2}</p>
                  )}

                  <p>
                    {address.city},{" "}
                    {address.state}{" "}
                    {address.postalCode}
                  </p>

                  <p>{address.country}</p>

                  {address.phone && (
                    <p className="mt-2">
                      {address.phone}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/account/addresses/${address.id}/edit`}
                    className="rounded-md border px-3 py-1 text-sm"
                  >
                    Edit
                  </Link>

                  <DeleteAddressButton
                    addressId={address.id}
                  />

                  {!address.isDefault && (
                    <SetDefaultAddressButton
                      addressId={address.id}
                    />
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}