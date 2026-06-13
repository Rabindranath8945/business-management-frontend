export interface Product {
  _id: string;
  product?: string;
  productNo?: string;
  productName?: string;
  name?: string;
  stock: number;
  lowStock?: number;
  category?: string;
}

export interface Sale {
  _id: string;
  invoiceNo: string;
  customerName: string;
  grandTotal: number;
  paymentMethod?: string;
  createdAt: string;
}

export interface DashboardData {
  todaySales: number;
  netProfit: number;
  stockValue: number;
  stockItems: number;
  lowStockCount: number;
  activeOrders: number;
  pendingOrders: number;

  lowStockProducts: Product[];
  recentSales: Sale[];
}
