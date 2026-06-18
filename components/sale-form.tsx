"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// 🌟 DATA ARCHITECTURE SCHEMAS
interface Product {
  _id: string;
  productNo: string;
  productName: string;
  salePrice: number;
  stock: number;
  unit: string;
}

interface SaleItem {
  product: string;
  productNo: string;
  productName: string;
  qty: number;
  salePrice: number;
  total: number;
}

interface Props {
  onSuccess: () => void;
}

export default function SaleForm({ onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  // 📝 BUYER & CLIENT META STATE
  const [customerName, setCustomerName] = useState("Cash");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");

  // 📈 FINANCIAL TOTALS MATRIX STATE
  const [discount, setDiscount] = useState<number | "">(0);
  const [tax, setTax] = useState<number | "">(0);

  // 🔍 PRODUCT LIVE SEARCH CONTEXT DROPDOWN ALTERNATIVE
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // 🛒 QUANTITY & INVOICING MANIFEST STATE
  const [qty, setQty] = useState<number | "">(1);
  const [salePrice, setSalePrice] = useState<number | "">(0);
  const [items, setItems] = useState<SaleItem[]>([]);

  // 🔄 LIFECYCLE INITIALIZER SYNC
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products?page=1&limit=1000&sort=az");

      const rawProducts = res.data.products || [];

      setProducts(rawProducts.filter((p: any) => p.isActive !== false));
    } catch (error) {
      console.error(error);
      toast.error("Failed to compile active store inventory schema.");
    }
  };

  // 🔎 REAL-TIME MULTI-KEYWORD SUGGESTIONS PARSER
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const tokens = searchQuery.toLowerCase().trim().split(/\s+/);
    return products.filter((p) => {
      const indexString = `${p.productName} ${p.productNo || ""}`.toLowerCase();
      return tokens.every((t) => indexString.includes(t));
    });
  }, [products, searchQuery]);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setSalePrice(product.salePrice);
    setSearchQuery(product.productName);
    setShowSuggestions(false);
  };

  const handleClearProductSelection = () => {
    setSelectedProduct(null);
    setSalePrice(0);
    setSearchQuery("");
    setQty(1);
  };

  // 📊 REACTIVE TRANSACTION MATHEMATICAL COMPUTATIONS
  const numericQty = Number(qty) || 0;
  const numericPrice = Number(salePrice) || 0;
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

  // ➕ SECURE SALES LINE ITEM REGISTER TRIGGER
  const addItem = () => {
    if (!selectedProduct)
      return toast.error("Isolate a valid product asset token first.");
    if (numericQty <= 0)
      return toast.error("Quantity metrics must scale higher than 0.");

    // Strict Stock Limit Checks
    if (numericQty > selectedProduct.stock) {
      return toast.error("Operation block: Insufficient warehouse balance.");
    }

    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.product === selectedProduct._id,
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        const prospectiveQty = updated[existingIndex].qty + numericQty;

        if (prospectiveQty > selectedProduct.stock) {
          toast.error("Combined balance threshold breaks stock parameters.");
          return prev;
        }

        updated[existingIndex].qty = prospectiveQty;
        updated[existingIndex].salePrice = numericPrice;
        updated[existingIndex].total = prospectiveQty * numericPrice;
        return updated;
      }

      return [
        ...prev,
        {
          product: selectedProduct._id,
          productNo: selectedProduct.productNo || "SKU-GEN",
          productName: selectedProduct.productName,
          qty: numericQty,
          salePrice: numericPrice,
          total: currentTotal,
        },
      ];
    });

    handleClearProductSelection();
    toast.success("Invoice manifest updated.");
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // 🚀 DISPATCH TRANSACTION DOCUMENT PIPELINE
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0)
      return toast.error("Invoice documentation demands a minimum of 1 item.");

    try {
      setLoading(true);
      await api.post("/sales", {
        customerName: customerName.trim() || "Cash",
        phone: phone.trim(),
        items,
        discount: Number(discount) || 0,
        tax: Number(tax) || 0,
        note: note.trim(),
      });

      toast.success("Tax Invoice deployed successfully.");

      // Clear Input Registries
      setCustomerName("Cash");
      setPhone("");
      setNote("");
      setDiscount(0);
      setTax(0);
      setItems([]);
      onSuccess();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Inward pipeline integration failed.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-xl mx-auto pb-24 text-slate-900 dark:text-slate-50 antialiased"
    >
      {/* 1. CUSTOMER IDENTITY METADATA CARD */}
      <Card className="rounded-2xl border border-slate-200/60 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.01)] dark:border-slate-800 dark:bg-slate-900/60 backdrop-blur-md">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/60 pb-2.5">
            <span className="text-xl">👤</span>
            <h2 className="font-extrabold text-base tracking-tight">
              Customer Dossier
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                Client Signature
              </label>
              <Input
                placeholder="Walk-in Client (Cash)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="h-10 rounded-xl border-slate-200 bg-slate-50/40 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-slate-400 dark:bg-slate-950 dark:border-slate-800 transition-all text-sm font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                Phone Identifier
              </label>
              <Input
                type="tel"
                placeholder="Mobile Contact No"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-10 rounded-xl border-slate-200 bg-slate-50/40 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-slate-400 dark:bg-slate-950 dark:border-slate-800 transition-all text-sm font-medium font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
              Invoice Remarks Memo
            </label>
            <Textarea
              placeholder="Record warranty specifics, promotional notes, or payment mode indicators..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="rounded-xl border-slate-200 bg-slate-50/40 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-slate-400 dark:bg-slate-950 dark:border-slate-800 dark:focus-visible:bg-slate-950 min-h-[65px] text-xs leading-relaxed"
            />
          </div>
        </CardContent>
      </Card>

      {/* 2. REAL-TIME AUTOCOMPLETE LIVE SEARCH INJECTOR */}
      <Card className="rounded-2xl border border-slate-200/60 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.01)] dark:border-slate-800 dark:bg-slate-900/60 backdrop-blur-md relative z-30">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/60 pb-2.5">
            <span className="text-xl">📦</span>
            <h2 className="font-extrabold text-base tracking-tight">
              Item Matrix Loader
            </h2>
          </div>

          <div className="space-y-1.5 relative">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
              Query Product Catalog
            </label>
            <div className="relative">
              <Input
                placeholder="Filter via product classification title or code tag..."
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
                className="h-10 pr-10 rounded-xl border-slate-200 bg-slate-50/40 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-slate-400 dark:bg-slate-950 dark:border-slate-800 text-sm font-medium"
              />
              {selectedProduct && (
                <button
                  type="button"
                  onClick={handleClearProductSelection}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-extrabold text-rose-500 hover:text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-md transition-all"
                >
                  Reset
                </button>
              )}
            </div>

            {/* LIVE AUTOCOMPLETE SUGGESTION DIALOG SHEET */}
            {showSuggestions && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-1.5 max-h-52 overflow-y-auto rounded-xl border border-slate-200/80 bg-white p-1 shadow-xl dark:border-slate-800 dark:bg-slate-950 z-50">
                {filteredProducts.length === 0 ? (
                  <div className="p-3 text-xs text-center text-slate-400 font-medium">
                    No verified items match query tokens
                  </div>
                ) : (
                  filteredProducts.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => handleSelectProduct(product)}
                      className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-xs"
                    >
                      <div className="space-y-0.5 pr-2 truncate flex-1">
                        <p className="font-bold text-slate-800 dark:text-slate-200 truncate">
                          {product.productName}
                        </p>
                        <p className="font-mono text-[9px] text-slate-400 uppercase">
                          Barcode: {product.productNo || "AUTO"}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-slate-700 dark:text-slate-300">
                          ₹{product.salePrice}
                        </p>
                        <p
                          className={`text-[9px] font-semibold ${product.stock <= 0 ? "text-rose-500" : "text-slate-400"}`}
                        >
                          {product.stock} {product.unit} left
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* SIMULATED PIPELINE FLOW BADGE */}
          {selectedProduct && (
            <div className="rounded-xl bg-slate-50/80 dark:bg-slate-950/60 p-3 text-xs text-slate-500 border border-slate-100 dark:border-slate-900/60 flex flex-col gap-1">
              <div className="flex justify-between">
                <span>
                  Warehouse Balance:{" "}
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {selectedProduct.stock} {selectedProduct.unit}
                  </span>
                </span>
                <span
                  className={
                    numericQty > selectedProduct.stock
                      ? "text-rose-500 font-extrabold"
                      : "text-emerald-500 font-bold"
                  }
                >
                  Post-Invoice Space: {selectedProduct.stock - numericQty}{" "}
                  {selectedProduct.unit}
                </span>
              </div>
              {numericQty > selectedProduct.stock && (
                <p className="text-[10px] font-extrabold text-rose-500 tracking-wide uppercase animate-pulse">
                  ⚠️ Allocation exceeds available warehouse parameters
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                Outward Volume Qty
              </label>
              <Input
                type="number"
                min={1}
                value={qty === "" ? "" : qty}
                onChange={(e) =>
                  setQty(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="h-10 rounded-xl bg-slate-50/40 dark:bg-slate-950 text-sm font-semibold border-slate-200 dark:border-slate-800 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                Retail Price Point (₹)
              </label>
              <Input
                type="number"
                min={0}
                value={salePrice === "" ? "" : salePrice}
                onChange={(e) =>
                  setSalePrice(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                className="h-10 rounded-xl bg-slate-50/40 dark:bg-slate-950 text-sm font-bold border-slate-200 dark:border-slate-800 font-mono text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 pt-2 text-xs font-bold text-slate-400 uppercase tracking-wide">
            <span>Aggregated Item Output</span>
            <span className="text-sm font-black font-mono text-slate-800 dark:text-slate-200">
              ₹{currentTotal.toLocaleString("en-IN")}
            </span>
          </div>

          <Button
            type="button"
            onClick={addItem}
            disabled={!selectedProduct || numericQty > selectedProduct.stock}
            className="w-full h-10 bg-slate-50 text-slate-800 hover:bg-slate-100 border border-slate-200 rounded-xl font-bold dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 dark:border-slate-800 transition-all text-xs tracking-wide uppercase disabled:opacity-40"
          >
            + Register Line to Manifest
          </Button>
        </CardContent>
      </Card>

      {/* 3. LIVE MANIFEST DATA REVIEW LEDGER */}
      {items.length > 0 && (
        <Card className="rounded-2xl border border-slate-200/60 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.01)] dark:border-slate-800 dark:bg-slate-900/60 backdrop-blur-md z-10 relative">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">📋</span>
                <h2 className="font-extrabold text-base tracking-tight">
                  Active Invoicing Ledger
                </h2>
              </div>
              <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 rounded-full">
                {totalQty} items selected
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
                      {item.salePrice.toLocaleString("en-IN")}
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
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* FINANCIAL MARKUPS & SUMMATIONS GRID */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                  Invoice Discount (₹)
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
                  Tax Surcharges (₹)
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

      {/* INVOICE DISPATCH TRANSMISSION BUTTON */}
      <Button
        type="submit"
        className="w-full h-12 bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-950 dark:hover:bg-slate-200 font-bold shadow-lg shadow-slate-900/10 dark:shadow-none rounded-xl transition-all active:scale-[0.99] disabled:opacity-40 text-sm tracking-wide uppercase"
        disabled={loading || items.length === 0}
      >
        {loading ? "Filing Invoice Parameters..." : "Save Sales Invoice Order"}
      </Button>
    </form>
  );
}
