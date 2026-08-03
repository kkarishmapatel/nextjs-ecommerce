import VariantForm from "@/components/admin/variants/VariantForm";

import PageHeader from "@/components/common/layout/PageHeader";

type Props = {
  params: Promise<{
    productId: string;
  }>;
};

export default async function NewVariantPage({
  params,
}: Props) {
  const { productId } =
    await params;

  return (
    <div className="mx-auto max-w-4xl p-8">
      <PageHeader
        title="Create Variant"
        description="Add a new product variant."
      />

      <VariantForm
        productId={productId}
      />
    </div>
  );
}