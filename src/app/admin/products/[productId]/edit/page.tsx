import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{
    productId: string;
  }>;
};

export default async function EditProductPage({ params }: Props) {
  const { productId } = await params;

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl p-8">
      <h1 className="mb-6 text-3xl font-bold">
        Edit Product
      </h1>

      <div className="space-y-3 rounded border p-6">
        <p>
          <strong>ID:</strong> {product.id}
        </p>

        <p>
          <strong>Name:</strong> {product.name}
        </p>

        <p>
          <strong>Slug:</strong> {product.slug}
        </p>

        <p>
          <strong>Status:</strong> {product.status}
        </p>

        <p>
          <strong>Created:</strong>{" "}
          {product.createdAt.toLocaleString()}
        </p>
      </div>
    </div>
  );
}