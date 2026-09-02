"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createCustomerSchema,
  updateCustomerSchema,
  type CreateCustomerInput,
  type UpdateCustomerInput,
} from "@/lib/customers/customerSchema";

import { createCustomer } from "@/actions/customer/createCustomer";
import { updateCustomer } from "@/actions/customer/updateCustomer";

type CustomerFormProps = {
  customer?: {
    id: string;
    name: string;
    email: string;
    role: "CUSTOMER" | "ADMIN";
  };
};

export default function CustomerForm({
  customer,
}: CustomerFormProps) {
  const router = useRouter();

  const isEditMode = Boolean(customer);

  const [serverError, setServerError] =
    useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const form = useForm<
    CreateCustomerInput | UpdateCustomerInput
  >({
    resolver: zodResolver(
      isEditMode
        ? updateCustomerSchema
        : createCustomerSchema
    ),
    defaultValues: {
      name: customer?.name ?? "",
      email: customer?.email ?? "",
      password: "",
      role: customer?.role ?? "CUSTOMER",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  async function onSubmit(
    data: CreateCustomerInput | UpdateCustomerInput
  ) {
    setServerError(null);
    setIsSubmitting(true);

    try {
      let result;

      if (isEditMode) {
        if (!customer) {
          setServerError("Customer data is missing.");
          return;
        }

        result = await updateCustomer(
          customer.id,
          data
        );
      } else {
        result = await createCustomer(data);
      }

      if (!result.success) {
        setServerError(
          result.error ??
          "Failed to create customer."
        );

        return;
      }

      if (isEditMode && customer) {
        router.push(
          `/admin/customers/${customer.id}`
        );
      } else {
        router.push(
          `/admin/customers/${result.customer?.id}`
        );
      }

      router.refresh();
    } catch (error) {
      console.error(
        "Customer save error:",
        error
      );

      setServerError(
        "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {serverError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="mb-1 block text-sm font-medium"
        >
          Name
        </label>

        <input
          id="name"
          type="text"
          {...register("name")}
          className="w-full rounded-md border px-3 py-2"
          placeholder="Customer name"
        />

        {errors.name && (
          <p className="mt-1 text-sm text-red-600">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="mb-1 block text-sm font-medium"
        >
          Email
        </label>

        <input
          id="email"
          type="email"
          {...register("email")}
          className="w-full rounded-md border px-3 py-2"
          placeholder="customer@example.com"
        />

        {errors.email && (
          <p className="mt-1 text-sm text-red-600">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="mb-1 block text-sm font-medium"
        >
          Password
          {isEditMode && (
            <span className="ml-2 text-xs font-normal text-gray-500">
              Leave blank to keep current password
            </span>
          )}
        </label>

        <input
          id="password"
          type="password"
          {...register("password")}
          className="w-full rounded-md border px-3 py-2"
          placeholder={
            isEditMode
              ? "Leave blank to keep current password"
              : "Minimum 8 characters"
          }
        />

        {errors.password && (
          <p className="mt-1 text-sm text-red-600">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Role */}
      <div>
        <label
          htmlFor="role"
          className="mb-1 block text-sm font-medium"
        >
          Role
        </label>

        <select
          id="role"
          {...register("role")}
          className="w-full rounded-md border px-3 py-2"
        >
          <option value="CUSTOMER">
            Customer
          </option>

          <option value="ADMIN">
            Admin
          </option>
        </select>

        {errors.role && (
          <p className="mt-1 text-sm text-red-600">
            {errors.role.message}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md border px-4 py-2 disabled:opacity-50"
        >
          {isSubmitting
            ? isEditMode
              ? "Updating..."
              : "Creating..."
            : isEditMode
              ? "Update Customer"
              : "Create Customer"}
        </button>

        <button
          type="button"
          disabled={isSubmitting}
          onClick={() =>
            router.push("/admin/customers")
          }
          className="rounded-md border px-4 py-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}