import { prisma } from "@/lib/prisma";

export async function getStorefrontProduct(slug: string) {
  const product = await prisma.product.findFirst({
    where: {
      slug,
      status: {
        in: ["ACTIVE", "OUT_OF_STOCK"],
      },
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
          },

          variantAttributes: {
            include: {
              attributeValue: {
                include: {
                  attribute: {
                    select: {
                      id: true,
                      name: true,
                      slug: true,
                      sortOrder: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return product;
}