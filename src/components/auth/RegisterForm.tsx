"use client";

import { useActionState } from "react";

import { registerUser, type RegisterState } from "@/actions/register";

const initialRegisterState: RegisterState = {
  error: null,
};

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(
    registerUser,
    initialRegisterState
  );

  return (
    <form action={formAction} className="space-y-4">
      <input
        type="text"
        name="name"
        placeholder="Name"
        className="w-full border p-2"
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        className="w-full border p-2"
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        className="w-full border p-2"
        required
      />

      {state.error && (
        <p
          role="alert"
          aria-live="polite"
          className="text-sm text-red-600"
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Registering..." : "Register"}
      </button>
    </form>
  );
}
