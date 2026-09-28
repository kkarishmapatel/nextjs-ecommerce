import Link from "next/link";

import CartItemRow from "@/components/cart/CartItemRow";
import { getCurrentCart } from "@/lib/cart/getCurrentCart";

export default async function CartPage() {
  const cart = await getCurrentCart();

  if (!cart || cart.items.length === 0) {
    return (
      <main className="mx-auto max-w-5xl p-6">
        <div className="py-20 text-center">
          <h1 className="text-3xl font-semibold">
            Your Cart
          </h1>

          <p className="mt-3 text-gray-600">
            Your cart is empty.
          </p>

          <Link
            href="/shop"
            className="mt-6 inline-block rounded-md bg-black px-6 py-3 text-sm font-medium text-white"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-3xl font-semibold">
        Your Cart
      </h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        {/* Cart items */}
        <div>
          {cart.items.map((item) => (
            <CartItemRow
              key={item.id}
              item={item}
            />
          ))}
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-lg border p-6">
          <h2 className="text-lg font-semibold">
            Order Summary
          </h2>

          <div className="mt-6 flex justify-between text-sm">
            <span>Subtotal</span>

            <span className="font-medium">
              ₹{cart.subtotal.toFixed(2)}
            </span>
          </div>

          <div className="mt-4 border-t pt-4">
            <div className="flex justify-between">
              <span className="font-semibold">
                Total
              </span>

              <span className="font-semibold">
                ₹{cart.subtotal.toFixed(2)}
              </span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="mt-6 block w-full rounded-md bg-black px-6 py-3 text-center text-sm font-medium text-white hover:bg-gray-800"
          >
            Checkout
          </Link>

          <Link
            href="/shop"
            className="mt-3 block text-center text-sm text-gray-600 hover:text-black"
          >
            Continue Shopping
          </Link>
        </aside>
      </div>
    </main>
  );
}