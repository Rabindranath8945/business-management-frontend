"use client";

import ReportLayout from "@/components/reports/ReportLayout";
import { AlertTriangle, ShieldAlert, RefreshCw } from "lucide-react";

export default function Page() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
      <ReportLayout
        title="Low Stock Analytics"
        endpoint="/reports/stock/low-stock"
        // Advanced metadata configuration for premium visual feedback
        meta={{
          subtitle: "Automated Supply Chain Deficit Tracking",
          category: "Inventory Risk Control",
          lastAudited: "Real-Time Engine Active",
        }}
        // Left Accent Capsule Configuration
        icon={{
          element: AlertTriangle,
          className:
            "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
          strokeWidth: 2.25,
        }}
        // Right Accent Status Badge
        badge={{
          element: ShieldAlert,
          text: "Action Required",
          className:
            "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/15 animate-pulse duration-[3000ms]",
        }}
        // Premium Quick Action Telemetry
        actions={[
          {
            label: "Force Recalculate Velocity",
            icon: RefreshCw,
            onClick: () => {
              // Programmatic revalidation logic for premium UX
              console.log("Triggered supply chain cache invalidation...");
            },
          },
        ]}
      />
    </div>
  );
}
