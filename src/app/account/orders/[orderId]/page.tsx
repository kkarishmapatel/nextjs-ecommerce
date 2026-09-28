import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { getCurrentCustomer } from "@/lib/customers/getCurrentCustomer";
import { prisma } from "@/lib/prisma";

type OrderDetailsPageProps = {
  params: Promise<{
    orderId: string;
  }>;
};

export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const customer = await getCurrentCustomer();

  if (!customer) {
    redirect("/login");
  }

  const { orderId } = await params;

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      customerId: customer.id,
    },
    include: {
      address: true,
      items: true,
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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

        <span className="w-fit rounded-full bg-gray-100 px-4 py-2 text-sm font-medium">
          {order.status}
        </span>
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
                className="py-5 first:pt-0 last:pb-0"
              >
                <div className="flex justify-between gap-4">
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
                      {Number(item.lineTotal).toFixed(
                        2
                      )}
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                      ₹
                      {Number(item.price).toFixed(2)} each
                    </p>
                  </div>
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
                {Number(order.shippingAmount).toFixed(
                  2
                )}
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

          <div className="mt-6 border-t pt-6">
            <p className="text-sm font-medium">
              Payment Status
            </p>

            <p className="mt-1 text-sm text-gray-600">
              {order.paymentStatus}
            </p>
          </div>
        </aside>
      </div>

      {order.address && (
        <section className="mt-6 rounded-lg border p-6">
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

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/account/orders"
          className="rounded-md border px-6 py-3 text-center text-sm font-medium"
        >
          Back to Orders
        </Link>

        <Link
          href="/shop"
          className="rounded-md bg-black px-6 py-3 text-center text-sm font-medium text-white"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}