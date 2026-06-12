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

  createdAt?: string;
  updatedAt?: string;
}
