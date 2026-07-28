import { prisma } from "@/lib/prisma";

export async function getBrands() {
  return prisma.brand.findMany({
    where: {
      isDeleted: false,
    },
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        name: "asc",
      },
    ],
  });
}