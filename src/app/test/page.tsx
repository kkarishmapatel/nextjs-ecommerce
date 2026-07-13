import { prisma } from "@/lib/prisma";

export default async function TestPage() {
  const users = await prisma.user.findMany();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        Users
      </h1>

      <pre>{JSON.stringify(users, null, 2)}</pre>
    </div>
  );
}