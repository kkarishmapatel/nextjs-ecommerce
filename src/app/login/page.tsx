
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { loginUser } from "@/actions/login";

export default function LoginPage() {
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const isRegistered =
    searchParams.get("registered") === "1";

  return (
    <div className="mx-auto mt-10 max-w-md">
      <h1 className="mb-6 text-2xl font-bold">
        Login
      </h1>

      {isRegistered && (
        <p className="mb-4 rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          Registration successful. Please log in with your new account.
        </p>
      )}

      <form
        onSubmit={async (event) => {
          event.preventDefault();
          setError("");

          const formData = new FormData(
            event.currentTarget
          );

          const result = await loginUser(formData);

          if (!result.success) {
            setError(result.error);
          }
        }}
        className="space-y-4"
      >
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full rounded border p-2"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full rounded border p-2"
          required
        />

        <button
          type="submit"
          className="rounded border px-4 py-2"
        >
          Login
        </button>

        {error && (
          <p
            role="alert"
            className="text-sm text-red-600"
          >
            {error}
          </p>
        )}
      </form>

      <p className="mt-6 text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-gray-900 underline"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
