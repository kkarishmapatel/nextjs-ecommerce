import Link from "next/link";
import DeleteCustomerButton from "@/components/admin/customers/DeleteCustomerButton";
import { prisma } from "@/lib/prisma";

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          addresses: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Customers
          </h1>

          <p className="text-sm text-gray-500">
            Manage your store customers and their addresses.
          </p>
        </div>
        <Link
          href="/admin/customers/new"
          className="rounded bg-black px-4 py-2 text-white"
        >
          Add Customer

        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-left">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Addresses</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="border-b last:border-b-0"
              >
                <td className="px-4 py-3">
                  {customer.user.name}
                </td>

                <td className="px-4 py-3">
                  {customer.user.email}
                </td>

                <td className="px-4 py-3">
                  {customer._count.addresses}
                </td>

                <td className="px-4 py-3">
                  {customer.createdAt.toLocaleDateString()}
                </td>

                <td className="px-4 py-3">

                  
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/customers/${customer.id}`}
                      className="rounded-md border px-3 py-1 text-sm"
                    >
                      View
                    </Link>

                    <Link
                      href={`/admin/customers/${customer.id}/edit`}
                      className="rounded-md border px-3 py-1 text-sm"
                    >
                      Edit
                    </Link>

                    <DeleteCustomerButton
                      customerId={customer.id}
                      customerName={customer.user.name}
                    />
                  </div>
                </td>
              </tr>
            ))}

            {customers.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}