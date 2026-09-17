import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      brand: {
        select: {
          name: true,
        },
      },
      variants: {
        select: {
          id: true,
          price: true,
          stock: true,
          isActive: true,
          isDefault: true,
        },
        orderBy: {
          isDefault: "desc",
        },
      },
      _count: {
        select: {
          productCategories: true,
          variants: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Products
          </h1>

          <p className="text-sm text-gray-500">
            Manage your store products and variants.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="rounded bg-black px-4 py-2 text-white"
        >
          Add Product
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-left">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Brand</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Variants</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => {
              const defaultVariant =
                product.variants.find(
                  (variant) => variant.isDefault
                ) ?? product.variants[0];

              return (
                <tr
                  key={product.id}
                  className="border-b last:border-b-0"
                >
                  <td className="px-4 py-3 font-medium">
                    {product.name}
                  </td>

                  <td className="px-4 py-3">
                    {product.brand?.name ?? "—"}
                  </td>

                  <td className="px-4 py-3">
                    {product.status}
                  </td>

                  <td className="px-4 py-3">
                    {defaultVariant
                      ? `₹${Number(
                          defaultVariant.price
                        ).toFixed(2)}`
                      : "—"}
                  </td>

                  <td className="px-4 py-3">
                    {defaultVariant
                      ? defaultVariant.stock
                      : "—"}
                  </td>

                  <td className="px-4 py-3">
                    {product._count.variants}
                  </td>

                  <td className="px-4 py-3">
                    {product.createdAt.toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="rounded-md border px-3 py-1 text-sm"
                      >
                        View
                      </Link>

                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="rounded-md border px-3 py-1 text-sm"
                      >
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}

            {products.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}