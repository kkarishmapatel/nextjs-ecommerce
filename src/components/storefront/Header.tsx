import Link from "next/link";

import { getCurrentCart } from "@/lib/cart/getCurrentCart";
import { getCurrentCustomer } from "@/lib/customers/getCurrentCustomer";

export default async function Header() {
  const customer = await getCurrentCustomer();
  const cart = await getCurrentCart();

  const cartItemCount =
    cart?.items.reduce(
      (total, item) => total + item.quantity,
      0
    ) ?? 0;

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-xl font-bold text-gray-900"
        >
          My Store
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/shop"
            className="text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Shop
          </Link>

          {customer ? (
            <Link
              href="/account/orders"
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Account
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Login
            </Link>
          )}

          <Link
            href="/account/cart"
            className="text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Cart
            {cartItemCount > 0 && (
              <span className="ml-1">
                ({cartItemCount})
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}