import Link from "next/link";

type Props = {
  params: Promise<{
    productId: string;
  }>;
};

export default async function ProductDetailsPage({
  params,
}: Props) {
  const { productId } = await params;

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Product Details
          </h1>

          <p className="text-sm text-muted-foreground">
            Product ID: {productId}
          </p>
        </div>

        <Link
          href={`/admin/products/${productId}/variants`}
          className="rounded bg-black px-4 py-2 text-white"
        >
          Manage Variants
        </Link>
      </div>
    </div>
  );
}