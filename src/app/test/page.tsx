import { hashPassword } from "@/lib/password";

export default async function HashTestPage() {
  const hash = await hashPassword(
    "Password123"
  );

  return (
    <div className="p-8">
      <pre>{hash}</pre>
    </div>
  );
}