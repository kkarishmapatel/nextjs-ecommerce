import Link from "next/link";

export default function PaymentCancelledPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center px-6 py-16">
      <div className="w-full rounded-lg border bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">
          Payment Cancelled
        </h1>

        <p className="mt-4 text-gray-600">
          Your payment was not completed, so your order has not been confirmed.
        </p>

        <p className="mt-2 text-gray-600">
          Your cart items are still available if you would like to try again.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/account/cart"
            className="rounded-md bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            Return to Cart
          </Link>

          <Link
            href="/account/orders"
            className="rounded-md border px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            View Orders
          </Link>
        </div>
      </div>
    </main>
  );
}