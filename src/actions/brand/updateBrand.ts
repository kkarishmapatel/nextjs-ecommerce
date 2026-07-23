"use server";

import { prisma } from "@/lib/prisma";

import {
  createBrandSchema,
  type CreateBrandInput,
} from "@/validators/brand";

export async function updateBrand(
  id: string,
  input: CreateBrandInput
) {
  const validatedFields =
    createBrandSchema.safeParse(input);

  if (!validatedFields.success) {
    return {
      success: false,
      errors:
        validatedFields.error.flatten()
          .fieldErrors,
    };
  }

  const {
    name,
    slug,
    description,
    sortOrder,
  } = validatedFields.data;

  const existingBrand =
    await prisma.brand.findFirst({
      where: {
        AND: [
          {
            id: {
              not: id,
            },
          },
          {
            OR: [
              { name },
              { slug },
            ],
          },
        ],
      },
    });

  if (existingBrand) {
    return {
      success: false,
      errors: {
        name: [
          "Brand name or slug already exists.",
        ],
      },
    };
  }

  await prisma.brand.update({
    where: {
      id,
    },
    data: {
      name,
      slug,
      description: description || null,
      sortOrder,
    },
  });

  return {
    success: true,
  };
}