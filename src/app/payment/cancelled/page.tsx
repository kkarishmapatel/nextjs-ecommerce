import Link from "next/link";

export default function PaymentCancelledPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 text-center">
      <h1 className="text-3xl font-bold">
        Payment Cancelled
      </h1>

      <p className="mt-4 text-gray-600">
        Your payment was cancelled. Your order has not been confirmed.
      </p>

      <div className="mt-8 flex justify-center gap-4">
        <Link
          href="/account/orders"
          className="rounded-md border border-gray-300 px-6 py-3 text-sm font-medium hover:bg-gray-50"
        >
          View My Orders
        </Link>

        <Link
          href="/account/cart"
          className="rounded-md bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800"
        >
          Return to Cart
        </Link>
      </div>
    </main>
  );
}