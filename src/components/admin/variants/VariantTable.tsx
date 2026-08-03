import Link from "next/link";

type Props = {
  productId: string;
  variants: any[];
};

export default function VariantTable({
  productId,
  variants,
}: Props) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted">
            <th className="p-3 text-left">
              SKU
            </th>

            <th className="p-3 text-left">
              Attributes
            </th>

            <th className="p-3 text-right">
              Price
            </th>

            <th className="p-3 text-right">
              Stock
            </th>

            <th className="p-3 text-center">
              Default
            </th>

            <th className="p-3 text-center">
              Active
            </th>

            <th className="p-3 text-right">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {variants.map((variant) => (
            <tr
              key={variant.id}
              className="border-b"
            >
              <td className="p-3 font-medium">
                {variant.sku}
              </td>

              <td className="p-3">
                {variant.variantAttributes
                  .map(
                    (attribute: any) =>
                      `${attribute.attributeValue.attribute.name}: ${attribute.attributeValue.value}`
                  )
                  .join(" • ")}
              </td>

              <td className="p-3 text-right">
                {Number(
                  variant.price
                ).toFixed(2)}
              </td>

              <td className="p-3 text-right">
                {variant.stock}
              </td>

              <td className="p-3 text-center">
                {variant.isDefault
                  ? "✅"
                  : ""}
              </td>

              <td className="p-3 text-center">
                {variant.isActive
                  ? "Active"
                  : "Inactive"}
              </td>

              <td className="p-3 text-right">
                <Link
                  href={`/admin/products/${productId}/variants/${variant.id}/edit`}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}

          {variants.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className="p-8 text-center text-muted-foreground"
              >
                No variants found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}