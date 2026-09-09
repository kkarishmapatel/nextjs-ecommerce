"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  customerAddressSchema,
  type CustomerAddressInput,
} from "@/lib/customers/customerAddressSchema";

import { createMyAddress } from "@/actions/customer/createMyAddress";
type CustomerAddressFormProps = {
  mode?: "create" | "edit";
  address?: {
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
};
export default function CustomerAddressForm({
  mode = "create",
  address,
}: CustomerAddressFormProps) {
  const router = useRouter();

  const [serverError, setServerError] =
    useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomerAddressInput>({
    resolver: zodResolver(customerAddressSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      company: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "IN",
      phone: "",
      isDefault: false,
    },
  });

  async function onSubmit(
    data: CustomerAddressInput
  ) {
    setServerError(null);

    const result = await createMyAddress(data);

    if (!result.success) {
      setServerError(
        result.error ??
          "Failed to create address."
      );
      return;
    }

    router.push("/account/addresses");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {/* First Name */}
      <div>
        <label
          htmlFor="firstName"
          className="mb-1 block text-sm font-medium"
        >
          First Name
        </label>

        <input
          id="firstName"
          type="text"
          {...register("firstName")}
          className="w-full rounded-md border px-3 py-2"
        />

        {errors.firstName && (
          <p className="mt-1 text-sm text-red-600">
            {errors.firstName.message}
          </p>
        )}
      </div>

      {/* Last Name */}
      <div>
        <label
          htmlFor="lastName"
          className="mb-1 block text-sm font-medium"
        >
          Last Name
        </label>

        <input
          id="lastName"
          type="text"
          {...register("lastName")}
          className="w-full rounded-md border px-3 py-2"
        />

        {errors.lastName && (
          <p className="mt-1 text-sm text-red-600">
            {errors.lastName.message}
          </p>
        )}
      </div>

      {/* Company */}
      <div>
        <label
          htmlFor="company"
          className="mb-1 block text-sm font-medium"
        >
          Company
        </label>

        <input
          id="company"
          type="text"
          {...register("company")}
          className="w-full rounded-md border px-3 py-2"
        />

        {errors.company && (
          <p className="mt-1 text-sm text-red-600">
            {errors.company.message}
          </p>
        )}
      </div>

      {/* Address 1 */}
      <div>
        <label
          htmlFor="address1"
          className="mb-1 block text-sm font-medium"
        >
          Address
        </label>

        <input
          id="address1"
          type="text"
          {...register("address1")}
          className="w-full rounded-md border px-3 py-2"
        />

        {errors.address1 && (
          <p className="mt-1 text-sm text-red-600">
            {errors.address1.message}
          </p>
        )}
      </div>

      {/* Address 2 */}
      <div>
        <label
          htmlFor="address2"
          className="mb-1 block text-sm font-medium"
        >
          Address 2
        </label>

        <input
          id="address2"
          type="text"
          {...register("address2")}
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      {/* City */}
      <div>
        <label
          htmlFor="city"
          className="mb-1 block text-sm font-medium"
        >
          City
        </label>

        <input
          id="city"
          type="text"
          {...register("city")}
          className="w-full rounded-md border px-3 py-2"
        />

        {errors.city && (
          <p className="mt-1 text-sm text-red-600">
            {errors.city.message}
          </p>
        )}
      </div>

      {/* State */}
      <div>
        <label
          htmlFor="state"
          className="mb-1 block text-sm font-medium"
        >
          State
        </label>

        <input
          id="state"
          type="text"
          {...register("state")}
          className="w-full rounded-md border px-3 py-2"
        />

        {errors.state && (
          <p className="mt-1 text-sm text-red-600">
            {errors.state.message}
          </p>
        )}
      </div>

      {/* Postal Code */}
      <div>
        <label
          htmlFor="postalCode"
          className="mb-1 block text-sm font-medium"
        >
          Postal Code
        </label>

        <input
          id="postalCode"
          type="text"
          {...register("postalCode")}
          className="w-full rounded-md border px-3 py-2"
        />

        {errors.postalCode && (
          <p className="mt-1 text-sm text-red-600">
            {errors.postalCode.message}
          </p>
        )}
      </div>

      {/* Country */}
      <div>
        <label
          htmlFor="country"
          className="mb-1 block text-sm font-medium"
        >
          Country
        </label>

        <input
          id="country"
          type="text"
          {...register("country")}
          className="w-full rounded-md border px-3 py-2"
        />

        {errors.country && (
          <p className="mt-1 text-sm text-red-600">
            {errors.country.message}
          </p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label
          htmlFor="phone"
          className="mb-1 block text-sm font-medium"
        >
          Phone
        </label>

        <input
          id="phone"
          type="tel"
          {...register("phone")}
          className="w-full rounded-md border px-3 py-2"
        />

        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* Default */}
      <div className="flex items-center gap-2">
        <input
          id="isDefault"
          type="checkbox"
          {...register("isDefault")}
        />

        <label
          htmlFor="isDefault"
          className="text-sm"
        >
          Set as default address
        </label>
      </div>

      {/* Server Error */}
      {serverError && (
        <p className="text-sm text-red-600">
          {serverError}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md border px-4 py-2 font-medium disabled:opacity-50"
        >
          {isSubmitting
            ? "Saving..."
            : "Save Address"}
        </button>

        <button
          type="button"
          onClick={() =>
            router.push("/account/addresses")
          }
          disabled={isSubmitting}
          className="rounded-md border px-4 py-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}