"use client";

import { useCheckout } from "@/components/checkout/CheckoutProvider";

type Address = {
  id: string;
  firstName: string;
  lastName: string;
  company: string | null;
  address1: string;
  address2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string | null;
  isDefault: boolean;
};

type CartItem = {
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
    sortOrder: number;
  } | null;
  attributes: {
    name: string;
    value: string;
  }[];
};

type Cart = {
  id: string;
  items: CartItem[];
  subtotal: number;
};

type ReviewOrderProps = {
  addresses: Address[];
  cart: Cart;
};

export default function ReviewOrder({
  addresses,
  cart,
}: ReviewOrderProps) {
  const { selectedAddressId } = useCheckout();

  const selectedAddress = addresses.find(
    (address) =>
      address.id === selectedAddressId
  );

  if (!selectedAddress) {
    return (
      <section className="rounded-lg border p-6">
        <h2 className="text-lg font-semibold">
          Shipping Address
        </h2>

        <p className="mt-3 text-sm text-gray-600">
          Please select a shipping address first.
        </p>
      </section>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <section className="lg:col-span-2">
        <div className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold">
            Shipping Address
          </h2>

          <div className="mt-4 text-sm">
            <p className="font-medium">
              {selectedAddress.firstName}{" "}
              {selectedAddress.lastName}
            </p>

            {selectedAddress.company && (
              <p className="mt-1">
                {selectedAddress.company}
              </p>
            )}

            <p className="mt-1">
              {selectedAddress.address1}
            </p>

            {selectedAddress.address2 && (
              <p>{selectedAddress.address2}</p>
            )}

            <p>
              {selectedAddress.city},{" "}
              {selectedAddress.state}{" "}
              {selectedAddress.postalCode}
            </p>

            <p>{selectedAddress.country}</p>

            {selectedAddress.phone && (
              <p className="mt-1">
                {selectedAddress.phone}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-lg border p-6">
          <h2 className="text-lg font-semibold">
            Order Items
          </h2>

          <div className="mt-6 divide-y">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 py-4 first:pt-0 last:pb-0"
              >
                {item.image && (
                  <img
                    src={item.image.url}
                    alt={
                      item.image.altText ??
                      item.product.name
                    }
                    className="h-20 w-20 rounded-md object-cover"
                  />
                )}

                <div className="flex-1">
                  <p className="font-medium">
                    {item.product.name}
                  </p>

                  {item.attributes.length > 0 && (
                    <div className="mt-1 text-sm text-gray-600">
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

                  <p className="mt-2 text-sm text-gray-600">
                    Qty: {item.quantity}
                  </p>
                </div>

                <p className="font-medium">
                  ₹{item.itemTotal.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <aside className="h-fit rounded-lg border p-6">
        <h2 className="text-lg font-semibold">
          Order Summary
        </h2>

        <div className="mt-6 flex justify-between text-sm">
          <span>Subtotal</span>

          <span>
            ₹{cart.subtotal.toFixed(2)}
          </span>
        </div>

        <div className="mt-4 border-t pt-4">
          <div className="flex justify-between font-semibold">
            <span>Total</span>

            <span>
              ₹{cart.subtotal.toFixed(2)}
            </span>
          </div>
        </div>
      </aside>
    </div>
  );
}