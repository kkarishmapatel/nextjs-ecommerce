import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">
        Dashboard
      </h1>

      <p>Welcome {user.name}</p>
      <p>{user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}