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

const navigation: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Customers", href: "/admin/customers", icon: UsersRound },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "Brands", href: "/admin/brands", icon: Tag },
  { label: "Attributes", href: "/admin/attributes", icon: SlidersHorizontal },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-b bg-white lg:sticky lg:top-0 lg:h-screen lg:w-60 lg:shrink-0 lg:border-b-0 lg:border-r">
      <div className="flex h-14 items-center px-5 lg:h-16">
        <Link href="/admin/products" className="font-semibold tracking-tight">
          Store admin
        </Link>
      </div>

      <nav
        aria-label="Admin navigation"
        className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:px-3 lg:pb-0"
      >
        {navigation.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={`flex shrink-0 items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-neutral-900 font-medium text-white"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"
              }`}
            >
              <Icon aria-hidden="true" size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}