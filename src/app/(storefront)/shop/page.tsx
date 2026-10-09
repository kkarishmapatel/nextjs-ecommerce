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
        <div className="rounded-2xl border border-dashed px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
            <span aria-hidden="true">⌕</span>
          </div>

          <h2 className="mt-5 text-xl font-semibold text-gray-900">
            No products found
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            Try changing your category or brand filters to
            discover more products.
          </p>

          <a
            href="/shop"
            className="mt-6 inline-flex rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Browse all products
          </a>
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