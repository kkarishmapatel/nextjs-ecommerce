import Link from "next/link";
import { notFound } from "next/navigation";

import CustomerForm from "@/components/admin/customers/CustomerForm";
import { prisma } from "@/lib/prisma";

type EditCustomerPageProps = {
  params: Promise<{
    customerId: string;
  }>;
};

export default async function EditCustomerPage({
  params,
}: EditCustomerPageProps) {
  const { customerId } = await params;

  const customer =
    await prisma.customer.findUnique({
      where: {
        id: customerId,
      },
      select: {
        id: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

  if (!customer) {
    notFound();
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <Link
          href={`/admin/customers/${customer.id}`}
          className="text-sm underline"
        >
          ← Back to Customer
        </Link>

        <h1 className="mt-3 text-2xl font-semibold">
          Edit Customer
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Update customer information.
        </p>
      </div>

      {/* Form */}
      <div className="max-w-2xl rounded-lg border p-6">
        <CustomerForm
          customer={{
            id: customer.id,
            name: customer.user.name,
            email: customer.user.email,
            role: customer.user.role,
          }}
        />
      </div>
    </div>
  );
}