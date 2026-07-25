import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

import CategoryForm from "@/components/admin/categories/CategoryForm";

type Props = {
  params: Promise<{
    categoryId: string;
  }>;
};

export default async function EditCategoryPage({
  params,
}: Props) {
  const { categoryId } = await params;

  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
      isDeleted: false,
    },
  });

  if (!category) {
    notFound();
  }

  const parentCategories =
    await prisma.category.findMany({
      where: {
        isDeleted: false,
        id: {
          not: category.id,
        },
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">
        Edit Category
      </h1>

      <CategoryForm
        parentCategories={parentCategories}
        initialData={{
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          sortOrder: category.sortOrder,
          parentId: category.parentId,
        }}
      />
    </div>
  );
}