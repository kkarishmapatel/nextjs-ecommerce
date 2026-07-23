import Link from "next/link";

import { prisma } from "@/lib/prisma";
import DeleteBrandButton from "@/components/admin/brands/DeleteBrandButton";

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany({
    where: {
      isDeleted: false,
    },
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        name: "asc",
      },
    ],
  });

  return (
    <div className="mx-auto max-w-5xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Brands
        </h1>

        <Link
          href="/admin/brands/new"
          className="rounded bg-black px-4 py-2 text-white"
        >
          Add Brand
        </Link>
      </div>

      <div className="overflow-hidden rounded border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50 text-left">
              <th className="p-3">
                Name
              </th>

              <th className="p-3">
                Slug
              </th>

              <th className="p-3">
                Sort Order
              </th>

              <th className="p-3">
                Created
              </th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {brands.map((brand) => (
              <tr
                key={brand.id}
                className="border-b"
              >
                <td className="p-3 font-medium">
                  {brand.name}
                </td>

                <td className="p-3">
                  {brand.slug}
                </td>

                <td className="p-3">
                  {brand.sortOrder}
                </td>

                <td className="p-3">
                  {brand.createdAt.toLocaleDateString()}
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/brands/${brand.id}/edit`}
                      className="rounded bg-blue-600 px-3 py-2 text-sm text-white"
                    >
                      Edit
                    </Link>

                    <DeleteBrandButton
                      brandId={brand.id}
                    />
                  </div>
                </td>
              </tr>
            ))}

            {brands.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="p-6 text-center"
                >
                  No brands found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}