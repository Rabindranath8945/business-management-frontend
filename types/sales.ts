export interface SaleItem {
  product: string;
  productNo?: string;
  productName?: string;

  qty: number;
  salePrice: number;
  total: number;
}

export interface Sale {
  _id?: string;

  invoiceNo?: string;

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
  updatedAt?: string;
}
