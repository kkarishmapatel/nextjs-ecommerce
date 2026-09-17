import Link from "next/link";
import { redirect } from "next/navigation";

import { getCheckoutData } from "@/lib/checkout/getCheckoutData";
import ReviewOrder from "@/components/checkout/ReviewOrder";

export default async function CheckoutReviewPage() {
  const checkoutData = await getCheckoutData();

  if (!checkoutData) {
    redirect("/login");
  }

  if (!checkoutData.cart) {
    redirect("/account/cart");
  }

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">
          Review Order
        </h1>

        <p className="mt-2 text-sm text-gray-600">
          Review your shipping address and order details before placing your order.
        </p>
      </div>

      <ReviewOrder
        addresses={checkoutData.addresses}
        cart={checkoutData.cart}
      />

      <div className="mt-8 flex items-center justify-between">
        <Link
          href="/checkout"
          className="text-sm font-medium underline"
        >
          Back to Checkout
        </Link>

        <button
          type="button"
          disabled
          className="rounded-md bg-gray-300 px-6 py-3 text-sm font-medium text-gray-600"
        >
          Place Order
        </button>
      </div>
    </main>
  );
}