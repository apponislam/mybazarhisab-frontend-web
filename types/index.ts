export type BazarUnit = "KG" | "PIECE" | "GM";

export type BillCategory =
  | "RENT" | "TRAVEL" | "WIFI" | "ELECTRICITY" | "GAS" | "WATER"
  | "MAID" | "MAINTENANCE" | "SUBSCRIPTION" | "MOBILE" | "MEDICAL"
  | "EDUCATION" | "SHOPPING" | "ENTERTAINMENT" | "LAUNDRY" | "LOAN_EMI"
  | "SALON_GROOMING" | "GIFTS_FESTIVALS" | "UTILITIES" | "OTHERS";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface MockProduct {
  id: string;
  name: string;
  emoji: string;
}

export interface MockBazarEntry {
  id: string;
  product: MockProduct;
  price: number;
  quantity: number;
  unit: BazarUnit;
  date: Date;
  notes?: string;
  user: MockUser;
}

export interface MockBill {
  id: string;
  user: MockUser;
  category: BillCategory;
  title: string;
  amount: number;
  date: Date;
  notes?: string;
}

export type AppTab = "home" | "expenses" | "bills" | "profile";

export type AppSubScreen =
  | null
  | "add-picker"
  | "add-expense"
  | "add-bill"
  | "expense-detail"
  | "expense-edit"
  | "bill-detail"
  | "bill-edit"
  | "profile-edit"
  | "profile-change-password";

export interface GroupStats {
  groupName: string;
  totalMembers: number;
  totalGroupBazarEntries: number;
  totalMyBazarEntries: number;
  totalProductsCreatedByMe: number;
  thisMonthBazarExpense: number;
  prevMonthBazarExpense: number;
  thisYearBazarExpense: number;
  prevYearBazarExpense: number;
  thisMonthBillExpense: number;
  prevMonthBillExpense: number;
  thisYearBillExpense: number;
  prevYearBillExpense: number;
  thisMonthTotalExpense: number;
  prevMonthTotalExpense: number;
  thisYearTotalExpense: number;
  prevYearTotalExpense: number;
}
