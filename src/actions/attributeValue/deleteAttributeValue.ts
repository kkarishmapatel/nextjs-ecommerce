"use server";

import { prisma } from "@/lib/prisma";


export async function deleteAttributeValue(
  attributeValueId: string
) {

  await prisma.attributeValue.delete({
    where: {
      id: attributeValueId,
    },
  });


  return {
    success: true,
  };
}