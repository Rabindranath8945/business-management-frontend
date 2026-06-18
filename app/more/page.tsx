"use client";

import Link from "next/link";
import { BarChart3, Settings, User, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuOption {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  variant: "primary" | "secondary" | "accent";
}

export default function MorePage() {
  const menus: MenuOption[] = [
    {
      title: "Business Analytics",
      description:
        "View real-time sales reports, profit margins, and performance metrics.",
      href: "/reports",
      icon: BarChart3,
      variant: "primary",
    },
    {
      title: "System Settings",
      description:
        "Configure store preferences, taxes, invoicing configurations, and hardware.",
      href: "/settings",
      icon: Settings,
      variant: "secondary",
    },
    {
      title: "User Profile",
      description:
        "Manage account credentials, security access levels, and authorization keys.",
      href: "/profile",
      icon: User,
      variant: "accent",
    },
  ];

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Premium Header Layout */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Management Center
        </h1>
        <p className="text-xs font-medium text-muted-foreground/80 tracking-wide uppercase tracking-widest">
          Store Administration & Control
        </p>
      </div>

      {/* Menu Options Stack */}
      <div className="space-y-3">
        {menus.map((item, index) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{ animationDelay: `${index * 75}ms` }}
              className={cn(
                "group relative flex items-center justify-between p-4 rounded-2xl border border-border/50",
                "bg-gradient-to-br from-background to-muted/10",
                "shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)]",
                "hover:border-primary/30 hover:shadow-[0_4px_20px_-6px_rgba(0,0,0,0.08)]",
                "active:scale-[0.99] transition-all duration-300 ease-out",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "animate-in fade-in slide-in-from-bottom-3 fill-mode-backwards",
              )}
            >
              <div className="flex items-start gap-4 min-w-0">
                {/* Micro-gradient Icon Container */}
                <div
                  className={cn(
                    "flex items-center justify-center w-11 h-11 rounded-xl shrink-0 transition-transform duration-300 group-hover:scale-105",
                    item.variant === "primary" &&
                      "bg-blue-500/10 text-blue-600 dark:text-blue-400",
                    item.variant === "secondary" &&
                      "bg-slate-500/10 text-slate-600 dark:text-slate-400",
                    item.variant === "accent" &&
                      "bg-purple-500/10 text-purple-600 dark:text-purple-400",
                  )}
                >
                  <Icon size={20} className="stroke-[2.25]" />
                </div>

                {/* Text Content */}
                <div className="space-y-0.5 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground tracking-tight group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-normal line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* End Chevron Indicator */}
              <ChevronRight
                size={16}
                className="text-muted-foreground/40 group-hover:text-foreground group-hover:translate-x-0.5 transition-all duration-300 shrink-0 ml-3"
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
