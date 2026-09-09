"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { deleteMyAddress } from "@/actions/customer/deleteMyAddress";

type DeleteAddressButtonProps = {
  addressId: string;
};

export default function DeleteAddressButton({
  addressId,
}: DeleteAddressButtonProps) {
  const router = useRouter();

  const [isDeleting, setIsDeleting] =
    useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      const result =
        await deleteMyAddress(addressId);

      if (!result.success) {
        window.alert(
          result.error ??
            "Failed to delete address."
        );
        return;
      }

      router.refresh();
    } catch (error) {
      console.error(
        "Delete address error:",
        error
      );

      window.alert(
        "Something went wrong. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}