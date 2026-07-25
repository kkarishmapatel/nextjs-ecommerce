"use server";

import { prisma } from "@/lib/prisma";

export async function deleteCategory(id: string) {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
    include: {
      _count: {
        select: {
          children: true,
          productCategories: true,
        },
      },
    },
  });

  if (!category) {
    return {
      success: false,
      message: "Category not found.",
    };
  }

  if (category._count.children > 0) {
    return {
      success: false,
      message:
        "Cannot delete a category that has child categories.",
    };
  }

  if (category._count.productCategories > 0) {
    return {
      success: false,
      message:
        "Cannot delete a category that is assigned to products.",
    };
  }

  await prisma.category.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });

  return {
    success: true,
  };
}