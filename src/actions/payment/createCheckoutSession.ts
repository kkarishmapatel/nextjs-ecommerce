"use server";

import { getCurrentCustomer } from "@/lib/customers/getCurrentCustomer";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { createPendingOrder } from "@/actions/order/createPendingOrder";

export async function createCheckoutSession(addressId: string) {
  const customer = await getCurrentCustomer();

  if (!customer) {
    return {
      success: false,
      error: "You must be logged in to continue.",
    };
  }

  const pendingOrder = await createPendingOrder(addressId);

  if (!pendingOrder.success) {
  return {
    success: false,
    error: pendingOrder.error ?? "Failed to create order.",
  };
}

  const order = await prisma.order.findUnique({
    where: {
      id: pendingOrder.orderId,
    },
    include: {
      items: true,
      payments: true,
    },
  });

  if (!order) {
    return {
      success: false,
      error: "Failed to create order.",
    };
  }

  const payment = order.payments[0];

  if (!payment) {
    return {
      success: false,
      error: "Payment record was not created.",
    };
  }

  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      line_items: order.items.map((item) => ({
        price_data: {
          currency: "inr",
          product_data: {
            name: item.productName,
          },
          unit_amount: Math.round(Number(item.price) * 100),
        },
        quantity: item.quantity,
      })),

      customer_email: customer.user.email,

      metadata: {
        orderId: order.id,
        paymentId: payment.id,
      },

      success_url: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/payment/cancelled?orderId=${order.id}`,
    });

    await prisma.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        providerOrderId: session.id,
      },
    });

    return {
      success: true,
      checkoutUrl: session.url,
    };
  } catch (error) {
    console.error("Failed to create Stripe Checkout Session:", error);

    return {
      success: false,
      error: "Unable to start payment.",
    };
  }
}