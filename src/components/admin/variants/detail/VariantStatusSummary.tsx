type VariantStatusSummaryProps = {
  isActive: boolean;
  isDefault: boolean;
};

export function VariantStatusSummary({
  isActive,
  isDefault,
}: VariantStatusSummaryProps) {
  return (
    <div className="rounded-lg border p-4">
      <h2 className="font-medium">
        Status
      </h2>

      <div className="mt-3 space-y-1 text-sm">
        <p>
          Active: {isActive ? "Yes" : "No"}
        </p>

        <p>
          Default Variant:{" "}
          {isDefault ? "Yes" : "No"}
        </p>
      </div>
    </div>
  );
}