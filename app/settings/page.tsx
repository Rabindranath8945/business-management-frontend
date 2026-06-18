"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// 🌟 SETTINGS INTERACTION SCHEMA
export interface SettingsForm {
  shopName: string;
  ownerName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  gstNo: string;
  invoicePrefix: string;
  purchasePrefix: string;
  productPrefix: string;
  currency: string;
  taxPercent: number;
  logo: string;
  thermalPrinter: boolean;
  darkMode: boolean;
}

const defaultSettings: SettingsForm = {
  shopName: "",
  ownerName: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  phone: "",
  whatsapp: "",
  email: "",
  website: "",
  gstNo: "",
  invoicePrefix: "INV",
  purchasePrefix: "PUR",
  productPrefix: "P",
  currency: "₹",
  taxPercent: 0,
  logo: "",
  thermalPrinter: false,
  darkMode: false,
};

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [form, setForm] = useState<SettingsForm>(defaultSettings);

  const API = process.env.NEXT_PUBLIC_API_URL;

  // 🔄 LIFECYCLE SYNC
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setPageLoading(true);
      const res = await axios.get(`${API}/settings`);
      if (res.data) {
        setForm((prev) => ({
          ...prev,
          ...res.data,
        }));
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load ecosystem settings configuration.");
    } finally {
      setPageLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;

    let targetValue: any = value;
    if (type === "checkbox") {
      targetValue = (e.target as HTMLInputElement).checked;
    } else if (name === "taxPercent") {
      targetValue = Number(value);
    }

    setForm((prev) => ({
      ...prev,
      [name]: targetValue,
    }));
  };

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.put(`${API}/settings`, form);
      toast.success("Ecosystem parameters compiled successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Secure transmission failure: settings drop failed.");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-sm text-slate-400 font-medium animate-pulse gap-2">
        <span>🔄</span>
        Decrypting secure configuration parameters...
      </div>
    );
  }
  return (
    <form
      onSubmit={saveSettings}
      className="min-h-screen bg-slate-50/50 p-4 md:p-8 space-y-6 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-50 max-w-4xl mx-auto pb-24"
    >
      {/* SETTINGS HEADER ROW */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 dark:from-slate-50 dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
            Ecosystem Configuration
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Synchronize workspace rules, billing serialization tokens, and
            system layout preferences.
          </p>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="h-10 px-5 rounded-xl bg-slate-900 text-slate-50 hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-950 dark:hover:bg-slate-200 font-semibold shadow-sm transition-all sm:w-auto w-full"
        >
          {loading ? "Compiling Updates..." : "Save Workspace Matrix"}
        </Button>
      </div>

      <div className="space-y-6">
        {/* PANEL 1: REGISTRY IDENTITY */}
        <Card className="rounded-2xl border border-slate-200/60 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.01)] dark:border-slate-800 dark:bg-slate-900/60 backdrop-blur-md">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/60 pb-2.5">
              <span className="text-sm">🏢</span>
              <h2 className="font-bold text-sm uppercase tracking-wider text-slate-400 dark:text-slate-500">
                1. Store & Brand Profile
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Shop Name
                </label>
                <Input
                  type="text"
                  name="shopName"
                  placeholder="e.g. Acme Supermart"
                  value={form.shopName}
                  onChange={handleChange}
                  className="h-10 rounded-xl border-slate-200 bg-slate-50/40 focus-visible:bg-white dark:bg-slate-950 dark:border-slate-800 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Owner Name
                </label>
                <Input
                  type="text"
                  name="ownerName"
                  placeholder="e.g. John Doe"
                  value={form.ownerName}
                  onChange={handleChange}
                  className="h-10 rounded-xl border-slate-200 bg-slate-50/40 focus-visible:bg-white dark:bg-slate-950 dark:border-slate-800 text-sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PANEL 2: COMMUNICATIONS GRID */}
        <Card className="rounded-2xl border border-slate-200/60 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.01)] dark:border-slate-800 dark:bg-slate-900/60 backdrop-blur-md">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/60 pb-2.5">
              <span className="text-sm">📞</span>
              <h2 className="font-bold text-sm uppercase tracking-wider text-slate-400 dark:text-slate-500">
                2. Contact Channels
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Phone Connection
                </label>
                <Input
                  type="text"
                  name="phone"
                  placeholder="+91 XXXXX XXXXX"
                  value={form.phone}
                  onChange={handleChange}
                  className="h-10 rounded-xl border-slate-200 bg-slate-50/40 focus-visible:bg-white dark:bg-slate-950 dark:border-slate-800 text-sm font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  WhatsApp Endpoint
                </label>
                <Input
                  type="text"
                  name="whatsapp"
                  placeholder="WhatsApp line link or code"
                  value={form.whatsapp}
                  onChange={handleChange}
                  className="h-10 rounded-xl border-slate-200 bg-slate-50/40 focus-visible:bg-white dark:bg-slate-950 dark:border-slate-800 text-sm font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Corporate Email
                </label>
                <Input
                  type="email"
                  name="email"
                  placeholder="support@acme.com"
                  value={form.email}
                  onChange={handleChange}
                  className="h-10 rounded-xl border-slate-200 bg-slate-50/40 focus-visible:bg-white dark:bg-slate-950 dark:border-slate-800 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Domain Website URL
                </label>
                <Input
                  type="text"
                  name="website"
                  placeholder="https://acme.com"
                  value={form.website}
                  onChange={handleChange}
                  className="h-10 rounded-xl border-slate-200 bg-slate-50/40 focus-visible:bg-white dark:bg-slate-950 dark:border-slate-800 text-sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PANEL 3: GEOGRAPHIC DESK */}
        <Card className="rounded-2xl border border-slate-200/60 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.01)] dark:border-slate-800 dark:bg-slate-900/60 backdrop-blur-md">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/60 pb-2.5">
              <span className="text-sm">📍</span>
              <h2 className="font-bold text-sm uppercase tracking-wider text-slate-400 dark:text-slate-500">
                3. Operational Address Location
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  City
                </label>
                <Input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={form.city}
                  onChange={handleChange}
                  className="h-10 rounded-xl border-slate-200 bg-slate-50/40 dark:bg-slate-950 dark:border-slate-800 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  State
                </label>
                <Input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={form.state}
                  onChange={handleChange}
                  className="h-10 rounded-xl border-slate-200 bg-slate-50/40 dark:bg-slate-950 dark:border-slate-800 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Pincode
                </label>
                <Input
                  type="text"
                  name="pincode"
                  placeholder="Postal Code"
                  value={form.pincode}
                  onChange={handleChange}
                  className="h-10 rounded-xl border-slate-200 bg-slate-50/40 dark:bg-slate-950 dark:border-slate-800 text-sm font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Country
                </label>
                <Input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={form.country}
                  onChange={handleChange}
                  className="h-10 rounded-xl border-slate-200 bg-slate-50/40 dark:bg-slate-950 dark:border-slate-800 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Full Structural Address
              </label>
              <Textarea
                name="address"
                placeholder="Type complete street, building, area particulars..."
                value={form.address}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, address: e.target.value }))
                }
                className="rounded-xl border-slate-200 bg-slate-50/40 focus-visible:bg-white dark:bg-slate-950 dark:border-slate-800 min-h-[70px] text-xs leading-relaxed"
              />
            </div>
          </CardContent>
        </Card>

        {/* PANEL 4: INVOICING MATRIX CONFIGS */}
        <Card className="rounded-2xl border border-slate-200/60 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.01)] dark:border-slate-800 dark:bg-slate-900/60 backdrop-blur-md">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/60 pb-2.5">
              <span className="text-sm">🏷️</span>
              <h2 className="font-bold text-sm uppercase tracking-wider text-slate-400 dark:text-slate-500">
                4. Legal Tax & Document Prefixes
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  GST Registration No
                </label>
                <Input
                  type="text"
                  name="gstNo"
                  placeholder="22AAAAA0000A1Z5"
                  value={form.gstNo}
                  onChange={handleChange}
                  className="h-10 rounded-xl border-slate-200 bg-slate-50/40 dark:bg-slate-950 dark:border-slate-800 text-sm font-mono uppercase font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Base Corporate Tax %
                </label>
                <Input
                  name="taxPercent"
                  type="number"
                  placeholder="Base Matrix % Value"
                  value={form.taxPercent}
                  onChange={handleChange}
                  className="h-10 rounded-xl border-slate-200 bg-slate-50/40 dark:bg-slate-950 dark:border-slate-800 text-sm font-mono font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Sales Invoice Prefix
                </label>
                <Input
                  type="text"
                  name="invoicePrefix"
                  placeholder="INV"
                  value={form.invoicePrefix}
                  onChange={handleChange}
                  className="h-10 rounded-xl border-slate-200 bg-slate-50/40 dark:bg-slate-950 dark:border-slate-800 text-sm font-mono font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Purchase Order Prefix
                </label>
                <Input
                  type="text"
                  name="purchasePrefix"
                  placeholder="PUR"
                  value={form.purchasePrefix}
                  onChange={handleChange}
                  className="h-10 rounded-xl border-slate-200 bg-slate-50/40 dark:bg-slate-950 dark:border-slate-800 text-sm font-mono font-semibold"
                />
              </div>

              <div className="space-y-1.5 col-span-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Product Registration SKU Prefix
                </label>
                <Input
                  type="text"
                  name="productPrefix"
                  placeholder="P"
                  value={form.productPrefix}
                  onChange={handleChange}
                  className="h-10 rounded-xl border-slate-200 bg-slate-50/40 dark:bg-slate-950 dark:border-slate-800 text-sm font-mono font-semibold"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PANEL 5: SYSTEM DRIVERS ENVIRONMENT OPTION */}
        <Card className="rounded-2xl border border-slate-200/60 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.01)] dark:border-slate-800 dark:bg-slate-900/60 backdrop-blur-md">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/60 pb-2.5">
              <span className="text-sm">⚙️</span>
              <h2 className="font-bold text-sm uppercase tracking-wider text-slate-400 dark:text-slate-500">
                5. Operational Environment Prefs
              </h2>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-1">
              {/* TOGGLE BLOCK A */}
              <div className="flex items-center justify-between border border-slate-100 dark:border-slate-850 bg-slate-50/40 dark:bg-slate-950/20 p-3 rounded-xl flex-1 gap-4">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Thermal Printing Mode
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Formats invoice pages to fit 80mm rollers
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
                  <input
                    type="checkbox"
                    name="thermalPrinter"
                    checked={form.thermalPrinter}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5.5 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-slate-900 dark:peer-checked:bg-slate-50" />
                </label>
              </div>

              {/* TOGGLE BLOCK B */}
              <div className="flex items-center justify-between border border-slate-100 dark:border-slate-850 bg-slate-50/40 dark:bg-slate-950/20 p-3 rounded-xl flex-1 gap-4">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    System Dark Variant
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Swaps base UI elements into high-contrast shades
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
                  <input
                    type="checkbox"
                    name="darkMode"
                    checked={form.darkMode}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5.5 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-slate-900 dark:peer-checked:bg-slate-50" />
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
