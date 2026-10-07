import Link from "next/link";

import { prisma } from "@/lib/prisma";
import SalesChart from "@/components/admin/SalesChart";

export default async function AdminDashboardPage() {
  const [
    revenueResult,
    totalOrders,
    totalProducts,
    totalCustomers,
    recentOrders,
  ] = await Promise.all([
    prisma.order.aggregate({
      _sum: {
        total: true,
      },
      where: {
        paymentStatus: "PAID",
      },
    }),
    prisma.order.count(),
    prisma.product.count(),
    prisma.customer.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        customer: {
          include: {
            user: true,
          },
        },
      },
    }),
  ]);

  const lowStockVariants = (
    await prisma.productVariant.findMany({
      where: {
        trackInventory: true,
        isActive: true,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        stock: "asc",
      },
    })
  ).filter((variant) => variant.stock <= variant.lowStockThreshold);

  const salesStartDate = new Date();

  salesStartDate.setHours(0, 0, 0, 0);
  salesStartDate.setDate(salesStartDate.getDate() - 6);

  const salesOrders = await prisma.order.findMany({
    where: {
      paymentStatus: "PAID",
      createdAt: {
        gte: salesStartDate,
      },
    },
    select: {
      total: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const salesData = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(salesStartDate);

    date.setDate(salesStartDate.getDate() + index);

    const dateKey = date.toISOString().slice(0, 10);

    const dayOrders = salesOrders.filter(
      (order) => order.createdAt.toISOString().slice(0, 10) === dateKey,
    );

    return {
      date: dateKey,
      revenue: dayOrders.reduce(
        (total, order) => total + Number(order.total),
        0,
      ),
      orders: dayOrders.length,
    };
  });

  const totalRevenue = revenueResult._sum.total ?? 0;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Overview of your store.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Total Revenue
          </p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            ₹{Number(totalRevenue).toLocaleString("en-IN")}
          </p>
        </div>

        <div className="rounded-lg border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Total Orders
          </p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {totalOrders}
          </p>
        </div>

        <div className="rounded-lg border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Total Products
          </p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {totalProducts}
          </p>
        </div>

        <div className="rounded-lg border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Total Customers
          </p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {totalCustomers}
          </p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="mt-8 rounded-lg border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Orders
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Latest orders placed in your store.
            </p>
          </div>

          <Link
            href="/admin/orders"
            className="text-sm font-medium text-gray-900 hover:underline"
          >
            View all
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-gray-500">
            No orders found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Order</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Total</th>
                  <th className="px-5 py-3 font-medium">Payment</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-medium text-gray-900 hover:underline"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>

                    <td className="px-5 py-4 text-gray-700">
                      {order.customer.user.name}
                    </td>

                    <td className="px-5 py-4 font-medium text-gray-900">
                      ₹{Number(order.total).toLocaleString("en-IN")}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                        {order.paymentStatus}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                        {order.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {order.createdAt.toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}


      </div>

      {/* Low Stock Products */}
      <div className="mt-8 rounded-lg border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Low Stock Products
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Products that need attention.
            </p>
          </div>

          <Link
            href="/admin/products"
            className="text-sm font-medium text-gray-900 hover:underline"
          >
            View products
          </Link>
        </div>

        {lowStockVariants.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-gray-500">
            No low-stock products.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Product</th>
                  <th className="px-5 py-3 font-medium">SKU</th>
                  <th className="px-5 py-3 font-medium">Stock</th>
                  <th className="px-5 py-3 font-medium">Threshold</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {lowStockVariants.slice(0, 5).map((variant) => (
                  <tr key={variant.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/products/${variant.product.id}`}
                        className="font-medium text-gray-900 hover:underline"
                      >
                        {variant.product.name}
                      </Link>
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {variant.sku}
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-semibold text-red-600">
                        {variant.stock}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {variant.lowStockThreshold}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-8 rounded-lg border bg-white p-5 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Sales Overview
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Revenue from paid orders over the last 7 days.
          </p>
        </div>

        <SalesChart data={salesData} />
      </div>
    </div>
  );
}