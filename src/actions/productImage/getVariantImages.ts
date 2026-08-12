"use server";

import { prisma } from "@/lib/prisma";

export async function getVariantImages(
  variantId: string
) {
  const images =
    await prisma.productImage.findMany({
      where: {
        variantId,
      },

      orderBy: [
        {
          sortOrder: "asc",
        },
        {
          createdAt: "asc",
        },
    ],
    });

  return images.map((image) => ({
    id: image.id,

    url: image.url,

    altText: image.altText,

    sortOrder: image.sortOrder,

    createdAt: image.createdAt,
  }));
}