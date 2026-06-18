"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// 🌟 DATA INTERFACES
interface Product {
  _id: string;
  productNo: string;
  productName: string;
  purchasePrice: number;
  stock: number;
  unit: string;
}

interface PurchaseItem {
  product: string;
  productNo: string;
  productName: string;
  qty: number;
  purchasePrice: number;
  total: number;
}

interface Props {
  onSuccess: () => void;
}

export default function PurchaseForm({ onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  // 📝 PURCHASE INFO STATE
  const [supplier, setSupplier] = useState("");
  const [note, setNote] = useState("");
  const [discount, setDiscount] = useState<number | "">(0);
  const [tax, setTax] = useState<number | "">(0);

  // 🔍 PRODUCT LIVE SEARCH STATE (Dropdown Alternative)
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // 🛒 QUANTITY & PRICE ENTRY
  const [qty, setQty] = useState<number | "">(1);
  const [purchasePrice, setPurchasePrice] = useState<number | "">(0);

  // 📑 MANIFEST ITEMS MATRIX
  const [items, setItems] = useState<PurchaseItem[]>([]);

  // 🔄 SYNC RECOGNIZED INVENTORY DATA
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products?page=1&limit=1000&sort=az");

      setProducts(res.data.products || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load product catalog registry.");
    }
  };

  // 🔎 DYNAMIC FILTER FOR PRODUCT SEARCH INPUT
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.productName.toLowerCase().includes(query) ||
        (p.productNo || "").toLowerCase().includes(query),
    );
  }, [products, searchQuery]);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setPurchasePrice(product.purchasePrice);
    setSearchQuery(product.productName);
    setShowSuggestions(false);
  };

  const handleClearProductSelection = () => {
    setSelectedProduct(null);
    setPurchasePrice(0);
    setSearchQuery("");
    setQty(1);
  };

  // 📈 DYNAMIC TRANSACT METRICS
  const numericQty = Number(qty) || 0;
  const numericPrice = Number(purchasePrice) || 0;
  const currentTotal = numericQty * numericPrice;

  const subTotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.total, 0);
  }, [items]);

  const grandTotal = useMemo(() => {
    const d = Number(discount) || 0;
    const t = Number(tax) || 0;
    return Math.max(0, subTotal - d + t);
  }, [subTotal, discount, tax]);

  const totalQty = useMemo(() => {
    return items.reduce((sum, item) => sum + item.qty, 0);
  }, [items]);

  // ➕ INJECT MANIFEST LINE ENTRY
  const addItem = () => {
    if (!selectedProduct)
      return toast.error(
        "Please search and select an operational product token.",
      );
    if (numericQty <= 0)
      return toast.error("Quantity metrics must scale higher than 0.");

    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.product === selectedProduct._id,
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].qty += numericQty;
        updated[existingIndex].purchasePrice = numericPrice;
        updated[existingIndex].total =
          updated[existingIndex].qty * numericPrice;
        return updated;
      }
      return [
        ...prev,
        {
          product: selectedProduct._id,
          productNo: selectedProduct.productNo || "SKU-AUTO",
          productName: selectedProduct.productName,
          qty: numericQty,
          purchasePrice: numericPrice,
          total: currentTotal,
        },
      ];
    });

    handleClearProductSelection();
    toast.success("Item line logged into order.");
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // 🚀 SUBMIT DATA TRANSACTION PIPELINE
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplier.trim()) return toast.error("Supplier identity is mandatory.");
    if (items.length === 0)
      return toast.error("Add at least one product line to finalize order.");

    try {
      setLoading(true);
      await api.post("/purchases", {
        supplier: supplier.trim(),
        items,
        discount: Number(discount) || 0,
        tax: Number(tax) || 0,
        note: note.trim(),
      });

      toast.success("Purchase order successfully deployed.");
      setSupplier("");
      setNote("");
      setDiscount(0);
      setTax(0);
      setItems([]);
      onSuccess();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Data tunnel injection failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-xl mx-auto pb-24 text-slate-900 dark:text-slate-50 antialiased"
    >
      {/* 1. SUPPLIER METADATA */}
      <Card className="rounded-2xl border border-slate-200/60 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:border-slate-800 dark:bg-slate-900/60 backdrop-blur-md">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏢</span>
            <h2 className="font-extrabold text-lg tracking-tight">
              Purchase Manifest
            </h2>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
              Supplier Profile
            </label>
            <Input
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              placeholder="Enter supplier name..."
              className="h-11 rounded-xl border-slate-200 bg-slate-50/40 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-slate-400 dark:bg-slate-950 dark:border-slate-800 dark:focus-visible:bg-slate-950 transition-all text-sm font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
              Audit Note
            </label>
            <Textarea
              placeholder="Record shipment logistics metrics, tracking records, or notes..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="rounded-xl border-slate-200 bg-slate-50/40 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-slate-400 dark:bg-slate-950 dark:border-slate-800 dark:focus-visible:bg-slate-950 min-h-[70px] text-sm leading-relaxed"
            />
          </div>
        </CardContent>
      </Card>

      {/* 2. LIVE SEARCH ASSET INJECTOR (DROPDOWN REPLACEMENT) */}
      <Card className="rounded-2xl border border-slate-200/60 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:border-slate-800 dark:bg-slate-900/60 backdrop-blur-md relative z-30">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔍</span>
            <h2 className="font-extrabold text-lg tracking-tight">
              Search & Allocate Items
            </h2>
          </div>

          <div className="space-y-1.5 relative">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
              Product Real-time Autocomplete
            </label>

            <div className="relative">
              <Input
                placeholder="Type code SKU number or name tokens to filter catalog..."
                value={searchQuery}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                  if (
                    selectedProduct &&
                    e.target.value !== selectedProduct.productName
                  ) {
                    setSelectedProduct(null);
                  }
                }}
                className="h-11 pr-10 rounded-xl border-slate-200 bg-slate-50/40 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-slate-400 dark:bg-slate-950 dark:border-slate-800 text-sm font-medium"
              />
              {selectedProduct && (
                <button
                  type="button"
                  onClick={handleClearProductSelection}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-rose-500 hover:text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-md"
                >
                  Clear Selection
                </button>
              )}
            </div>

            {/* LIVE AUTOCOMPLETE DROPDOWN PANEL POPUP */}
            {showSuggestions && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-1.5 max-h-56 overflow-y-auto rounded-xl border border-slate-200/80 bg-white p-1.5 shadow-xl dark:border-slate-800 dark:bg-slate-950 z-50">
                {filteredProducts.length === 0 ? (
                  <div className="p-3 text-xs text-center text-slate-400 font-medium">
                    No verified database tokens match query parameters
                  </div>
                ) : (
                  filteredProducts.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => handleSelectProduct(product)}
                      className="flex items-center justify-between p-2.5 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-sm"
                    >
                      <div className="space-y-0.5 pr-3 truncate">
                        <p className="font-bold text-slate-800 dark:text-slate-200 truncate">
                          {product.productName}
                        </p>
                        <p className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                          SKU: {product.productNo || "N/A"}
                        </p>
                      </div>
                      <div className="text-right text-xs shrink-0">
                        <p className="font-semibold text-slate-700 dark:text-slate-300">
                          ₹{product.purchasePrice}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {product.stock} {product.unit} left
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* SIMULATION CARD PREVIEW CHIP */}
          {selectedProduct && (
            <div className="rounded-xl bg-slate-50/70 p-3 text-xs text-slate-500 dark:bg-slate-950 dark:text-slate-400 border border-slate-100 dark:border-slate-900 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Warehouse Pipeline Status:
                </span>{" "}
                Currently holds{" "}
                <span className="font-bold">
                  {selectedProduct.stock} {selectedProduct.unit}
                </span>
              </div>
              <div className="font-bold text-emerald-600 dark:text-emerald-400">
                → New Estimated Ceiling: {selectedProduct.stock + numericQty}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                Volume Qty
              </label>
              <Input
                type="number"
                min={1}
                value={qty === "" ? "" : qty}
                onChange={(e) =>
                  setQty(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="h-11 rounded-xl bg-slate-50/40 dark:bg-slate-950 text-sm font-semibold border-slate-200 dark:border-slate-800 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                Acquisition Price (₹)
              </label>
              <Input
                type="number"
                min={0}
                value={purchasePrice === "" ? "" : purchasePrice}
                onChange={(e) =>
                  setPurchasePrice(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                className="h-11 rounded-xl bg-slate-50/40 dark:bg-slate-950 text-sm font-bold border-slate-200 dark:border-slate-800 font-mono text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
              Allocated Component Total
            </span>
            <span className="text-base font-black font-mono text-slate-800 dark:text-slate-200">
              ₹{currentTotal.toLocaleString("en-IN")}
            </span>
          </div>

          <Button
            type="button"
            onClick={addItem}
            className="w-full h-11 bg-slate-50 text-slate-800 hover:bg-slate-100 border border-slate-200 rounded-xl font-bold dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 dark:border-slate-800 transition-all text-xs tracking-wide uppercase"
          >
            + Commit Line to Sheet
          </Button>
        </CardContent>
      </Card>

      {/* 3. LIVE MANIFEST DATA REVIEW LEDGER */}
      {items.length > 0 && (
        <Card className="rounded-2xl border border-slate-200/60 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:border-slate-800 dark:bg-slate-900/60 backdrop-blur-md z-10 relative">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">📋</span>
                <h2 className="font-extrabold text-lg tracking-tight">
                  Active Ledger Manifest
                </h2>
              </div>
              <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 rounded-full">
                {totalQty} Items Counted
              </span>
            </div>

            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100/70 bg-slate-50/50 dark:border-slate-850 dark:bg-slate-950/40 transition-all hover:bg-slate-50"
                >
                  <div className="space-y-0.5 pr-4 flex-1 truncate">
                    <h3 className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200 truncate">
                      {item.productName}
                    </h3>
                    <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wide">
                      SKU: {item.productNo || "AUTO"}
                    </p>
                    <p className="text-xs font-semibold text-slate-400">
                      {item.qty} units × ₹
                      {item.purchasePrice.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <span className="text-sm font-black font-mono">
                      ₹{item.total.toLocaleString("en-IN")}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 px-2 py-1 rounded-md transition-all"
                    >
                      Scrub
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* FINANCIAL MARKUPS & SUMMATIONS GRID */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                  Deductive Discount (₹)
                </label>
                <Input
                  type="number"
                  min={0}
                  value={discount === "" ? "" : discount}
                  onChange={(e) =>
                    setDiscount(
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                  className="h-10 rounded-xl border-slate-200 dark:border-slate-800 font-bold font-mono text-rose-600 dark:text-rose-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                  Surcharge Tax Overhead (₹)
                </label>
                <Input
                  type="number"
                  min={0}
                  value={tax === "" ? "" : tax}
                  onChange={(e) =>
                    setTax(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  className="h-10 rounded-xl border-slate-200 dark:border-slate-800 font-bold font-mono"
                />
              </div>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-850 dark:bg-slate-950/60 space-y-2">
              <div className="flex justify-between text-xs font-medium text-slate-400 uppercase tracking-wider">
                <span>Subtotal Gross Balance</span>
                <span className="font-mono">
                  ₹{subTotal.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2.5 border-t border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-slate-50">
                <span className="text-xs uppercase tracking-wider text-slate-500">
                  Liquidation Net Grand Total
                </span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-tight">
                  ₹{grandTotal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* OVERALL SHEET FINALIZATION TRANSMISSION BUTTON */}
      <Button
        type="submit"
        className="w-full h-12 bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-950 dark:hover:bg-slate-200 font-bold shadow-lg shadow-slate-900/10 dark:shadow-none rounded-xl transition-all active:scale-[0.99] disabled:opacity-40 text-sm tracking-wide uppercase"
        disabled={loading || items.length === 0}
      >
        {loading
          ? "Filing Procurement Records..."
          : "Save Complete Purchase Order"}
      </Button>
    </form>
  );
}
