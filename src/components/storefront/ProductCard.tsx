import Link from "next/link";
import Image from "next/image";

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    slug: string;
    shortDescription: string | null;
    brand: {
      name: string;
      slug: string;
    } | null;
    variants: {
      id: string;
      price: unknown;
      stock: number;
      isDefault: boolean;
      images: {
        url: string;
        altText: string | null;
      }[];
    }[];
  };
};

export default function ProductCard({
  product,
}: ProductCardProps) {
  const defaultVariant =
    product.variants.find(
      (variant) => variant.isDefault
    ) ?? product.variants[0];

  const image =
    defaultVariant?.images[0];

  const isOutOfStock =
    !defaultVariant ||
    (!defaultVariant.stock &&
      !defaultVariant.isDefault);

  return (
    <article className="overflow-hidden rounded-lg border">
      <Link href={`/shop/${product.slug}`}>
        <div className="relative aspect-square bg-gray-100">
          {image ? (
            <Image
              src={image.url}
              alt={
                image.altText ??
                product.name
              }
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-500">
              No image
            </div>
          )}
        </div>
      </Link>

      <div className="space-y-2 p-4">
        {product.brand && (
          <p className="text-xs text-gray-500">
            {product.brand.name}
          </p>
        )}

        <Link
          href={`/shop/${product.slug}`}
          className="font-semibold hover:underline"
        >
          {product.name}
        </Link>

        {product.shortDescription && (
          <p className="text-sm text-gray-500">
            {product.shortDescription}
          </p>
        )}

        {defaultVariant ? (
          <p className="font-medium">
            ₹{Number(defaultVariant.price).toFixed(2)}
          </p>
        ) : (
          <p className="text-sm text-gray-500">
            No variant available
          </p>
        )}

        {defaultVariant &&
          defaultVariant.stock <= 0 && (
            <p className="text-sm text-red-600">
              Out of stock
            </p>
          )}

        <Link
          href={`/shop/${product.slug}`}
          className="inline-block rounded-md border px-4 py-2 text-sm"
        >
          View Product
        </Link>
      </div>
    </article>
  );
}