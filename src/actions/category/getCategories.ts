"use server";

import { prisma } from "@/lib/prisma";

export async function getCategories() {
  const categories = await prisma.category.findMany({
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
    select: {
      id: true,
      name: true,
    },
  });

  return categories;
}