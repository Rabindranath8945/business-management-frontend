"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  FileText,
  FileSpreadsheet,
  Printer,
  Share2,
  MessageCircle,
  Database,
  Inbox,
} from "lucide-react";
import {
  exportToExcel,
  exportToPDF,
  printReport,
  shareReport,
  shareWhatsApp,
} from "@/components/reports/ReportExport";
import { cn } from "@/lib/utils";

const API = process.env.NEXT_PUBLIC_API_URL || "";

interface ReportLayoutProps {
  title: string;
  endpoint: string;
  meta?: {
    subtitle?: string;
    category?: string;
    lastAudited?: string;
  };
  icon?: {
    element?: React.ComponentType<{
      className?: string;
      size?: number;
      strokeWidth?: number;
    }>;
    className?: string;
    strokeWidth?: number;
  };
  badge?: {
    element?: React.ComponentType<{
      className?: string;
      size?: number;
      strokeWidth?: number;
    }>;
    text?: string;
    className?: string;
  };
  actions?: {
    label: string;
    icon?: React.ComponentType<{ className?: string; size?: number }>;
    className?: string;
    onClick?: () => void;
  }[];
}

export default function ReportLayout({
  title,
  endpoint,
  meta,
  icon,
  badge,
  actions,
}: ReportLayoutProps) {
  const [data, setData] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  const fetchData = async () => {
    try {
      if (data.length === 0) setLoading(true);
      setIsRefreshing(true);
      const res = await fetch(`${API}${endpoint}`);
      const json = await res.json();
      setSummary(json.summary || null);
      setData(json.products || json.sales || json.purchases || json.data || []);
    } catch (error) {
      console.error("Telemetry pipe failure:", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(search.toLowerCase()),
    );
  }, [data, search]);

  const formatKeyLabel = (str: string) => {
    return str
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (match) => match.toUpperCase())
      .replace(/_/g, " ");
  };

  const formatCellValue = (key: string, val: any) => {
    const stringVal = String(val);
    if (
      !isNaN(Number(val)) &&
      (key.toLowerCase().includes("price") ||
        key.toLowerCase().includes("value") ||
        key.toLowerCase().includes("amount") ||
        key.toLowerCase().includes("cost"))
    ) {
      return `₹${Number(val).toLocaleString("en-IN")}`;
    }
    if (
      key.toLowerCase().includes("date") ||
      key.toLowerCase().includes("time")
    ) {
      try {
        return new Date(stringVal).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
      } catch {
        return stringVal;
      }
    }
    return stringVal;
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto px-4 py-6 space-y-5 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="space-y-2 w-2/3">
            <div className="h-6 bg-muted rounded-xl w-3/4" />
            <div className="h-3 bg-muted rounded-lg w-1/2" />
          </div>
          <div className="w-10 h-10 bg-muted rounded-xl" />
        </div>
        <div className="h-10 bg-muted rounded-xl w-full" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-20 bg-muted rounded-2xl" />
          <div className="h-20 bg-muted rounded-2xl" />
        </div>
        <div className="space-y-3">
          <div className="h-24 bg-muted rounded-2xl w-full" />
          <div className="h-24 bg-muted rounded-2xl w-full" />
        </div>
      </div>
    );
  }

  const PageIcon = icon?.element || Database;
  const BadgeIcon = badge?.element;

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex items-start justify-between gap-4 border-b border-border/40 pb-5">
        <div className="flex items-center gap-3.5 min-w-0">
          <div
            className={cn(
              "flex items-center justify-center w-11 h-11 rounded-xl shrink-0",
              icon?.className ||
                "bg-primary/5 text-primary border border-primary/10",
            )}
          >
            <PageIcon size={20} strokeWidth={icon?.strokeWidth || 2.25} />
          </div>
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight text-foreground truncate leading-none">
                {title}
              </h1>
              {badge && (
                <div
                  className={cn(
                    "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                    badge.className,
                  )}
                >
                  {BadgeIcon && <BadgeIcon size={10} strokeWidth={2.5} />}
                  <span>{badge.text}</span>
                </div>
              )}
            </div>
            <p className="text-xs font-medium text-muted-foreground/80 tracking-wide uppercase tracking-widest truncate">
              {meta?.subtitle || "Dynamic Analytical Log Sheet"}
            </p>
          </div>
        </div>

        <button
          onClick={fetchData}
          aria-label="Refresh Dataset"
          className={cn(
            "flex items-center justify-center w-9 h-9 rounded-xl border border-border/50 bg-background",
            "text-muted-foreground hover:text-foreground active:scale-95 transition-all duration-200 shadow-sm shrink-0",
            isRefreshing && "animate-spin text-primary border-primary/20",
          )}
        >
          <RefreshCw size={15} strokeWidth={2.25} />
        </button>
      </div>

      {/* Primary Custom Actions (Procurement Order, Force Recalculate, etc.) */}
      {actions && actions.length > 0 && (
        <div className="flex flex-wrap gap-2 animate-in fade-in duration-300">
          {actions.map((act, idx) => {
            const ActIcon = act.icon;
            return (
              <button
                key={idx}
                onClick={act.onClick}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border border-border/60 shadow-sm bg-background hover:bg-muted/30 active:scale-95 transition-all duration-200",
                  act.className,
                )}
              >
                {ActIcon && <ActIcon size={13} />}
                <span>{act.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Global Search Bar */}
      <div className="group relative rounded-xl border border-border/50 bg-gradient-to-b from-background to-muted/10 transition-all duration-300 focus-within:border-primary/40 focus-within:shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)]">
        <Search
          size={15}
          className="absolute left-3.5 top-3 text-muted-foreground/60 group-focus-within:text-primary transition-colors"
        />
        <input
          type="text"
          placeholder={`Query catalog index (${data.length} records available)...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent py-2.5 pl-10 pr-4 text-sm font-medium text-foreground placeholder:text-muted-foreground/40 focus:outline-none border-none ring-0"
        />
      </div>

      {/* Summary Cards Layer */}
      {summary && (
        <div className="grid grid-cols-2 gap-3 animate-in fade-in zoom-in-95 duration-300">
          {Object.entries(summary).map(([key, value]) => (
            <div
              key={key}
              className="p-3.5 rounded-2xl border border-border/40 bg-gradient-to-br from-background to-muted/20 shadow-sm space-y-1"
            >
              <span className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-wider block truncate">
                {formatKeyLabel(key)}
              </span>
              <span className="text-lg font-bold tracking-tight text-foreground block truncate">
                {formatCellValue(key, value)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Redesigned Export Panel: Clean Inline Action Matrix */}
      <div className="p-3 rounded-2xl border border-border/40 bg-muted/20 space-y-2">
        <div className="flex justify-between items-center px-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            Compile & Dispatch Ledger
          </span>
          <span className="text-[11px] font-semibold text-muted-foreground/80">
            {filteredData.length} entries filtered
          </span>
        </div>

        {/* Inline Grid Row for Rapid Single-Tap Operations */}
        <div className="grid grid-cols-5 gap-2">
          {/* Portable PDF Card */}
          <button
            onClick={() => exportToPDF(filteredData, title)}
            title="Export Adobe PDF"
            className={cn(
              "group/btn flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border border-border/40 bg-background shadow-sm",
              "hover:border-rose-500/30 hover:bg-gradient-to-b hover:from-background hover:to-rose-500/[0.03]",
              "active:scale-95 transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-rose-500/20",
            )}
          >
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 group-hover/btn:scale-110 transition-transform duration-200">
              <FileText size={15} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-bold tracking-tight text-foreground/90">
              PDF
            </span>
          </button>

          {/* Excel Spreadsheet Card */}
          <button
            onClick={() => exportToExcel(filteredData, title)}
            title="Export Excel Sheet"
            className={cn(
              "group/btn flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border border-border/40 bg-background shadow-sm",
              "hover:border-emerald-500/30 hover:bg-gradient-to-b hover:from-background hover:to-emerald-500/[0.03]",
              "active:scale-95 transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-emerald-500/20",
            )}
          >
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover/btn:scale-110 transition-transform duration-200">
              <FileSpreadsheet size={15} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-bold tracking-tight text-foreground/90">
              Excel
            </span>
          </button>

          {/* Hardware Print Card */}
          <button
            onClick={() => printReport()}
            title="Send to Hardware Printer"
            className={cn(
              "group/btn flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border border-border/40 bg-background shadow-sm",
              "hover:border-slate-500/30 hover:bg-gradient-to-b hover:from-background hover:to-slate-500/[0.03]",
              "active:scale-95 transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-slate-500/20",
            )}
          >
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-500/10 text-slate-600 dark:text-slate-400 group-hover/btn:scale-110 transition-transform duration-200">
              <Printer size={15} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-bold tracking-tight text-foreground/90">
              Print
            </span>
          </button>

          {/* Native Share Hub Card */}
          <button
            onClick={() => shareReport(title)}
            title="Open Native System Share"
            className={cn(
              "group/btn flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border border-border/40 bg-background shadow-sm",
              "hover:border-blue-500/30 hover:bg-gradient-to-b hover:from-background hover:to-blue-500/[0.03]",
              "active:scale-95 transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-blue-500/20",
            )}
          >
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover/btn:scale-110 transition-transform duration-200">
              <Share2 size={15} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-bold tracking-tight text-foreground/90">
              Share
            </span>
          </button>

          {/* WhatsApp Business Dispatch Card */}
          <button
            onClick={() => shareWhatsApp(title)}
            title="Dispatch via WhatsApp Business"
            className={cn(
              "group/btn flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border border-border/40 bg-background shadow-sm",
              "hover:border-green-500/30 hover:bg-gradient-to-b hover:from-background hover:to-green-500/[0.03]",
              "active:scale-95 transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-green-500/20",
            )}
          >
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 group-hover/btn:scale-110 transition-transform duration-200">
              <MessageCircle size={15} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-bold tracking-tight text-foreground/90">
              WhatsApp
            </span>
          </button>
        </div>
      </div>

      {/* Zero State Fallback Module */}
      {filteredData.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border/60 p-10 text-center space-y-2 bg-muted/5 animate-in fade-in zoom-in-98 duration-200">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-muted text-muted-foreground/60">
            <Inbox size={20} />
          </div>
          <h3 className="text-sm font-semibold text-foreground">
            Zero Records Located
          </h3>
          <p className="text-xs text-muted-foreground/80 max-w-[240px] mx-auto">
            No records found matching the active query index patterns.
          </p>
        </div>
      )}

      {/* Ultra-Premium Contextual Data Cards Feed */}
      <div className="space-y-3.5">
        {filteredData.map((item: any, index: number) => (
          <div
            key={item._id || item.productNo || item.id || index}
            className="group relative p-4 rounded-2xl border border-border/50 bg-gradient-to-br from-background to-muted/5 shadow-sm hover:border-primary/20 transition-all duration-300"
          >
            <div className="divide-y divide-border/30 space-y-2">
              {Object.entries(item).map(([key, value]) => {
                if (
                  key === "_id" ||
                  key === "__v" ||
                  value === null ||
                  value === undefined
                )
                  return null;

                return (
                  <div
                    key={key}
                    className="flex justify-between items-center pt-2 first:pt-0 text-sm"
                  >
                    <span className="text-xs font-medium text-muted-foreground/80 tracking-tight">
                      {formatKeyLabel(key)}
                    </span>
                    <span className="font-semibold text-foreground tracking-tight text-right max-w-[60%] truncate">
                      {formatCellValue(key, value)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
