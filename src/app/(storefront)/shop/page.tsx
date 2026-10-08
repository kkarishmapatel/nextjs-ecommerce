import { prisma } from "@/lib/prisma";

import { getStorefrontProducts } from "@/lib/products/getStorefrontProducts";
import ProductCard from "@/components/storefront/ProductCard";
import ShopFilters from "@/components/storefront/ShopFilters";

type ShopPageProps = {
  searchParams: Promise<{
    category?: string;
    brand?: string;
    sort?: string;
  }>;
};

export default async function ShopPage({
  searchParams,
}: ShopPageProps) {
  const params = await searchParams;

  const [products, categories, brands] =
    await Promise.all([
      getStorefrontProducts({
        category: params.category,
        brand: params.brand,
        sort: params.sort,
      }),

      prisma.category.findMany({
        where: {
          isDeleted: false,
        },
        select: {
          name: true,
          slug: true,
        },
        orderBy: {
          name: "asc",
        },
      }),

      prisma.brand.findMany({
        where: {
          isDeleted: false,
        },
        select: {
          name: true,
          slug: true,
        },
        orderBy: {
          name: "asc",
        },
      }),
    ]);

  return (
    <main className="mx-auto max-w-7xl space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-semibold">
          Shop
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Browse our products.
        </p>
      </div>

      <ShopFilters
        categories={categories}
        brands={brands}
      />

      {products.length === 0 ? (
        <div className="rounded-lg border p-8 text-center">
          <p className="text-gray-500">
            No products found.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </main>
  );
}