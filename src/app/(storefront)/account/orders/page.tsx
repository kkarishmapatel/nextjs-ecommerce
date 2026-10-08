import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentCustomer } from "@/lib/customers/getCurrentCustomer";
import { prisma } from "@/lib/prisma";

export default async function OrdersPage() {
  const customer = await getCurrentCustomer();

  if (!customer) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: {
      customerId: customer.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      items: {
        select: {
          id: true,
        },
      },
    },
  });

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div>
        <h1 className="text-3xl font-semibold">
          My Orders
        </h1>

        <p className="mt-2 text-sm text-gray-600">
          View your order history and order details.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="mt-10 rounded-lg border p-8 text-center">
          <h2 className="text-lg font-semibold">
            No orders yet
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            You haven't placed any orders yet.
          </p>

          <Link
            href="/shop"
            className="mt-6 inline-block rounded-md bg-black px-6 py-3 text-sm font-medium text-white"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-lg border">
          <div className="hidden grid-cols-[1.5fr_1fr_1fr_1fr_auto] gap-4 border-b bg-gray-50 px-6 py-4 text-sm font-medium md:grid">
            <span>Order</span>
            <span>Date</span>
            <span>Status</span>
            <span>Total</span>
            <span></span>
          </div>

          <div className="divide-y">
            {orders.map((order) => (
              <div
                key={order.id}
                className="grid gap-4 px-6 py-5 md:grid-cols-[1.5fr_1fr_1fr_1fr_auto] md:items-center"
              >
                <div>
                  <p className="font-medium">
                    #{order.orderNumber}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {order.items.length}{" "}
                    {order.items.length === 1
                      ? "item"
                      : "items"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 md:hidden">
                    Date
                  </p>

                  <p className="text-sm">
                    {order.createdAt.toLocaleDateString(
                      "en-IN"
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 md:hidden">
                    Status
                  </p>

                  <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium">
                    {order.status}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-gray-600 md:hidden">
                    Total
                  </p>

                  <p className="font-medium">
                    ₹{Number(order.total).toFixed(2)}
                  </p>
                </div>

                <div>
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="text-sm font-medium underline"
                  >
                    View Order
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <Link
          href="/shop"
          className="text-sm font-medium underline"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}