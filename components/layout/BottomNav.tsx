"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Package, ShoppingCart, Truck, Ellipsis } from "lucide-react";

const items = [
  {
    label: "Home",
    href: "/dashboard",
    icon: House,
  },
  {
    label: "Items",
    href: "/products",
    icon: Package,
  },
  {
    label: "Sales",
    href: "/sales",
    icon: ShoppingCart,
  },
  {
    label: "Purchase",
    href: "/purchases",
    icon: Truck,
  },
  {
    label: "More",
    href: "/more",
    icon: Ellipsis,
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <div className="grid grid-cols-5">
        {items.map((item) => {
          const Icon = item.icon;

          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-2 text-xs ${
                active ? "text-primary font-semibold" : "text-muted-foreground"
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
