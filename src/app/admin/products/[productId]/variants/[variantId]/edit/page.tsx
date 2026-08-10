import { notFound } from "next/navigation";

import { getVariantForEdit } from "@/actions/variant/getVariantForEdit";
import { getVariantLookupData } from "@/actions/variant/getVariantLookupData";

import VariantForm from "@/components/admin/variants/VariantForm";

type Props = {
  params: Promise<{
    productId: string;
    variantId: string;
  }>;
};

export default async function EditVariantPage({
  params,
}: Props) {
  const {
    productId,
    variantId,
  } = await params;

  const [variant, lookupData] =
    await Promise.all([
      getVariantForEdit(variantId),
      getVariantLookupData(),
    ]);

  if (
    !variant ||
    variant.productId !== productId
  ) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="mb-8 text-3xl font-bold">
        Edit Variant
      </h1>

      <VariantForm
        productId={productId}
        lookupData={lookupData}
        initialData={variant}
      />
    </div>
  );
}