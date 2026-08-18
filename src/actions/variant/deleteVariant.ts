"use server";

import { prisma } from "@/lib/prisma";

export async function deleteVariant(
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
          isDefault: true,
        },
      });

    if (!variant) {
      return {
        success: false,
        error: "Variant not found.",
      };
    }

    // Don't allow deleting the default variant.
    if (variant.isDefault) {
      return {
        success: false,
        error:
          "The default variant cannot be deleted. Set another variant as default first.",
      };
    }

    await prisma.$transaction(
      async (tx) => {
        // Remove variant attribute selections.
        await tx.variantAttributeValue.deleteMany({
          where: {
            variantId,
          },
        });

        // Remove variant images.
        await tx.productImage.deleteMany({
          where: {
            variantId,
          },
        });

        // Remove inventory history.
        await tx.inventoryHistory.deleteMany({
          where: {
            variantId,
          },
        });

        // Finally delete the variant.
        await tx.productVariant.delete({
          where: {
            id: variantId,
          },
        });
      }
    );

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "Failed to delete variant:",
      error
    );

    return {
      success: false,
      error: "Failed to delete variant.",
    };
  }
}