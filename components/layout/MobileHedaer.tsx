"use client";

import { ArrowLeft, Plus, Receipt, ShoppingBag, Truck } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function MobileHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  // Monitor scroll to trigger a dynamic premium glassmorphic border shift
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = pathname === "/" || pathname === "/dashboard";

  const getHeaderDetails = () => {
    if (pathname.startsWith("/products"))
      return { title: "Inventory", subtitle: "Stock & Items" };
    if (pathname.startsWith("/sales"))
      return { title: "Sales Ledger", subtitle: "Transactions" };
    if (pathname.startsWith("/purchases"))
      return { title: "Purchases", subtitle: "Supply Chain" };
    if (pathname.startsWith("/reports"))
      return { title: "Analytics", subtitle: "Business Intelligence" };
    if (pathname.startsWith("/settings"))
      return { title: "Configuration", subtitle: "Preferences" };
    if (pathname.startsWith("/more"))
      return { title: "Management", subtitle: "Additional Tools" };

    return { title: "Mandal Cycle Store", subtitle: "Executive Dashboard" };
  };

  const { title, subtitle } = getHeaderDetails();

  return (
    <header
      className={cn(
        "md:hidden sticky top-0 z-50 w-full transition-all duration-300 ease-in-out px-4 py-2.5",
        "bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60",
        scrolled
          ? "border-b border-border/60 shadow-[0_2px_20px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_20px_-12px_rgba(255,255,255,0.05)]"
          : "border-b border-transparent",
      )}
    >
      <div className="flex items-center justify-between h-11">
        {/* Left Section: Back Button and Dynamic Typography */}
        <div className="flex items-center gap-3.5 min-w-0">
          {!isHome && (
            <button
              onClick={() => router.back()}
              aria-label="Go back"
              className={cn(
                "flex items-center justify-center w-9 h-9 rounded-xl border border-border/50 bg-background/50",
                "text-muted-foreground hover:text-foreground active:scale-95 transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              )}
            >
              <ArrowLeft size={16} strokeWidth={2.25} />
            </button>
          )}

          <div className="flex flex-col min-w-0">
            <h1 className="text-[15px] font-semibold tracking-tight text-foreground truncate leading-tight">
              {title}
            </h1>
            <span className="text-[11px] font-medium tracking-wide text-muted-foreground/80 uppercase tracking-widest leading-none mt-0.5">
              {subtitle}
            </span>
          </div>
        </div>

        {/* Right Section: Premium Dropdown Trigger */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              aria-label="Quick Actions Menu"
              className={cn(
                "flex items-center justify-center w-9 h-9 rounded-xl border border-border/50",
                "bg-gradient-to-b from-background to-muted/20 text-foreground",
                "shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-muted/40 active:scale-95 transition-all duration-200",
                "data-[state=open]:bg-muted data-[state=open]:ring-2 data-[state=open]:ring-primary/20",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
            >
              <Plus
                size={16}
                strokeWidth={2.25}
                className="transition-transform duration-300 data-[state=open]:rotate-45"
              />
            </button>
          </DropdownMenuTrigger>

          {/* Premium Dropdown Styling */}
          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-56 p-1.5 rounded-2xl border border-border/60 bg-background/95 backdrop-blur-md shadow-xl animate-in fade-in-50 zoom-in-95 duration-100"
          >
            <DropdownMenuLabel className="px-2.5 py-1.5 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
              Quick Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="mx-1 bg-border/60" />

            <DropdownMenuGroup className="space-y-0.5">
              <DropdownMenuItem asChild>
                <Link
                  href="/sales/new"
                  className="flex items-center gap-3 px-2.5 py-2 rounded-xl text-sm font-medium text-foreground hover:bg-primary/5 hover:text-primary transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Receipt size={14} strokeWidth={2.5} />
                  </div>
                  <span>New Sale</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href="/products/new"
                  className="flex items-center gap-3 px-2.5 py-2 rounded-xl text-sm font-medium text-foreground hover:bg-primary/5 hover:text-primary transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <ShoppingBag size={14} strokeWidth={2.5} />
                  </div>
                  <span>New Product</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href="/purchases/new"
                  className="flex items-center gap-3 px-2.5 py-2 rounded-xl text-sm font-medium text-foreground hover:bg-primary/5 hover:text-primary transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <Truck size={14} strokeWidth={2.5} />
                  </div>
                  <span>New Purchase</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
