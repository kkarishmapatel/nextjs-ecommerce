import { prisma } from "@/lib/prisma";

export async function getStorefrontProducts() {
  const products = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
    },
    include: {
      brand: {
        select: {
          name: true,
          slug: true,
        },
      },
      productCategories: {
        include: {
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      },
      variants: {
        where: {
          isActive: true,
        },
        orderBy: [
          {
            isDefault: "desc",
          },
          {
            price: "asc",
          },
        ],
        include: {
          images: {
            orderBy: {
              sortOrder: "asc",
            },
            take: 1,
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return products;
}