"use server";

import { prisma } from "@/lib/prisma";

export async function getVariantLookupData() {
  const attributes = await prisma.attribute.findMany({
  where: {
    isActive: true,
  },

  orderBy: {
    name: "asc",
  },

  include: {
    values: {
      where: {
        isActive: true,
      },

      orderBy: {
        sortOrder: "asc",
      },
    },
  },
});

  return {
    attributes: attributes.map((attribute) => ({
      id: attribute.id,
      name: attribute.name,

      values: attribute.values.map((value) => ({
        id: value.id,
        name: value.value,
      })),
    })),
  };
}