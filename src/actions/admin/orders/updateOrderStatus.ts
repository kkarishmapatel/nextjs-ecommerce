"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

const orderStatuses = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

const paymentStatuses = [
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
] as const;

type OrderStatus = (typeof orderStatuses)[number];
type PaymentStatus = (typeof paymentStatuses)[number];

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
) {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      error: "You must be logged in.",
    };
  }

  if (user.role !== "ADMIN") {
    return {
      success: false,
      error: "You are not authorized to update orders.",
    };
  }

  if (!orderStatuses.includes(status)) {
    return {
      success: false,
      error: "Invalid order status.",
    };
  }

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
  });

  if (!order) {
    return {
      success: false,
      error: "Order not found.",
    };
  }

  await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status,
    },
  });

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
  revalidatePath(`/account/orders/${orderId}`);
  revalidatePath("/account/orders");

  return {
    success: true,
  };
}

export async function updatePaymentStatus(
  orderId: string,
  paymentStatus: PaymentStatus
) {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      error: "You must be logged in.",
    };
  }

  if (user.role !== "ADMIN") {
    return {
      success: false,
      error: "You are not authorized to update orders.",
    };
  }

  if (!paymentStatuses.includes(paymentStatus)) {
    return {
      success: false,
      error: "Invalid payment status.",
    };
  }

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
  });

  if (!order) {
    return {
      success: false,
      error: "Order not found.",
    };
  }

  await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      paymentStatus,
    },
  });

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
  revalidatePath(`/account/orders/${orderId}`);
  revalidatePath("/account/orders");

  return {
    success: true,
  };
}