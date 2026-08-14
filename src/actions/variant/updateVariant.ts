"use server";

import { prisma } from "@/lib/prisma";
import { validateVariantAttributes } from "@/lib/variants/validateVariantAttributes";
import { createVariantSchema } from "@/validators/variant";

export async function updateVariant(
  variantId: string,
  productId: string,
  data: unknown
) {
  const validated =
    createVariantSchema.safeParse(data);

  if (!validated.success) {
    return {
      success: false,
      errors:
        validated.error.flatten().fieldErrors,
    };
  }

  const {
    sku,
    barcode,
    price,
    compareAtPrice,
    stock,
    trackInventory,
    allowBackorders,
    lowStockThreshold,
    isDefault,
    selectedAttributes,
  } = validated.data;

  const normalizedStock =
    validated.data.trackInventory
      ? validated.data.stock
      : 0;

  const normalizedLowStockThreshold =
    validated.data.trackInventory
      ? validated.data.lowStockThreshold
      : 0;

  const variant =
    await prisma.productVariant.findUnique({
      where: {
        id: variantId,
      },
    });

  if (!variant) {
    return {
      success: false,
      errors: {
        sku: ["Variant not found."],
      },
    };
  }

  if (variant.productId !== productId) {
    return {
      success: false,
      errors: {
        sku: [
          "Variant does not belong to this product.",
        ],
      },
    };
  }

  const attributeValidation =
    await validateVariantAttributes(
      validated.data.selectedAttributes ?? []
    );

  if (!attributeValidation.success) {
    return {
      success: false,
      errors: {
        selectedAttributes: [
          attributeValidation.error,
        ],
      },
    };
  }

  const duplicateSku =
    await prisma.productVariant.findFirst({
      where: {
        sku,

        NOT: {
          id: variantId,
        },
      },
    });

  if (duplicateSku) {
    return {
      success: false,
      errors: {
        sku: ["SKU already exists."],
      },
    };
  }

  const attributeValueIds =
    selectedAttributes
      .map(
        (item) =>
          item.attributeValueId
      )
      .filter(Boolean);

  const attributeValues =
    await prisma.attributeValue.findMany({
      where: {
        id: {
          in: attributeValueIds,
        },

        isActive: true,
      },

      select: {
        id: true,
        attributeId: true,
      },
    });

  if (
    attributeValues.length !==
    attributeValueIds.length
  ) {
    return {
      success: false,
      errors: {
        selectedAttributes: [
          "One or more selected attribute values are invalid.",
        ],
      },
    };
  }

  const attributeIds =
    attributeValues.map(
      (item) => item.attributeId
    );

  if (
    new Set(attributeIds).size !==
    attributeIds.length
  ) {
    return {
      success: false,
      errors: {
        selectedAttributes: [
          "A variant can only have one value per attribute.",
        ],
      },
    };
  }

  await prisma.$transaction(
    async (tx) => {
      if (validated.data.isDefault) {
        await tx.productVariant.updateMany({
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
        });
      }

      await tx.productVariant.update({
        where: {
          id: variantId,
        },

        data: {
          sku,
          barcode: barcode || null,
          price,
          compareAtPrice:
            compareAtPrice ?? null,
          stock: normalizedStock,
          trackInventory,
          allowBackorders,
          lowStockThreshold:
            normalizedLowStockThreshold,
          isDefault:
            validated.data.isDefault,
        },
      });

      await tx.variantAttributeValue.deleteMany({
        where: {
          variantId,
        },
      });

      if (attributeValueIds.length > 0) {
        await tx.variantAttributeValue.createMany({
          data: attributeValueIds.map(
            (attributeValueId) => ({
              variantId,
              attributeValueId,
            })
          ),
        });
      }
    }
  );

  return {
    success: true,
    variantId,
  };
}