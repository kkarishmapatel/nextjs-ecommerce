"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  House,
  ShieldCheck,
  ShoppingCart,
  Store,
  UserRound,
  type LucideIcon,
} from "lucide-react";

const navigation: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Dashboard", href: "/dashboard", icon: House },
  { label: "Shop", href: "/shop", icon: Store },
  { label: "Account", href: "/account", icon: UserRound },
  { label: "Orders", href: "/account/orders", icon: ClipboardList },
  { label: "Cart", href: "/account/cart", icon: ShoppingCart },
];

export default function DashboardSidebar({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const items = isAdmin
    ? [...navigation, { label: "Admin", href: "/admin/products", icon: ShieldCheck }]
    : navigation;

  return (
    <aside className="border-b bg-white lg:sticky lg:top-0 lg:h-screen lg:w-60 lg:shrink-0 lg:border-b-0 lg:border-r">
      <div className="flex h-14 items-center px-5 lg:h-16">
        <Link href="/dashboard" className="font-semibold tracking-tight">
          My dashboard
        </Link>
      </div>

      <nav
        aria-label="Dashboard navigation"
        className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:px-3 lg:pb-0"
      >
        {items.map(({ label, href, icon: Icon }) => {
          const isActive =
            pathname === href ||
            (href !== "/account" && pathname.startsWith(`${href}/`));

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