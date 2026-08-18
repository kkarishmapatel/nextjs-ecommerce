type VariantOverviewProps = {
  sku: string;
  barcode: string | null;
  productName: string;
};

export function VariantOverview({
  sku,
  barcode,
  productName,
}: VariantOverviewProps) {
  return (
    <div className="rounded-lg border p-4">
      <h2 className="font-medium">
        Overview
      </h2>

      <div className="mt-3 space-y-1 text-sm">
        <p>
          <span className="font-medium">
            Product:
          </span>{" "}
          {productName}
        </p>

        <p>
          <span className="font-medium">
            SKU:
          </span>{" "}
          {sku}
        </p>

        <p>
          <span className="font-medium">
            Barcode:
          </span>{" "}
          {barcode ?? "-"}
        </p>
      </div>
    </div>
  );
}