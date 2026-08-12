"use server";

import { prisma } from "@/lib/prisma";

type ReorderItem = {
  id: string;
  sortOrder: number;
};

export async function reorderProductImages(
  variantId: string,
  images: ReorderItem[]
) {
  const variant =
    await prisma.productVariant.findUnique({
      where: {
        id: variantId,
      },
      select: {
        id: true,
      },
    });

  if (!variant) {
    return {
      success: false,
      errors: {
        variant: ["Variant not found."],
      },
    };
  }

  const existingImages =
    await prisma.productImage.findMany({
      where: {
        variantId,
      },
      select: {
        id: true,
      },
    });

  const existingIds = new Set(
    existingImages.map((image) => image.id)
  );

  const invalidImage = images.some(
    (image) => !existingIds.has(image.id)
  );

  if (invalidImage) {
    return {
      success: false,
      errors: {
        images: [
          "One or more images do not belong to this variant.",
        ],
      },
    };
  }

  await prisma.$transaction(
    images.map((image) =>
      prisma.productImage.update({
        where: {
          id: image.id,
        },
        data: {
          sortOrder: image.sortOrder,
        },
      })
    )
  );

  return {
    success: true,
  };
}