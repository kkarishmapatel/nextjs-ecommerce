import { prisma } from "@/lib/prisma";

export async function getStorefrontProduct(
  slug: string
) {
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

  if (!product) {
    return null;
  }

  return {
    ...product,

    variants: product.variants.map(
      (variant) => ({
        ...variant,

        price: Number(variant.price),

        compareAtPrice:
          variant.compareAtPrice !== null
            ? Number(
                variant.compareAtPrice
              )
            : null,

        costPrice:
          variant.costPrice !== null
            ? Number(variant.costPrice)
            : null,

        weight:
          variant.weight !== null
            ? Number(variant.weight)
            : null,
      })
    ),
  };
}