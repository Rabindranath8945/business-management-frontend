"use client";

import { useRouter } from "next/navigation";
import SaleForm from "@/components/sale-form";

export default function NewSalePage() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <div>
        <h1 className="text-2xl font-bold">New Sale</h1>

        <p className="text-muted-foreground">Create a new sales invoice</p>
      </div>

      <SaleForm
        onSuccess={() => {
          router.push("/sales");
        }}
      />
    </div>
  );
}
