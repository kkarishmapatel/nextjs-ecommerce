import Link from "next/link";

type Attribute = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: Date;
};

type Props = {
  attributes: Attribute[];
};

export default function AttributeTable({
  attributes,
}: Props) {
  return (
    <div className="overflow-hidden rounded border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-gray-50 text-left">
            <th className="p-3">Name</th>
            <th className="p-3">Slug</th>
            <th className="p-3">Status</th>
            <th className="p-3">Created</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {attributes.map((attribute) => (
            <tr
              key={attribute.id}
              className="border-b"
            >
              <td className="p-3 font-medium">
                {attribute.name}
              </td>

              <td className="p-3">
                {attribute.slug}
              </td>

              <td className="p-3">
                {attribute.isActive
                  ? "Active"
                  : "Inactive"}
              </td>

              <td className="p-3">
                {attribute.createdAt.toLocaleDateString()}
              </td>

              <td className="p-3">
                <div className="flex gap-2">
                  <Link
                    href={`/admin/attributes/${attribute.id}/edit`}
                    className="rounded bg-blue-600 px-3 py-2 text-sm text-white"
                  >
                    Edit
                  </Link>

                  <Link
                    href={`/admin/attributes/${attribute.id}/values`}
                    className="rounded bg-green-600 px-3 py-2 text-sm text-white"
                  >
                    Values
                  </Link>

                  {/* Delete button next */}
                </div>
              </td>
            </tr>
          ))}

          {attributes.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="p-6 text-center"
              >
                No attributes found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}