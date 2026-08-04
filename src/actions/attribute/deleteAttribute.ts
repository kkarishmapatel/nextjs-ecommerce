"use server";

import { prisma } from "@/lib/prisma";

export async function deleteAttribute(
  attributeId: string
) {
  await prisma.attribute.delete({
    where: {
      id: attributeId,
    },
  });

  return {
    success: true,
  };
}