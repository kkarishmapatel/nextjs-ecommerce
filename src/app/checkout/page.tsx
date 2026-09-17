import Link from "next/link";
import { redirect } from "next/navigation";

import { getCheckoutData } from "@/lib/checkout/getCheckoutData";
import ShippingAddressSelector from "@/components/checkout/ShippingAddressSelector";

export default async function CheckoutPage() {
    const data = await getCheckoutData();

    if (!data) {
        redirect("/login");
    }

    if (!data.cart) {
        redirect("/account/cart");
    }

    return (
        <main className="mx-auto max-w-6xl p-6">
            <h1 className="text-3xl font-semibold">
                Checkout
            </h1>

            <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
                {/* Checkout details */}
                <div className="space-y-8">
                    <ShippingAddressSelector
                        addresses={data.addresses}
                    />

                    {data.addresses.length > 0 && (
                        <div className="flex justify-end">
                            <Link
                                href="/checkout/review"
                                className="rounded-md bg-black px-6 py-3 text-sm font-medium text-white"
                            >
                                Continue to Review
                            </Link>
                        </div>
                    )}
                </div>

                {/* Order summary */}
                <aside className="h-fit rounded-lg border p-6">
                    <h2 className="text-lg font-semibold">
                        Order Summary
                    </h2>

                    <div className="mt-6 space-y-4">
                        {data.cart.items.map(
                            (item) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between gap-4 text-sm"
                                >
                                    <div>
                                        <p className="font-medium">
                                            {item.product.name}
                                        </p>

                                        {item.attributes.length >
                                            0 && (
                                                <p className="mt-1 text-gray-500">
                                                    {item.attributes
                                                        .map(
                                                            (attribute) =>
                                                                `${attribute.name}: ${attribute.value}`
                                                        )
                                                        .join(", ")}
                                                </p>
                                            )}

                                        <p className="mt-1 text-gray-500">
                                            Qty: {item.quantity}
                                        </p>
                                    </div>

                                    <span className="shrink-0">
                                        ₹
                                        {item.itemTotal.toFixed(
                                            2
                                        )}
                                    </span>
                                </div>
                            )
                        )}
                    </div>

                    <div className="mt-6 border-t pt-4">
                        <div className="flex justify-between">
                            <span className="font-semibold">
                                Subtotal
                            </span>

                            <span className="font-semibold">
                                ₹
                                {data.cart.subtotal.toFixed(
                                    2
                                )}
                            </span>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
}