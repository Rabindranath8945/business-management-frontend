"use client";
import { useRouter } from "next/navigation";
import GlassCard from "../ui/GlassCard";
import api from "@/lib/api";
import {
  AlertCircle,
  ArrowUpRight,
  RefreshCw,
  ShoppingCart,
} from "lucide-react";
import { Product } from "@/types/dashboard";

export default function LowStock({ products = [] }: { products: Product[] }) {
  const router = useRouter();
  return (
    <GlassCard>
      <div className="p-1">
        {/* Dynamic Warning Header Group */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 animate-pulse">
              <AlertCircle size={16} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 tracking-tight text-base">
                Inventory Alerts
              </h2>
              <p className="text-[11px] font-medium text-slate-400">
                Items breaching safety margins
              </p>
            </div>
          </div>

          <span className="text-[10px] font-bold bg-rose-100/80 text-rose-700 px-2 py-0.5 rounded-full ring-2 ring-rose-50">
            {products.length} Critical
          </span>
        </div>

        {/* Dense Informative List Framework */}
        <div className="space-y-2.5">
          {products.map((item) => {
            // Calculate relative stock emergency severity level
            const isEmergency = item.stock <= 1;

            return (
              <div
                key={item._id}
                className="group relative flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/40 transition-all duration-200 hover:border-rose-100 hover:bg-rose-50/10"
              >
                {/* Product Meta Identification Blocks */}
                <div className="space-y-0.5 max-w-[60%]">
                  <span className="block text-xs font-semibold text-slate-800 truncate group-hover:text-slate-900">
                    {item.productName}
                  </span>
                  <span className="block text-[10px] font-medium text-slate-400">
                    {item.category || "General"} • Min goal:{" "}
                    {item.lowStock ?? 5}
                  </span>
                </div>

                {/* Stock Counter Status Pill and Direct Action Quick Link */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span
                      className={`inline-block text-xs font-bold font-mono px-2 py-0.5 rounded-md ${
                        isEmergency
                          ? "bg-rose-100 text-rose-700 border border-rose-200"
                          : "bg-amber-100 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {item.stock} left
                    </span>
                  </div>

                  {/* Micro Quick-Action Reorder Button */}
                  <button
                    type="button"
                    aria-label={`Quick reorder ${item.productName}`}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 active:scale-95 opacity-80 group-hover:opacity-100"
                  >
                    <RefreshCw
                      size={12}
                      className="transition-transform duration-300 group-hover:rotate-180"
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Premium Bottom Panel Navigation Action */}
        <button
          onClick={() => router.push("/purchases")}
          type="button"
          className="w-full mt-4 py-2 flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-200 text-xs font-semibold text-slate-600 transition-all duration-200 hover:border-indigo-300 hover:bg-indigo-50/30 hover:text-indigo-600"
        >
          <ShoppingCart size={13} />
          Open Purchase Orders
          <ArrowUpRight size={12} />
        </button>
      </div>
    </GlassCard>
  );
}
