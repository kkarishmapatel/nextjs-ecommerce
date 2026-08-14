"use server";

import { prisma } from "@/lib/prisma";
import { validateVariantAttributes } from "@/lib/variants/validateVariantAttributes";

import {
  createVariantSchema,
  type CreateVariantInput,
} from "@/validators/variant";

type CreateVariantData = CreateVariantInput & {
  productId: string;
};

export async function createVariant(
  data: CreateVariantData
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

  const { productId } = data;

  const {
    sku,
    barcode,
    price,
    compareAtPrice,
    costPrice,
    trackInventory,
    allowBackorders,
    isDefault,
    isActive,
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

  const attributeValueIds =
  selectedAttributes
    .map(
      (item) => item.attributeValueId
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

  const existing =
    await prisma.productVariant.findUnique({
      where: {
        sku,
      },
    });

  if (existing) {
    return {
      success: false,
      errors: {
        sku: ["SKU already exists."],
      },
    };
  }

  const attributeIds =
  attributeValues.map(
    (item) => item.attributeId
  );

const uniqueAttributeIds =
  new Set(attributeIds);

if (
  uniqueAttributeIds.size !==
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

  try {
  const variant =
    await prisma.$transaction(
      async (tx) => {
        if (validated.data.isDefault) {
          await tx.productVariant.updateMany({
            where: {
              productId,
              isDefault: true,
            },
            data: {
              isDefault: false,
            },
          });
        }

        return tx.productVariant.create({
          data: {
            productId,

            sku,

            barcode: barcode || null,

            price,

            compareAtPrice:
              compareAtPrice ?? null,

            costPrice:
              costPrice ?? null,

            stock: normalizedStock,

            trackInventory,

            allowBackorders,

            lowStockThreshold:
              normalizedLowStockThreshold,

            isDefault:
              validated.data.isDefault,

            isActive,
            variantAttributes: {
              create: selectedAttributes
                .filter(
                  (item) =>
                    item.attributeValueId
                )
                .map((item) => ({
                  attributeValueId:
                    item.attributeValueId,
                })),
            },
          },
        });
      }
    );

  return {
    success: true,
    variantId: variant.id,
  };
} catch (error) {
  console.error(
    "Create variant error:",
    error
  );

  return {
    success: false,
    errors: {
      sku: [
        "Unable to create variant. Please check the SKU and try again.",
      ],
    },
  };
}
}