"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type ProductDetailProps = {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    shortDescription: string | null;

    brand: {
      name: string;
      slug: string;
    } | null;

    variants: {
      id: string;
      sku: string;
      price: unknown;
      compareAtPrice: unknown;
      stock: number;
      trackInventory: boolean;
      allowBackorders: boolean;
      isDefault: boolean;

      images: {
        id: string;
        url: string;
        altText: string | null;
        sortOrder: number;
      }[];

      variantAttributes: {
        attributeValue: {
          id: string;
          value: string;

          attribute: {
            id: string;
            name: string;
            slug: string;
            sortOrder: number;
          };
        };
      }[];
    }[];
  };
};

export default function ProductDetail({
  product,
}: ProductDetailProps) {
  const defaultVariant =
    product.variants.find(
      (variant) => variant.isDefault
    ) ?? product.variants[0];

  const [selectedVariantId, setSelectedVariantId] =
    useState(defaultVariant?.id);

  const selectedVariant =
    product.variants.find(
      (variant) =>
        variant.id === selectedVariantId
    ) ?? defaultVariant;

  const attributeGroups = useMemo(() => {
    const groups = new Map<
      string,
      {
        id: string;
        name: string;
        slug: string;
        sortOrder: number;
        values: {
          id: string;
          value: string;
        }[];
      }
    >();

    for (const variant of product.variants) {
      for (const item of variant.variantAttributes) {
        const attribute =
          item.attributeValue.attribute;

        if (!groups.has(attribute.id)) {
          groups.set(attribute.id, {
            id: attribute.id,
            name: attribute.name,
            slug: attribute.slug,
            sortOrder: attribute.sortOrder,
            values: [],
          });
        }

        const group = groups.get(attribute.id)!;

        const exists = group.values.some(
          (value) =>
            value.id ===
            item.attributeValue.id
        );

        if (!exists) {
          group.values.push({
            id: item.attributeValue.id,
            value: item.attributeValue.value,
          });
        }
      }
    }

    return Array.from(groups.values()).sort(
      (a, b) =>
        a.sortOrder - b.sortOrder
    );
  }, [product.variants]);

  const selectedAttributes = useMemo(() => {
    const map = new Map<
      string,
      string
    >();

    if (!selectedVariant) {
      return map;
    }

    for (const item of selectedVariant.variantAttributes) {
      map.set(
        item.attributeValue.attribute.id,
        item.attributeValue.id
      );
    }

    return map;
  }, [selectedVariant]);

  function selectAttribute(
    attributeId: string,
    attributeValueId: string
  ) {
    const currentSelections = new Map(
      selectedAttributes
    );

    currentSelections.set(
      attributeId,
      attributeValueId
    );

    const matchingVariant =
      product.variants.find(
        (variant) => {
          const variantAttributes =
            new Map<
              string,
              string
            >();

          for (const item of variant.variantAttributes) {
            variantAttributes.set(
              item.attributeValue
                .attribute.id,
              item.attributeValue.id
            );
          }

          if (
            variantAttributes.size !==
            currentSelections.size
          ) {
            return false;
          }

          for (const [
            key,
            value,
          ] of currentSelections) {
            if (
              variantAttributes.get(
                key
              ) !== value
            ) {
              return false;
            }
          }

          return true;
        }
      );

    if (matchingVariant) {
      setSelectedVariantId(
        matchingVariant.id
      );
    }
  }

  const price = selectedVariant
    ? Number(selectedVariant.price)
    : null;

  const compareAtPrice =
    selectedVariant?.compareAtPrice
      ? Number(
          selectedVariant.compareAtPrice
        )
      : null;

  const hasStock = selectedVariant
    ? selectedVariant.stock > 0 ||
      selectedVariant.allowBackorders
    : false;

  const images =
    selectedVariant?.images ??
    [];

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      {/* Images */}
      <div>
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
          {images[0] ? (
            <Image
              src={images[0].url}
              alt={
                images[0].altText ??
                product.name
              }
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-500">
              No image
            </div>
          )}
        </div>

        {images.length > 1 && (
          <div className="mt-4 grid grid-cols-4 gap-3">
            {images.map((image) => (
              <div
                key={image.id}
                className="relative aspect-square overflow-hidden rounded-md border"
              >
                <Image
                  src={image.url}
                  alt={
                    image.altText ??
                    product.name
                  }
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product information */}
      <div className="space-y-6">
        {product.brand && (
          <p className="text-sm text-gray-500">
            {product.brand.name}
          </p>
        )}

        <div>
          <h1 className="text-3xl font-semibold">
            {product.name}
          </h1>

          {product.shortDescription && (
            <p className="mt-3 text-gray-600">
              {product.shortDescription}
            </p>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center gap-3">
          {price !== null && (
            <span className="text-2xl font-semibold">
              ₹{price.toFixed(2)}
            </span>
          )}

          {compareAtPrice !== null &&
            compareAtPrice > price! && (
              <span className="text-lg text-gray-400 line-through">
                ₹{compareAtPrice.toFixed(2)}
              </span>
            )}
        </div>

        {/* Variant selectors */}
        {attributeGroups.length > 0 && (
          <div className="space-y-5">
            {attributeGroups.map(
              (group) => (
                <div key={group.id}>
                  <p className="mb-2 text-sm font-medium">
                    {group.name}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {group.values.map(
                      (value) => {
                        const isSelected =
                          selectedAttributes.get(
                            group.id
                          ) === value.id;

                        return (
                          <button
                            key={value.id}
                            type="button"
                            onClick={() =>
                              selectAttribute(
                                group.id,
                                value.id
                              )
                            }
                            className={`rounded-md border px-4 py-2 text-sm ${
                              isSelected
                                ? "border-black bg-black text-white"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            {value.value}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* Stock */}
        {selectedVariant && (
          <div>
            {hasStock ? (
              <p className="text-sm text-green-600">
                {selectedVariant.stock >
                0
                  ? `In stock (${selectedVariant.stock} available)`
                  : "Available for backorder"}
              </p>
            ) : (
              <p className="text-sm text-red-600">
                Out of stock
              </p>
            )}
          </div>
        )}

        {/* SKU */}
        {selectedVariant && (
          <p className="text-sm text-gray-500">
            SKU: {selectedVariant.sku}
          </p>
        )}

        {/* Description */}
        {product.description && (
          <div className="border-t pt-6">
            <h2 className="font-medium">
              Description
            </h2>

            <div className="mt-3 whitespace-pre-line text-sm leading-6 text-gray-600">
              {product.description}
            </div>
          </div>
        )}

        {/* Add to cart placeholder */}
        <button
          type="button"
          disabled={!selectedVariant || !hasStock}
          className="w-full rounded-md bg-black px-6 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}