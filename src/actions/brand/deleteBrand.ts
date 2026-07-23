"use server";

import { prisma } from "@/lib/prisma";

export async function deleteBrand(id: string) {
  const brand = await prisma.brand.findUnique({
    where: {
      id,
    },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });

  if (!brand) {
    return {
      success: false,
      message: "Brand not found.",
    };
  }

  if (brand._count.products > 0) {
    return {
      success: false,
      message:
        "Cannot delete a brand that is assigned to products.",
    };
  }

  await prisma.brand.update({
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