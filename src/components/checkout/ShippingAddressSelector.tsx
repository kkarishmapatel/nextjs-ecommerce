"use client";

import { useEffect } from "react";
import Link from "next/link";

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

type ShippingAddressSelectorProps = {
  addresses: Address[];
};

export default function ShippingAddressSelector({
  addresses,
}: ShippingAddressSelectorProps) {
  const {
    selectedAddressId,
    setSelectedAddressId,
  } = useCheckout();

  useEffect(() => {
    if (
      selectedAddressId ||
      addresses.length === 0
    ) {
      return;
    }

    const defaultAddress =
      addresses.find(
        (address) => address.isDefault
      ) ?? addresses[0];

    setSelectedAddressId(
      defaultAddress.id
    );
  }, [
    addresses,
    selectedAddressId,
    setSelectedAddressId,
  ]);

  return (
    <section className="rounded-lg border p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Shipping Address
        </h2>

        <Link
          href="/account/addresses/new"
          className="text-sm font-medium underline"
        >
          Add New Address
        </Link>
      </div>

      {addresses.length === 0 ? (
        <div className="mt-6">
          <p className="text-sm text-gray-600">
            You don't have a saved address.
          </p>

          <Link
            href="/account/addresses/new"
            className="mt-4 inline-block rounded-md bg-black px-5 py-2.5 text-sm font-medium text-white"
          >
            Add Address
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {addresses.map((address) => {
            const isSelected =
              selectedAddressId === address.id;

            return (
              <label
                key={address.id}
                className={`block cursor-pointer rounded-md border p-4 transition ${
                  isSelected
                    ? "border-black"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="shippingAddress"
                    value={address.id}
                    checked={isSelected}
                    onChange={() =>
                      setSelectedAddressId(
                        address.id
                      )
                    }
                    className="mt-1"
                  />

                  <div className="text-sm">
                    <p className="font-medium">
                      {address.firstName}{" "}
                      {address.lastName}
                    </p>

                    {address.company && (
                      <p className="mt-1">
                        {address.company}
                      </p>
                    )}

                    <p className="mt-1">
                      {address.address1}
                    </p>

                    {address.address2 && (
                      <p>{address.address2}</p>
                    )}

                    <p>
                      {address.city},{" "}
                      {address.state}{" "}
                      {address.postalCode}
                    </p>

                    <p>{address.country}</p>

                    {address.phone && (
                      <p className="mt-1">
                        {address.phone}
                      </p>
                    )}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      )}
    </section>
  );
}
