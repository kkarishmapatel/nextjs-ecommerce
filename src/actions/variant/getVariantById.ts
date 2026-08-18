"use server";

import { prisma } from "@/lib/prisma";

export async function getVariantById(
  variantId: string
) {
  const variant =
    await prisma.productVariant.findUnique({
      where: {
        id: variantId,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },

        variantAttributes: {
          include: {
            attributeValue: {
              include: {
                attribute: true,
              },
            },
          },
        },

        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },

        inventoryHistory: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

  if (!variant) {
    return {
      success: false,
      error: "Variant not found.",
    };
  }

  return {
    success: true,
    variant,
  };
}