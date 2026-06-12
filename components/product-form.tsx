"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";

export interface Product {
  _id?: string;

  productNo: string;
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
  productNo: "",
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
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (initialData?._id) {
        await api.put(`/products/${initialData._id}`, formData);

        toast.success("Product updated successfully");
      } else {
        await api.post("/products", formData);

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
      <Input
        name="productNo"
        placeholder="Product No"
        value={formData.productNo}
        onChange={handleChange}
      />

      <Input
        name="productName"
        placeholder="Product Name"
        value={formData.productName}
        onChange={handleChange}
        required
      />

      <Input
        name="category"
        placeholder="Category"
        value={formData.category}
        onChange={handleChange}
      />

      <Input
        name="hsn"
        placeholder="HSN Code"
        value={formData.hsn}
        onChange={handleChange}
      />

      <Input
        type="number"
        name="purchasePrice"
        placeholder="Purchase Price"
        value={formData.purchasePrice}
        onChange={handleChange}
      />

      <Input
        type="number"
        name="salePrice"
        placeholder="Sale Price"
        value={formData.salePrice}
        onChange={handleChange}
      />

      <Input
        type="number"
        name="stock"
        placeholder="Opening Stock"
        value={formData.stock}
        onChange={handleChange}
      />

      <select
        name="unit"
        value={formData.unit}
        onChange={handleChange}
        className="w-full border rounded-md p-2"
      >
        <option value="PCS">PCS</option>
        <option value="KG">KG</option>
        <option value="LTR">LTR</option>
        <option value="BOX">BOX</option>
        <option value="PACK">PACK</option>
        <option value="DOZEN">DOZEN</option>
        <option value="METER">METER</option>
      </select>

      <Input
        type="number"
        name="gstRate"
        placeholder="GST Rate (%)"
        value={formData.gstRate}
        onChange={handleChange}
      />

      <Input
        type="number"
        name="minStock"
        placeholder="Minimum Stock Alert"
        value={formData.minStock}
        onChange={handleChange}
      />

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
