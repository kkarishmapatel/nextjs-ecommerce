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
  } = data;

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
      },
    });

  return {
    success: true,
    variantId: variant.id,
  };
}