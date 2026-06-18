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
      value: `₹${(dashboard?.todaySales || 0).toLocaleString()}`,
      change: `${dashboard?.salesGrowth || 0}%`,
      isPositive: (dashboard?.salesGrowth || 0) >= 0,
      timeframe: "vs yesterday",
      icon: IndianRupee,
      showTrend: true,
      badgeColor:
        (dashboard?.salesGrowth || 0) >= 0
          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
          : "bg-rose-50 text-rose-700 border-rose-100",
      accentColor: "from-indigo-500 to-blue-600",
    },

    {
      title: "Month Sales",
      value: `₹${(dashboard?.monthSales || 0).toLocaleString()}`,
      change: `${dashboard?.monthGrowth || 0}%`,
      isPositive: (dashboard?.monthGrowth || 0) >= 0,
      timeframe: "vs last month",
      icon: TrendingUp,
      showTrend: true,
      badgeColor:
        (dashboard?.monthGrowth || 0) >= 0
          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
          : "bg-rose-50 text-rose-700 border-rose-100",
      accentColor: "from-emerald-500 to-teal-600",
    },

    {
      title: "Net Profit",
      value: `₹${(dashboard?.netProfit || 0).toLocaleString()}`,
      change: `${dashboard?.profitGrowth || 0}%`,
      isPositive: (dashboard?.profitGrowth || 0) >= 0,
      timeframe: "profit margin",
      icon: Layers,
      showTrend: true,
      badgeColor:
        (dashboard?.profitGrowth || 0) >= 0
          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
          : "bg-rose-50 text-rose-700 border-rose-100",
      accentColor: "from-cyan-500 to-sky-600",
    },

    {
      title: "Stock Value",
      value: `₹${(dashboard?.stockValue || 0).toLocaleString()}`,
      change: `${dashboard?.stockItems || 0} Items`,
      isPositive: true,
      timeframe: `${dashboard?.lowStockCount || 0} Low Stock`,
      icon: ShoppingBag,
      showTrend: false,
      badgeColor: "bg-amber-50 text-amber-700 border-amber-100",
      accentColor: "from-amber-500 to-orange-600",
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
                  {card.showTrend &&
                    (card.isPositive ? (
                      <ArrowUpRight size={10} strokeWidth={3} />
                    ) : (
                      <ArrowDownRight size={10} strokeWidth={3} />
                    ))}

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
