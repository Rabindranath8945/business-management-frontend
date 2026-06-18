"use client";

import ReportLayout from "@/components/reports/ReportLayout";
import { XCircle, ShoppingCart, ShieldAlert } from "lucide-react";

export default function Page() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
      <ReportLayout
        title="Out of Stock Deficit"
        endpoint="/reports/stock/out-of-stock"
        // Critical revenue risk metadata mapping
        meta={{
          subtitle: "Revenue Leakage & Depleted Inventory Audits",
          category: "Critical Operations",
          lastAudited: "Live Deficiency Alert Engine Active",
        }}
        // Left High-Urgency Accent Capsule
        icon={{
          element: XCircle,
          className:
            "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20",
          strokeWidth: 2.25,
        }}
        // Pulse Alert Status Tag to identify direct revenue impact
        badge={{
          element: ShieldAlert,
          text: "Critical Leak",
          className:
            "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20 animate-pulse duration-[2000ms]",
        }}
        // Emergency procurement quick actions
        actions={[
          {
            label: "Initialize Procurement Order",
            icon: ShoppingCart,
            className:
              "bg-rose-600 text-white hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600 border-none font-medium shadow-sm",
            onClick: () => {
              console.log(
                "Redirecting system line to new batch purchase manifest...",
              );
            },
          },
        ]}
      />
    </div>
  );
}
