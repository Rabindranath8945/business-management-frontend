"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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

  // Customer Details

  const [customerName, setCustomerName] = useState("Cash");

  const [phone, setPhone] = useState("");

  const [note, setNote] = useState("");

  // Summary

  const [discount, setDiscount] = useState(0);

  const [tax, setTax] = useState(0);

  // Product Entry

  const [selectedProduct, setSelectedProduct] = useState("");

  const [qty, setQty] = useState(1);

  const [salePrice, setSalePrice] = useState(0);

  // Items

  const [items, setItems] = useState<SaleItem[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");

      setProducts(res.data.filter((p: any) => p.isActive));
    } catch {
      toast.error("Failed to load products");
    }
  };

  const currentProduct = products.find((p) => p._id === selectedProduct);

  const currentTotal = qty * salePrice;

  const handleProductChange = (productId: string) => {
    setSelectedProduct(productId);

    const product = products.find((p) => p._id === productId);

    if (product) {
      setSalePrice(product.salePrice);
    }
  };

  const addItem = () => {
    if (!selectedProduct) {
      return toast.error("Select product");
    }

    const product = products.find((p) => p._id === selectedProduct);

    if (!product) {
      return toast.error("Product not found");
    }

    // Stock Validation

    if (qty > product.stock) {
      return toast.error("Insufficient stock");
    }

    const total = qty * salePrice;

    setItems((prev) => {
      const existing = prev.findIndex((i) => i.product === product._id);

      // Merge Duplicate Product

      if (existing >= 0) {
        const updated = [...prev];

        const newQty = updated[existing].qty + qty;

        if (newQty > product.stock) {
          toast.error("Insufficient stock");

          return prev;
        }

        updated[existing].qty = newQty;

        updated[existing].salePrice = salePrice;

        updated[existing].total = newQty * salePrice;

        return updated;
      }

      return [
        ...prev,
        {
          product: product._id,

          productNo: product.productNo,

          productName: product.productName,

          qty,

          salePrice,

          total,
        },
      ];
    });

    setSelectedProduct("");

    setQty(1);

    setSalePrice(0);

    toast.success("Item added");
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const subTotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.total, 0);
  }, [items]);

  const grandTotal = useMemo(() => {
    return subTotal - discount + tax;
  }, [subTotal, discount, tax]);

  const totalQty = useMemo(() => {
    return items.reduce((sum, item) => sum + item.qty, 0);
  }, [items]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      return toast.error("Add at least one item");
    }

    try {
      setLoading(true);

      await api.post("/sales", {
        customerName,
        phone,
        items,
        discount,
        tax,
        note,
      });

      toast.success("Sale saved successfully");

      setCustomerName("Cash");

      setPhone("");

      setNote("");

      setDiscount(0);

      setTax(0);

      setItems([]);

      setSelectedProduct("");

      setQty(1);

      setSalePrice(0);

      onSuccess();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-5 pb-24">
      {/* Customer Details */}

      <Card>
        <CardContent className="p-4 space-y-4">
          <h2 className="text-lg font-bold">Customer Details</h2>

          <div className="space-y-2">
            <label className="text-sm font-medium">Customer Name</label>

            <Input
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Phone Number</label>

            <Input
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Note</label>

            <Textarea
              placeholder="Sale Note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Product Entry */}

      <Card>
        <CardContent className="p-4 space-y-4">
          <h2 className="text-lg font-bold">Add Product</h2>

          <div className="space-y-2">
            <label className="text-sm font-medium">Product</label>

            <select
              value={selectedProduct}
              onChange={(e) => handleProductChange(e.target.value)}
              className="w-full rounded-md border p-2"
            >
              <option value="">Select Product</option>

              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.productNo} - {product.productName}
                </option>
              ))}
            </select>
          </div>

          {currentProduct && (
            <div className="rounded-lg border p-3 text-sm">
              <p>
                Current Stock:{" "}
                <strong>
                  {currentProduct.stock} {currentProduct.unit}
                </strong>
              </p>

              <p
                className={
                  qty > currentProduct.stock
                    ? "text-red-600 font-semibold"
                    : "text-green-600"
                }
              >
                After Sale: {currentProduct.stock - qty} {currentProduct.unit}
              </p>

              {qty > currentProduct.stock && (
                <p className="text-red-600 font-semibold">Insufficient Stock</p>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity</label>

              <Input
                type="number"
                min={1}
                value={qty || ""}
                onChange={(e) => setQty(Number(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sale Price</label>

              <Input
                type="number"
                min={0}
                value={salePrice || ""}
                onChange={(e) => setSalePrice(Number(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Item Total</label>

            <Input readOnly disabled value={`₹${currentTotal}`} />
          </div>

          <Button
            type="button"
            className="w-full"
            onClick={addItem}
            disabled={currentProduct ? qty > currentProduct.stock : false}
          >
            + Add Item
          </Button>
        </CardContent>
      </Card>

      {/* Added Items */}

      {items.length > 0 && (
        <Card>
          <CardContent className="p-4 space-y-4">
            <h2 className="text-lg font-bold">Added Items</h2>

            {items.map((item, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{item.productName}</h3>

                      <p className="text-sm text-muted-foreground">
                        {item.productNo}
                      </p>

                      <p className="text-sm mt-1">
                        Qty: {item.qty} × ₹{item.salePrice}
                      </p>

                      <p className="font-semibold text-green-600">
                        Total: ₹{item.total}
                      </p>
                    </div>

                    <Button
                      size="sm"
                      variant="destructive"
                      type="button"
                      onClick={() => removeItem(index)}
                    >
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Summary */}

      <Card>
        <CardContent className="p-4 space-y-4">
          <h2 className="text-lg font-bold">Summary</h2>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Discount</label>

              <Input
                type="number"
                value={discount || ""}
                onChange={(e) => setDiscount(Number(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tax</label>

              <Input
                type="number"
                value={tax || ""}
                onChange={(e) => setTax(Number(e.target.value) || 0)}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Total Items</span>
              <span>{items.length}</span>
            </div>

            <div className="flex justify-between">
              <span>Total Qty</span>
              <span>{totalQty}</span>
            </div>

            <div className="flex justify-between">
              <span>Sub Total</span>
              <span>₹{subTotal}</span>
            </div>

            <div className="flex justify-between">
              <span>Discount</span>
              <span>- ₹{discount}</span>
            </div>

            <div className="flex justify-between">
              <span>Tax</span>
              <span>+ ₹{tax}</span>
            </div>

            <Separator />

            <div className="flex justify-between text-lg font-bold">
              <span>Grand Total</span>

              <span className="text-green-600">₹{grandTotal}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sticky Save Button */}

      <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-4 z-50">
        <Button
          type="submit"
          className="w-full h-12 text-base"
          disabled={loading || items.length === 0}
        >
          {loading ? "Saving..." : `Save Sale ₹${grandTotal}`}
        </Button>
      </div>
    </form>
  );
}
