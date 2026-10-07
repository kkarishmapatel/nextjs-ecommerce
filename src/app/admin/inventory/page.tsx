import Link from "next/link";

import { prisma } from "@/lib/prisma";

export default async function AdminInventoryPage() {
  const variants = await prisma.productVariant.findMany({
    include: {
      product: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: [
      {
        stock: "asc",
      },
      {
        createdAt: "desc",
      },
    ],
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Inventory
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Monitor product variant inventory and stock levels.
        </p>
      </div>

      <div className="rounded-lg border bg-white shadow-sm">
        {variants.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-gray-500">
            No product variants found.
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
                  <th className="px-5 py-3 font-medium">Tracking</th>
                  <th className="px-5 py-3 font-medium">Backorders</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {variants.map((variant) => {
                  const isLowStock =
                    variant.trackInventory &&
                    variant.stock <= variant.lowStockThreshold;

                  return (
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
                        <span
                          className={
                            isLowStock
                              ? "font-semibold text-red-600"
                              : "font-medium text-gray-900"
                          }
                        >
                          {variant.stock}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {variant.trackInventory
                          ? variant.lowStockThreshold
                          : "—"}
                      </td>

                      <td className="px-5 py-4">
                        {variant.trackInventory ? "Enabled" : "Disabled"}
                      </td>

                      <td className="px-5 py-4">
                        {variant.allowBackorders ? "Allowed" : "Not allowed"}
                      </td>

                      <td className="px-5 py-4">
                        {variant.isActive ? "Active" : "Inactive"}
                      </td>

                      <td className="px-5 py-4">
                        <Link
                          href={`/admin/products/${variant.product.id}/variants/${variant.id}/edit`}
                          className="font-medium text-gray-900 hover:underline"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}