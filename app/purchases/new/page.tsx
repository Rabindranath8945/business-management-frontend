"use client";

import { useRouter } from "next/navigation";
import PurchaseForm from "@/components/purchase-form";
import { Button } from "@/components/ui/button";

export default function NewPurchasePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50/30 dark:bg-slate-950/20 pb-16 antialiased">
      {/* 🌟 PREMIUM STICKY SUB-HEADER */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/80 mb-8">
        <div className="max-w-xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push("/purchases")}
              className="h-9 w-9 p-0 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              ←
            </Button>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
                New Purchase Order
              </h1>
              <p className="hidden xs:block text-[11px] font-medium text-slate-400 dark:text-slate-500">
                Procurement & Stock Injection Matrix
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 px-2.5 py-1 rounded-md select-none">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Tunnel
          </div>
        </div>
      </div>

      {/* 🚀 FORM CONTAINER CORE */}
      <div className="max-w-xl mx-auto px-4">
        {/* Render your pristine, ultra-premium form component directly */}
        <PurchaseForm
          onSuccess={() => {
            router.push("/purchases");
          }}
        />
      </div>
    </div>
  );
}
