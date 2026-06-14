"use client";

import { useEffect, useState, useMemo } from "react";
import api from "@/lib/api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import {
  Upload,
  Download,
  Plus,
  Layers,
  AlertCircle,
  Search,
  TrendingUp,
  ShieldAlert,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import ProductForm from "@/components/product-form";

// 🌟 ULTRA-PREMIUM DATA SCHEMAS
export interface Product {
  _id: string;
  productNo?: string;
  productName: string;
  category: string;
  hsn: string;
  purchasePrice: number;
  salePrice: number;
  stock: number;
  unit: string;
  gstRate: number;
  minStock: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface InventoryMetrics {
  totalProducts: number;
  lowStockCount: number;
  totalValue: number;
  inactiveCount: number;
}

export default function ProductsPage() {
  // ⚡ CORE STATE MATRIX
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [stockStatus, setStockStatus] = useState<
    "All" | "In Stock" | "Low Stock" | "Out of Stock"
  >("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // 🔘 UI & EXPERIENCE CONTROL STATE
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [importing, setImporting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("az");

  // 🔄 LIFECYCLE MANAGEMENT
  useEffect(() => {
    fetchProducts();
  }, [page, search, sortBy, selectedCategory, itemsPerPage]);
  // 📥 API ORCHESTRATION
  // 📥 API ORCHESTRATION
  const fetchProducts = async () => {
    try {
      setIsLoading(true);

      const res = await api.get(
        `/products?page=${page}&limit=${itemsPerPage}&search=${search}&sort=${sortBy}&category=${selectedCategory}`,
      );

      setProducts(res.data.products || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error(error);
      toast.error("Failed to sync inventory pipeline.");
    } finally {
      setIsLoading(false);
    }
  };

  // 🔄 Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [search, sortBy, selectedCategory, stockStatus]);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/products/${id}`);

      setProducts((prev) => prev.filter((p) => p._id !== id));

      toast.success("Product deleted successfully.");
    } catch (error) {
      toast.error("Secure removal sequence failed.");
    }
  };

  // 📈 INTELLIGENT METRICS ENGINE (Real-time analytics computation)
  const metrics = useMemo<InventoryMetrics>(() => {
    return products.reduce(
      (acc, p) => {
        acc.totalProducts++;
        if (!p.isActive) acc.inactiveCount++;
        if (p.stock === 0) acc.lowStockCount++;
        else if (p.stock <= p.minStock) acc.lowStockCount++;
        acc.totalValue += p.stock * p.purchasePrice;
        return acc;
      },
      { totalProducts: 0, lowStockCount: 0, totalValue: 0, inactiveCount: 0 },
    );
  }, [products]);

  // 🔍 DEEP SEARCH & MULTI-LAYER FILTERING LOGIC

  // 🏷️ DYNAMIC EXTRACTOR FOR CATEGORY FILTER DROPDOWNS
  const categories = useMemo(() => {
    const list = new Set(products.map((p) => p.category).filter(Boolean));
    return ["All", ...Array.from(list)];
  }, [products]);

  // 🔀 PERFORMANCE-OPTIMIZED PAGINATION SLICER

  // 📤 DATA SHEET INTEGRATIONS (Optimized Excel Pipeline)
  const handleDirectImport = async (file: File) => {
    if (!file) return;
    try {
      setImporting(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/products/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(
        `Pipeline Sync: ${res.data.imported} added, ${res.data.skipped} skipped.`,
      );
      fetchProducts();
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Data pipeline injection failed.");
      }
    } finally {
      setImporting(false);
    }
  };

  const exportProducts = () => {
    if (products.length === 0) {
      toast.error("No dataset available to export.");
      return;
    }
    const data = products.map((p) => ({
      "Serial No": p.productNo || "N/A",
      "Product Title": p.productName,
      "Market Segment": p.category,
      "HSN Code": p.hsn,
      "Acquisition Cost": p.purchasePrice,
      "Retail Price": p.salePrice,
      "Inventory Balance": p.stock,
      "Measurement Unit": p.unit,
      "Tax Matrix (GST %)": p.gstRate,
      "Buffer Floor Level": p.minStock,
      "Operational Status": p.isActive ? "Active" : "Archived",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory Ledger");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const fileData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(
      fileData,
      `inventory_ledger_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
    toast.success("Ledger exported successfully.");
  };
  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 space-y-8 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-50">
      {/* HEADER ACTION LAYER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-100 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 dark:from-slate-50 dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
            Inventory Systems
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your global catalog, track buffer floors, and oversee tax
            matrix distribution.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Custom Sleek File Drag/Upload Button */}
          <div className="relative group">
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              disabled={importing}
              onChange={(e) => {
                const chosen = e.target.files?.[0];
                if (chosen) handleDirectImport(chosen);
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
            />
            <Button
              variant="outline"
              className="bg-white dark:bg-slate-900 shadow-sm transition-all group-hover:border-slate-300 dark:group-hover:border-slate-700"
              disabled={importing}
            >
              <Upload
                className={`mr-2 h-4 w-4 text-slate-500 ${importing ? "animate-spin" : ""}`}
              />
              {importing ? "Syncing..." : "Import Ledger"}
            </Button>
          </div>

          <Button
            variant="outline"
            onClick={exportProducts}
            className="bg-white dark:bg-slate-900 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Download className="mr-2 h-4 w-4 text-slate-500" />
            Export Data
          </Button>

          {/* Core Creation Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setSelectedProduct(null);
                  setIsDialogOpen(true);
                }}
                className="bg-slate-900 text-slate-50 hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200 shadow-md font-medium"
              >
                <Plus className="mr-2 h-4 w-4 stroke-[3]" />
                Add Product
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl backdrop-blur-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold tracking-tight">
                  {selectedProduct
                    ? "Modify Registry Item"
                    : "Create New Product Entry"}
                </DialogTitle>
              </DialogHeader>

              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <ProductForm
                  initialData={selectedProduct || undefined}
                  onSuccess={() => {
                    fetchProducts();
                    setIsDialogOpen(false);
                  }}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* EXECUTIVE REAL-TIME KPI ANALYTICS METRICS */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="border border-slate-100 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-900 dark:bg-slate-900/50">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Total Catalog
              </p>
              <p className="text-2xl font-bold tracking-tight">
                {isLoading ? "..." : metrics.totalProducts}
              </p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl dark:bg-blue-950/50 dark:text-blue-400">
              <Layers className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-100 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-900 dark:bg-slate-900/50">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Low/Out Stock
              </p>
              <p
                className={`text-2xl font-bold tracking-tight ${metrics.lowStockCount > 0 ? "text-amber-600 dark:text-amber-400" : ""}`}
              >
                {isLoading ? "..." : metrics.lowStockCount}
              </p>
            </div>
            <div
              className={`p-3 rounded-xl ${metrics.lowStockCount > 0 ? "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400" : "bg-slate-50 text-slate-400 dark:bg-slate-900"}`}
            >
              <AlertCircle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-100 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-900 dark:bg-slate-900/50">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Asset Valuation
              </p>
              <p className="text-2xl font-bold tracking-tight">
                {isLoading
                  ? "..."
                  : `₹${metrics.totalValue.toLocaleString("en-IN")}`}
              </p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl dark:bg-emerald-950/50 dark:text-emerald-400">
              <TrendingUp className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-100 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-900 dark:bg-slate-900/50">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Archived Items
              </p>
              <p className="text-2xl font-bold tracking-tight">
                {isLoading ? "..." : metrics.inactiveCount}
              </p>
            </div>
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl dark:bg-rose-950/50 dark:text-rose-400">
              <ShieldAlert className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FILTER CONTROL BAR PANEL */}
      <Card className="border border-slate-100 bg-white shadow-sm p-4 dark:border-slate-900 dark:bg-slate-900/40">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search via token name, SKU code, HSN matrix..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-slate-50 border-transparent focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-slate-400 dark:bg-slate-950 dark:focus-visible:bg-slate-950"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-9 px-3 py-1 text-sm bg-slate-50 dark:bg-slate-950 rounded-md"
            >
              <option value="az">A → Z</option>
              <option value="za">Z → A</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priceLow">Price Low → High</option>
              <option value="priceHigh">Price High → Low</option>
              <option value="stockLow">Stock Low → High</option>
              <option value="stockHigh">Stock High → Low</option>
            </select>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-9 px-3 py-1 text-sm bg-slate-50 dark:bg-slate-950 rounded-md border border-transparent font-medium text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-400"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "All" ? "All Categories" : cat}
                </option>
              ))}
            </select>

            <select
              value={stockStatus}
              onChange={(e) => setStockStatus(e.target.value as any)}
              className="h-9 px-3 py-1 text-sm bg-slate-50 dark:bg-slate-950 rounded-md border border-transparent font-medium text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-400"
            >
              <option value="All">All Stocks</option>
              <option value="Low Stock">Low Stock Limits</option>
              <option value="Out of Stock">Depleted Inventory</option>
            </select>
          </div>
        </div>
      </Card>

      {/* CORE GRANULAR INVENTORY DISPLAY LAYOUT */}
      {isLoading ? (
        <div className="py-24 text-center text-sm font-medium text-slate-400 animate-pulse">
          Synchronizing enterprise database secure tunnels...
        </div>
      ) : products.length === 0 ? (
        <Card className="border border-dashed border-slate-200 dark:border-slate-800 bg-transparent">
          <CardContent className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
            <Search className="h-8 w-8 stroke-[1.5] text-slate-300 mb-2" />
            <p className="font-semibold text-slate-600 dark:text-slate-300">
              No records found matching query parameters
            </p>
            <p className="text-xs max-w-xs">
              Try softening filters, resetting segment controls, or clearing
              search tokens.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {products.map((item) => {
            const isLowStock = item.stock <= item.minStock && item.stock > 0;

            const isOutStock = item.stock === 0;

            return (
              <Card
                key={item._id}
                className={`group relative overflow-hidden rounded-xl border border-slate-200/60 bg-white transition-all duration-300 hover:-translate-y-[2px] hover:border-slate-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:border-slate-800/80 dark:bg-slate-900/50 dark:hover:border-slate-700 dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] ${
                  !item.isActive ? "opacity-60 saturate-50" : ""
                }`}
              >
                {/* Left status accent strip (subtle 3px visual indicator) */}
                <div
                  className={`absolute bottom-0 left-0 top-0 w-[3px] transition-colors duration-300 ${
                    isOutStock
                      ? "bg-rose-500"
                      : isLowStock
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                  }`}
                />

                <CardContent className="p-5 pl-6 space-y-4">
                  {/* Upper Matrix: Meta, Title, and Badges */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[11px] font-bold tracking-tight text-slate-400 dark:text-slate-500">
                          {item.productNo || "SKU-AUTO"}
                        </span>
                        {item.category && (
                          <>
                            <span className="text-slate-300 dark:text-slate-700 text-xs">
                              •
                            </span>
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                              {item.category}
                            </span>
                          </>
                        )}
                      </div>

                      <h3 className="text-base font-bold tracking-tight text-slate-900 transition-colors duration-200 group-hover:text-black dark:text-slate-100 dark:group-hover:text-white">
                        {item.productName}
                      </h3>
                    </div>

                    {/* Dynamic Glassmorphic Status Pill */}
                    <div>
                      {isOutStock ? (
                        <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-600/10 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20">
                          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                          Out of Stock
                        </span>
                      ) : isLowStock ? (
                        <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/10 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20">
                          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-amber-500" />
                          Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20">
                          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          In Stock
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Financial & Stock Subgrid Ledger */}
                  <div className="grid grid-cols-3 gap-2 rounded-lg border border-slate-100 bg-slate-50/50 p-3 text-center dark:border-slate-800/50 dark:bg-slate-950/40">
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Available
                      </p>
                      <p
                        className={`text-sm font-bold ${
                          isOutStock
                            ? "text-rose-600 dark:text-rose-400"
                            : isLowStock
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-slate-800 dark:text-slate-200"
                        }`}
                      >
                        {item.stock}{" "}
                        <span className="text-[11px] font-normal text-slate-400 lowercase">
                          {item.unit || "pcs"}
                        </span>
                      </p>
                    </div>

                    <div className="space-y-0.5 border-x border-slate-200/60 dark:border-slate-800/60">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Cost Price
                      </p>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        ₹{item.purchasePrice?.toLocaleString("en-IN") || "0"}
                      </p>
                    </div>

                    <div className="space-y-0.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Retail Price
                      </p>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        ₹{item.salePrice?.toLocaleString("en-IN") || "0"}
                      </p>
                    </div>
                  </div>

                  {/* Ultra-Premium Action Footer Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60">
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                      Tax Matrix: {item.gstRate || 0}% GST
                    </p>

                    <div className="flex items-center gap-1.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedProduct(item);
                          setIsDialogOpen(true);
                        }}
                        className="h-8 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(item._id)}
                        className="h-8 px-3 text-xs font-semibold text-rose-600 hover:bg-rose-50/70 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/20 dark:hover:text-rose-300 transition-colors"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* FOOTER PAGINATION PANEL */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between border-t pt-4">
          <p className="text-sm text-slate-500">
            Page {page} of {totalPages}
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Previous
            </Button>

            <Button
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
