type VariantAttributesSummaryProps = {
  attributes: {
    attribute: string;
    value: string;
  }[];
};

export function VariantAttributesSummary({
  attributes,
}: VariantAttributesSummaryProps) {
  return (
    <div className="rounded-lg border p-4">
      <h2 className="font-medium">
        Attributes
      </h2>

      <div className="mt-3 space-y-2">
        {attributes.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No attributes assigned.
          </p>
        ) : (
          attributes.map((item) => (
            <div
              key={`${item.attribute}-${item.value}`}
              className="flex gap-2 text-sm"
            >
              <span className="font-medium">
                {item.attribute}:
              </span>

              <span>
                {item.value}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}