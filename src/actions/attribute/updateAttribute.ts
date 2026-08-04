"use server";

import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/slug";

import {
  createAttributeSchema,
  type CreateAttributeInput,
} from "@/validators/attribute";

export async function updateAttribute(
  attributeId: string,
  data: CreateAttributeInput
) {
  const validated =
    createAttributeSchema.safeParse(data);

  if (!validated.success) {
    return {
      success: false,
      errors:
        validated.error.flatten().fieldErrors,
    };
  }

  let {
    name,
    slug,
    isActive,
  } = validated.data;

  slug = generateSlug(slug);

  const existing =
    await prisma.attribute.findFirst({
      where: {
        slug,

        NOT: {
          id: attributeId,
        },
      },
    });

  if (existing) {
    return {
      success: false,
      errors: {
        slug: [
          "Slug already exists.",
        ],
      },
    };
  }

  await prisma.attribute.update({
    where: {
      id: attributeId,
    },

    data: {
      name,
      slug,
      isActive,
    },
  });

  return {
    success: true,
  };
}