import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/products/ProductForm";

import { prisma } from "@/lib/prisma";
import { getBrands } from "@/actions/brand/getBrands";
import { getCategories } from "@/actions/category/getCategories";

type Props = {
  params: Promise<{
    productId: string;
  }>;
};

export default async function EditProductPage({
  params,
}: Props) {
  const { productId } = await params;

  const [product, brands, categories] =
    await Promise.all([
      prisma.product.findUnique({
        where: {
          id: productId,
        },
        include: {
          productCategories: {
            select: {
              categoryId: true,
            },
          },
        },
      }),

      getBrands(),
      getCategories(),
    ]);

  if (!product) {
    notFound();
  }

  const productData = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    shortDescription:
      product.shortDescription ?? "",
    description: product.description ?? "",
    brandId: product.brandId ?? "",
    status: product.status,
    categoryIds:
      product.productCategories.map(
        (item) => item.categoryId
      ),
  };

  return (
    <div className="mx-auto max-w-3xl p-8">
      <h1 className="mb-8 text-3xl font-bold">
        Edit Product
      </h1>

      <ProductForm
        lookupData={{
          brands,
          categories,
        }}
        product={productData}
      />
    </div>
  );
}
