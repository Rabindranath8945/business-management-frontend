"use client";

import ReportLayout from "@/components/reports/ReportLayout";
import { IndianRupee, FileText, Landmark } from "lucide-react";

export default function Page() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
      <ReportLayout
        title="Asset Valuation Ledger"
        endpoint="/reports/stock/stock-value"
        // Premium capital management metadata payload
        meta={{
          subtitle: "Total Inventory Net Capital & Valuation Audits",
          category: "Financial Control",
          lastAudited: "Live Valuation Stream Active",
        }}
        // Left Executive Financial Icon Capsule
        icon={{
          element: IndianRupee,
          className:
            "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
          strokeWidth: 2.25,
        }}
        // Asset Liquidity Status Tag
        badge={{
          element: Landmark,
          text: "Capital Audited",
          className:
            "bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10",
        }}
        // Premium Financial Reporting Actions
        actions={[
          {
            label: "Compile Balance Sheet",
            icon: FileText,
            className:
              "bg-foreground text-background dark:bg-foreground dark:text-background hover:opacity-90 font-medium shadow-sm border-none",
            onClick: () => {
              console.log(
                "Compiling real-time inventory capital balance sheets...",
              );
            },
          },
        ]}
      />
    </div>
  );
}
