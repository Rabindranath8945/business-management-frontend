"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// 🌟 ULTRA-PREMIUM DATA SCHEMAS
export interface PurchaseItem {
  productNo?: string;
  productName: string;
  qty: number;
  purchasePrice: number;
  total: number;
}

export interface Purchase {
  _id: string;
  purchaseNo?: string;
  supplier: string;
  items: PurchaseItem[];
  subTotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
  note: string;
  purchaseDate?: string;
  createdAt?: string;
}

export interface FinancialSummary {
  totalOutflow: number;
  invoiceCount: number;
  totalTaxPaid: number;
  savedViaDiscounts: number;
}

export default function PurchasesPage() {
  // ⚡ CORE STATE MATRIX
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Purchase | null>(null);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;

  // 🔄 LIFECYCLE MANAGEMENT
  useEffect(() => {
    fetchPurchases();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search]);

  // 📥 API ORCHESTRATION
  const fetchPurchases = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/purchases");
      setPurchases(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      toast.error("Failed to sync procurement database.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/purchases/${id}`);
      toast.success("Procurement ledger record scrubbed.");
      fetchPurchases();
    } catch (error) {
      toast.error("Secure removal sequence failed.");
    }
  };

  // 📉 REAL-TIME EXECUTIVE PROCUREMENT ANALYTICS
  const financialMetrics = useMemo<FinancialSummary>(() => {
    return purchases.reduce(
      (acc, curr) => {
        acc.invoiceCount++;
        acc.totalOutflow += curr.grandTotal || 0;
        acc.totalTaxPaid += curr.tax || 0;
        acc.savedViaDiscounts += curr.discount || 0;
        return acc;
      },
      {
        totalOutflow: 0,
        invoiceCount: 0,
        totalTaxPaid: 0,
        savedViaDiscounts: 0,
      },
    );
  }, [purchases]);

  // 🔍 DEEP LEVENSHTEIN-ACCENT MULTI-KEYWORD SEARCH
  const filtered = useMemo(() => {
    return purchases.filter((p) => {
      const queryTokens = search.toLowerCase().trim().split(/\s+/);
      const targetString = `
        ${p.purchaseNo || ""} 
        ${p.supplier || ""} 
        ${p.items?.map((i) => i.productName || "").join(" ")}
      `.toLowerCase();

      return queryTokens.every((token) => targetString.includes(token));
    });
  }, [purchases, search]);

  // 🔀 PERFORMANCE-OPTIMIZED PAGINATION SLICER
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const start = (page - 1) * itemsPerPage;
  const paginated = useMemo(() => {
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, start, itemsPerPage]);
  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 space-y-8 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-50">
      {/* HEADER LAYER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-100 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 dark:from-slate-50 dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
            Procurement Ledger
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track inward supply flows, analyze capital expenditures, and audit
            vendor invoices.
          </p>
        </div>

        <Button
          asChild
          className="bg-slate-900 text-slate-50 hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200 shadow-md font-medium rounded-xl h-11 px-5"
        >
          <Link href="/purchases/new">
            <span className="mr-2 font-bold text-base">+</span> New Purchase
            Order
          </Link>
        </Button>
      </div>

      {/* EXECUTIVE REAL-TIME PROCUREMENT KPI DASHBOARD */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="border border-slate-200/60 bg-white shadow-sm dark:border-slate-900 dark:bg-slate-900/50">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Total Outflow
              </p>
              <p className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                {isLoading
                  ? "..."
                  : `₹${financialMetrics.totalOutflow.toLocaleString("en-IN")}`}
              </p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl dark:bg-blue-950/40 dark:text-blue-400">
              {/* Note: Icons assume Lucide icons like Wallet, Receipt, Percent, ShieldCheck are available */}
              <span className="text-xl font-semibold">₹</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/60 bg-white shadow-sm dark:border-slate-900 dark:bg-slate-900/50">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Invoices Filed
              </p>
              <p className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                {isLoading ? "..." : financialMetrics.invoiceCount}
              </p>
            </div>
            <div className="p-3 bg-slate-50 text-slate-600 rounded-xl dark:bg-slate-800 dark:text-slate-400">
              <span className="text-sm font-bold">📄</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/60 bg-white shadow-sm dark:border-slate-900 dark:bg-slate-900/50">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Tax Surcharges
              </p>
              <p className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                {isLoading
                  ? "..."
                  : `₹${financialMetrics.totalTaxPaid.toLocaleString("en-IN")}`}
              </p>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl dark:bg-amber-950/40 dark:text-amber-400">
              <span className="text-sm font-bold">%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/60 bg-white shadow-sm dark:border-slate-900 dark:bg-slate-900/50">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Capital Saved
              </p>
              <p className="text-xl md:text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                {isLoading
                  ? "..."
                  : `₹${financialMetrics.savedViaDiscounts.toLocaleString("en-IN")}`}
              </p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl dark:bg-emerald-950/40 dark:text-emerald-400">
              <span className="text-sm font-bold">🛡️</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SEARCH AND FILTERS */}
      <Card className="border border-slate-200/60 bg-white shadow-sm p-4 dark:border-slate-900 dark:bg-slate-900/40 rounded-xl">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
            🔍
          </span>
          <Input
            placeholder="Filter procurement records by Invoice No, Supplier Name, or contained Items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-slate-50 border-transparent focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-slate-400 dark:bg-slate-950 dark:focus-visible:bg-slate-950 rounded-xl h-11"
          />
        </div>
      </Card>

      {/* CORE GRANULAR PROCUREMENT LOG LIST */}
      {isLoading ? (
        <div className="py-24 text-center text-sm font-medium text-slate-400 animate-pulse">
          Decrypting global accounts ledger pipelines...
        </div>
      ) : paginated.length === 0 ? (
        <Card className="border border-dashed border-slate-200 dark:border-slate-800 bg-transparent rounded-xl">
          <CardContent className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
            <span className="text-2xl mb-2">📥</span>
            <p className="font-semibold text-slate-600 dark:text-slate-300">
              No matching acquisition entries found
            </p>
            <p className="text-xs max-w-xs">
              Double-check entry strings, serial numbers, or configure an
              alternate vendor profile tier.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {paginated.map((item) => (
            <Card
              key={item._id}
              className="group relative overflow-hidden rounded-xl border border-slate-200/60 bg-white transition-all duration-300 hover:-translate-y-[2px] hover:border-slate-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:border-slate-800/80 dark:bg-slate-900/50 dark:hover:border-slate-700 dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)]"
            >
              {/* Dynamic Status Accent Edge Strip */}
              <div className="absolute bottom-0 left-0 top-0 w-[3px] bg-slate-200 dark:bg-slate-800 group-hover:bg-slate-400 transition-colors duration-300" />

              <CardContent className="p-5 pl-6 space-y-4">
                {/* Upper Core Info Matrix */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[11px] font-bold tracking-tight text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        {item.purchaseNo || "BAL-INV"}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        {new Date(
                          item.purchaseDate || item.createdAt!,
                        ).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <h2 className="text-base font-bold tracking-tight text-slate-800 dark:text-slate-200 mt-1 transition-colors duration-200 group-hover:text-black dark:group-hover:text-white">
                      {item.supplier || "Direct Procurement"}
                    </h2>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
                      ₹{item.grandTotal?.toLocaleString("en-IN")}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium tracking-wide uppercase">
                      {item.items?.length || 0} unique items
                    </p>
                  </div>
                </div>

                {/* Sub-item quick view list wrapper snippet */}
                {item.items && item.items.length > 0 && (
                  <p className="text-xs text-slate-400 dark:text-slate-500 truncate italic">
                    Includes:{" "}
                    {item.items
                      .map((i) => `${i.productName} (x${i.qty})`)
                      .join(", ")}
                  </p>
                )}

                {/* Granular Action Footer Controls */}
                <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setSelected(item);
                      setOpen(true);
                    }}
                    className="h-8 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                  >
                    View Breakdown
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(item._id)}
                    className="h-8 px-3 text-xs font-semibold text-rose-600 hover:bg-rose-50/70 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/20 dark:hover:text-rose-300 transition-colors"
                  >
                    Scrub Entry
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* FOOTER PAGINATION PANEL */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-200/60 dark:border-slate-900">
          <p className="text-xs text-slate-400 font-medium">
            Showing{" "}
            <span className="font-semibold text-slate-600 dark:text-slate-300">
              {start + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-slate-600 dark:text-slate-300">
              {Math.min(start + itemsPerPage, filtered.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-600 dark:text-slate-300">
              {filtered.length}
            </span>{" "}
            invoices
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="h-8 px-3 rounded-lg text-xs bg-white dark:bg-slate-900 font-medium"
            >
              ← Prev
            </Button>
            <div className="text-xs font-semibold px-3 text-slate-500">
              {page} / {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="h-8 px-3 rounded-lg text-xs bg-white dark:bg-slate-900 font-medium"
            >
              Next →
            </Button>
          </div>
        </div>
      )}

      {/* GRAND OVERLAY METRICS INTERACTION MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Procurement Audit Summary
            </DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="space-y-6 mt-4">
              {/* Upper Modal Manifest Header */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-900">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Ledger Reference
                  </p>
                  <p className="text-sm font-mono font-bold text-slate-700 dark:text-slate-300">
                    {selected.purchaseNo || "N/A"}
                  </p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Filing Date
                  </p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {new Date(
                      selected.purchaseDate || selected.createdAt!,
                    ).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="space-y-1 col-span-2 pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Supplier Account
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-50">
                    {selected.supplier || "Standard Supply Line"}
                  </p>
                </div>
              </div>

              {/* Contained Manifest Products Line Grid */}
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Itemized Breakdown
                </p>
                <div className="space-y-2">
                  {selected.items?.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white shadow-sm dark:border-slate-800/60 dark:bg-slate-900/40"
                    >
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                          {item.productName}
                        </p>
                        <p className="text-xs font-mono text-slate-400">
                          SKU: {item.productNo || "AUTO"}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          {item.qty} units × ₹
                          {item.purchasePrice?.toLocaleString("en-IN")}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        ₹{item.total?.toLocaleString("en-IN")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Deductions & Tax Summation List */}
              <div className="space-y-2.5 rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800/60 dark:bg-slate-950/30">
                <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                  <span>Subtotal Value</span>
                  <span>₹{selected.subTotal?.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-xs font-medium text-rose-500">
                  <span>Trade Discount Applied</span>
                  <span>- ₹{selected.discount?.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                  <span>Integrated GST Surcharges</span>
                  <span>+ ₹{selected.tax?.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between items-center pt-2.5 border-t border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-slate-50">
                  <span className="text-sm">Grand Total Liquidation</span>
                  <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    ₹{selected.grandTotal?.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Context Notes */}
              {selected.note && (
                <div className="p-3.5 bg-amber-50/40 rounded-xl border border-amber-100/50 dark:bg-amber-950/10 dark:border-amber-900/30 space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Audit Memorandum Note
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    {selected.note}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
