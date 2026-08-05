"use server";

import { prisma } from "@/lib/prisma";


export async function getAttributeValues(
  attributeId: string
) {

  return prisma.attributeValue.findMany({

    where: {
      attributeId,
    },

    orderBy: {
      value: "asc",
    },

  });

}