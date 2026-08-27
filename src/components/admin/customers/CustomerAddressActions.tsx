"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { deleteCustomerAddress } from "@/actions/customer/deleteCustomerAddress";
import { setDefaultCustomerAddress } from "@/actions/customer/setDefaultCustomerAddress";

type CustomerAddressActionsProps = {
  customerId: string;
  addressId: string;
  isDefault: boolean;
};

export default function CustomerAddressActions({
  customerId,
  addressId,
  isDefault,
}: CustomerAddressActionsProps) {
  const router = useRouter();

  const [isDeleting, setIsDeleting] =
    useState(false);

  const [isSettingDefault, setIsSettingDefault] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmed) {
      return;
    }

    setError(null);
    setIsDeleting(true);

    try {
      const result =
        await deleteCustomerAddress(
          customerId,
          addressId
        );

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.refresh();
    } catch (error) {
      console.error(error);

      setError(
        "Failed to delete address."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleSetDefault() {
    setError(null);
    setIsSettingDefault(true);

    try {
      const result =
        await setDefaultCustomerAddress(
          customerId,
          addressId
        );

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.refresh();
    } catch (error) {
      console.error(error);

      setError(
        "Failed to set default address."
      );
    } finally {
      setIsSettingDefault(false);
    }
  }

  return (
    <div className="mt-4 space-y-2">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50"
        >
          {isDeleting
            ? "Deleting..."
            : "Delete"}
        </button>

        {!isDefault && (
          <button
            type="button"
            onClick={handleSetDefault}
            disabled={isSettingDefault}
            className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50"
          >
            {isSettingDefault
              ? "Setting..."
              : "Set as Default"}
          </button>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}