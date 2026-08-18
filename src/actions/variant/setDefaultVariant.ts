"use server";

import { prisma } from "@/lib/prisma";

export async function setDefaultVariant(
  productId: string,
  variantId: string
) {
  try {
    const variant =
      await prisma.productVariant.findFirst({
        where: {
          id: variantId,
          productId,
        },
        select: {
          id: true,
        },
      });

    if (!variant) {
      return {
        success: false,
        error: "Variant not found.",
      };
    }

    await prisma.$transaction([
      prisma.productVariant.updateMany({
        where: {
          productId,
          isDefault: true,
          NOT: {
            id: variantId,
          },
        },
        data: {
          isDefault: false,
        },
      }),

      prisma.productVariant.update({
        where: {
          id: variantId,
        },
        data: {
          isDefault: true,
        },
      }),
    ]);

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "Failed to set default variant:",
      error
    );

    return {
      success: false,
      error: "Failed to set default variant.",
    };
  }
}