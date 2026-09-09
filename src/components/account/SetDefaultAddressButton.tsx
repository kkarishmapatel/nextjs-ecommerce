"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { setDefaultMyAddress } from "@/actions/customer/setDefaultMyAddress";

type SetDefaultAddressButtonProps = {
  addressId: string;
};

export default function SetDefaultAddressButton({
  addressId,
}: SetDefaultAddressButtonProps) {
  const router = useRouter();

  const [isUpdating, setIsUpdating] =
    useState(false);

  async function handleSetDefault() {
    setIsUpdating(true);

    try {
      const result =
        await setDefaultMyAddress(addressId);

      if (!result.success) {
        window.alert(
          result.error ??
            "Failed to set default address."
        );

        return;
      }

      router.refresh();
    } catch (error) {
      console.error(
        "Set default address error:",
        error
      );

      window.alert(
        "Something went wrong. Please try again."
      );
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleSetDefault}
      disabled={isUpdating}
      className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
    >
      {isUpdating
        ? "Updating..."
        : "Set as Default"}
    </button>
  );
}