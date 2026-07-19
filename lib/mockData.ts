import React from "react";
import {
  Home, Car, Wifi, Zap, Flame, Droplets, Sparkles, Wrench, CreditCard,
  Smartphone, Heart, GraduationCap, ShoppingBag, Tv, Shirt, Banknote,
  Scissors, Gift, Settings, MoreHorizontal
} from "lucide-react";
import { MockUser, MockProduct, MockBazarEntry, MockBill, BillCategory, GroupStats } from "@/types";

export const MOCK_USERS: MockUser[] = [
  { id: "u1", name: "Ahmed Hassan", email: "ahmed@email.com", phone: "+880 1711 234567" },
  { id: "u2", name: "Fatima Begum", email: "fatima@email.com", phone: "+880 1812 345678" },
  { id: "u3", name: "Karim Uddin", email: "karim@email.com", phone: "+880 1913 456789" },
  { id: "u4", name: "Rahima Khatun", email: "rahima@email.com", phone: "+880 1614 567890" },
];

export const MOCK_PRODUCTS: MockProduct[] = [
  { id: "p1", name: "Onion", emoji: "🧅" }, { id: "p2", name: "Potato", emoji: "🥔" },
  { id: "p3", name: "Tomato", emoji: "🍅" }, { id: "p4", name: "Rice (Miniket)", emoji: "🌾" },
  { id: "p5", name: "Hilsha Fish", emoji: "🐟" }, { id: "p6", name: "Chicken", emoji: "🍗" },
  { id: "p7", name: "Eggs", emoji: "🥚" }, { id: "p8", name: "Soybean Oil", emoji: "🫙" },
  { id: "p9", name: "Garlic", emoji: "🧄" }, { id: "p10", name: "Lentils (Dal)", emoji: "🫘" },
];

const now = new Date();
const thisMonth = (d: number) => new Date(now.getFullYear(), now.getMonth(), d);
const lastMonth = (d: number) => new Date(now.getFullYear(), now.getMonth() - 1, d);

export const INITIAL_ENTRIES: MockBazarEntry[] = [
  { id: "e1", product: MOCK_PRODUCTS[4], price: 480, quantity: 1, unit: "KG", date: thisMonth(12), notes: "Fresh from Karwan Bazar", user: MOCK_USERS[0] },
  { id: "e2", product: MOCK_PRODUCTS[3], price: 70, quantity: 5, unit: "KG", date: thisMonth(12), user: MOCK_USERS[1] },
  { id: "e3", product: MOCK_PRODUCTS[0], price: 55, quantity: 2, unit: "KG", date: thisMonth(11), user: MOCK_USERS[2] },
  { id: "e4", product: MOCK_PRODUCTS[5], price: 220, quantity: 1.5, unit: "KG", date: thisMonth(11), notes: "Country chicken", user: MOCK_USERS[0] },
  { id: "e5", product: MOCK_PRODUCTS[6], price: 145, quantity: 12, unit: "PIECE", date: thisMonth(10), user: MOCK_USERS[3] },
  { id: "e6", product: MOCK_PRODUCTS[7], price: 185, quantity: 2, unit: "PIECE", date: thisMonth(10), notes: "5L bottle", user: MOCK_USERS[1] },
  { id: "e7", product: MOCK_PRODUCTS[2], price: 60, quantity: 1, unit: "KG", date: lastMonth(25), user: MOCK_USERS[2] },
  { id: "e8", product: MOCK_PRODUCTS[9], price: 110, quantity: 500, unit: "GM", date: lastMonth(22), user: MOCK_USERS[0] },
  { id: "e9", product: MOCK_PRODUCTS[1], price: 40, quantity: 3, unit: "KG", date: lastMonth(18), user: MOCK_USERS[3] },
  { id: "e10", product: MOCK_PRODUCTS[8], price: 30, quantity: 250, unit: "GM", date: lastMonth(15), notes: "Local market", user: MOCK_USERS[1] },
];

export const INITIAL_BILLS: MockBill[] = [
  { id: "b1", user: MOCK_USERS[0], category: "RENT", title: "House Rent", amount: 18000, date: thisMonth(5), notes: "Paid to landlord Alam saheb" },
  { id: "b2", user: MOCK_USERS[1], category: "WIFI", title: "Grameenphone Broadband", amount: 1200, date: thisMonth(3) },
  { id: "b3", user: MOCK_USERS[2], category: "ELECTRICITY", title: "DESCO Bill", amount: 2400, date: thisMonth(8), notes: "AC usage high" },
  { id: "b4", user: MOCK_USERS[0], category: "GAS", title: "Titas Gas Bill", amount: 950, date: thisMonth(7) },
  { id: "b5", user: MOCK_USERS[3], category: "MAID", title: "House Maid Salary", amount: 3500, date: thisMonth(1) },
  { id: "b6", user: MOCK_USERS[1], category: "MOBILE", title: "Robi Recharge", amount: 500, date: thisMonth(6) },
  { id: "b7", user: MOCK_USERS[2], category: "MEDICAL", title: "Square Hospital Visit", amount: 1800, date: lastMonth(20), notes: "Dr. Rahman consultation" },
  { id: "b8", user: MOCK_USERS[0], category: "SUBSCRIPTION", title: "Netflix Monthly", amount: 399, date: lastMonth(2) },
];

