"use client";

import Link from "next/link";
import {
  Package,
  AlertTriangle,
  XCircle,
  IndianRupee,
  ArrowRightLeft,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ReportOption {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{
    className?: string;
    size?: number;
    strokeWidth?: number;
  }>;
  variant: "neutral" | "warning" | "destructive" | "success" | "info";
}

const reports: ReportOption[] = [
  {
    title: "Master Inventory Ledger",
    description:
      "Real-time auditing of comprehensive stock distribution and counts.",
    href: "/reports/stock",
    icon: Package,
    variant: "neutral",
  },
  {
    title: "Low Stock Alert",
    description:
      "Items dip below localized thresholds requiring reorder queues.",
    href: "/reports/stock/low",
    icon: AlertTriangle,
    variant: "warning",
  },
  {
    title: "Out Of Stock Deficit",
    description:
      "Critically depleted item metrics resulting in passive revenue leaks.",
    href: "/reports/stock/out",
    icon: XCircle,
    variant: "destructive",
  },
  {
    title: "Financial Stock Valuation",
    description:
      "Real-time calculation of overall inventory asset capital holding value.",
    href: "/reports/stock/value",
    icon: IndianRupee,
    variant: "success",
  },
  {
    title: "Inventory Movement Velocity",
    description:
      "Detailed velocity metrics tracing incoming purchases vs outgoing sales.",
    href: "/reports/stock/movement",
    icon: ArrowRightLeft,
    variant: "info",
  },
];

export default function ReportsPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Premium Dashboard Header Layout */}
      <div className="flex items-center justify-between border-b border-border/40 pb-5">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Analytics Suite
          </h1>
          <p className="text-xs font-medium text-muted-foreground/80 tracking-wide uppercase tracking-widest">
            Business Intelligence & Metrics
          </p>
        </div>
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/5 text-primary border border-primary/10">
          <TrendingUp size={18} className="stroke-[2.25]" />
        </div>
      </div>

      {/* Structured Metric Links Stack */}
      <div className="space-y-3.5">
        {reports.map((report, index) => {
          const Icon = report.icon;

          return (
            <Link
              key={report.href}
              href={report.href}
              style={{ animationDelay: `${index * 60}ms` }}
              className={cn(
                "group relative block p-4 rounded-2xl border border-border/50",
                "bg-gradient-to-br from-background to-muted/10",
                "shadow-[0_2px_8px_-3px_rgba(0,0,0,0.04)]",
                "hover:border-primary/25 hover:shadow-[0_4px_24px_-6px_rgba(0,0,0,0.06)]",
                "active:scale-[0.99] transition-all duration-300 ease-out",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "animate-in fade-in slide-in-from-bottom-3 fill-mode-backwards",
              )}
            >
              <div className="flex items-center gap-4">
                {/* Dynamic Contextual Icon Capsules */}
                <div
                  className={cn(
                    "flex items-center justify-center w-11 h-11 rounded-xl border border-transparent shrink-0 transition-transform duration-300 group-hover:scale-105",
                    report.variant === "neutral" &&
                      "bg-slate-500/10 text-slate-600 dark:text-slate-400",
                    report.variant === "warning" &&
                      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/10",
                    report.variant === "destructive" &&
                      "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/10",
                    report.variant === "success" &&
                      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/10",
                    report.variant === "info" &&
                      "bg-blue-500/10 text-blue-600 dark:text-blue-400",
                  )}
                >
                  <Icon size={18} strokeWidth={2.25} />
                </div>

                {/* Report Content Blocks */}
                <div className="flex-1 space-y-0.5 min-w-0">
                  <h2 className="text-sm font-semibold text-foreground tracking-tight group-hover:text-primary transition-colors">
                    {report.title}
                  </h2>
                  <p className="text-xs text-muted-foreground leading-normal line-clamp-2">
                    {report.description}
                  </p>
                </div>

                {/* Fluid Micro-Chevron Tracking Indicator */}
                <ChevronRight
                  size={16}
                  className="text-muted-foreground/30 group-hover:text-foreground group-hover:translate-x-0.5 transition-all duration-300 shrink-0 ml-1"
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
