"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import ProductForm from "@/components/product-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { toast } from "react-hot-toast";

interface Product {
  _id: string;

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

  createdAt?: string;
  updatedAt?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (error) {
      toast.error("Failed to load products");
    }
  };

  const handleDelete = async (id: string) => {
    const ok = confirm("Are you sure you want to delete this product?");

    if (!ok) return;

    try {
      await api.delete(`/products/${id}`);

      toast.success("Deleted successfully");

      fetchProducts();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const filtered = products.filter((p) => {
    const searchText = search.toLowerCase();

    return (
      p.productNo?.toLowerCase().includes(searchText) ||
      p.productName?.toLowerCase().includes(searchText) ||
      p.category?.toLowerCase().includes(searchText) ||
      p.hsn?.toLowerCase().includes(searchText)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

  const start = (page - 1) * itemsPerPage;

  const paginated = filtered.slice(start, start + itemsPerPage);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setSelected(null);
                setOpen(true);
              }}
            >
              + Add Product
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selected ? "Edit Product" : "Add Product"}
              </DialogTitle>
            </DialogHeader>

            <ProductForm
              initialData={selected || undefined}
              onSuccess={() => {
                fetchProducts();
                setOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Input
        placeholder="Search product..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Product Cards */}
      <div className="space-y-3">
        {paginated.map((item) => (
          <Card key={item._id} className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-bold text-lg">{item.productName}</h2>

                  <p className="text-sm text-gray-500">{item.productNo}</p>
                </div>

                {!item.isActive && (
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                    Inactive
                  </span>
                )}
              </div>

              <div className="mt-3 space-y-1 text-sm">
                <p>
                  <strong>Category:</strong> {item.category || "-"}
                </p>

                <p>
                  <strong>HSN:</strong> {item.hsn || "-"}
                </p>

                <p>
                  <strong>Stock:</strong> {item.stock} {item.unit}
                </p>

                <p>
                  <strong>Purchase:</strong> ₹{item.purchasePrice}
                </p>

                <p>
                  <strong>Sale:</strong> ₹{item.salePrice}
                </p>

                <p>
                  <strong>GST:</strong> {item.gstRate}%
                </p>

                <p>
                  <strong>Min Stock:</strong> {item.minStock}
                </p>

                {item.stock <= item.minStock && (
                  <div className="text-red-600 font-semibold">⚠ Low Stock</div>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  onClick={() => {
                    setSelected(item);
                    setOpen(true);
                  }}
                >
                  Edit
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}

      <div className="flex justify-center gap-3">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </Button>

        <span className="flex items-center">
          {page} / {totalPages || 1}
        </span>

        <Button
          variant="outline"
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
