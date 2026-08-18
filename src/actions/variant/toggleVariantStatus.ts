"use server";

import { prisma } from "@/lib/prisma";

export async function toggleVariantStatus(
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
          isActive: true,
        },
      });

    if (!variant) {
      return {
        success: false,
        error: "Variant not found.",
      };
    }

    const updatedVariant =
      await prisma.productVariant.update({
        where: {
          id: variant.id,
        },
        data: {
          isActive: !variant.isActive,
        },
        select: {
          isActive: true,
        },
      });

    return {
      success: true,
      isActive:
        updatedVariant.isActive,
    };
  } catch (error) {
    console.error(
      "Failed to update variant status:",
      error
    );

    return {
      success: false,
      error:
        "Failed to update variant status.",
    };
  }
}