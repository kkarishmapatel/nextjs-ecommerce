import { getCurrentCustomer } from "@/lib/customers/getCurrentCustomer";
import { prisma } from "@/lib/prisma";

export async function getCurrentCart() {
  const customer = await getCurrentCustomer();

  if (!customer) {
    return null;
  }

  const cart = await prisma.cart.findUnique({
    where: {
      customerId: customer.id,
    },
    include: {
      items: {
        orderBy: {
          createdAt: "asc",
        },
        include: {
          variant: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
              images: {
                orderBy: {
                  sortOrder: "asc",
                },
                take: 1,
              },
              variantAttributes: {
                include: {
                  attributeValue: {
                    select: {
                      id: true,
                      value: true,
                      attribute: {
                        select: {
                          id: true,
                          name: true,
                          sortOrder: true,
                        },
                      },
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

  if (!cart) {
    return null;
  }

  const items = cart.items.map((item) => {
    const price = Number(item.variant.price);

    return {
      id: item.id,
      quantity: item.quantity,
      variantId: item.variant.id,
      sku: item.variant.sku,
      price,
      itemTotal: price * item.quantity,

      product: item.variant.product,

      image: item.variant.images[0] ?? null,

      attributes: item.variant.variantAttributes
        .sort(
          (a, b) =>
            a.attributeValue.attribute.sortOrder -
            b.attributeValue.attribute.sortOrder
        )
        .map((item) => ({
          name: item.attributeValue.attribute.name,
          value: item.attributeValue.value,
        })),
    };
  });

  const subtotal = items.reduce(
    (total, item) => total + item.itemTotal,
    0
  );

  return {
    id: cart.id,
    items,
    subtotal,
  };
}