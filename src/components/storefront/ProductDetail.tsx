"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { addToCart } from "@/actions/cart/addToCart";

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
      price: number;
      compareAtPrice: number | null;
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

  const [isAddingToCart, setIsAddingToCart] =
    useState(false);

  const [selectedImageId, setSelectedImageId] =
    useState<string | null>(null);

  const [cartMessage, setCartMessage] =
    useState<string | null>(null);

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
    const map = new Map<string, string>();

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

    // First, try to find an exact variant
    // matching all selected attributes.
    const exactVariant =
      product.variants.find((variant) => {
        const variantAttributes = new Map<
          string,
          string
        >();

        for (const item of variant.variantAttributes) {
          variantAttributes.set(
            item.attributeValue.attribute.id,
            item.attributeValue.id
          );
        }

        if (
          variantAttributes.size !==
          currentSelections.size
        ) {
          return false;
        }

        for (const [key, value] of currentSelections) {
          if (
            variantAttributes.get(key) !== value
          ) {
            return false;
          }
        }

        return true;
      });

    if (exactVariant) {
      setSelectedVariantId(exactVariant.id);
      return;
    }

    // If the exact combination doesn't exist,
    // find the first variant containing the
    // newly selected attribute value.
    const fallbackVariant =
      product.variants.find((variant) =>
        variant.variantAttributes.some(
          (item) =>
            item.attributeValue.id ===
            attributeValueId
        )
      );

    if (fallbackVariant) {
      setSelectedVariantId(fallbackVariant.id);
    }
  }

  const price = selectedVariant
    ? Number(selectedVariant.price)
    : null;

  const compareAtPrice =
    selectedVariant?.compareAtPrice
      ? Number(selectedVariant.compareAtPrice)
      : null;

  const hasStock = selectedVariant
    ? selectedVariant.stock > 0 ||
      selectedVariant.allowBackorders
    : false;

  const images =
    selectedVariant?.images ?? [];

  const selectedImage =
    images.find(
      (image) =>
        image.id === selectedImageId
    ) ?? images[0];

  useEffect(() => {
    setSelectedImageId(
      images[0]?.id ?? null
    );
  }, [selectedVariantId]);

  async function handleAddToCart() {
    if (!selectedVariant) {
      return;
    }

    setIsAddingToCart(true);
    setCartMessage(null);

    const result = await addToCart(
      selectedVariant.id,
      1
    );

    if (result.success) {
      setCartMessage(
        "Product added to cart."
      );
    } else {
      setCartMessage(
        result.error ??
          "Failed to add product to cart."
      );
    }

    setIsAddingToCart(false);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
      {/* Product images */}
      <div>
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
          {selectedImage ? (
            <Image
              src={selectedImage.url}
              alt={
                selectedImage.altText ??
                product.name
              }
              fill
              priority
              className="object-cover transition duration-300"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-500">
              No image
            </div>
          )}
        </div>

        {images.length > 0 && (
          <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
            {images.map((image) => {
              const isSelected =
                image.id ===
                selectedImageId;

              return (
                <button
                  key={image.id}
                  type="button"
                  onClick={() =>
                    setSelectedImageId(
                      image.id
                    )
                  }
                  aria-label={`View ${product.name} image`}
                  className={`relative aspect-square overflow-hidden rounded-lg border-2 transition ${
                    isSelected
                      ? "border-black"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={
                      image.altText ??
                      product.name
                    }
                    fill
                    className="object-cover transition duration-200 hover:scale-105"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Product information */}
      <div className="flex flex-col">
        {product.brand && (
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            {product.brand.name}
          </p>
        )}

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          {product.name}
        </h1>

        {product.shortDescription && (
          <p className="mt-4 text-base leading-7 text-gray-600">
            {product.shortDescription}
          </p>
        )}

        {/* Price */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {price !== null && (
            <span className="text-2xl font-semibold text-gray-900">
              ₹{price.toFixed(2)}
            </span>
          )}

          {compareAtPrice !== null &&
            price !== null &&
            compareAtPrice > price && (
              <>
                <span className="text-base text-gray-400 line-through">
                  ₹{compareAtPrice.toFixed(2)}
                </span>

                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                  Sale
                </span>
              </>
            )}
        </div>

        {/* Variant selectors */}
        {attributeGroups.length > 0 && (
          <div className="mt-8 space-y-6 border-t pt-6">
            {attributeGroups.map((group) => (
              <div key={group.id}>
                <p className="mb-3 text-sm font-semibold text-gray-900">
                  {group.name}
                </p>

                <div className="flex flex-wrap gap-2">
                  {group.values.map((value) => {
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
                        className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                          isSelected
                            ? "border-black bg-black text-white"
                            : "border-gray-300 bg-white text-gray-700 hover:border-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {value.value}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stock + SKU */}
        {selectedVariant && (
          <div className="mt-6 space-y-3">
            {hasStock ? (
              <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                {selectedVariant.stock > 0
                  ? `In stock (${selectedVariant.stock} available)`
                  : "Available for backorder"}
              </span>
            ) : (
              <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-700">
                Out of stock
              </span>
            )}

            <p className="text-xs text-gray-500">
              SKU: {selectedVariant.sku}
            </p>
          </div>
        )}

        {/* Add to cart */}
        <div className="mt-6 border-t pt-6">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={
              !selectedVariant ||
              !hasStock ||
              isAddingToCart
            }
            className="w-full rounded-lg bg-black px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {isAddingToCart
              ? "Adding..."
              : "Add to Cart"}
          </button>

          {cartMessage && (
            <p
              className={`mt-3 rounded-md px-3 py-2 text-sm ${
                cartMessage ===
                "Product added to cart."
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {cartMessage}
            </p>
          )}
        </div>

        {/* Description */}
        {product.description && (
          <div className="mt-8 border-t pt-6">
            <h2 className="text-base font-semibold text-gray-900">
              Description
            </h2>

            <div className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-600">
              {product.description}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}