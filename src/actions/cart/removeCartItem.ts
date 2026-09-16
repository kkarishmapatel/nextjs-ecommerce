"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentCustomer } from "@/lib/customers/getCurrentCustomer";

export async function removeCartItem(
  cartItemId: string
) {
  try {
    const customer = await getCurrentCustomer();

    if (!customer) {
      return {
        success: false,
        error: "You must be logged in.",
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
        select: {
          id: true,
        },
      });

    if (!cartItem) {
      return {
        success: false,
        error: "Cart item not found.",
      };
    }

    await prisma.cartItem.delete({
      where: {
        id: cartItem.id,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "Failed to remove cart item:",
      error
    );

    return {
      success: false,
      error: "Failed to remove cart item.",
    };
  }
}