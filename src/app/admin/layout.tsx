import { redirect } from "next/navigation";

import AdminHeader from "@/components/admin/AdminHeader";
import AdminNavigation from "@/components/admin/AdminNavigation";
import { getCurrentUser } from "@/lib/session";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        <AdminNavigation />

        <div className="flex min-w-0 flex-1 flex-col">
          <AdminHeader />

          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}