"use client";

import ReportLayout from "@/components/reports/ReportLayout";
import { Package, FileDown, Layers, LayoutGrid } from "lucide-react";

export default function Page() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
      <ReportLayout
        title="Master Inventory Ledger"
        endpoint="/reports/stock"
        // Comprehensive top-tier master reporting metadata payload
        meta={{
          subtitle: "Total Catalog Distribution & Comprehensive Asset Audit",
          category: "Core Operations",
          lastAudited: "Live Ledger Pipeline Active",
        }}
        // Left Premium Structural Icon Capsule
        icon={{
          element: Package,
          className:
            "bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20",
          strokeWidth: 2.25,
        }}
        // System Stability Status Badge
        badge={{
          element: Layers,
          text: "Full Catalog Streamed",
          className:
            "bg-slate-500/5 text-slate-600 dark:text-slate-400 border border-slate-500/10",
        }}
        // Multi-Action Executive Administrative Triggers
        actions={[
          {
            label: "Export Master Manifest",
            icon: FileDown,
            onClick: () => {
              console.log("Packaging global stock layout manifest stream...");
            },
          },
          {
            label: "Toggle View Schema",
            icon: LayoutGrid,
            className:
              "text-slate-600 dark:text-slate-400 hover:bg-slate-500/5",
            onClick: () => {
              console.log("Switching layout schema display modes...");
            },
          },
        ]}
      />
    </div>
  );
}
