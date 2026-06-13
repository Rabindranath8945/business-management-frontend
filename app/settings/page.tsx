"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const API = process.env.NEXT_PUBLIC_API_URL;
  const [pageLoading, setPageLoading] = useState(true);

  const [form, setForm] = useState({
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
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${API}/settings`);

      if (res.data) {
        setForm((prev) => ({
          ...prev,
          ...res.data,
        }));
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load settings");
    } finally {
      setPageLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "taxPercent"
            ? Number(value)
            : value,
    }));
  };

  const saveSettings = async () => {
    try {
      setLoading(true);

      await axios.put(`${API}/settings`, form);

      toast.success("Settings saved successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };
  if (pageLoading) {
    return <div className="p-6">Loading settings...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          className="border p-2 rounded"
          type="text"
          name="shopName"
          placeholder="Shop Name"
          value={form.shopName}
          onChange={handleChange}
        />

        <input
          className="border p-2 rounded"
          type="text"
          name="ownerName"
          placeholder="Owner Name"
          value={form.ownerName}
          onChange={handleChange}
        />

        <input
          className="border p-2 rounded"
          type="text"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
        />

        <input
          className="border p-2 rounded"
          type="text"
          name="whatsapp"
          placeholder="WhatsApp"
          value={form.whatsapp}
          onChange={handleChange}
        />

        <input
          className="border p-2 rounded"
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          className="border p-2 rounded"
          type="text"
          name="website"
          placeholder="Website"
          value={form.website}
          onChange={handleChange}
        />

        <input
          className="border p-2 rounded"
          type="text"
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
        />

        <input
          className="border p-2 rounded"
          type="text"
          name="state"
          placeholder="State"
          value={form.state}
          onChange={handleChange}
        />

        <input
          className="border p-2 rounded"
          type="text"
          name="pincode"
          placeholder="Pincode"
          value={form.pincode}
          onChange={handleChange}
        />

        <input
          className="border p-2 rounded"
          type="text"
          name="country"
          placeholder="Country"
          value={form.country}
          onChange={handleChange}
        />

        <input
          className="border p-2 rounded"
          type="text"
          name="gstNo"
          placeholder="GST Number"
          value={form.gstNo}
          onChange={handleChange}
        />

        <input
          className="border p-2 rounded"
          name="taxPercent"
          type="number"
          placeholder="Tax %"
          value={form.taxPercent}
          onChange={handleChange}
        />

        <input
          className="border p-2 rounded"
          type="text"
          name="invoicePrefix"
          placeholder="Invoice Prefix"
          value={form.invoicePrefix}
          onChange={handleChange}
        />

        <input
          className="border p-2 rounded"
          type="text"
          name="purchasePrefix"
          placeholder="Purchase Prefix"
          value={form.purchasePrefix}
          onChange={handleChange}
        />

        <input
          className="border p-2 rounded"
          type="text"
          name="productPrefix"
          placeholder="Product Prefix"
          value={form.productPrefix}
          onChange={handleChange}
        />
      </div>

      <textarea
        className="border p-2 rounded w-full mt-4"
        rows={4}
        name="address"
        placeholder="Address"
        value={form.address}
        onChange={(e) =>
          setForm((prev) => ({
            ...prev,
            address: e.target.value,
          }))
        }
      />

      <div className="mt-4 flex gap-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="thermalPrinter"
            checked={form.thermalPrinter}
            onChange={handleChange}
          />
          Thermal Printer
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="darkMode"
            checked={form.darkMode}
            onChange={handleChange}
          />
          Dark Mode
        </label>
      </div>

      <button
        onClick={saveSettings}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded mt-6"
      >
        {loading ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
}
