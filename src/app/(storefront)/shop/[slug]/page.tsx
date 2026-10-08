import { notFound } from "next/navigation";

import { getStorefrontProduct } from "@/lib/products/getStorefrontProduct";
import ProductDetail from "@/components/storefront/ProductDetail";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  const product =
    await getStorefrontProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-7xl p-6">
      <ProductDetail product={product} />
    </main>
  );
}