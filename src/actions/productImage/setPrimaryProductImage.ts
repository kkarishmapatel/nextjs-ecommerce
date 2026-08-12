"use server";

import { prisma } from "@/lib/prisma";

export async function setPrimaryProductImage(
  variantId: string,
  imageId: string
) {
  const image = await prisma.productImage.findFirst({
    where: {
      id: imageId,
      variantId,
    },
  });

  if (!image) {
    return {
      success: false,
      error: "Image not found for this variant.",
    };
  }

  const images = await prisma.productImage.findMany({
    where: {
      variantId,
    },
    orderBy: {
      sortOrder: "asc",
    },
  });

  const reordered = [
    image,
    ...images.filter(
      (item) => item.id !== imageId
    ),
  ];

  await prisma.$transaction(
    reordered.map((item, index) =>
      prisma.productImage.update({
        where: {
          id: item.id,
        },
        data: {
          sortOrder: index,
        },
      })
    )
  );

  return {
    success: true,
  };
}