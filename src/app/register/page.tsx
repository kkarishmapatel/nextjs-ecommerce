import { registerUser } from "@/actions/register";

export default function RegisterPage() {
  async function handleRegister(formData: FormData) {
    "use server";
    await registerUser(formData);
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">
        Register
      </h1>

      <form action={handleRegister} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="border p-2 w-full"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border p-2 w-full"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border p-2 w-full"
          required
        />

        <button
          type="submit"
          className="border px-4 py-2"
        >
          Register
        </button>
      </form>
    </div>
  );
}