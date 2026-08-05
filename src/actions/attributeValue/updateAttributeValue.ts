"use server";

import { prisma } from "@/lib/prisma";

import {
  createAttributeValueSchema,
  type CreateAttributeValueInput,
} from "@/validators/attributeValue";


export async function updateAttributeValue(
  attributeValueId: string,
  data: CreateAttributeValueInput
) {
  const validated =
    createAttributeValueSchema.safeParse(data);


  if (!validated.success) {
    return {
      success: false,
      errors:
        validated.error.flatten().fieldErrors,
    };
  }


  const current =
    await prisma.attributeValue.findUnique({
      where: {
        id: attributeValueId,
      },
    });


  if (!current) {
    return {
      success: false,
      errors: {
        value: [
          "Value not found.",
        ],
      },
    };
  }


  const duplicate =
    await prisma.attributeValue.findFirst({
      where: {
        attributeId: current.attributeId,

        value: validated.data.value,

        NOT: {
          id: attributeValueId,
        },
      },
    });


  if (duplicate) {
    return {
      success: false,
      errors: {
        value: [
          "Value already exists.",
        ],
      },
    };
  }


  await prisma.attributeValue.update({
    where: {
      id: attributeValueId,
    },

    data: {
      value: validated.data.value,
    },
  });


  return {
    success: true,
  };
}