"use client";

import ReportLayout from "@/components/reports/ReportLayout";
import { ArrowRightLeft, FileSpreadsheet, Download } from "lucide-react";

export default function Page() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
      <ReportLayout
        title="Inventory Movement"
        endpoint="/reports/stock/inventory-movement"
        // Advanced metadata configuration for data lifecycle visibility
        meta={{
          subtitle: "Purchase Velocity vs Sales Turnover Analysis",
          category: "Supply Chain Metrics",
          lastAudited: "Live Tracking Active",
        }}
        // Left Visual Accent Container
        icon={{
          element: ArrowRightLeft,
          className:
            "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20",
          strokeWidth: 2.25,
        }}
        // Status Badge to confirm ledger operational mode
        badge={{
          text: "Flow Ledger Active",
          className:
            "bg-blue-500/5 text-blue-600 dark:text-blue-400 border border-blue-500/10",
        }}
        // Premium Data Actions for Executive Exporting
        actions={[
          {
            label: "Export CSV Ledger",
            icon: Download,
            onClick: () => {
              console.log("Compiling movement csv document stream...");
            },
          },
          {
            label: "Generate Sheet",
            icon: FileSpreadsheet,
            className:
              "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/5",
            onClick: () => {
              console.log("Synthesizing spreadsheet layout schema...");
            },
          },
        ]}
      />
    </div>
  );
}
