import ProductForm from "@/components/admin/products/ProductForm";

import { getBrands } from "@/actions/brand/getBrands";
import { getCategories } from "@/actions/category/getCategories";

export default async function NewProductPage() {
  const [brands, categories] = await Promise.all([
    getBrands(),
    getCategories()
  ]);

  const lookupData = {
    brands,
    categories
  };

  return (
    <div className="mx-auto max-w-3xl p-8">
      <h1 className="mb-8 text-3xl font-bold">
        Create Product
      </h1>

      <ProductForm lookupData={lookupData} />
    </div>
  );
}