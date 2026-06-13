import GlassCard from "../ui/GlassCard";
import {
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Landmark,
  Wallet,
} from "lucide-react";
import { Sale } from "@/types/dashboard";

export default function RecentSales({ sales = [] }: { sales: Sale[] }) {
  // Map financial channels to elegant localized iconography
  const getMethodIcon = (method: string) => {
    switch (method) {
      case "UPI":
        return <Wallet size={13} className="text-violet-600" />;
      case "Card":
        return <CreditCard size={13} className="text-blue-600" />;
      default:
        return <Landmark size={13} className="text-amber-600" />;
    }
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const created = new Date(date);

    const diff = Math.floor((now.getTime() - created.getTime()) / 1000 / 60);

    if (diff < 60) return `${diff} mins ago`;

    if (diff < 1440) return `${Math.floor(diff / 60)} hrs ago`;

    return `${Math.floor(diff / 1440)} days ago`;
  };

  return (
    <GlassCard>
      <div className="p-1">
        {/* Component Action Section Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-bold text-slate-900 tracking-tight text-base">
              Recent Income Streams
            </h2>
            <p className="text-[11px] font-medium text-slate-400">
              Live operational ledger updates
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 bg-indigo-50/50 hover:bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100/50 transition-all active:scale-95"
          >
            Ledger View
            <ArrowRight size={12} />
          </button>
        </div>

        {/* Dense Transaction Scroll Box Container */}
        <div className="space-y-2.5">
          {sales.map((sale) => (
            <div
              key={sale.invoiceNo}
              className="group flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/30 transition-all duration-200 hover:border-slate-200 hover:bg-white hover:shadow-[0_4px_12px_rgba(0,0,0,0.02)]"
            >
              {/* Left Identity Meta Blocks */}
              <div className="flex items-center gap-3 min-w-[50%]">
                {/* Micro Check Status Badge */}
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100/60">
                  <CheckCircle2 size={15} strokeWidth={2.5} />
                </div>

                <div className="space-y-0.5 truncate">
                  <span className="block text-xs font-semibold text-slate-800 truncate group-hover:text-slate-900">
                    {sale.customerName || "Walk-in Customer"}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
                    <span className="font-mono text-slate-500">
                      {sale.invoiceNo}
                    </span>
                    <span>•</span>
                    <span>{getTimeAgo(sale.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Right Side Financial Channels and Pricing Layout */}
              <div className="flex items-center gap-4 text-right">
                {/* Localized Channel Pill Badge */}
                <div className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-semibold text-slate-600 shadow-2xs">
                  {getMethodIcon(sale.paymentMethod || "Cash")}
                  {sale.paymentMethod || "Cash"}
                </div>

                {/* Primary Ledger Numerical Record */}
                <div className="space-y-0.5">
                  <span className="block text-sm font-bold font-mono text-slate-900">
                    ₹{sale.grandTotal.toLocaleString("en-IN")}
                  </span>
                  <span className="block text-[9px] font-bold tracking-wider text-emerald-600 uppercase">
                    Settled
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
