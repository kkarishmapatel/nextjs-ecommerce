"use client";

import Image from "next/image";
import { useState } from "react";
import { updateCartItemQuantity } from "@/actions/cart/updateCartItemQuantity";
import { removeCartItem } from "@/actions/cart/removeCartItem";

type CartItemRowProps = {
  item: {
    id: string;
    quantity: number;
    variantId: string;
    sku: string;
    price: number;
    itemTotal: number;

    product: {
      id: string;
      name: string;
      slug: string;
    };

    image: {
      id: string;
      url: string;
      altText: string | null;
    } | null;

    attributes: {
      name: string;
      value: string;
    }[];
  };
};

export default function CartItemRow({
  item,
}: CartItemRowProps) {
  const [isUpdating, setIsUpdating] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function changeQuantity(
    quantity: number
  ) {
    if (quantity < 1) {
      return;
    }

    setIsUpdating(true);
    setError(null);

    const result =
      await updateCartItemQuantity(
        item.id,
        quantity
      );

    if (!result.success) {
      setError(
        result.error ??
          "Failed to update quantity."
      );
    }

    setIsUpdating(false);

    if (result.success) {
      window.location.reload();
    }
  }

  async function handleRemove() {
    setIsUpdating(true);
    setError(null);

    const result =
      await removeCartItem(item.id);

    if (!result.success) {
      setError(
        result.error ??
          "Failed to remove item."
      );

      setIsUpdating(false);
      return;
    }

    window.location.reload();
  }

  return (
    <div className="flex gap-4 border-b py-6">
      {/* Product image */}
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-gray-100">
        {item.image ? (
          <Image
            src={item.image.url}
            alt={
              item.image.altText ??
              item.product.name
            }
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-gray-500">
            No image
          </div>
        )}
      </div>

      {/* Product information */}
      <div className="flex flex-1 justify-between gap-4">
        <div>
          <h2 className="font-medium">
            {item.product.name}
          </h2>

          {item.attributes.length > 0 && (
            <div className="mt-2 space-y-1 text-sm text-gray-600">
              {item.attributes.map(
                (attribute) => (
                  <p
                    key={`${attribute.name}-${attribute.value}`}
                  >
                    {attribute.name}:{" "}
                    {attribute.value}
                  </p>
                )
              )}
            </div>
          )}

          <p className="mt-2 text-sm text-gray-500">
            SKU: {item.sku}
          </p>

          <p className="mt-2 text-sm text-gray-600">
            ₹{item.price.toFixed(2)}
          </p>

          {/* Quantity controls */}
          <div className="mt-4 flex items-center gap-3">
            <span className="text-sm font-medium">
              Quantity
            </span>

            <div className="flex items-center rounded-md border">
              <button
                type="button"
                onClick={() =>
                  changeQuantity(
                    item.quantity - 1
                  )
                }
                disabled={
                  isUpdating ||
                  item.quantity <= 1
                }
                className="px-3 py-1 text-lg disabled:cursor-not-allowed disabled:text-gray-300"
              >
                −
              </button>

              <span className="min-w-10 text-center text-sm">
                {item.quantity}
              </span>

              <button
                type="button"
                onClick={() =>
                  changeQuantity(
                    item.quantity + 1
                  )
                }
                disabled={isUpdating}
                className="px-3 py-1 text-lg disabled:cursor-not-allowed disabled:text-gray-300"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleRemove}
              disabled={isUpdating}
              className="text-sm text-red-600 hover:text-red-800 disabled:cursor-not-allowed disabled:text-gray-300"
            >
              Remove
            </button>
          </div>

          {error && (
            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>
          )}
        </div>

        {/* Item total */}
        <div className="shrink-0 text-right">
          <p className="font-medium">
            ₹{item.itemTotal.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
