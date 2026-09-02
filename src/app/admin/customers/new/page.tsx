import Link from "next/link";

import CustomerForm from "@/components/admin/customers/CustomerForm";

export default function NewCustomerPage() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <Link
          href="/admin/customers"
          className="text-sm underline"
        >
          ← Back to Customers
        </Link>

        <h1 className="mt-3 text-2xl font-semibold">
          Add Customer
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Create a new customer account.
        </p>
      </div>

      {/* Form */}
      <div className="max-w-2xl rounded-lg border p-6">
        <CustomerForm />
      </div>
    </div>
  );
}