import GlassCard from "../ui/GlassCard";
import { ArrowUpRight, BarChart3, Calendar, Download } from "lucide-react";

export default function SalesChart() {
  // Analytical breakdown tracking sales value and daily peak variance
  const chartData = [
    { day: "Mon", sales: 12000, height: "h-[35%]" },
    { day: "Tue", sales: 18000, height: "h-[50%]" },
    { day: "Wed", sales: 15000, height: "h-[42%]" },
    { day: "Thu", sales: 28000, height: "h-[80%]" },
    { day: "Fri", sales: 22000, height: "h-[65%]" },
    { day: "Sat", sales: 32000, height: "h-[100%]" }, // Peak revenue day
    { day: "Sun", sales: 9000, height: "h-[25%]" },
  ];

  return (
    <GlassCard>
      <div className="p-1">
        {/* Analytical Section Metric Controller Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600">
                <BarChart3 size={15} strokeWidth={2.5} />
              </div>
              <h2 className="font-bold text-slate-900 tracking-tight text-base">
                Weekly Revenue Velocity
              </h2>
            </div>
            <p className="text-[11px] font-medium text-slate-400">
              Comparing day-over-day store performance
            </p>
          </div>

          {/* Action Utilities Hub */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 shadow-3xs">
              <Calendar size={13} className="text-slate-400" />
              <span>Current Week</span>
            </div>

            <button
              type="button"
              aria-label="Export analytics report"
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-3xs transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 active:scale-95"
            >
              <Download size={13} />
            </button>
          </div>
        </div>

        {/* Primary Data Graph Grid Frame */}
        <div className="relative pt-4">
          {/* Background Dotted Guidelines Grid */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-7 text-[9px] font-bold font-mono text-slate-300">
            <div className="w-full border-b border-dashed border-slate-100/80 pb-1 text-right">
              ₹30K
            </div>
            <div className="w-full border-b border-dashed border-slate-100/80 pb-1 text-right">
              ₹20K
            </div>
            <div className="w-full border-b border-dashed border-slate-100/80 pb-1 text-right">
              ₹10K
            </div>
          </div>

          {/* Core Chart Column Bars Element Layout */}
          <div className="relative z-10 h-44 flex items-end justify-between gap-2 sm:gap-4 px-2 sm:px-6">
            {chartData.map((item) => (
              <div
                key={item.day}
                className="group flex flex-col items-center flex-1 h-full justify-end"
              >
                {/* Floating Metric Tooltip Popup on Hover */}
                <div className="absolute mb-2 bottom-full opacity-0 pointer-events-none translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 z-20">
                  <div className="bg-slate-900 text-white font-mono font-bold text-[10px] px-2 py-1 rounded-md shadow-md whitespace-nowrap">
                    ₹{item.sales.toLocaleString("en-IN")}
                  </div>
                  <div className="w-1.5 h-1.5 bg-slate-900 rotate-45 mx-auto -mt-1" />
                </div>

                {/* Primary Data Value Column Solid Block */}
                <div
                  className={`w-full max-w-[32px] rounded-t-lg bg-gradient-to-t from-indigo-500/80 via-indigo-500 to-indigo-400 transition-all duration-500 ease-out origin-bottom ${item.height} shadow-[0_4px_12px_rgba(99,102,241,0.15)] group-hover:from-indigo-600 group-hover:to-indigo-500 group-hover:shadow-[0_4px_16px_rgba(99,102,241,0.3)]`}
                />

                {/* Axis String Text Labels */}
                <span className="mt-3 text-[11px] font-bold text-slate-400 group-hover:text-slate-800 transition-colors">
                  {item.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Comparative Growth Digest Summary */}
        <div className="mt-5 pt-4 border-t border-slate-100/60 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
              <ArrowUpRight size={12} strokeWidth={2.5} />
              +18.4%
            </span>
            <span>vs previous week</span>
          </div>

          <div className="text-[11px] font-medium text-slate-400">
            Peak:{" "}
            <span className="font-mono font-bold text-slate-700">
              Sat (₹32,000)
            </span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
