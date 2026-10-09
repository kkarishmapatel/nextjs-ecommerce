import Image from "next/image";
import Link from "next/link";

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

  const image = defaultVariant?.images[0];

  const isOutOfStock =
    !defaultVariant ||
    defaultVariant.stock <= 0;

  return (
    <article className="group overflow-hidden rounded-xl border bg-white transition hover:-translate-y-0.5 hover:shadow-md">
      <Link
        href={`/shop/${product.slug}`}
        className="block"
      >
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {image ? (
            <Image
              src={image.url}
              alt={
                image.altText ??
                product.name
              }
              fill
              className="object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-500">
              No image
            </div>
          )}

          {isOutOfStock && (
            <span className="absolute left-3 top-3 rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white">
              Out of stock
            </span>
          )}
        </div>
      </Link>

      <div className="space-y-3 p-4">
        {product.brand && (
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {product.brand.name}
          </p>
        )}

        <Link
          href={`/shop/${product.slug}`}
          className="block text-base font-semibold text-gray-900 hover:text-gray-700"
        >
          {product.name}
        </Link>

        {product.shortDescription && (
          <p className="line-clamp-2 text-sm leading-5 text-gray-500">
            {product.shortDescription}
          </p>
        )}

        {defaultVariant ? (
          <p className="text-lg font-semibold text-gray-900">
            ₹{Number(defaultVariant.price).toFixed(2)}
          </p>
        ) : (
          <p className="text-sm text-gray-500">
            No variant available
          </p>
        )}

        <Link
          href={`/shop/${product.slug}`}
          className="block rounded-md border px-4 py-2.5 text-center text-sm font-medium text-gray-900 transition hover:bg-gray-900 hover:text-white"
        >
          View Product
        </Link>
      </div>
    </article>
  );
}