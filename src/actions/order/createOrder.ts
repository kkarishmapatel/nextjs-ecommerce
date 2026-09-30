"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentCustomer } from "@/lib/customers/getCurrentCustomer";

export async function createOrder(addressId: string) {
  const customer = await getCurrentCustomer();

  if (!customer) {
    return {
      success: false,
      error: "You must be logged in to place an order.",
    };
  }

  if (!addressId) {
    return {
      success: false,
      error: "Please select a shipping address.",
    };
  }

  // Make sure the address belongs to the logged-in customer.
  const address = await prisma.customerAddress.findFirst({
    where: {
      id: addressId,
      customerId: customer.id,
    },
  });

  if (!address) {
    return {
      success: false,
      error: "Invalid shipping address.",
    };
  }

  // Get the latest cart directly from the database.
  const cart = await prisma.cart.findUnique({
    where: {
      customerId: customer.id,
    },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: true,
              variantAttributes: {
                include: {
                  attributeValue: {
                    include: {
                      attribute: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    return {
      success: false,
      error: "Your cart is empty.",
    };
  }

  /*
   * Validate the cart before starting the transaction.
   *
   * We intentionally use the current database values rather than
   * trusting anything sent by the browser.
   */
  for (const item of cart.items) {
    const variant = item.variant;
    const product = variant.product;

    if (product.status !== "ACTIVE") {
      return {
        success: false,
        error: `"${product.name}" is not available for purchase.`,
      };
    }

    if (!variant.isActive) {
      return {
        success: false,
        error: `"${product.name}" (${variant.sku}) is no longer available.`,
      };
    }

    if (
      variant.trackInventory &&
      !variant.allowBackorders &&
      variant.stock < item.quantity
    ) {
      return {
        success: false,
        error: `"${product.name}" (${variant.sku}) does not have enough stock.`,
      };
    }
  }

  /*
   * IMPORTANT:
   * We calculate prices from the database.
   * The client never sends the order price.
   */
  const subtotal = cart.items.reduce((total, item) => {
    const price = Number(item.variant.price);

    return total + price * item.quantity;
  }, 0);

  const shippingAmount = 0;
  const discountAmount = 0;
  const total = subtotal + shippingAmount - discountAmount;

  const orderNumber = await generateOrderNumber();

  try {
    const order = await prisma.$transaction(async (tx) => {
      /*
       * 1. Create the order
       */
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          customerId: customer.id,
          status: "PENDING",
          paymentStatus: "PENDING",
          subtotal,
          shippingAmount,
          discountAmount,
          total,
        },
      });

      /*
       * 2. Copy the customer's address into the order.
       *
       * This creates a permanent snapshot.
       */
      await tx.orderAddress.create({
        data: {
          orderId: createdOrder.id,
          firstName: address.firstName,
          lastName: address.lastName,
          company: address.company,
          address1: address.address1,
          address2: address.address2,
          city: address.city,
          state: address.state,
          postalCode: address.postalCode,
          country: address.country,
          phone: address.phone,
        },
      });

      /*
       * 3. Create order-item snapshots
       */
      for (const item of cart.items) {
        const variant = item.variant;

        const attributes = variant.variantAttributes.map(
          (attribute) => ({
            attribute: attribute.attributeValue.attribute.name,
            value: attribute.attributeValue.value,
          })
        );

        const price = Number(variant.price);
        const lineTotal = price * item.quantity;

        await tx.orderItem.create({
          data: {
            orderId: createdOrder.id,
            variantId: variant.id,

            productName: variant.product.name,
            sku: variant.sku,
            attributes,

            price,
            quantity: item.quantity,
            lineTotal,
          },
        });
      }

      /*
       * 4. Decrease inventory
       */
      for (const item of cart.items) {
        const variant = await tx.productVariant.findUnique({
          where: {
            id: item.variantId,
          },
        });

        if (!variant) {
          throw new Error("Product variant not found.");
        }

        if (!variant.trackInventory) {
          continue;
        }

        const previousStock = variant.stock;

        if (!variant.allowBackorders) {
          const updatedVariant = await tx.productVariant.updateMany({
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

          if (updatedVariant.count !== 1) {
            throw new Error(
              `"${item.variant.product.name}" (${variant.sku}) is out of stock.`
            );
          }
        } else {
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
        }

        await tx.inventoryHistory.create({
          data: {
            variantId: variant.id,
            previousStock,
            newStock: previousStock - item.quantity,
            change: -item.quantity,
            reason: "ORDER",
            note: `Order ${createdOrder.orderNumber}`,
          },
        });
      }

      /*
       * 5. Remove the cart after everything succeeds.
       */
      await tx.cartItem.deleteMany({
        where: {
          cartId: cart.id,
        },
      });

      return createdOrder;
    });

    return {
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
    };
  } catch (error) {
    console.error("Failed to create order:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create order.",
    };
  }
}

async function generateOrderNumber() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(
    2,
    "0"
  );
  const day = String(date.getDate()).padStart(2, "0");

  const prefix = `ORD-${year}${month}${day}`;

  const latestOrder = await prisma.order.findFirst({
    where: {
      orderNumber: {
        startsWith: prefix,
      },
    },
    orderBy: {
      orderNumber: "desc",
    },
    select: {
      orderNumber: true,
    },
  });

  let sequence = 1;

  if (latestOrder) {
    const lastSequence = Number(
      latestOrder.orderNumber.slice(-4)
    );

    sequence = lastSequence + 1;
  }

  return `${prefix}-${String(sequence).padStart(4, "0")}`;
}