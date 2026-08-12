"use server";

import { prisma } from "@/lib/prisma";

export async function getVariantForEdit(
  variantId: string
) {
  const variant =
    await prisma.productVariant.findUnique({
      where: {
        id: variantId,
      },

      include: {
        variantAttributes: {
          select: {
            attributeValueId: true,

            attributeValue: {
              select: {
                attributeId: true,
              },
            },
          },
        },
      },
    });

  if (!variant) {
    return null;
  }

  return {
    id: variant.id,
    productId: variant.productId,

    sku: variant.sku,
    barcode: variant.barcode,

    price: variant.price.toString(),
    compareAtPrice:
      variant.compareAtPrice?.toString() ?? "",

    stock: variant.stock,
    costPrice:
  variant.costPrice?.toString() ?? "",

trackInventory:
  variant.trackInventory,

lowStockThreshold:
  variant.lowStockThreshold,

allowBackorders:
  variant.allowBackorders,

    weight:
      variant.weight?.toString() ?? "",

    isDefault: variant.isDefault,
    isActive: variant.isActive,

    selectedAttributes:
      variant.variantAttributes.map((item) => ({
        attributeId:
          item.attributeValue.attributeId,

        attributeValueId:
          item.attributeValueId,
      })),
  };
}