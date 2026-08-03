import Link from "next/link";

import { getProductVariants } from "@/actions/variant/getProductVariants";

import VariantTable from "@/components/admin/variants/VariantTable";
import PageHeader from "@/components/common/layout/PageHeader";

type Props = {
  params: Promise<{
    productId: string;
  }>;
};

export default async function ProductVariantsPage({
  params,
}: Props) {
  const { productId } =
    await params;

  const variants =
    await getProductVariants(productId);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-8">
      
      <PageHeader
        title="Product Variants"
        description="Manage all variants for this product."
        actions={
          <Link
            href={`/admin/products/${productId}/variants/new`}
            className="rounded bg-black px-4 py-2 text-white"
          >
            Add Variant
          </Link>
        }
      />

      <VariantTable
        productId={productId}
        variants={variants}
      />
    </div>
  );
}