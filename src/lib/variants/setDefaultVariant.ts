import { prisma } from "@/lib/prisma";

export async function setDefaultVariant(
  productId: string,
  variantId: string
) {
  await prisma.$transaction([
    prisma.productVariant.updateMany({
      where: {
        productId,
        isDefault: true,
        NOT: {
          id: variantId,
        },
      },
      data: {
        isDefault: false,
      },
    }),

    prisma.productVariant.update({
      where: {
        id: variantId,
      },
      data: {
        isDefault: true,
      },
    }),
  ]);
}