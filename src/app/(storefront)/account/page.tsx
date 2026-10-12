
import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutUser } from "@/actions/logout";
import { getCurrentCustomer } from "@/lib/customers/getCurrentCustomer";

export default async function AccountPage() {
  const customer = await getCurrentCustomer();

  if (!customer) {
    redirect("/login");
  }

  const addressCount = customer.addresses.length;

  return (
    <main className="min-h-screen bg-gray-50/70">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Page heading */}
        <div className="mb-10">
          <p className="text-sm font-medium text-gray-500">
            YOUR ACCOUNT
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            My Account
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-600 sm:text-base">
            Manage your profile, track your orders, and keep your
            addresses up to date.
          </p>
        </div>

        {/* Welcome section */}
        <section className="mb-8 rounded-2xl bg-gray-900 px-6 py-7 text-white sm:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/10 text-xl font-semibold">
              {customer.user.name?.trim().charAt(0).toUpperCase() || "U"}
            </div>

            <div className="min-w-0">
              <p className="text-sm text-gray-300">
                Welcome back,
              </p>

              <h2 className="mt-1 truncate text-xl font-semibold sm:text-2xl">
                {customer.user.name || "Customer"}
              </h2>

              <p className="mt-1 break-all text-sm text-gray-300">
                {customer.user.email}
              </p>
            </div>
          </div>
        </section>

        {/* Account dashboard cards */}
        <section>
          <h2 className="mb-5 text-lg font-semibold text-gray-900">
            Manage your account
          </h2>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {/* Profile */}
            <article className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl">
                <span aria-hidden="true">👤</span>
              </div>

              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                My Profile
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                View and manage your personal account information.
              </p>

              <div className="mt-5 space-y-1 text-sm">
                <p className="truncate font-medium text-gray-900">
                  {customer.user.name || "Name not provided"}
                </p>

                <p className="break-all text-gray-500">
                  {customer.user.email}
                </p>
              </div>

              <div className="mt-auto pt-6">
                <Link
                  href="/account/profile"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 transition hover:text-gray-600"
                >
                  Edit Profile
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>

            {/* Orders */}
            <article className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-xl">
                <span aria-hidden="true">📦</span>
              </div>

              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                My Orders
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                View your purchases, check order statuses, and find
                your order details.
              </p>

              <div className="mt-auto pt-6">
                <Link
                  href="/account/orders"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 transition hover:text-gray-600"
                >
                  View My Orders
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>

            {/* Addresses */}
            <article className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-xl">
                <span aria-hidden="true">📍</span>
              </div>

              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                My Addresses
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Manage your saved shipping addresses for a smoother
                checkout.
              </p>

              <div className="mt-5">
                <p className="text-2xl font-bold text-gray-900">
                  {addressCount}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Saved {addressCount === 1 ? "address" : "addresses"}
                </p>
              </div>

              <div className="mt-auto pt-6">
                <Link
                  href="/account/addresses"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 transition hover:text-gray-600"
                >
                  Manage Addresses
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          </div>
        </section>

        {/* Continue shopping */}
        <section className="mt-8 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Looking for something new?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Explore our collection and find your next favorite product.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
          >
            Continue Shopping
            <span aria-hidden="true">→</span>
          </Link>
        </section>


        {/* Logout */}
        <section className="mt-8 flex flex-col gap-4 rounded-2xl border border-red-100 bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Sign out of your account
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Sign out securely when you're finished shopping.
            </p>
          </div>

          <form action={logoutUser}>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 sm:w-auto"
            >
              <span aria-hidden="true">↪</span>
              Logout
            </button>
          </form>
        </section>

      </div>
    </main>
  );
}