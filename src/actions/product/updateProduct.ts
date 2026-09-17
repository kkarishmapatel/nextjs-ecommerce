"use server";

import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/slug";

import {
  createProductSchema,
  CreateProductInput,
} from "@/validators/product";

export async function updateProduct(
  productId: string,
  data: CreateProductInput
) {
  const validated = createProductSchema.safeParse(data);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
    };
  }

  let {
    name,
    slug,
    description,
    shortDescription,
    brandId,
    categoryIds,
    status,
  } = validated.data;

  slug = generateSlug(slug);

  const existing = await prisma.product.findFirst({
    where: {
      slug,
      NOT: {
        id: productId,
      },
    },
  });

  if (existing) {
    return {
      success: false,
      errors: {
        slug: ["Slug already exists."],
      },
    };
  }

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    return {
      success: false,
      errors: {
        _form: ["Product not found."],
      },
    };
  }

  await prisma.$transaction(async (tx) => {
    await tx.product.update({
      where: {
        id: productId,
      },
      data: {
        name,
        slug,
        description,
        shortDescription,
        brandId: brandId || null,
        status,

        productCategories: {
          deleteMany: {},

          create: categoryIds.map((categoryId) => ({
            categoryId,
          })),
        },
      },
    });
  });

  return {
    success: true,
    productId: product.id,
  };
}