import { prisma } from "@/lib/prisma";

type GetStorefrontProductsOptions = {
  category?: string;
  brand?: string;
  sort?: string;
};

export async function getStorefrontProducts(
  options: GetStorefrontProductsOptions = {}
) {
  const {
    category,
    brand,
    sort = "newest",
  } = options;

  const products = await prisma.product.findMany({
    where: {
      status: {
        in: ["ACTIVE", "OUT_OF_STOCK"],
      },

      ...(brand
        ? {
            brand: {
              slug: brand,
            },
          }
        : {}),

      ...(category
        ? {
            productCategories: {
              some: {
                category: {
                  slug: category,
                },
              },
            },
          }
        : {}),
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

    orderBy:
      sort === "name-asc"
        ? {
            name: "asc",
          }
        : {
            createdAt: "desc",
          },
  });

  // Prisma cannot directly sort Product by a related
  // ProductVariant price, so sort the result in memory.
  if (
    sort === "price-asc" ||
    sort === "price-desc"
  ) {
    products.sort((a, b) => {
      const aPrice =
        a.variants.length > 0
          ? Number(a.variants[0].price)
          : Infinity;

      const bPrice =
        b.variants.length > 0
          ? Number(b.variants[0].price)
          : Infinity;

      return sort === "price-asc"
        ? aPrice - bPrice
        : bPrice - aPrice;
    });
  }

  return products;
}