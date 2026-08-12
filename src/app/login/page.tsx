import { loginUser } from "@/actions/login";

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">
        Login
      </h1>

      <form
        onSubmit={async (event) => {
          event.preventDefault();

          const formData = new FormData(
            event.currentTarget
          );

          const result = await loginUser(formData);

          if (!result.success) {
            // handle/display the error here
            console.error(result.error);
          }
        }}
      >
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
          Login
        </button>
      </form>
    </div>
  );
}