import Link from "next/link";

import CartItemRow from "@/components/cart/CartItemRow";
import { getCurrentCart } from "@/lib/cart/getCurrentCart";

export default async function CartPage() {
  const cart = await getCurrentCart();

  if (!cart || cart.items.length === 0) {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="rounded-2xl border border-dashed px-6 py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <span aria-hidden="true" className="text-2xl">
            🛒
          </span>
        </div>

        <h1 className="mt-5 text-3xl font-semibold text-gray-900">
          Your Cart
        </h1>

        <p className="mt-3 text-gray-600">
          Your cart is empty.
        </p>

        <p className="mt-2 text-sm text-gray-500">
          Explore our products and find something you love.
        </p>

        <Link
          href="/shop"
          className="mt-7 inline-flex rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
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