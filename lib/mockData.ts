import React from "react";
import { Home, Car, Wifi, Zap, Flame, Droplets, Sparkles, Wrench, CreditCard, Smartphone, Heart, GraduationCap, ShoppingBag, Tv, Shirt, Banknote, Scissors, Gift, Settings, MoreHorizontal } from "lucide-react";
import { MockUser, MockProduct, MockBazarEntry, MockBill, BillCategory, GroupStats } from "@/types";

export const MOCK_USERS: MockUser[] = [
    { id: "u1", name: "Ahmed Hassan", email: "ahmed@email.com", phone: "+880 1711 234567" },
    { id: "u2", name: "Fatima Begum", email: "fatima@email.com", phone: "+880 1812 345678" },
    { id: "u3", name: "Karim Uddin", email: "karim@email.com", phone: "+880 1913 456789" },
    { id: "u4", name: "Rahima Khatun", email: "rahima@email.com", phone: "+880 1614 567890" },
];

export const MOCK_PRODUCTS: MockProduct[] = [
    { id: "p1", name: "Onion", emoji: "🧅" },
    { id: "p2", name: "Potato", emoji: "🥔" },
    { id: "p3", name: "Tomato", emoji: "🍅" },
    { id: "p4", name: "Rice (Miniket)", emoji: "🌾" },
    { id: "p5", name: "Hilsha Fish", emoji: "🐟" },
    { id: "p6", name: "Chicken", emoji: "🍗" },
    { id: "p7", name: "Eggs", emoji: "🥚" },
    { id: "p8", name: "Soybean Oil", emoji: "🫙" },
    { id: "p9", name: "Garlic", emoji: "🧄" },
    { id: "p10", name: "Lentils (Dal)", emoji: "🫘" },
];

const now = new Date();
const thisMonth = (d: number) => new Date(now.getFullYear(), now.getMonth(), d);
const lastMonth = (d: number) => new Date(now.getFullYear(), now.getMonth() - 1, d);

export const INITIAL_ENTRIES: MockBazarEntry[] = [];

export const INITIAL_BILLS: MockBill[] = [];

export function fmt(n: number) {
    return `৳${Math.round(n).toLocaleString()}`;
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

export function initials(name?: string) {
    if (!name) return "U";
    return (
        name
            .split(" ")
            .map((w) => w[0])
            .filter(Boolean)
            .join("")
            .slice(0, 2)
            .toUpperCase() || "U"
    );
}

const AVATAR_COLORS = ["#c06010", "#8b6914", "#3d7a5c", "#5a4a8a", "#7a3d3d"];

export function avatarColor(id?: string) {
    if (!id) return AVATAR_COLORS[0];
    const charCode = id.length > 1 ? id.charCodeAt(1) : id.charCodeAt(0) || 0;
    return AVATAR_COLORS[charCode % AVATAR_COLORS.length];
}

export function isThisMonth(d: Date) {
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

export const BILL_META: Record<BillCategory, { label: string; icon: React.ReactNode; color: string }> = {
    RENT: { label: "Rent", icon: React.createElement(Home, { className: "w-5 h-5" }), color: "#e8a020" },
    TRAVEL: { label: "Travel", icon: React.createElement(Car, { className: "w-5 h-5" }), color: "#3b82f6" },
    WIFI: { label: "Wi-Fi", icon: React.createElement(Wifi, { className: "w-5 h-5" }), color: "#06b6d4" },
    ELECTRICITY: { label: "Electricity", icon: React.createElement(Zap, { className: "w-5 h-5" }), color: "#f59e0b" },
    GAS: { label: "Gas", icon: React.createElement(Flame, { className: "w-5 h-5" }), color: "#f97316" },
    WATER: { label: "Water", icon: React.createElement(Droplets, { className: "w-5 h-5" }), color: "#60a5fa" },
    MAID: { label: "Maid", icon: React.createElement(Sparkles, { className: "w-5 h-5" }), color: "#a78bfa" },
    MAINTENANCE: { label: "Maintenance", icon: React.createElement(Wrench, { className: "w-5 h-5" }), color: "#78716c" },
    SUBSCRIPTION: { label: "Subscription", icon: React.createElement(CreditCard, { className: "w-5 h-5" }), color: "#ec4899" },
    MOBILE: { label: "Mobile", icon: React.createElement(Smartphone, { className: "w-5 h-5" }), color: "#34d399" },
    MEDICAL: { label: "Medical", icon: React.createElement(Heart, { className: "w-5 h-5" }), color: "#f43f5e" },
    EDUCATION: { label: "Education", icon: React.createElement(GraduationCap, { className: "w-5 h-5" }), color: "#8b5cf6" },
    SHOPPING: { label: "Shopping", icon: React.createElement(ShoppingBag, { className: "w-5 h-5" }), color: "#c06010" },
    ENTERTAINMENT: { label: "Entertainment", icon: React.createElement(Tv, { className: "w-5 h-5" }), color: "#6366f1" },
    LAUNDRY: { label: "Laundry", icon: React.createElement(Shirt, { className: "w-5 h-5" }), color: "#14b8a6" },
    LOAN_EMI: { label: "Loan / EMI", icon: React.createElement(Banknote, { className: "w-5 h-5" }), color: "#ef4444" },
    SALON_GROOMING: { label: "Salon", icon: React.createElement(Scissors, { className: "w-5 h-5" }), color: "#d946ef" },
    GIFTS_FESTIVALS: { label: "Gifts", icon: React.createElement(Gift, { className: "w-5 h-5" }), color: "#f59e0b" },
    UTILITIES: { label: "Utilities", icon: React.createElement(Settings, { className: "w-5 h-5" }), color: "#94a3b8" },
    OTHERS: { label: "Others", icon: React.createElement(MoreHorizontal, { className: "w-5 h-5" }), color: "#64748b" },
};

export const BILL_CATEGORIES = Object.entries(BILL_META).map(([k, v]) => ({ key: k as BillCategory, ...v }));

export function makeMockStats(groupName: string): GroupStats {
    return {
        groupName,
        totalMembers: 4,
        totalGroupBazarEntries: 0,
        totalMyBazarEntries: 0,
        totalProductsCreatedByMe: 0,
        thisMonthBazarExpense: 0,
        prevMonthBazarExpense: 0,
        thisYearBazarExpense: 0,
        prevYearBazarExpense: 0,
        thisMonthBillExpense: 0,
        prevMonthBillExpense: 0,
        thisYearBillExpense: 0,
        prevYearBillExpense: 0,
        thisMonthTotalExpense: 0,
        prevMonthTotalExpense: 0,
        thisYearTotalExpense: 0,
        prevYearTotalExpense: 0,
    };
}
