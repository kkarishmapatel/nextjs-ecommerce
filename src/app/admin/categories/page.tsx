import Link from "next/link";

import { prisma } from "@/lib/prisma";
import DeleteCategoryButton from "@/components/admin/categories/DeleteCategoryButton";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      parent: {
        select: {
          id: true,
          name: true,
        },
      },
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Categories
        </h1>

        <Link
          href="/admin/categories/new"
          className="rounded bg-black px-4 py-2 text-white"
        >
          New Category
        </Link>
      </div>

      <table className="min-w-full border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-3 text-left">
              Name
            </th>

            <th className="border p-3 text-left">
              Parent
            </th>

            <th className="border p-3 text-left">
              Sort Order
            </th>

            <th className="border p-3 text-left">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="p-6 text-center"
              >
                No categories found.
              </td>
            </tr>
          ) : (
            categories.map((category) => (
              <tr key={category.id}>
                <td className="border p-3">
                  {category.name}
                </td>

                <td className="border p-3">
                  {category.parent?.name ?? "-"}
                </td>

                <td className="border p-3">
                  {category.sortOrder}
                </td>

                <td className="border p-3">
                  <div className="flex items-center">
                    <Link
                      href={`/admin/categories/${category.id}/edit`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>

                    <DeleteCategoryButton
                      categoryId={category.id}
                    />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}