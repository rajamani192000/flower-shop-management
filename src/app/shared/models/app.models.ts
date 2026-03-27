export type UserRole = 'Admin' | 'Staff' | 'Accountant';

export interface AppUser {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  shopId: string;
  shopCode?: string;
  shopName?: string;
  status: 'active' | 'inactive';
}

export interface ShopRecord {
  id?: string;
  shopId: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface Flower extends ShopRecord {
  flowerName: string;
  unit: 'KG' | 'Gram' | 'Piece' | 'Garland';
  category: 'Loose Flower' | 'Garland' | 'Decoration Flower' | 'Temple Flower';
  defaultPrice: number;
  status: boolean;
}

export interface Customer extends ShopRecord {
  name: string;
  phone: string;
  address: string;
  creditLimit: number;
  customerType: 'Temple' | 'Tea Shop' | 'Retail' | 'Decorator';
}

export interface Supplier extends ShopRecord {
  supplierName: string;
  location: string;
  phone: string;
  paymentType: string;
}

export interface Purchase extends ShopRecord {
  flowerId: string;
  weight: number;
  price: number;
  supplierId: string;
  boxNumber: string;
  paymentType: 'Cash' | 'UPI' | 'Credit';
  date: string;
  billPhotoUrl?: string;
}

export interface SortingEntry extends ShopRecord {
  purchaseId: string;
  grossWeight: number;
  wasteWeight: number;
  netSellableWeight: number;
  date: string;
}

export interface Sale extends ShopRecord {
  flowerId: string;
  weight: number;
  price: number;
  customerId: string;
  paymentType: 'Cash' | 'UPI' | 'Credit';
  date: string;
}

export interface Expense extends ShopRecord {
  expenseType: string;
  amount: number;
  note: string;
  date: string;
}

export interface Waste extends ShopRecord {
  flowerId: string;
  weight: number;
  reason: string;
  date: string;
}

export interface CreditSale extends ShopRecord {
  customerId: string;
  amount: number;
  date: string;
  status: 'Pending' | 'Paid';
}

export interface CreditCollection extends ShopRecord {
  customerId: string;
  amount: number;
  date: string;
}

export interface PriceHistory extends ShopRecord {
  flowerId: string;
  date: string;
  purchasePrice: number;
  salePrice: number;
}

export interface StockItem extends ShopRecord {
  flowerId: string;
  openingStock: number;
  purchases: number;
  sales: number;
  waste: number;
  currentStock: number;
  lowStockThreshold: number;
}

export interface BoxTracking extends ShopRecord {
  boxNumber: string;
  flowerId: string;
  supplierId: string;
  grossWeight: number;
  netWeight: number;
  purchasePrice: number;
  date: string;
}
