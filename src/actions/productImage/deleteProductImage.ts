"use server";

import { prisma } from "@/lib/prisma";

export async function deleteProductImage(
  imageId: string
) {
  const image =
    await prisma.productImage.findUnique({
      where: {
        id: imageId,
      },

      select: {
        id: true,
      },
    });

  if (!image) {
    return {
      success: false,
      errors: {
        image: ["Image not found."],
      },
    };
  }

  await prisma.productImage.delete({
    where: {
      id: imageId,
    },
  });

  return {
    success: true,
  };
}