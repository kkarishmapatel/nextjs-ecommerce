"use server";

import { prisma } from "@/lib/prisma";
import {
  createCategorySchema,
  type CreateCategoryInput,
} from "@/validators/category";

export async function updateCategory(
  id: string,
  input: CreateCategoryInput
) {
  const validatedFields = createCategorySchema.safeParse(input);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const {
    name,
    slug,
    description,
    sortOrder,
    parentId,
  } = validatedFields.data;

  const existingCategory = await prisma.category.findFirst({
  where: {
    id: {
      not: id,
    },
    parentId: parentId || null,
    name,
    isDeleted: false,
  },
});

if (existingCategory) {
  return {
    success: false,
    errors: {
      name: [
        "A category with this name already exists under the selected parent.",
      ],
    },
  };
}

  await prisma.category.update({
    where: {
      id,
    },
    data: {
      name,
      slug,
      description: description || null,
      sortOrder,
      parentId: parentId || null,
    },
  });

  return {
    success: true,
  };
}