"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import {
  Package,
  Tag,
  Hash,
  Download,
  TrendingUp,
  Layers,
  Percent,
  AlertTriangle,
  ShieldCheck,
  ChevronRight,
  Info,
} from "lucide-react";

export interface Product {
  _id?: string;
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
}

interface Props {
  initialData?: Product;
  onSuccess: () => void;
}

const defaultData: Product = {
  productName: "",
  category: "",
  hsn: "",
  purchasePrice: 0,
  salePrice: 0,
  stock: 0,
  unit: "PCS",
  gstRate: 0,
  minStock: 0,
  isActive: true,
};

export default function ProductForm({ initialData, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Product>(defaultData);

  useEffect(() => {
    if (initialData) {
      setFormData({ ...defaultData, ...initialData });
    } else {
      setFormData(defaultData);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    const numberFields = [
      "purchasePrice",
      "salePrice",
      "stock",
      "gstRate",
      "minStock",
    ];

    setFormData((prev) => ({
      ...prev,
      [name]: numberFields.includes(name) ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { productNo, ...payload } = formData;

      if (initialData?._id) {
        await api.put(`/products/${initialData._id}`, payload);
        toast.success("Product optimized successfully");
      } else {
        await api.post("/products", payload);
        toast.success("Product created in matrix");
        setFormData(defaultData);
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-md mx-auto pb-8 text-slate-900 dark:text-slate-100"
    >
      {/* SECTION 1: IDENTITY METADATA */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Core Identity
        </p>

        {initialData?._id && (
          <div className="relative opacity-70">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={formData.productNo || ""}
              readOnly
              disabled
              className="pl-9 bg-slate-50 dark:bg-slate-950 font-mono text-xs border-dashed"
              placeholder="System ID"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
            <Package className="h-3.5 w-3.5" /> Product Name{" "}
            <span className="text-rose-500">*</span>
          </label>
          <Input
            name="productName"
            placeholder="e.g. Wireless AirPods Max"
            value={formData.productName}
            onChange={handleChange}
            required
            className="h-11 rounded-xl bg-slate-50/50 focus-visible:bg-white dark:bg-slate-950 dark:focus-visible:bg-slate-950 border-slate-200/60 transition-all text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5" /> Category
            </label>
            <Input
              name="category"
              placeholder="Electronics"
              value={formData.category}
              onChange={handleChange}
              className="h-11 rounded-xl bg-slate-50/50 dark:bg-slate-950 text-sm border-slate-200/60"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <Hash className="h-3.5 w-3.5" /> HSN Code
            </label>
            <Input
              name="hsn"
              placeholder="8518"
              value={formData.hsn}
              onChange={handleChange}
              className="h-11 rounded-xl bg-slate-50/50 dark:bg-slate-950 text-sm border-slate-200/60"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: FINANCE & VALUATION */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Financial Matrix
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <Download className="h-3.5 w-3.5" /> Cost Price (Buy)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                ₹
              </span>
              <Input
                type="number"
                name="purchasePrice"
                value={formData.purchasePrice || ""}
                onChange={handleChange}
                min={0}
                placeholder="0.00"
                className="h-11 pl-7 rounded-xl bg-slate-50/50 dark:bg-slate-950 text-sm border-slate-200/60"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5" /> Selling Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                ₹
              </span>
              <Input
                type="number"
                name="salePrice"
                value={formData.salePrice || ""}
                onChange={handleChange}
                min={0}
                placeholder="0.00"
                className="h-11 pl-7 rounded-xl bg-slate-50/50 dark:bg-slate-950 text-sm border-slate-200/60 font-medium text-emerald-600 dark:text-emerald-400"
              />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
            <Percent className="h-3.5 w-3.5" /> Applied GST Rate
          </label>
          <div className="relative">
            <select
              name="gstRate"
              value={formData.gstRate}
              onChange={handleChange}
              className="w-full h-11 px-3 rounded-xl bg-slate-50/50 dark:bg-slate-950 text-sm border border-slate-200/60 focus:outline-none appearance-none font-medium"
            >
              <option value={0}>Exempted (0% GST)</option>
              <option value={5}>Standard Rate (5% GST)</option>
              <option value={12}>Standard Rate (12% GST)</option>
              <option value={18}>Premium Rate (18% GST)</option>
              <option value={28}>Luxury Rate (28% GST)</option>
            </select>
            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 rotate-90 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* SECTION 3: STOCK LOGISTICS */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Stock & Units
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5" /> Initial Stock
            </label>
            <Input
              type="number"
              name="stock"
              value={formData.stock || ""}
              onChange={handleChange}
              min={0}
              placeholder="0"
              className="h-11 rounded-xl bg-slate-50/50 dark:bg-slate-950 text-sm border-slate-200/60"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5" /> Unit Metric
            </label>
            <div className="relative">
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full h-11 px-3 rounded-xl bg-slate-50/50 dark:bg-slate-950 text-sm border border-slate-200/60 focus:outline-none appearance-none font-medium text-slate-700 dark:text-slate-300"
              >
                <option value="PCS">Pieces (PCS)</option>
                <option value="BOX">Boxes (BOX)</option>
                <option value="PACK">Packs (PACK)</option>
                <option value="DOZEN">Dozens (DOZEN)</option>
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 rotate-90 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5" /> Low Stock Floor Alert
          </label>
          <Input
            type="number"
            name="minStock"
            value={formData.minStock || ""}
            onChange={handleChange}
            min={0}
            placeholder="Notify when stock hits..."
            className="h-11 rounded-xl bg-slate-50/50 dark:bg-slate-950 text-sm border-slate-200/60"
          />
        </div>
      </div>

      {/* SECTION 4: TOGGLE STATUS ROW */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="space-y-0.5">
          <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" /> Active Registry
          </label>
          <p className="text-xs text-slate-400">
            Available across invoices when visible
          </p>
        </div>

        {/* iOS Styled Premium Toggle Switch Wrapper */}
        <label className="relative inline-flex items-center cursor-pointer select-none">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
            }
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:after:bg-slate-200 peer-checked:bg-emerald-500" />
        </label>
      </div>

      {/* FIXED FOOTER SUBMIT ACCENT */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full h-12 rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-950 dark:hover:bg-slate-200 font-semibold shadow-lg transition-transform active:scale-[0.99] disabled:opacity-50"
      >
        {loading
          ? "Synchronizing Matrix..."
          : initialData?._id
            ? "Commit Updates"
            : "Deploy New Asset"}
      </Button>
    </form>
  );
}
