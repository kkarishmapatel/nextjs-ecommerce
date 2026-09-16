"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentCustomer } from "@/lib/customers/getCurrentCustomer";

export async function addToCart(
  variantId: string,
  quantity: number = 1
) {
  try {
    const customer =
      await getCurrentCustomer();

    if (!customer) {
      return {
        success: false,
        error: "You must be logged in to add items to your cart.",
      };
    }

    if (quantity < 1) {
      return {
        success: false,
        error: "Quantity must be at least 1.",
      };
    }

    const variant =
      await prisma.productVariant.findFirst({
        where: {
          id: variantId,
          isActive: true,
        },
        select: {
          id: true,
          stock: true,
          trackInventory: true,
          allowBackorders: true,
          product: {
            select: {
              id: true,
              status: true,
            },
          },
        },
      });

    if (!variant) {
      return {
        success: false,
        error: "Product variant not found.",
      };
    }

    if (
      variant.product.status !== "ACTIVE"
    ) {
      return {
        success: false,
        error: "This product is not available for purchase.",
      };
    }

    if (
      variant.trackInventory &&
      variant.stock < quantity &&
      !variant.allowBackorders
    ) {
      return {
        success: false,
        error: "Not enough stock available.",
      };
    }

    const cart = await prisma.cart.upsert({
      where: {
        customerId: customer.id,
      },
      create: {
        customerId: customer.id,
      },
      update: {},
    });

    const existingItem =
      await prisma.cartItem.findUnique({
        where: {
          cartId_variantId: {
            cartId: cart.id,
            variantId: variant.id,
          },
        },
      });

    if (existingItem) {
      const newQuantity =
        existingItem.quantity + quantity;

      if (
        variant.trackInventory &&
        variant.stock < newQuantity &&
        !variant.allowBackorders
      ) {
        return {
          success: false,
          error: "Not enough stock available.",
        };
      }

      await prisma.cartItem.update({
        where: {
          id: existingItem.id,
        },
        data: {
          quantity: newQuantity,
        },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          variantId: variant.id,
          quantity,
        },
      });
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "Failed to add item to cart:",
      error
    );

    return {
      success: false,
      error: "Failed to add item to cart.",
    };
  }
}