export function fmt(n: number) {
  if (n >= 100000) return `৳${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `৳${(n / 1000).toFixed(1)}K`;
  return `৳${n.toLocaleString()}`;
}

export function fmtFull(n: number) {
  return `৳${n.toLocaleString()}`;
}

export function fmtDate(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function toInputDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function initials(name: string) {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

const AVATAR_COLORS = ["#c06010", "#8b6914", "#3d7a5c", "#5a4a8a", "#7a3d3d"];

export function avatarColor(id: string) {
  return AVATAR_COLORS[id.charCodeAt(1) % AVATAR_COLORS.length];
}

export function isThisMonth(d: Date) {
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

export const BILL_META: Record<BillCategory, { label: string; icon: React.ReactNode; color: string }> = {
  RENT:           { label: "Rent",         icon: React.createElement(Home, { className: "w-4 h-4" }),         color: "#e8a020" },
  TRAVEL:         { label: "Travel",       icon: React.createElement(Car, { className: "w-4 h-4" }),           color: "#3b82f6" },
  WIFI:           { label: "Wi-Fi",        icon: React.createElement(Wifi, { className: "w-4 h-4" }),          color: "#06b6d4" },
  ELECTRICITY:    { label: "Electricity",  icon: React.createElement(Zap, { className: "w-4 h-4" }),           color: "#f59e0b" },
  GAS:            { label: "Gas",          icon: React.createElement(Flame, { className: "w-4 h-4" }),         color: "#f97316" },
  WATER:          { label: "Water",        icon: React.createElement(Droplets, { className: "w-4 h-4" }),      color: "#60a5fa" },
  MAID:           { label: "Maid",         icon: React.createElement(Sparkles, { className: "w-4 h-4" }),      color: "#a78bfa" },
  MAINTENANCE:    { label: "Maintenance",  icon: React.createElement(Wrench, { className: "w-4 h-4" }),        color: "#78716c" },
  SUBSCRIPTION:   { label: "Subscription", icon: React.createElement(CreditCard, { className: "w-4 h-4" }),   color: "#ec4899" },
  MOBILE:         { label: "Mobile",       icon: React.createElement(Smartphone, { className: "w-4 h-4" }),   color: "#34d399" },
  MEDICAL:        { label: "Medical",      icon: React.createElement(Heart, { className: "w-4 h-4" }),         color: "#f43f5e" },
  EDUCATION:      { label: "Education",    icon: React.createElement(GraduationCap, { className: "w-4 h-4" }), color: "#8b5cf6" },
  SHOPPING:       { label: "Shopping",     icon: React.createElement(ShoppingBag, { className: "w-4 h-4" }),  color: "#c06010" },
  ENTERTAINMENT:  { label: "Entertainment",icon: React.createElement(Tv, { className: "w-4 h-4" }),            color: "#6366f1" },
  LAUNDRY:        { label: "Laundry",      icon: React.createElement(Shirt, { className: "w-4 h-4" }),         color: "#14b8a6" },
  LOAN_EMI:       { label: "Loan / EMI",   icon: React.createElement(Banknote, { className: "w-4 h-4" }),     color: "#ef4444" },
  SALON_GROOMING: { label: "Salon",        icon: React.createElement(Scissors, { className: "w-4 h-4" }),     color: "#d946ef" },
  GIFTS_FESTIVALS:{ label: "Gifts",        icon: React.createElement(Gift, { className: "w-4 h-4" }),          color: "#f59e0b" },
  UTILITIES:      { label: "Utilities",    icon: React.createElement(Settings, { className: "w-4 h-4" }),      color: "#94a3b8" },
  OTHERS:         { label: "Others",       icon: React.createElement(MoreHorizontal, { className: "w-4 h-4" }),color: "#64748b" },
};

export const BILL_CATEGORIES = Object.entries(BILL_META).map(([k, v]) => ({ key: k as BillCategory, ...v }));

export function makeMockStats(groupName: string): GroupStats {
  return {
    groupName, totalMembers: 8, totalGroupBazarEntries: 134, totalMyBazarEntries: 47, totalProductsCreatedByMe: 23,
    thisMonthBazarExpense: 12840, prevMonthBazarExpense: 10950, thisYearBazarExpense: 98400, prevYearBazarExpense: 87200,
    thisMonthBillExpense: 4200, prevMonthBillExpense: 5100, thisYearBillExpense: 43600, prevYearBillExpense: 39800,
    thisMonthTotalExpense: 17040, prevMonthTotalExpense: 16050, thisYearTotalExpense: 142000, prevYearTotalExpense: 127000,
  };
}
