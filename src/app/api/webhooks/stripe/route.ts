import { NextResponse } from "next/server";
import Stripe from "stripe";

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature." },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured.");

    return NextResponse.json(
      { error: "Webhook secret is not configured." },
      { status: 500 }
    );
  }

  const body = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (error) {
    console.error("Invalid Stripe webhook signature:", error);

    return NextResponse.json(
      { error: "Invalid webhook signature." },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        await handleCheckoutCompleted(session);

        break;
      }

      default:
        console.log(`Unhandled Stripe event: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook processing failed:", error);

    return NextResponse.json(
      { error: "Webhook processing failed." },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session
) {
  const orderId = session.metadata?.orderId;
  const paymentId = session.metadata?.paymentId;

  if (!orderId || !paymentId) {
    throw new Error(
      "Stripe Checkout Session is missing orderId or paymentId metadata."
    );
  }

  if (session.payment_status !== "paid") {
    console.log(
      `Checkout session ${session.id} completed but payment is not paid.`
    );

    return;
  }

  await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        items: true,
        payments: true,
      },
    });

    if (!order) {
      throw new Error(`Order ${orderId} not found.`);
    }

    const payment = order.payments.find(
      (item) => item.id === paymentId
    );

    if (!payment) {
      throw new Error(`Payment ${paymentId} not found.`);
    }

    // Webhooks can be delivered more than once.
    // If payment is already processed, do nothing.
    if (payment.status === "PAID") {
      return;
    }

    if (order.status === "CANCELLED") {
      throw new Error(
        `Order ${order.orderNumber} has already been cancelled.`
      );
    }

    // Deduct inventory only after successful payment.
    for (const item of order.items) {
      if (!item.variantId) {
        continue;
      }

      const variant = await tx.productVariant.findUnique({
        where: {
          id: item.variantId,
        },
      });

      if (!variant) {
        throw new Error(
          `Variant ${item.variantId} was not found.`
        );
      }

      if (!variant.trackInventory) {
        continue;
      }

      if (variant.allowBackorders) {
        await tx.productVariant.update({
          where: {
            id: variant.id,
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        await tx.inventoryHistory.create({
          data: {
            variantId: variant.id,
            previousStock: variant.stock,
            newStock: variant.stock - item.quantity,
            change: -item.quantity,
            reason: "ORDER",
            note: `Order ${order.orderNumber} paid via Stripe`,
          },
        });

        continue;
      }

      const stockUpdate = await tx.productVariant.updateMany({
        where: {
          id: variant.id,
          stock: {
            gte: item.quantity,
          },
        },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });

      if (stockUpdate.count === 0) {
        throw new Error(
          `Insufficient stock for ${item.sku}.`
        );
      }

      await tx.inventoryHistory.create({
        data: {
          variantId: variant.id,
          previousStock: variant.stock,
          newStock: variant.stock - item.quantity,
          change: -item.quantity,
          reason: "ORDER",
          note: `Order ${order.orderNumber} paid via Stripe`,
        },
      });
    }

    await tx.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        status: "PAID",
        providerPaymentId:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : null,
        providerOrderId: session.id,
      },
    });

    await tx.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: "CONFIRMED",
        paymentStatus: "PAID",
      },
    });

    await tx.cartItem.deleteMany({
      where: {
        cart: {
          customerId: order.customerId,
        },
      },
    });
  });
}