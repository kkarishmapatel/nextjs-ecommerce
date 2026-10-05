"use server";

import { revalidatePath } from "next/cache";
import { getCurrentCustomer } from "@/lib/customers/getCurrentCustomer";
import { prisma } from "@/lib/prisma";

export async function cancelOrder(orderId: string) {
  const customer = await getCurrentCustomer();

  if (!customer) {
    return {
      success: false,
      error: "You must be logged in to cancel an order.",
    };
  }

  if (!orderId) {
    return {
      success: false,
      error: "Invalid order.",
    };
  }

  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        customerId: customer.id,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return {
        success: false,
        error: "Order not found.",
      };
    }

    if (order.status === "CANCELLED") {
      return {
        success: false,
        error: "This order has already been cancelled.",
      };
    }

    if (
      order.status !== "PENDING" &&
      order.status !== "CONFIRMED"
    ) {
      return {
        success: false,
        error: "This order can no longer be cancelled.",
      };
    }

    await prisma.$transaction(async (tx) => {
      // Re-check the order inside the transaction.
      const currentOrder = await tx.order.findUnique({
        where: {
          id: order.id,
        },
        include: {
          items: true,
        },
      });

      if (!currentOrder) {
        throw new Error("Order not found.");
      }

      if (currentOrder.status === "CANCELLED") {
        throw new Error("This order has already been cancelled.");
      }

      if (
        currentOrder.status !== "PENDING" &&
        currentOrder.status !== "CONFIRMED"
      ) {
        throw new Error("This order can no longer be cancelled.");
      }

      // Stripe pending orders have not deducted inventory yet.
      // Inventory should only be restored after successful payment.
      const shouldRestoreInventory =
        currentOrder.paymentStatus === "PAID" ||
        currentOrder.status === "CONFIRMED";

      if (shouldRestoreInventory) {
        for (const item of currentOrder.items) {
          if (!item.variantId) {
            continue;
          }

          const variant = await tx.productVariant.findUnique({
            where: {
              id: item.variantId,
            },
          });

          if (!variant) {
            continue;
          }

          if (!variant.trackInventory) {
            continue;
          }

          await tx.productVariant.update({
            where: {
              id: variant.id,
            },
            data: {
              stock: {
                increment: item.quantity,
              },
            },
          });

          await tx.inventoryHistory.create({
            data: {
              variantId: variant.id,
              previousStock: variant.stock,
              newStock: variant.stock + item.quantity,
              change: item.quantity,
              reason: "RETURN",
              note: `Order ${currentOrder.orderNumber} cancelled`,
            },
          });
        }
      }

      await tx.order.update({
        where: {
          id: currentOrder.id,
        },
        data: {
          status: "CANCELLED",
        },
      });
    });

    revalidatePath(`/account/orders/${orderId}`);
    revalidatePath("/account/orders");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to cancel order:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to cancel order.",
    };
  }
}