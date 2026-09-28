import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

type OrderSuccessPageProps = {
  params: Promise<{
    orderId: string;
  }>;
};

export default async function OrderSuccessPage({
  params,
}: OrderSuccessPageProps) {
  const { orderId } = await params;

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
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
    <main className="mx-auto max-w-4xl p-6">
      <div className="py-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-2xl text-green-700">
          ✓
        </div>

        <h1 className="mt-6 text-3xl font-semibold">
          Order Placed Successfully
        </h1>

        <p className="mt-3 text-gray-600">
          Thank you for your order. Your order has been
          received successfully.
        </p>

        <p className="mt-4 text-lg font-medium">
          Order #{order.orderNumber}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold">
            Shipping Address
          </h2>

          {order.address && (
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
          )}
        </section>

        <section className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold">
            Order Summary
          </h2>

          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>

              <span>
                ₹{Number(order.subtotal).toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>

              <span>
                ₹{Number(order.shippingAmount).toFixed(2)}
              </span>
            </div>

            {Number(order.discountAmount) > 0 && (
              <div className="flex justify-between">
                <span>Discount</span>

                <span>
                  -₹{Number(order.discountAmount).toFixed(2)}
                </span>
              </div>
            )}

            <div className="flex justify-between border-t pt-3 font-semibold">
              <span>Total</span>

              <span>
                ₹{Number(order.total).toFixed(2)}
              </span>
            </div>
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-lg border p-6">
        <h2 className="text-lg font-semibold">
          Order Items
        </h2>

        <div className="mt-6 divide-y">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
            >
              <div>
                <p className="font-medium">
                  {item.productName}
                </p>

                <p className="mt-1 text-sm text-gray-600">
                  SKU: {item.sku}
                </p>

                <p className="mt-1 text-sm text-gray-600">
                  Qty: {item.quantity}
                </p>
              </div>

              <p className="font-medium">
                ₹{Number(item.lineTotal).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/shop"
          className="rounded-md bg-black px-6 py-3 text-center text-sm font-medium text-white"
        >
          Continue Shopping
        </Link>

        <Link
          href="/account/orders"
          className="rounded-md border px-6 py-3 text-center text-sm font-medium"
        >
          View My Orders
        </Link>
      </div>
    </main>
  );
}