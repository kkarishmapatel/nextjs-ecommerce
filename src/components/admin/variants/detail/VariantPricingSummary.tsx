type VariantPricingSummaryProps = {
  price: string;
  compareAtPrice: string | null;
  costPrice: string | null;
};

export function VariantPricingSummary({
  price,
  compareAtPrice,
  costPrice,
}: VariantPricingSummaryProps) {
  return (
    <div className="rounded-lg border p-4">
      <h2 className="font-medium">
        Pricing
      </h2>

      <div className="mt-3 space-y-1 text-sm">
        <p>
          Price: {price}
        </p>

        <p>
          Compare-at Price:{" "}
          {compareAtPrice ?? "-"}
        </p>

        <p>
          Cost Price: {costPrice ?? "-"}
        </p>
      </div>
    </div>
  );
}