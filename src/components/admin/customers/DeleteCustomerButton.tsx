"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { deleteCustomer } from "@/actions/customer/deleteCustomer";

type DeleteCustomerButtonProps = {
  customerId: string;
  customerName?: string;
};

export default function DeleteCustomerButton({
  customerId,
  customerName,
}: DeleteCustomerButtonProps) {
  const router = useRouter();

  const [isDeleting, setIsDeleting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function handleDelete() {
    const confirmed = window.confirm(
      customerName
        ? `Are you sure you want to delete "${customerName}"?`
        : "Are you sure you want to delete this customer?"
    );

    if (!confirmed) {
      return;
    }

    setError(null);
    setIsDeleting(true);

    try {
      const result =
        await deleteCustomer(customerId);

      if (!result.success) {
        setError(
          result.error ??
            "Failed to delete customer."
        );
        return;
      }

      router.push("/admin/customers");
      router.refresh();
    } catch (error) {
      console.error(
        "Delete customer error:",
        error
      );

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
      >
        {isDeleting
          ? "Deleting..."
          : "Delete"}
      </button>

      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}