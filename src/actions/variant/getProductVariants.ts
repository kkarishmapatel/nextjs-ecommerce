"use server";

import { prisma } from "@/lib/prisma";

export async function getProductVariants(
  productId: string
) {
  const variants =
    await prisma.productVariant.findMany({
      where: {
        productId,
      },

      include: {
        variantAttributes: {
          include: {
            attributeValue: {
              include: {
                attribute: true,
              },
            },
          },
        },
      },

      orderBy: [
        {
          isDefault: "desc",
        },
        {
          createdAt: "asc",
        },
      ],
    });

  return variants;
}