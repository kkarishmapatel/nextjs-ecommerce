import Link from "next/link";
import { redirect } from "next/navigation";

// import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export default async function AdminOrdersPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
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
      _count: {
        select: {
          items: true,
        },
      },
    },
  });

  return (
    <main className="mx-auto max-w-7xl p-6">
      <div>
        <h1 className="text-3xl font-semibold">
          Orders
        </h1>

        <p className="mt-2 text-sm text-gray-600">
          Manage customer orders and order status.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="mt-10 rounded-lg border p-8 text-center">
          <h2 className="text-lg font-semibold">
            No orders yet
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Customer orders will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-lg border">
          <div className="hidden grid-cols-[1.4fr_1.5fr_1fr_1fr_1fr_auto] gap-4 border-b bg-gray-50 px-6 py-4 text-sm font-medium md:grid">
            <span>Order</span>
            <span>Customer</span>
            <span>Date</span>
            <span>Status</span>
            <span>Total</span>
            <span></span>
          </div>

          <div className="divide-y">
            {orders.map((order) => (
              <div
                key={order.id}
                className="grid gap-4 px-6 py-5 md:grid-cols-[1.4fr_1.5fr_1fr_1fr_1fr_auto] md:items-center"
              >
                <div>
                  <p className="font-medium">
                    #{order.orderNumber}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {order._count.items}{" "}
                    {order._count.items === 1
                      ? "item"
                      : "items"}
                  </p>
                </div>

                <div>
                  <p className="font-medium">
                    {order.customer.user.name}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {order.customer.user.email}
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
                    href={`/admin/orders/${order.id}`}
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
    </main>
  );
}