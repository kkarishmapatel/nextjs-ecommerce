"use server";

import { prisma } from "@/lib/prisma";

type CreateProductImageInput = {
  variantId: string;

  url: string;

  altText?: string;

  sortOrder?: number;
};

export async function createProductImage(
  data: CreateProductImageInput
) {
  if (!data.url.trim()) {
    return {
      success: false,
      errors: {
        url: ["Image URL is required."],
      },
    };
  }

  const variant =
    await prisma.productVariant.findUnique({
      where: {
        id: data.variantId,
      },

      select: {
        id: true,
      },
    });

  if (!variant) {
    return {
      success: false,
      errors: {
        url: ["Variant not found."],
      },
    };
  }

  const image =
    await prisma.productImage.create({
      data: {
        variantId: data.variantId,

        url: data.url.trim(),

        altText:
          data.altText?.trim() || null,

        sortOrder:
          data.sortOrder ?? 0,
      },
    });

  return {
    success: true,

    imageId: image.id,
  };
}