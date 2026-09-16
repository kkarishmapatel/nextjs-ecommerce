"use client";

import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
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

    // First, try to find an exact variant
    // matching all selected attributes.
    const exactVariant = product.variants.find(
      (variant) => {
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
      }
    );

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
      ? Number(
        selectedVariant.compareAtPrice
      )
      : null;

  const hasStock = selectedVariant
    ? selectedVariant.stock > 0 ||
    selectedVariant.allowBackorders
    : false;

  const images =
    selectedVariant?.images ?? [];

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
    <div className="grid gap-10 lg:grid-cols-2">
      {/* Images */}
      <div>
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
          {images.length > 0 ? (
            <Image
              src={
                images.find(
                  (image) =>
                    image.id === selectedImageId
                )?.url ?? images[0].url
              }
              alt={
                images.find(
                  (image) =>
                    image.id === selectedImageId
                )?.altText ?? product.name
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

        {images.length > 0 && (
          <div className="mt-4 grid grid-cols-4 gap-3">
            {images.map((image) => {
              const isSelected =
                image.id === selectedImageId ||
                (!selectedImageId &&
                  image.id === images[0].id);

              return (
                <button
                  key={image.id}
                  type="button"
                  onClick={() =>
                    setSelectedImageId(image.id)
                  }
                  className={`relative aspect-square overflow-hidden rounded-md border-2 ${isSelected
                    ? "border-black"
                    : "border-gray-200"
                    }`}
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
                </button>
              );
            })}
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
                            className={`rounded-md border px-4 py-2 text-sm ${isSelected
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
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={
              !selectedVariant ||
              !hasStock ||
              isAddingToCart
            }
            className="w-full rounded-md bg-black px-6 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {isAddingToCart
              ? "Adding..."
              : "Add to Cart"}
          </button>

          {cartMessage && (
            <p className="text-sm text-gray-600">
              {cartMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}