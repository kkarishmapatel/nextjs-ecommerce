import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import OrderStatusControls from "@/components/admin/orders/OrderStatusControls";

type AdminOrderDetailsPageProps = {
    params: Promise<{
        orderId: string;
    }>;
};

export default async function AdminOrderDetailsPage({
    params,
}: AdminOrderDetailsPageProps) {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    if (user.role !== "ADMIN") {
        redirect("/");
    }

    const { orderId } = await params;

    const order = await prisma.order.findUnique({
        where: {
            id: orderId,
        },
        include: {
            customer: {
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                },
            },
            address: true,
            items: true,
        },
    });

    if (!order) {
        notFound();
    }

    return (
        <main className="mx-auto max-w-6xl p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p className="text-sm text-gray-600">
                        Order Details
                    </p>

                    <h1 className="mt-1 text-3xl font-semibold">
                        #{order.orderNumber}
                    </h1>

                    <p className="mt-2 text-sm text-gray-600">
                        Placed on{" "}
                        {order.createdAt.toLocaleDateString("en-IN")}
                    </p>
                </div>

                <div className="flex gap-2">
                    <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium">
                        {order.status}
                    </span>

                    <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium">
                        Payment: {order.paymentStatus}
                    </span>
                </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
                <section className="lg:col-span-2 rounded-lg border p-6">
                    <h2 className="text-lg font-semibold">
                        Order Items
                    </h2>

                    <div className="mt-6 divide-y">
                        {order.items.map((item) => (
                            <div
                                key={item.id}
                                className="flex justify-between gap-6 py-5 first:pt-0 last:pb-0"
                            >
                                <div>
                                    <p className="font-medium">
                                        {item.productName}
                                    </p>

                                    <p className="mt-1 text-sm text-gray-600">
                                        SKU: {item.sku}
                                    </p>

                                    <p className="mt-1 text-sm text-gray-600">
                                        Quantity: {item.quantity}
                                    </p>

                                    {Array.isArray(item.attributes) &&
                                        item.attributes.length > 0 && (
                                            <div className="mt-2 text-sm text-gray-600">
                                                {item.attributes.map(
                                                    (attribute, index) => {
                                                        if (
                                                            typeof attribute !==
                                                            "object" ||
                                                            attribute === null
                                                        ) {
                                                            return null;
                                                        }

                                                        const name =
                                                            "attribute" in attribute
                                                                ? String(
                                                                    attribute.attribute
                                                                )
                                                                : "";

                                                        const value =
                                                            "value" in attribute
                                                                ? String(
                                                                    attribute.value
                                                                )
                                                                : "";

                                                        return (
                                                            <p key={index}>
                                                                {name}: {value}
                                                            </p>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        )}
                                </div>

                                <div className="text-right">
                                    <p className="font-medium">
                                        ₹
                                        {Number(item.lineTotal).toFixed(2)}
                                    </p>

                                    <p className="mt-1 text-sm text-gray-600">
                                        ₹
                                        {Number(item.price).toFixed(2)} each
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <aside className="h-fit rounded-lg border p-6">
                    <h2 className="text-lg font-semibold">
                        Order Summary
                    </h2>

                    <div className="mt-6 space-y-4 text-sm">
                        <div className="flex justify-between">
                            <span>Subtotal</span>

                            <span>
                                ₹{Number(order.subtotal).toFixed(2)}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span>Shipping</span>

                            <span>
                                ₹
                                {Number(
                                    order.shippingAmount
                                ).toFixed(2)}
                            </span>
                        </div>

                        {Number(order.discountAmount) > 0 && (
                            <div className="flex justify-between">
                                <span>Discount</span>

                                <span>
                                    -₹
                                    {Number(
                                        order.discountAmount
                                    ).toFixed(2)}
                                </span>
                            </div>
                        )}

                        <div className="flex justify-between border-t pt-4 font-semibold">
                            <span>Total</span>

                            <span>
                                ₹{Number(order.total).toFixed(2)}
                            </span>
                        </div>
                    </div>
                </aside>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
                <section className="rounded-lg border p-6">
                    <h2 className="text-lg font-semibold">
                        Customer
                    </h2>

                    <div className="mt-4 text-sm">
                        <p className="font-medium">
                            {order.customer.user.name}
                        </p>

                        <p className="mt-1 text-gray-600">
                            {order.customer.user.email}
                        </p>
                    </div>
                </section>

                {order.address && (
                    <section className="rounded-lg border p-6">
                        <h2 className="text-lg font-semibold">
                            Shipping Address
                        </h2>

                        <div className="mt-4 text-sm">
                            <p className="font-medium">
                                {order.address.firstName}{" "}
                                {order.address.lastName}
                            </p>

                            {order.address.company && (
                                <p className="mt-1">
                                    {order.address.company}
                                </p>
                            )}

                            <p className="mt-1">
                                {order.address.address1}
                            </p>

                            {order.address.address2 && (
                                <p>{order.address.address2}</p>
                            )}

                            <p>
                                {order.address.city},{" "}
                                {order.address.state}{" "}
                                {order.address.postalCode}
                            </p>

                            <p>{order.address.country}</p>

                            {order.address.phone && (
                                <p className="mt-1">
                                    {order.address.phone}
                                </p>
                            )}
                        </div>
                    </section>
                )}
            </div>

            <OrderStatusControls
                orderId={order.id}
                orderStatus={order.status}
                paymentStatus={order.paymentStatus}
            />

            <div className="mt-8">
                <Link
                    href="/admin/orders"
                    className="text-sm font-medium underline"
                >
                    Back to Orders
                </Link>
            </div>
        </main>
    );
}