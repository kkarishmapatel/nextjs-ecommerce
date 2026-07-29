"use server";

import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/slug";

import {
  createProductSchema,
  CreateProductInput,
} from "@/validators/product";

export async function createProduct(data: CreateProductInput) {
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
  } = validated.data;

  slug = generateSlug(slug);

  const existing = await prisma.product.findUnique({
    where: {
      slug,
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

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description,
      shortDescription,
      brandId: brandId || null,

      productCategories: {
        create: categoryIds.map((categoryId) => ({
          categoryId,
        })),
      },
    },
  });

  return {
    success: true,
    productId: product.id,
  };
}