"use client";

import { useState } from "react";

import {
  updateOrderStatus,
  updatePaymentStatus,
} from "@/actions/admin/orders/updateOrderStatus";

const orderStatuses = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

const paymentStatuses = [
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
] as const;

type OrderStatus = (typeof orderStatuses)[number];
type PaymentStatus = (typeof paymentStatuses)[number];

type OrderStatusControlsProps = {
  orderId: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
};

export default function OrderStatusControls({
  orderId,
  orderStatus,
  paymentStatus,
}: OrderStatusControlsProps) {
  const [status, setStatus] =
    useState<OrderStatus>(orderStatus);

  const [payment, setPayment] =
    useState<PaymentStatus>(paymentStatus);

  const [loading, setLoading] = useState<
    "status" | "payment" | null
  >(null);

  const [error, setError] = useState("");

  async function handleStatusChange(
    value: OrderStatus
  ) {
    setStatus(value);
    setLoading("status");
    setError("");

    const result = await updateOrderStatus(
      orderId,
      value
    );

    if (!result.success) {
      setStatus(orderStatus);
      setError(result.error ?? "Failed to update status.");
    }

    setLoading(null);
  }

  async function handlePaymentChange(
    value: PaymentStatus
  ) {
    setPayment(value);
    setLoading("payment");
    setError("");

    const result = await updatePaymentStatus(
      orderId,
      value
    );

    if (!result.success) {
      setPayment(paymentStatus);
      setError(
        result.error ??
          "Failed to update payment status."
      );
    }

    setLoading(null);
  }

  return (
    <section className="mt-6 rounded-lg border p-6">
      <h2 className="text-lg font-semibold">
        Manage Order
      </h2>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="order-status"
            className="block text-sm font-medium"
          >
            Order Status
          </label>

          <select
            id="order-status"
            value={status}
            disabled={loading === "status"}
            onChange={(event) =>
              handleStatusChange(
                event.target.value as OrderStatus
              )
            }
            className="mt-2 w-full rounded-md border px-3 py-2 text-sm"
          >
            {orderStatuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="payment-status"
            className="block text-sm font-medium"
          >
            Payment Status
          </label>

          <select
            id="payment-status"
            value={payment}
            disabled={loading === "payment"}
            onChange={(event) =>
              handlePaymentChange(
                event.target.value as PaymentStatus
              )
            }
            className="mt-2 w-full rounded-md border px-3 py-2 text-sm"
          >
            {paymentStatuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && (
        <p className="mt-4 text-sm text-gray-600">
          Saving...
        </p>
      )}

      {error && (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
    </section>
  );
}