"use server";

import { prisma } from "@/lib/prisma";

import {
  createAttributeValueSchema,
  type CreateAttributeValueInput,
} from "@/validators/attributeValue";


export async function createAttributeValue(
  attributeId: string,
  data: CreateAttributeValueInput
) {

  const validated =
    createAttributeValueSchema.safeParse(
      data
    );


  if (!validated.success) {
    return {
      success: false,
      errors:
        validated.error.flatten()
          .fieldErrors,
    };
  }


  const existing =
    await prisma.attributeValue.findFirst({
      where: {
        attributeId,

        value: validated.data.value,
      },
    });


  if (existing) {
    return {
      success: false,
      errors: {
        value: [
          "Value already exists."
        ],
      },
    };
  }


  const attributeValue =
    await prisma.attributeValue.create({
      data: {
        attributeId,

        value:
          validated.data.value,
      },
    });


  return {
    success: true,

    id: attributeValue.id,
  };
}