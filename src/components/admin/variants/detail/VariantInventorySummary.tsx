type VariantInventorySummaryProps = {
  stock: number;
  trackInventory: boolean;
  allowBackorders: boolean;
  lowStockThreshold: number;
};

export function VariantInventorySummary({
  stock,
  trackInventory,
  allowBackorders,
  lowStockThreshold,
}: VariantInventorySummaryProps) {
  return (
    <div className="rounded-lg border p-4">
      <h2 className="font-medium">
        Inventory
      </h2>

      <div className="mt-3 space-y-1 text-sm">
        <p>
          Stock: {stock}
        </p>

        <p>
          Track Inventory:{" "}
          {trackInventory ? "Yes" : "No"}
        </p>

        <p>
          Backorders:{" "}
          {allowBackorders ? "Yes" : "No"}
        </p>

        <p>
          Low Stock Threshold:{" "}
          {lowStockThreshold}
        </p>
      </div>
    </div>
  );
}