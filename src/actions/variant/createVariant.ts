"use server";

import { prisma } from "@/lib/prisma";

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

  const {
    productId,
    sku,
    barcode,
    price,
    compareAtPrice,
    costPrice,
    stock,
    trackInventory,
    allowBackorders,
    lowStockThreshold,
    isDefault,
    isActive,
    selectedAttributes,
  } = data;

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

  const variant =
    await prisma.productVariant.create({
      data: {
        productId,

        sku,

        barcode: barcode || null,

        price,

        compareAtPrice:
          compareAtPrice ?? null,

        costPrice:
          costPrice ?? null,

        stock,

        trackInventory,

        allowBackorders,

        lowStockThreshold,

        isDefault,

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

  return {
    success: true,
    variantId: variant.id,
  };
}