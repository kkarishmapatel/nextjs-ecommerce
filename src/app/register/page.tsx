import Link from "next/link";

import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="mx-auto mt-10 max-w-md">
      <h1 className="mb-6 text-2xl font-bold">
        Register
      </h1>

      <RegisterForm />

      <p className="mt-6 text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-gray-900 underline"
        >
          Login here
        </Link>
      </p>
    </div>
  );
}