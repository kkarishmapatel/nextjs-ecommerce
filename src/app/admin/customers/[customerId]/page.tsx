import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CustomerAddressForm from "@/components/admin/customers/CustomerAddressForm";
import CustomerAddressActions from "@/components/admin/customers/CustomerAddressActions";

type CustomerDetailPageProps = {
    params: Promise<{
        customerId: string;
    }>;
};

export default async function CustomerDetailPage({
    params,
}: CustomerDetailPageProps) {
    const { customerId } = await params;

    const customer = await prisma.customer.findUnique({
        where: {
            id: customerId,
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                },
            },
            addresses: {
                orderBy: [
                    {
                        isDefault: "desc",
                    },
                    {
                        createdAt: "desc",
                    },
                ],
            },
        },
    });

    if (!customer) {
        notFound();
    }

    return (
        <div className="space-y-6 p-6">
            <div>
                <Link
                    href="/admin/customers"
                    className="text-sm underline"
                >
                    ← Back to Customers
                </Link>

                <h1 className="mt-3 text-2xl font-semibold">
                    {customer.user.name}
                </h1>

                <p className="text-sm text-gray-500">
                    {customer.user.email}
                </p>
            </div>

            <section className="space-y-4">
                <div>
                    <h2 className="text-lg font-semibold">
                        Addresses
                    </h2>

                    <p className="text-sm text-gray-500">
                        {customer.addresses.length} address
                        {customer.addresses.length === 1 ? "" : "es"}
                    </p>
                </div>

                <CustomerAddressForm
                    customerId={customer.id}
                />

                {customer.addresses.length === 0 ? (
                    <div className="rounded-lg border p-6 text-sm text-gray-500">
                        No addresses found.
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {customer.addresses.map((address) => (
                            <div
                                key={address.id}
                                className="rounded-lg border p-4"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="font-medium">
                                            {address.firstName}{" "}
                                            {address.lastName}
                                        </h3>

                                        {address.company && (
                                            <p className="text-sm">
                                                {address.company}
                                            </p>
                                        )}
                                    </div>

                                    {address.isDefault && (
                                        <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-700">
                                            Default
                                        </span>
                                    )}
                                </div>

                                <div className="mt-3 space-y-1 text-sm text-gray-600">
                                    <p>{address.address1}</p>

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
                                        <p>{address.phone}</p>
                                    )}
                                </div>

                                <CustomerAddressActions
                                    customerId={customer.id}
                                    addressId={address.id}
                                    isDefault={address.isDefault}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}