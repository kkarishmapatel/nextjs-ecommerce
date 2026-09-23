import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getProductVariants } from "@/actions/variant/getProductVariants";

type Props = {
  params: Promise<{ productId: string }>;
};

export default async function ProductDetailsPage({
  params,
}: Props) {
  const { productId } = await params;

  const [product, variants] = await Promise.all([
    prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        brand: {
          select: {
            name: true,
          },
        },
        productCategories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    }),

    getProductVariants(productId),
  ]);

  if (!product) {
    notFound();
  }

  const defaultVariant =
    variants.find((variant) => variant.isDefault) ??
    variants[0];

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {product.name}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Product details
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href={`/admin/products/${product.id}/edit`}
            className="rounded border px-4 py-2 text-sm hover:bg-muted"
          >
            Edit Product
          </Link>

          <Link
            href={`/admin/products/${product.id}/variants`}
            className="rounded bg-black px-4 py-2 text-sm text-white hover:bg-gray-800"
          >
            Manage Variants
          </Link>
        </div>
      </div>

      {/* Basic Information */}
      <section className="rounded-lg border p-6">
        <h2 className="mb-5 text-xl font-semibold">
          Basic Information
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">
              Product Name
            </p>
            <p className="font-medium">
              {product.name}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Slug
            </p>
            <p className="font-medium">
              {product.slug}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Brand
            </p>
            <p className="font-medium">
              {product.brand?.name ?? "—"}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Status
            </p>
            <p className="font-medium">
              {product.status}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Created
            </p>
            <p className="font-medium">
              {product.createdAt.toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Last Updated
            </p>
            <p className="font-medium">
              {product.updatedAt.toLocaleString()}
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="rounded-lg border p-6">
        <h2 className="mb-5 text-xl font-semibold">
          Categories
        </h2>

        {product.productCategories.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {product.productCategories.map(
              ({ category }) => (
                <span
                  key={category.id}
                  className="rounded-full border px-3 py-1 text-sm"
                >
                  {category.name}
                </span>
              )
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No categories assigned.
          </p>
        )}
      </section>

      {/* Description */}
      <section className="rounded-lg border p-6">
        <h2 className="mb-5 text-xl font-semibold">
          Description
        </h2>

        {product.shortDescription && (
          <div className="mb-5">
            <p className="mb-1 text-sm text-muted-foreground">
              Short Description
            </p>

            <p>
              {product.shortDescription}
            </p>
          </div>
        )}

        <div>
          <p className="mb-1 text-sm text-muted-foreground">
            Description
          </p>

          <p className="whitespace-pre-wrap">
            {product.description || "No description provided."}
          </p>
        </div>
      </section>

      {/* Variant Summary */}
      <section className="rounded-lg border p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Variant Summary
          </h2>

          <Link
            href={`/admin/products/${product.id}/variants`}
            className="text-sm hover:underline"
          >
            View All Variants
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-4">
          <div className="rounded border p-4">
            <p className="text-sm text-muted-foreground">
              Total Variants
            </p>

            <p className="mt-1 text-2xl font-semibold">
              {variants.length}
            </p>
          </div>

          <div className="rounded border p-4">
            <p className="text-sm text-muted-foreground">
              Active Variants
            </p>

            <p className="mt-1 text-2xl font-semibold">
              {variants.filter(
                (variant) => variant.isActive
              ).length}
            </p>
          </div>

          <div className="rounded border p-4">
            <p className="text-sm text-muted-foreground">
              Total Stock
            </p>

            <p className="mt-1 text-2xl font-semibold">
              {variants.reduce(
                (total, variant) =>
                  total + variant.stock,
                0
              )}
            </p>
          </div>

          <div className="rounded border p-4">
            <p className="text-sm text-muted-foreground">
              Default Price
            </p>

            <p className="mt-1 text-2xl font-semibold">
              {defaultVariant
                ? `₹${Number(
                    defaultVariant.price
                  ).toFixed(2)}`
                : "—"}
            </p>
          </div>
        </div>
      </section>

      {/* Recent / Current Variants */}
      <section className="rounded-lg border p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Variants
          </h2>

          <Link
            href={`/admin/products/${product.id}/variants/new`}
            className="rounded bg-black px-4 py-2 text-sm text-white hover:bg-gray-800"
          >
            Add Variant
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="p-3">
                  SKU
                </th>

                <th className="p-3">
                  Attributes
                </th>

                <th className="p-3 text-right">
                  Price
                </th>

                <th className="p-3 text-right">
                  Stock
                </th>

                <th className="p-3 text-center">
                  Status
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
                      .join(" • ") || "—"}
                  </td>

                  <td className="p-3 text-right">
                    ₹
                    {Number(
                      variant.price
                    ).toFixed(2)}
                  </td>

                  <td className="p-3 text-right">
                    {variant.stock}
                  </td>

                  <td className="p-3 text-center">
                    {variant.isActive
                      ? "Active"
                      : "Inactive"}
                  </td>

                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/admin/products/${product.id}/variants/${variant.id}`}
                        className="hover:underline"
                      >
                        View
                      </Link>

                      <Link
                        href={`/admin/products/${product.id}/variants/${variant.id}/edit`}
                        className="hover:underline"
                      >
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}

              {variants.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-muted-foreground"
                  >
                    No variants found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}