"use client";

import { useRouter } from "next/navigation";
import PurchaseForm from "@/components/purchase-form";
import { Card, CardContent } from "@/components/ui/card";

export default function NewPurchasePage() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardContent className="p-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">New Purchase</h1>

            <p className="text-sm text-muted-foreground">
              Add products to purchase and update stock.
            </p>
          </div>

          <PurchaseForm
            onSuccess={() => {
              router.push("/purchases");
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
