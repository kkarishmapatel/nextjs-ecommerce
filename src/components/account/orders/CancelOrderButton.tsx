"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cancelOrder } from "@/actions/order/cancelOrder";

type CancelOrderButtonProps = {
  orderId: string;
};

export default function CancelOrderButton({
  orderId,
}: CancelOrderButtonProps) {
  const router = useRouter();
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState("");

  async function handleCancel() {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) {
      return;
    }

    setIsCancelling(true);
    setError("");

    const result = await cancelOrder(orderId);

    if (!result.success) {
      setError(result.error ?? "Failed to cancel order.");
      setIsCancelling(false);
      return;
    }

    router.refresh();
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={handleCancel}
        disabled={isCancelling}
        className="rounded-md border border-red-600 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isCancelling ? "Cancelling..." : "Cancel Order"}
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}