"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Separator } from "@/components/ui/separator";

interface SaleItem {
  product: string;
  productNo: string;
  productName: string;
  qty: number;
  salePrice: number;
  total: number;
}

interface Sale {
  _id: string;

  invoiceNo: string;

  customerName: string;

  phone: string;

  items: SaleItem[];

  subTotal: number;

  discount: number;

  tax: number;

  grandTotal: number;

  note: string;

  saleDate?: string;

  createdAt?: string;
}

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [selected, setSelected] = useState<Sale | null>(null);

  const [open, setOpen] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchSales();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const fetchSales = async () => {
    try {
      const res = await api.get("/sales");

      setSales(res.data);
    } catch {
      toast.error("Failed to load sales");
    }
  };

  const handleDelete = async (id: string) => {
    const ok = confirm("Delete sale?");

    if (!ok) return;

    try {
      await api.delete(`/sales/${id}`);

      toast.success("Sale deleted");

      fetchSales();
    } catch {
      toast.error("Delete failed");
    }
  };

  const filtered = sales.filter((sale) => {
    const s = search.toLowerCase();

    return (
      sale.invoiceNo?.toLowerCase().includes(s) ||
      sale.customerName?.toLowerCase().includes(s) ||
      sale.phone?.toLowerCase().includes(s) ||
      sale.items.some((item) => item.productName.toLowerCase().includes(s))
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

  const start = (page - 1) * itemsPerPage;

  const paginated = filtered.slice(start, start + itemsPerPage);

  return (
    <div className="space-y-4">
      {/* Header */}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sales</h1>

        <Button asChild>
          <Link href="/sales/new">+ Add Sale</Link>
        </Button>
      </div>

      {/* Search */}

      <Input
        placeholder="Search sale..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Cards */}

      <div className="space-y-3">
        {paginated.map((item) => (
          <Card key={item._id}>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <h2 className="font-bold text-lg">{item.invoiceNo}</h2>

                  <span className="font-bold text-green-600">
                    ₹{item.grandTotal}
                  </span>
                </div>

                <p className="text-sm">
                  <strong>Customer:</strong> {item.customerName}
                </p>

                <p className="text-sm">
                  <strong>Phone:</strong> {item.phone || "-"}
                </p>

                <p className="text-sm text-muted-foreground">
                  {new Date(
                    item.saleDate || item.createdAt!,
                  ).toLocaleDateString()}
                </p>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelected(item);
                      setOpen(true);
                    }}
                  >
                    View
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {paginated.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No sales found
            </CardContent>
          </Card>
        )}
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
          {page} / {totalPages}
        </span>

        <Button
          variant="outline"
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </div>

      {/* View Dialog */}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sale Details</DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="space-y-4">
              <div>
                <p>
                  <strong>Invoice No:</strong> {selected.invoiceNo}
                </p>

                <p>
                  <strong>Customer:</strong> {selected.customerName}
                </p>

                <p>
                  <strong>Phone:</strong> {selected.phone || "-"}
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(
                    selected.saleDate || selected.createdAt!,
                  ).toLocaleDateString()}
                </p>
              </div>

              <Separator />

              <div className="space-y-3">
                {selected.items.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="p-3">
                      <p className="font-semibold">{item.productName}</p>

                      <p>Product No: {item.productNo}</p>

                      <p>Qty: {item.qty}</p>

                      <p>Price: ₹{item.salePrice}</p>

                      <p className="font-bold">Total: ₹{item.total}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Separator />

              <div className="space-y-1">
                <p>Sub Total: ₹{selected.subTotal}</p>

                <p>Discount: ₹{selected.discount}</p>

                <p>Tax: ₹{selected.tax}</p>

                <p className="font-bold text-lg text-green-600">
                  Grand Total: ₹{selected.grandTotal}
                </p>
              </div>

              {selected.note && (
                <div>
                  <strong>Note:</strong>

                  <p className="text-sm text-muted-foreground">
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
