interface Purchase {
  _id: string;

  purchaseNo: string;

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

interface PurchaseItem {
  product: string;
  productNo: string;
  productName: string;
  qty: number;
  purchasePrice: number;
  total: number;
}
