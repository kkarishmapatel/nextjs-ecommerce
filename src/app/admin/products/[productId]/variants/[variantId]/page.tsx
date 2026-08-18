import Link from "next/link";

import { notFound } from "next/navigation";

import { getVariantById } from "@/actions/variant/getVariantById";
import {
  VariantOverview,
} from "@/components/admin/variants/detail/VariantOverview";

import {
  VariantPricingSummary,
} from "@/components/admin/variants/detail/VariantPricingSummary";

import {
  VariantInventorySummary,
} from "@/components/admin/variants/detail/VariantInventorySummary";

import {
  VariantAttributesSummary,
} from "@/components/admin/variants/detail/VariantAttributesSummary";

import {
  VariantStatusSummary,
} from "@/components/admin/variants/detail/VariantStatusSummary";

import {
  VariantImageGallery,
} from "@/components/admin/variants/detail/VariantImageGallery";
import {
  VariantActions,
} from "@/components/admin/variants/detail/VariantActions";

type VariantDetailPageProps = {
  params: Promise<{
    productId: string;
    variantId: string;
  }>;
};

export default async function VariantDetailPage({
  params,
}: VariantDetailPageProps) {
  const {
    productId,
    variantId,
  } = await params;

  const result =
    await getVariantById(variantId);

  if (!result.success || !result.variant) {
    notFound();
  }

  const variant = result.variant;

  if (variant.productId !== productId) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            Variant
          </h1>

          <p className="text-sm text-muted-foreground">
            {variant.sku}  koko
          </p>
        </div>

        <VariantActions
          productId={productId}
          variantId={variantId}
          isDefault={variant.isDefault}
          isActive={variant.isActive}
        />
      </div>
      <VariantOverview
        sku={variant.sku}
        barcode={variant.barcode}
        productName={variant.product.name}
      />

      <VariantAttributesSummary
        attributes={variant.variantAttributes.map(
          (item) => ({
            attribute:
              item.attributeValue.attribute.name,
            value:
              item.attributeValue.value,
          })
        )}
      />

      <VariantImageGallery
        images={variant.images.map((image) => ({
          id: image.id,
          url: image.url,
          altText: image.altText,
          sortOrder: image.sortOrder,
        }))}
      />

      <VariantPricingSummary
        price={variant.price.toString()}
        compareAtPrice={
          variant.compareAtPrice?.toString() ?? null
        }
        costPrice={
          variant.costPrice?.toString() ?? null
        }

      />

      <VariantInventorySummary
        stock={variant.stock}
        trackInventory={variant.trackInventory}
        allowBackorders={variant.allowBackorders}
        lowStockThreshold={
          variant.lowStockThreshold
        }
      />

      <VariantStatusSummary
        isActive={variant.isActive}
        isDefault={variant.isDefault}
      />

    </div>
  );
}