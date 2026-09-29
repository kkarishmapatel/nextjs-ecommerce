import { redirect } from "next/navigation";
import { logoutUser } from "@/actions/logout";
import DashboardSidebar from "@/components/common/DashboardSidebar";
import { getCurrentUser } from "@/lib/session";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen lg:flex">
      <DashboardSidebar isAdmin={user.role === "ADMIN"} />
      <main className="min-w-0 flex-1">
        <div className="p-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>

          <p>Welcome {user.name}</p>
          <p>{user.email}</p>
          <p>Role: {user.role}</p>

          <form action={logoutUser}>
            <button type="submit" className="mt-4 border px-4 py-2">
              Logout
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}