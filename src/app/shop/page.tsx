import { getStorefrontProducts } from "@/lib/products/getStorefrontProducts";
import ProductCard from "@/components/storefront/ProductCard";

export default async function ShopPage() {
  const products =
    await getStorefrontProducts();

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

      {products.length === 0 ? (
        <div className="rounded-lg border p-8 text-center">
          <p className="text-gray-500">
            No products available.
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