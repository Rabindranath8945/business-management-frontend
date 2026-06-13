"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";

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
      setFormData({
        ...defaultData,
        ...initialData,
      });
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

        toast.success("Product updated successfully");
      } else {
        await api.post("/products", payload);

        toast.success("Product added successfully");

        setFormData(defaultData);
      }

      onSuccess();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {initialData?._id && (
        <Input
          value={formData.productNo || ""}
          readOnly
          disabled
          placeholder="Product No"
        />
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium">Product Name</label>

        <Input
          name="productName"
          placeholder="Enter product name"
          value={formData.productName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Category</label>

        <Input
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">HSN Code</label>
        <Input
          name="hsn"
          placeholder="HSN Code"
          value={formData.hsn}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Purchase Price</label>
        <Input
          type="number"
          name="purchasePrice"
          placeholder="Purchase Price"
          value={formData.purchasePrice || ""}
          onChange={handleChange}
          min={0}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Sale Price</label>
        <Input
          type="number"
          name="salePrice"
          placeholder="Sale Price"
          value={formData.salePrice || ""}
          onChange={handleChange}
          min={0}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Opening Stock</label>
        <Input
          type="number"
          name="stock"
          placeholder="Opening Stock"
          value={formData.stock || ""}
          onChange={handleChange}
          min={0}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Unit</label>
        <select
          name="unit"
          value={formData.unit}
          onChange={handleChange}
          className="w-full rounded-md border p-2"
        >
          <option value="PCS">PCS</option>
          <option value="BOX">BOX</option>
          <option value="PACK">PACK</option>
          <option value="DOZEN">DOZEN</option>
        </select>
      </div>

      <select
        name="gstRate"
        value={formData.gstRate}
        onChange={handleChange}
        className="w-full rounded-md border p-2"
      >
        <option value={0}>GST 0%</option>
        <option value={5}>GST 5%</option>
        <option value={12}>GST 12%</option>
        <option value={18}>GST 18%</option>
        <option value={28}>GST 28%</option>
      </select>

      <div className="space-y-2">
        <label className="text-sm font-medium">Minimum Stock Alert</label>
        <Input
          type="number"
          name="minStock"
          placeholder="Minimum Stock Alert"
          value={formData.minStock || ""}
          onChange={handleChange}
          min={0}
        />
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={formData.isActive}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              isActive: e.target.checked,
            }))
          }
        />
        Active Product
      </label>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Saving..." : "Save Product"}
      </Button>
    </form>
  );
}
