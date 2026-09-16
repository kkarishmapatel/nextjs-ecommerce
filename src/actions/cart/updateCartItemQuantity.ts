"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentCustomer } from "@/lib/customers/getCurrentCustomer";

export async function updateCartItemQuantity(
  cartItemId: string,
  quantity: number
) {
  try {
    const customer = await getCurrentCustomer();

    if (!customer) {
      return {
        success: false,
        error: "You must be logged in.",
      };
    }

    if (quantity < 1) {
      return {
        success: false,
        error: "Quantity must be at least 1.",
      };
    }

    const cartItem =
      await prisma.cartItem.findFirst({
        where: {
          id: cartItemId,
          cart: {
            customerId: customer.id,
          },
        },
        include: {
          variant: {
            select: {
              id: true,
              stock: true,
              trackInventory: true,
              allowBackorders: true,
            },
          },
        },
      });

    if (!cartItem) {
      return {
        success: false,
        error: "Cart item not found.",
      };
    }

    const {
      variant,
    } = cartItem;

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

    await prisma.cartItem.update({
      where: {
        id: cartItem.id,
      },
      data: {
        quantity,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "Failed to update cart quantity:",
      error
    );

    return {
      success: false,
      error: "Failed to update cart quantity.",
    };
  }
}