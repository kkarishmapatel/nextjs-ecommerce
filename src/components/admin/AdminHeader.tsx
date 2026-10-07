import { getCurrentUser } from "@/lib/session";

export default async function AdminHeader() {
  const user = await getCurrentUser();

  return (
    <header className="border-b bg-white">
      <div className="flex min-h-16 items-center justify-between px-6">
        <div>
          <p className="text-sm font-medium text-gray-900">
            Admin Dashboard
          </p>
        </div>

        {user && (
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {user.name}
            </p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        )}
      </div>
    </header>
  );
}