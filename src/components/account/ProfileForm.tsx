"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  updateCustomerProfileSchema,
  type UpdateCustomerProfileInput,
} from "@/lib/customers/customerProfileSchema";

import { updateCustomerProfile } from "@/actions/customer/updateCustomerProfile";

type ProfileFormProps = {
  initialData: {
    name: string;
    email: string;
  };
};

export default function ProfileForm({
  initialData,
}: ProfileFormProps) {
  const router = useRouter();

  const [serverError, setServerError] =
    useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateCustomerProfileInput>({
    resolver: zodResolver(
      updateCustomerProfileSchema
    ),
    defaultValues: {
      name: initialData.name,
      email: initialData.email,
      password: "",
    },
  });

  async function onSubmit(
    data: UpdateCustomerProfileInput
  ) {
    setServerError(null);
    setIsSubmitting(true);

    try {
      const result =
        await updateCustomerProfile(data);

      if (!result.success) {
        setServerError(
          result.error ??
            "Failed to update your profile."
        );
        return;
      }

      router.push("/account");
      router.refresh();
    } catch (error) {
      console.error(
        "Profile update error:",
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
          New Password
        </label>

        <input
          id="password"
          type="password"
          placeholder="Leave blank to keep current password"
          {...register("password")}
          className="w-full rounded-md border px-3 py-2"
        />

        {errors.password && (
          <p className="mt-1 text-sm text-red-600">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Server Error */}
      {serverError && (
        <p className="text-sm text-red-600">
          {serverError}
        </p>
      )}

      {/* Submit */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md border px-4 py-2 font-medium disabled:opacity-50"
        >
          {isSubmitting
            ? "Saving..."
            : "Save Changes"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/account")}
          disabled={isSubmitting}
          className="rounded-md border px-4 py-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}