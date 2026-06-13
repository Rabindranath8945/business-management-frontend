import GlassCard from "../ui/GlassCard";
import {
  ArrowUpRight,
  ArrowDownRight,
  IndianRupee,
  Layers,
  AlertTriangle,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";

// Robust TypeScript/JavaScript data definition with rich operational metadata

export default function KpiCards({ dashboard }: { dashboard: any }) {
  const kpiData = [
    {
      title: "Today's Sales",
      value: `₹${dashboard?.todaySales?.toLocaleString() ?? 0}`,
      change: "+12.4%",
      isPositive: true,
      timeframe: "vs yesterday",
      icon: IndianRupee,
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-100",
      accentColor: "from-indigo-500 to-blue-600",
    },

    {
      title: "Net Profit",
      value: `₹${dashboard?.netProfit?.toLocaleString() ?? 0}`,
      change: "+8.2%",
      isPositive: true,
      timeframe: "vs yesterday",
      icon: TrendingUp,
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
      accentColor: "from-emerald-500 to-teal-600",
    },

    {
      title: "Stock Value",
      value: `₹${dashboard?.stockValue?.toLocaleString() ?? 0}`,
      change: "Optimized",
      isPositive: true,
      timeframe: `${dashboard?.stockItems ?? 0} items total`,
      icon: Layers,
      badgeColor: "bg-cyan-50 text-cyan-700 border-cyan-100",
      accentColor: "from-cyan-500 to-sky-600",
    },

    {
      title: "Active Orders",
      value: `${dashboard?.activeOrders ?? 0} Orders`,
      change: `${dashboard?.pendingOrders ?? 0} Pending`,
      isPositive: true,
      timeframe: "Repairs & builds",
      icon: ShoppingBag,
      badgeColor: "bg-amber-50 text-amber-700 border-amber-100",
      accentColor: "from-amber-500 to-orange-600",
    },

    {
      title: "Low Stock Items",
      value: `${dashboard?.lowStockCount ?? 0} Lines`,
      change: "Critical",
      isPositive: false,
      timeframe: "Requires reorder",
      icon: AlertTriangle,
      badgeColor: "bg-rose-50 text-rose-700 border-rose-100",
      accentColor: "from-rose-500 to-red-600",
    },
  ];
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {kpiData.map((card) => {
        const IconComponent = card.icon;

        return (
          <GlassCard key={card.title}>
            <div className="flex flex-col h-full justify-between p-1">
              {/* Card Meta Top Header Row */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold tracking-wide text-slate-500/90 uppercase truncate">
                  {card.title}
                </span>

                {/* Decorative Premium Subtle Icon Glyph */}
                <div
                  className={`p-2 rounded-xl bg-gradient-to-br ${card.accentColor} text-white shadow-sm ring-4 ring-white/50`}
                >
                  <IconComponent size={14} strokeWidth={2.5} />
                </div>
              </div>

              {/* Central Primary Metric Display */}
              <div className="mt-4 my-2">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl font-mono">
                  {card.value}
                </h2>
              </div>

              {/* Bottom Context Trend Analytics Anchor */}
              <div className="mt-auto pt-3 border-t border-slate-100/50 flex flex-wrap items-center gap-1.5">
                <span
                  className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[10px] font-bold border transition-colors ${card.badgeColor}`}
                >
                  {card.title === "Today's Sales" ||
                  card.title === "Net Profit" ? (
                    card.isPositive ? (
                      <ArrowUpRight size={10} strokeWidth={3} />
                    ) : (
                      <ArrowDownRight size={10} strokeWidth={3} />
                    )
                  ) : null}
                  {card.change}
                </span>

                <span className="text-[10px] font-medium text-slate-400 truncate">
                  {card.timeframe}
                </span>
              </div>
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
}
