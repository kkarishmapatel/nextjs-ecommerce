"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderTree,
  Package,
  ShoppingCart,
  SlidersHorizontal,
  Tag,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

const navigationItems: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Dashboard", href: "/admin", icon: FolderTree },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "Customers", href: "/admin/customers", icon: UsersRound },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Inventory", href: "/admin/inventory", icon: Package },
  { label: "Brands", href: "/admin/brands", icon: Tag },
  { label: "Attributes", href: "/admin/attributes", icon: SlidersHorizontal },
];

export default function AdminNavigation() {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 border-b bg-white md:w-64 md:border-b-0 md:border-r">
      <div className="border-b px-6 py-5">
        <h2 className="text-lg font-semibold text-gray-900">
          Admin Panel
        </h2>
      </div>

      <nav className="overflow-x-auto p-4 md:overflow-visible">
        <ul className="flex min-w-max gap-1 md:block md:min-w-0 md:space-y-1">
          {navigationItems.map(({ label, href, icon: Icon }) => {
            const isActive =
              href === "/admin"
                ? pathname === "/admin"
                : pathname === href ||
                  pathname.startsWith(`${href}/`);

            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex shrink-0 items-center gap-3 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ${
                    isActive
                      ? "bg-gray-900 text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                   <Icon aria-hidden="true" size={18} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}