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

interface Purchase {
  _id: string;

  purchaseNo?: string;

  supplier: string;

  items: PurchaseItem[];

  subTotal: number;

  discount: number;

  tax: number;

  grandTotal: number;

  note: string;

  purchaseDate?: string;

  createdAt?: string;
}

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Purchase | null>(null);

  const [open, setOpen] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchPurchases();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const fetchPurchases = async () => {
    try {
      const res = await api.get("/purchases");
      setPurchases(res.data);
    } catch (error) {
      toast.error("Failed to load purchases");
    }
  };

  const handleDelete = async (id: string) => {
    const ok = confirm("Delete purchase?");

    if (!ok) return;

    try {
      await api.delete(`/purchases/${id}`);

      toast.success("Purchase deleted");

      fetchPurchases();
    } catch (error) {
      toast.error("Delete failed");
    }
  };
  const filtered = purchases.filter((p) => {
    const s = search.toLowerCase();

    return (
      (p.purchaseNo || "").toLowerCase().includes(s) ||
      (p.supplier || "").toLowerCase().includes(s) ||
      p.items.some((item) => (item.productName || "").toLowerCase().includes(s))
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

  const start = (page - 1) * itemsPerPage;

  const paginated = filtered.slice(start, start + itemsPerPage);

  return (
    <div className="space-y-4">
      {/* Header */}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Purchases</h1>

        <Button asChild>
          <Link href="/purchases/new">+ Add Purchase</Link>
        </Button>
      </div>

      {/* Search */}

      <Input
        placeholder="Search purchase..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Purchase Cards */}

      <div className="space-y-3">
        {paginated.map((item) => (
          <Card key={item._id}>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <h2 className="font-bold text-lg">{item.purchaseNo}</h2>

                  <span className="font-bold text-green-600">
                    ₹{item.grandTotal}
                  </span>
                </div>

                <p className="text-sm">
                  <strong>Supplier:</strong> {item.supplier || "-"}
                </p>

                <p className="text-sm text-muted-foreground">
                  {new Date(
                    item.purchaseDate || item.createdAt!,
                  ).toLocaleDateString()}
                </p>

                <div className="flex gap-2 mt-4">
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
              No purchases found
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
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Purchase Details</DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="space-y-4">
              <div>
                <p>
                  <strong>Purchase No:</strong> {selected.purchaseNo}
                </p>

                <p>
                  <strong>Supplier:</strong> {selected.supplier}
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(
                    selected.purchaseDate || selected.createdAt!,
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

                      <p>Price: ₹{item.purchasePrice}</p>

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
