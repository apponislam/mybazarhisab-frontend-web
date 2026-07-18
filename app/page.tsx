"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";
import {
  Eye, EyeOff, ShoppingBag, TrendingUp, BookOpen,
  ArrowLeft, Mail, CheckCircle, Camera, User,
  Phone, Lock, Users, Plus, LogIn, Home,
  Receipt, BarChart2, Package, ChevronUp, ChevronDown,
  Minus, Calendar, Star, Wifi, Zap, Droplets,
  Car, Gift, Heart, Smartphone, CreditCard,
  Shirt, Scissors, Wrench, Tv, Banknote,
  GraduationCap, Flame, Sparkles, MoreHorizontal,
  ChevronRight, X, AlignLeft, Hash, Weight,
  Trash2, Edit3, Bell, BellOff, Globe, MapPin,
  Shield, AlertTriangle, LogOut, Info,
  Settings, FileText,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type BazarUnit = "KG" | "PIECE" | "GM";
type BillCategory =
  | "RENT" | "TRAVEL" | "WIFI" | "ELECTRICITY" | "GAS" | "WATER"
  | "MAID" | "MAINTENANCE" | "SUBSCRIPTION" | "MOBILE" | "MEDICAL"
  | "EDUCATION" | "SHOPPING" | "ENTERTAINMENT" | "LAUNDRY" | "LOAN_EMI"
  | "SALON_GROOMING" | "GIFTS_FESTIVALS" | "UTILITIES" | "OTHERS";

interface MockUser { id: string; name: string; email: string; phone: string; }
interface MockProduct { id: string; name: string; emoji: string; }

interface MockBazarEntry {
  id: string; product: MockProduct; price: number;
  quantity: number; unit: BazarUnit; date: Date;
  notes?: string; user: MockUser;
}
interface MockBill {
  id: string; user: MockUser; category: BillCategory;
  title: string; amount: number; date: Date; notes?: string;
}

type AppTab = "home" | "expenses" | "bills" | "profile";
type AppSubScreen =
  | null | "add-picker" | "add-expense" | "add-bill"
  | "expense-detail" | "expense-edit"
  | "bill-detail" | "bill-edit"
  | "profile-edit" | "profile-change-password";

interface GroupStats {
  groupName: string; totalMembers: number; totalGroupBazarEntries: number;
  totalMyBazarEntries: number; totalProductsCreatedByMe: number;
  thisMonthBazarExpense: number; prevMonthBazarExpense: number;
  thisYearBazarExpense: number; prevYearBazarExpense: number;
  thisMonthBillExpense: number; prevMonthBillExpense: number;
  thisYearBillExpense: number; prevYearBillExpense: number;
  thisMonthTotalExpense: number; prevMonthTotalExpense: number;
  thisYearTotalExpense: number; prevYearTotalExpense: number;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_USERS: MockUser[] = [
  { id: "u1", name: "Ahmed Hassan", email: "ahmed@email.com", phone: "+880 1711 234567" },
  { id: "u2", name: "Fatima Begum", email: "fatima@email.com", phone: "+880 1812 345678" },
  { id: "u3", name: "Karim Uddin", email: "karim@email.com", phone: "+880 1913 456789" },
  { id: "u4", name: "Rahima Khatun", email: "rahima@email.com", phone: "+880 1614 567890" },
];
const MOCK_PRODUCTS: MockProduct[] = [
  { id: "p1", name: "Onion", emoji: "🧅" }, { id: "p2", name: "Potato", emoji: "🥔" },
  { id: "p3", name: "Tomato", emoji: "🍅" }, { id: "p4", name: "Rice (Miniket)", emoji: "🌾" },
  { id: "p5", name: "Hilsha Fish", emoji: "🐟" }, { id: "p6", name: "Chicken", emoji: "🍗" },
  { id: "p7", name: "Eggs", emoji: "🥚" }, { id: "p8", name: "Soybean Oil", emoji: "🫙" },
  { id: "p9", name: "Garlic", emoji: "🧄" }, { id: "p10", name: "Lentils (Dal)", emoji: "🫘" },
];

const now = new Date();
const thisMonth = (d: number) => new Date(now.getFullYear(), now.getMonth(), d);
const lastMonth = (d: number) => new Date(now.getFullYear(), now.getMonth() - 1, d);

const INITIAL_ENTRIES: MockBazarEntry[] = [
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

const INITIAL_BILLS: MockBill[] = [
  { id: "b1", user: MOCK_USERS[0], category: "RENT", title: "House Rent", amount: 18000, date: thisMonth(5), notes: "Paid to landlord Alam saheb" },
  { id: "b2", user: MOCK_USERS[1], category: "WIFI", title: "Grameenphone Broadband", amount: 1200, date: thisMonth(3) },
  { id: "b3", user: MOCK_USERS[2], category: "ELECTRICITY", title: "DESCO Bill", amount: 2400, date: thisMonth(8), notes: "AC usage high" },
  { id: "b4", user: MOCK_USERS[0], category: "GAS", title: "Titas Gas Bill", amount: 950, date: thisMonth(7) },
  { id: "b5", user: MOCK_USERS[3], category: "MAID", title: "House Maid Salary", amount: 3500, date: thisMonth(1) },
  { id: "b6", user: MOCK_USERS[1], category: "MOBILE", title: "Robi Recharge", amount: 500, date: thisMonth(6) },
  { id: "b7", user: MOCK_USERS[2], category: "MEDICAL", title: "Square Hospital Visit", amount: 1800, date: lastMonth(20), notes: "Dr. Rahman consultation" },
  { id: "b8", user: MOCK_USERS[0], category: "SUBSCRIPTION", title: "Netflix Monthly", amount: 399, date: lastMonth(2) },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  if (n >= 100000) return `৳${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `৳${(n / 1000).toFixed(1)}K`;
  return `৳${n.toLocaleString()}`;
}
function fmtFull(n: number) { return `৳${n.toLocaleString()}`; }
function fmtDate(d: Date) { return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); }
function toInputDate(d: Date) { return d.toISOString().slice(0, 10); }
function initials(name: string) { return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase(); }
const AVATAR_COLORS = ["#c06010", "#8b6914", "#3d7a5c", "#5a4a8a", "#7a3d3d"];
function avatarColor(id: string) { return AVATAR_COLORS[id.charCodeAt(1) % AVATAR_COLORS.length]; }
function isThisMonth(d: Date) { return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); }

function Avatar({ user, size = 36 }: { user: MockUser; size?: number }) {
  return (
    <div className="rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-white"
      style={{ width: size, height: size, background: avatarColor(user.id), fontSize: size * 0.36 }}>
      {initials(user.name)}
    </div>
  );
}

const BILL_META: Record<BillCategory, { label: string; icon: React.ReactNode; color: string }> = {
  RENT:           { label: "Rent",         icon: <Home className="w-4 h-4" />,         color: "#e8a020" },
  TRAVEL:         { label: "Travel",       icon: <Car className="w-4 h-4" />,           color: "#3b82f6" },
  WIFI:           { label: "Wi-Fi",        icon: <Wifi className="w-4 h-4" />,          color: "#06b6d4" },
  ELECTRICITY:    { label: "Electricity",  icon: <Zap className="w-4 h-4" />,           color: "#f59e0b" },
  GAS:            { label: "Gas",          icon: <Flame className="w-4 h-4" />,         color: "#f97316" },
  WATER:          { label: "Water",        icon: <Droplets className="w-4 h-4" />,      color: "#60a5fa" },
  MAID:           { label: "Maid",         icon: <Sparkles className="w-4 h-4" />,      color: "#a78bfa" },
  MAINTENANCE:    { label: "Maintenance",  icon: <Wrench className="w-4 h-4" />,        color: "#78716c" },
  SUBSCRIPTION:   { label: "Subscription", icon: <CreditCard className="w-4 h-4" />,   color: "#ec4899" },
  MOBILE:         { label: "Mobile",       icon: <Smartphone className="w-4 h-4" />,   color: "#34d399" },
  MEDICAL:        { label: "Medical",      icon: <Heart className="w-4 h-4" />,         color: "#f43f5e" },
  EDUCATION:      { label: "Education",    icon: <GraduationCap className="w-4 h-4" />, color: "#8b5cf6" },
  SHOPPING:       { label: "Shopping",     icon: <ShoppingBag className="w-4 h-4" />,  color: "#c06010" },
  ENTERTAINMENT:  { label: "Entertainment",icon: <Tv className="w-4 h-4" />,            color: "#6366f1" },
  LAUNDRY:        { label: "Laundry",      icon: <Shirt className="w-4 h-4" />,         color: "#14b8a6" },
  LOAN_EMI:       { label: "Loan / EMI",   icon: <Banknote className="w-4 h-4" />,     color: "#ef4444" },
  SALON_GROOMING: { label: "Salon",        icon: <Scissors className="w-4 h-4" />,     color: "#d946ef" },
  GIFTS_FESTIVALS:{ label: "Gifts",        icon: <Gift className="w-4 h-4" />,          color: "#f59e0b" },
  UTILITIES:      { label: "Utilities",    icon: <Settings className="w-4 h-4" />,      color: "#94a3b8" },
  OTHERS:         { label: "Others",       icon: <MoreHorizontal className="w-4 h-4" />,color: "#64748b" },
};
const BILL_CATEGORIES = Object.entries(BILL_META).map(([k, v]) => ({ key: k as BillCategory, ...v }));

// ─── Shared UI ────────────────────────────────────────────────────────────────

const BG_DOTS = (
  <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
    style={{ backgroundImage: "radial-gradient(circle, #e8a020 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
);
const TOP_LINE = <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />;

function ScreenShell({ children, scrollable }: { children: React.ReactNode; scrollable?: boolean }) {
  return (
    <div className="relative size-full flex flex-col overflow-hidden bg-background">
      {TOP_LINE}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(232,160,32,0.12) 0%, transparent 70%)" }} />
      {BG_DOTS}
      <div className={`relative flex flex-col flex-1 min-h-0 ${scrollable ? "overflow-y-auto" : "overflow-hidden"}`}>
        {children}
      </div>
    </div>
  );
}

function SpinnerIcon() {
  return (
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="31.4" strokeDashoffset="10" />
    </svg>
  );
}

function PrimaryButton({ loading, label, loadingLabel, type = "submit", onClick, disabled }: {
  loading?: boolean; label: string; loadingLabel?: string; type?: "submit" | "button"; onClick?: () => void; disabled?: boolean;
}) {
  return (
    <motion.button type={type} onClick={onClick} disabled={loading || disabled} whileTap={{ scale: 0.97 }}
      className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-base transition-all hover:bg-accent disabled:opacity-50"
      style={{ fontFamily: "'DM Sans', sans-serif", boxShadow: "0 4px 20px rgba(232,160,32,0.3)" }}>
      {loading ? <span className="flex items-center justify-center gap-2"><SpinnerIcon />{loadingLabel ?? "Please wait…"}</span> : label}
    </motion.button>
  );
}

function BackButton({ onBack, label = "Back" }: { onBack: () => void; label?: string }) {
  return (
    <button type="button" onClick={onBack}
      className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm mb-5"
      style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <ArrowLeft className="w-4 h-4" /> {label}
    </button>
  );
}

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="transition-all duration-300 rounded-full"
          style={{ width: i === current ? 20 : 6, height: 6, background: i <= current ? "#e8a020" : "rgba(232,160,32,0.2)" }} />
      ))}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mt-1">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>{children}</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

function FieldBox({ label, focused, error, children }: { label: string; focused: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground/80" style={{ fontFamily: "'DM Sans', sans-serif" }}>{label}</label>
      <div className="rounded-xl border transition-all duration-200"
        style={{ borderColor: error ? "rgba(212,24,61,0.6)" : focused ? "rgba(232,160,32,0.7)" : "rgba(232,160,32,0.18)", background: "#2e1a0a", boxShadow: error ? "0 0 0 3px rgba(212,24,61,0.08)" : focused ? "0 0 0 3px rgba(232,160,32,0.12)" : "none" }}>
        {children}
      </div>
      {error && <p className="text-xs text-destructive" style={{ fontFamily: "'DM Sans', sans-serif" }}>{error}</p>}
    </div>
  );
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle}
      className="w-12 h-6 rounded-full transition-all duration-300 flex items-center relative flex-shrink-0"
      style={{ background: on ? "#e8a020" : "rgba(232,160,32,0.2)" }}>
      <div className="w-5 h-5 rounded-full bg-white shadow-md absolute transition-all duration-300"
        style={{ left: on ? "calc(100% - 22px)" : "2px" }} />
    </button>
  );
}

function SettingsRow({ icon, label, sub, right, onClick, danger }: {
  icon: React.ReactNode; label: string; sub?: string; right?: React.ReactNode; onClick?: () => void; danger?: boolean;
}) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag type={onClick ? "button" : undefined} onClick={onClick}
      className={`w-full flex items-center gap-3 p-4 text-left transition-all ${onClick ? "hover:bg-primary/5 active:bg-primary/10" : ""}`}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: danger ? "rgba(212,24,61,0.12)" : "rgba(232,160,32,0.1)", color: danger ? "#d4183d" : "#e8a020" }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium" style={{ fontFamily: "'DM Sans', sans-serif", color: danger ? "#d4183d" : undefined }}>{label}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5 truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>{sub}</p>}
      </div>
      {right ?? (onClick && !danger && <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />)}
    </Tag>
  );
}

function FilterTabs({ active, onChange }: { active: "month" | "all"; onChange: (v: "month" | "all") => void }) {
  return (
    <div className="flex gap-2 mx-6 mb-4 p-1 rounded-xl border border-border bg-card" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
      {(["month", "all"] as const).map(tab => (
        <button key={tab} type="button" onClick={() => onChange(tab)}
          className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            background: active === tab ? "#e8a020" : "transparent",
            color: active === tab ? "#1a0e07" : "#a08060",
            boxShadow: active === tab ? "0 2px 8px rgba(232,160,32,0.3)" : "none",
          }}>
          {tab === "month" ? "This Month" : "All"}
        </button>
      ))}
    </div>
  );
}

function DeleteConfirm({ label, onConfirm, onCancel }: { label: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="mt-4 rounded-2xl border border-destructive/40 p-5"
      style={{ background: "rgba(212,24,61,0.06)" }}>
      <div className="flex items-start gap-3 mb-4">
        <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-destructive" style={{ fontFamily: "'DM Sans', sans-serif" }}>Delete {label}?</p>
          <p className="text-xs text-muted-foreground mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>This action cannot be undone.</p>
        </div>
      </div>
      <div className="flex gap-3">
        <button type="button" onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl border border-border text-foreground text-sm font-medium transition-all hover:bg-secondary"
          style={{ fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
        <button type="button" onClick={onConfirm}
          className="flex-1 py-2.5 rounded-xl bg-destructive text-white text-sm font-semibold transition-all hover:opacity-90"
          style={{ fontFamily: "'DM Sans', sans-serif" }}>Delete</button>
      </div>
    </motion.div>
  );
}

// ─── Bottom Nav ───────────────────────────────────────────────────────────────

function BottomNav({ tab, onTab, onAdd }: { tab: AppTab; onTab: (t: AppTab) => void; onAdd: () => void }) {
  const tabs: { id: AppTab; icon: React.ReactNode; label: string }[] = [
    { id: "home",     icon: <Home className="w-5 h-5" strokeWidth={1.8} />,     label: "Home" },
    { id: "expenses", icon: <ShoppingBag className="w-5 h-5" strokeWidth={1.8} />, label: "Expenses" },
    { id: "bills",    icon: <Receipt className="w-5 h-5" strokeWidth={1.8} />,   label: "Bills" },
    { id: "profile",  icon: <User className="w-5 h-5" strokeWidth={1.8} />,      label: "Profile" },
  ];
  return (
    <div className="relative flex items-end bg-card border-t border-border px-2 pb-2 pt-1 flex-shrink-0"
      style={{ boxShadow: "0 -4px 24px rgba(0,0,0,0.4)" }}>
      {tabs.slice(0, 2).map(t => (
        <button key={t.id} onClick={() => onTab(t.id)}
          className="flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl transition-all"
          style={{ color: tab === t.id ? "#e8a020" : "#a08060" }}>
          {t.icon}
          <span className="text-[10px] font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>{t.label}</span>
          {tab === t.id && <div className="w-1 h-1 rounded-full bg-primary" />}
        </button>
      ))}
      <div className="flex-1 flex flex-col items-center pb-1">
        <motion.button onClick={onAdd} whileTap={{ scale: 0.9 }}
          className="w-14 h-14 rounded-full bg-primary flex items-center justify-center -mt-6 shadow-xl"
          style={{ boxShadow: "0 4px 20px rgba(232,160,32,0.5)" }}>
          <Plus className="w-7 h-7 text-primary-foreground" strokeWidth={2.5} />
        </motion.button>
        <span className="text-[10px] font-medium mt-1" style={{ fontFamily: "'DM Sans', sans-serif", color: "#a08060" }}>Add</span>
      </div>
      {tabs.slice(2).map(t => (
        <button key={t.id} onClick={() => onTab(t.id)}
          className="flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl transition-all"
          style={{ color: tab === t.id ? "#e8a020" : "#a08060" }}>
          {t.icon}
          <span className="text-[10px] font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>{t.label}</span>
          {tab === t.id && <div className="w-1 h-1 rounded-full bg-primary" />}
        </button>
      ))}
    </div>
  );
}

// ─── Home Tab ─────────────────────────────────────────────────────────────────

function Delta({ current, prev }: { current: number; prev: number }) {
  if (prev === 0) return null;
  const pct = Math.round(((current - prev) / prev) * 100);
  const up = pct >= 0;
  return (
    <span className="flex items-center gap-0.5 text-xs font-medium"
      style={{ color: up ? "#22c55e" : "#ef4444", fontFamily: "'DM Mono', monospace" }}>
      {up ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}{Math.abs(pct)}%
    </span>
  );
}

function StatCard({ label, value, prev, icon, delay = 0, accent = false }: { label: string; value: number; prev?: number; icon: React.ReactNode; delay?: number; accent?: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-border bg-card p-4 flex flex-col gap-2" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.35)" }}>
      <div className="flex items-center justify-between">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${accent ? "bg-accent/20 border border-accent/30" : "bg-primary/12 border border-primary/25"}`}>{icon}</div>
        {prev !== undefined && <Delta current={value} prev={prev} />}
      </div>
      <p className="text-2xl font-bold text-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>{fmt(value)}</p>
      <p className="text-xs text-muted-foreground leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>{label}</p>
    </motion.div>
  );
}

function CountCard({ label, value, icon, delay = 0 }: { label: string; value: number; icon: React.ReactNode; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.35)" }}>
      <div className="w-10 h-10 rounded-xl bg-primary/12 border border-primary/25 flex items-center justify-center flex-shrink-0">{icon}</div>
      <div>
        <p className="text-xl font-bold text-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>{value.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>{label}</p>
      </div>
    </motion.div>
  );
}

function HomeTab({ stats }: { stats: GroupStats }) {
  const mn = now.toLocaleString("default", { month: "long" }), yr = now.getFullYear();
  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
      <div className="flex items-center gap-3 px-6 pt-12 pb-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-foreground truncate" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>{stats.groupName}</h1>
          <p className="text-muted-foreground text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>Hisab Overview</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10">
          <Star className="w-3 h-3 text-primary" strokeWidth={2} />
          <span className="text-primary text-xs font-semibold" style={{ fontFamily: "'DM Mono', monospace" }}>{stats.totalMembers} members</span>
        </div>
      </div>
      <div className="mx-6 h-px bg-border mb-1" />
      <div className="flex flex-col px-6 pb-6 gap-4">
        <SectionLabel>Overview</SectionLabel>
        <div className="grid grid-cols-2 gap-3">
          <CountCard label="Group Bazar Entries" value={stats.totalGroupBazarEntries} icon={<ShoppingBag className="w-5 h-5 text-primary" strokeWidth={1.8} />} delay={0.05} />
          <CountCard label="My Bazar Entries" value={stats.totalMyBazarEntries} icon={<BookOpen className="w-5 h-5 text-primary" strokeWidth={1.8} />} delay={0.1} />
        </div>
        <CountCard label="Products Created by Me" value={stats.totalProductsCreatedByMe} icon={<Package className="w-5 h-5 text-primary" strokeWidth={1.8} />} delay={0.15} />
        <SectionLabel>Bazar Expense</SectionLabel>
        <div className="grid grid-cols-2 gap-3">
          <StatCard label={`${mn} Bazar`} value={stats.thisMonthBazarExpense} prev={stats.prevMonthBazarExpense} icon={<ShoppingBag className="w-4 h-4 text-primary" strokeWidth={1.8} />} delay={0.2} />
          <StatCard label="Prev Month" value={stats.prevMonthBazarExpense} icon={<ShoppingBag className="w-4 h-4 text-muted-foreground" strokeWidth={1.8} />} delay={0.25} />
          <StatCard label={`${yr} Bazar`} value={stats.thisYearBazarExpense} prev={stats.prevYearBazarExpense} icon={<Calendar className="w-4 h-4 text-primary" strokeWidth={1.8} />} delay={0.3} />
          <StatCard label={`${yr - 1} Bazar`} value={stats.prevYearBazarExpense} icon={<Calendar className="w-4 h-4 text-muted-foreground" strokeWidth={1.8} />} delay={0.35} />
        </div>
        <SectionLabel>Bill Expense</SectionLabel>
        <div className="grid grid-cols-2 gap-3">
          <StatCard label={`${mn} Bills`} value={stats.thisMonthBillExpense} prev={stats.prevMonthBillExpense} icon={<Receipt className="w-4 h-4 text-accent" strokeWidth={1.8} />} delay={0.38} accent />
          <StatCard label="Prev Month" value={stats.prevMonthBillExpense} icon={<Receipt className="w-4 h-4 text-muted-foreground" strokeWidth={1.8} />} delay={0.41} accent />
          <StatCard label={`${yr} Bills`} value={stats.thisYearBillExpense} prev={stats.prevYearBillExpense} icon={<BarChart2 className="w-4 h-4 text-accent" strokeWidth={1.8} />} delay={0.44} accent />
          <StatCard label={`${yr - 1} Bills`} value={stats.prevYearBillExpense} icon={<BarChart2 className="w-4 h-4 text-muted-foreground" strokeWidth={1.8} />} delay={0.47} accent />
        </div>
        <SectionLabel>Total Expense</SectionLabel>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="rounded-2xl border border-primary/40 p-5 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(232,160,32,0.14) 0%, rgba(192,96,16,0.08) 100%)", boxShadow: "0 4px 24px rgba(232,160,32,0.15)" }}>
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-primary/5 -translate-y-8 translate-x-8 pointer-events-none" />
          <p className="text-xs text-muted-foreground mb-1 uppercase tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>{mn} {yr} — Total</p>
          <p className="text-4xl font-bold text-primary mb-2" style={{ fontFamily: "'DM Mono', monospace" }}>{fmt(stats.thisMonthTotalExpense)}</p>
          <div className="flex items-center gap-2">
            <Delta current={stats.thisMonthTotalExpense} prev={stats.prevMonthTotalExpense} />
            <span className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>vs {fmt(stats.prevMonthTotalExpense)} last month</span>
          </div>
        </motion.div>
        <div className="grid grid-cols-2 gap-3">
          <StatCard label={`${yr} Grand Total`} value={stats.thisYearTotalExpense} prev={stats.prevYearTotalExpense} icon={<TrendingUp className="w-4 h-4 text-primary" strokeWidth={1.8} />} delay={0.54} />
          <StatCard label={`${yr - 1} Grand Total`} value={stats.prevYearTotalExpense} icon={<Minus className="w-4 h-4 text-muted-foreground" strokeWidth={1.8} />} delay={0.58} />
        </div>
      </div>
    </div>
  );
}

// ─── Expenses Tab ─────────────────────────────────────────────────────────────

function ExpenseRow({ entry, onClick }: { entry: MockBazarEntry; onClick: () => void }) {
  const total = entry.price * entry.quantity;
  return (
    <motion.button type="button" onClick={onClick} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
      className="w-full flex items-center gap-3 p-4 rounded-2xl border border-border bg-card hover:border-primary/40 transition-all text-left"
      style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>
      <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 text-2xl">{entry.product.emoji}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>{entry.product.name}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <Avatar user={entry.user} size={16} />
          <p className="text-xs text-muted-foreground truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>{entry.user.name}</p>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5" style={{ fontFamily: "'DM Mono', monospace" }}>{entry.quantity} {entry.unit} · {fmtDate(entry.date)}</p>
      </div>
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <p className="text-sm font-bold text-primary" style={{ fontFamily: "'DM Mono', monospace" }}>{fmtFull(total)}</p>
        <p className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>৳{entry.price}/{entry.unit}</p>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
      </div>
    </motion.button>
  );
}

function ExpensesTab({ entries, onDetail }: { entries: MockBazarEntry[]; onDetail: (e: MockBazarEntry) => void }) {
  const [filter, setFilter] = useState<"month" | "all">("month");
  const filtered = filter === "month" ? entries.filter(e => isThisMonth(e.date)) : entries;
  const total = filtered.reduce((s, e) => s + e.price * e.quantity, 0);
  const mn = now.toLocaleString("default", { month: "long" });
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="px-6 pt-12 pb-4">
        <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>Bazar <span className="text-primary">Expenses</span></h2>
        <p className="text-xs text-muted-foreground mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {filtered.length} entries · <span className="text-primary font-semibold" style={{ fontFamily: "'DM Mono', monospace" }}>{fmtFull(total)}</span>
          {filter === "month" && <span className="text-muted-foreground"> in {mn}</span>}
        </p>
      </div>
      <FilterTabs active={filter} onChange={setFilter} />
      <div className="flex-1 overflow-y-auto px-6 pb-4 flex flex-col gap-3">
        {filtered.length === 0
          ? <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
              <div className="text-4xl mb-3">🛒</div>
              <p className="text-muted-foreground text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>No expenses this month</p>
            </div>
          : filtered.map((e, i) => (
              <motion.div key={e.id} transition={{ delay: i * 0.04 }}>
                <ExpenseRow entry={e} onClick={() => onDetail(e)} />
              </motion.div>
            ))
        }
      </div>
    </div>
  );
}

// ─── Expense Detail ───────────────────────────────────────────────────────────

function ExpenseDetailScreen({ entry, onBack, onEdit, onDelete }: {
  entry: MockBazarEntry; onBack: () => void; onEdit: () => void; onDelete: () => void;
}) {
  const total = entry.price * entry.quantity;
  const [confirmDelete, setConfirmDelete] = useState(false);
  return (
    <ScreenShell scrollable>
      <div className="flex flex-col px-6 pt-12 pb-8">
        <div className="flex items-center justify-between mb-6">
          <button type="button" onClick={onBack}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <ArrowLeft className="w-4 h-4" /> Expenses
          </button>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/40 text-primary text-sm font-medium hover:bg-primary/10 transition-all"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
            <button type="button" onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-destructive/40 text-destructive text-sm font-medium hover:bg-destructive/10 transition-all"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-primary/40 p-6 mb-5 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(232,160,32,0.14) 0%, rgba(192,96,16,0.06) 100%)", boxShadow: "0 4px 24px rgba(232,160,32,0.15)" }}>
          <div className="text-5xl mb-3">{entry.product.emoji}</div>
          <h2 className="text-2xl font-bold text-foreground mb-1" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>{entry.product.name}</h2>
          <p className="text-4xl font-bold text-primary" style={{ fontFamily: "'DM Mono', monospace" }}>{fmtFull(total)}</p>
          <p className="text-xs text-muted-foreground mt-1" style={{ fontFamily: "'DM Mono', monospace" }}>৳{entry.price} × {entry.quantity} {entry.unit}</p>
        </motion.div>

        <div className="flex flex-col gap-3">
          {[
            { icon: <Weight className="w-4 h-4 text-primary" />, label: "Quantity", value: `${entry.quantity} ${entry.unit}` },
            { icon: <Hash className="w-4 h-4 text-primary" />, label: "Unit Price", value: `৳${entry.price} / ${entry.unit}` },
            { icon: <Calendar className="w-4 h-4 text-primary" />, label: "Date", value: fmtDate(entry.date) },
          ].map((row, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.06 }}
              className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
              <div className="w-8 h-8 rounded-lg bg-primary/12 border border-primary/25 flex items-center justify-center">{row.icon}</div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>{row.label}</p>
                <p className="text-sm font-semibold text-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>{row.value}</p>
              </div>
            </motion.div>
          ))}

          <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.28 }}
            className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
            <Avatar user={entry.user} size={36} />
            <div>
              <p className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>Added by</p>
              <p className="text-sm font-semibold text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>{entry.user.name}</p>
              <p className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>{entry.user.phone}</p>
            </div>
          </motion.div>

          {entry.notes && (
            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.34 }}
              className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
              <div className="w-8 h-8 rounded-lg bg-primary/12 border border-primary/25 flex items-center justify-center mt-0.5"><AlignLeft className="w-4 h-4 text-primary" /></div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>Notes</p>
                <p className="text-sm text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>{entry.notes}</p>
              </div>
            </motion.div>
          )}

          {confirmDelete && (
            <DeleteConfirm label="Expense" onConfirm={onDelete} onCancel={() => setConfirmDelete(false)} />
          )}
        </div>
      </div>
    </ScreenShell>
  );
}

// ─── Expense Edit ─────────────────────────────────────────────────────────────

function ExpenseEditScreen({ entry, onBack, onSave }: {
  entry: MockBazarEntry; onBack: () => void; onSave: (updated: MockBazarEntry) => void;
}) {
  const [price, setPrice] = useState(String(entry.price));
  const [quantity, setQuantity] = useState(String(entry.quantity));
  const [unit, setUnit] = useState<BazarUnit>(entry.unit);
  const [date, setDate] = useState(toInputDate(entry.date));
  const [notes, setNotes] = useState(entry.notes ?? "");
  const [loading, setLoading] = useState(false);
  const [fPrice, setFPrice] = useState(false);
  const [fQty, setFQty] = useState(false);
  const [fNotes, setFNotes] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSave({ ...entry, price: Number(price), quantity: Number(quantity), unit, date: new Date(date), notes: notes || undefined });
    }, 1200);
  };

  return (
    <ScreenShell scrollable>
      <div className="flex flex-col px-6 pt-12 pb-8">
        <BackButton onBack={onBack} label="Cancel" />
        <div className="flex items-center gap-3 mb-7">
          <div className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center shadow-md shadow-primary/30">
            <Edit3 className="w-5 h-5 text-primary-foreground" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>Edit Expense</h2>
            <p className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>{entry.product.emoji} {entry.product.name}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <FieldBox label="Price (৳)" focused={fPrice}>
              <div className="flex items-center" onFocus={() => setFPrice(true)} onBlur={() => setFPrice(false)}>
                <span className="pl-4 text-muted-foreground text-sm font-bold">৳</span>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)} required
                  className="flex-1 px-3 py-3.5 bg-transparent text-foreground text-sm outline-none" style={{ fontFamily: "'DM Sans', sans-serif" }} />
              </div>
            </FieldBox>
            <FieldBox label="Quantity" focused={fQty}>
              <div className="flex items-center" onFocus={() => setFQty(true)} onBlur={() => setFQty(false)}>
                <span className="pl-4 text-muted-foreground"><Weight className="w-4 h-4" /></span>
                <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} required
                  className="flex-1 px-3 py-3.5 bg-transparent text-foreground text-sm outline-none" style={{ fontFamily: "'DM Sans', sans-serif" }} />
              </div>
            </FieldBox>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground/80" style={{ fontFamily: "'DM Sans', sans-serif" }}>Unit</label>
            <div className="flex gap-2">
              {(["KG", "PIECE", "GM"] as BazarUnit[]).map(u => (
                <button key={u} type="button" onClick={() => setUnit(u)}
                  className="flex-1 py-3 rounded-xl border text-sm font-semibold transition-all"
                  style={{ borderColor: unit === u ? "rgba(232,160,32,0.8)" : "rgba(232,160,32,0.18)", background: unit === u ? "rgba(232,160,32,0.15)" : "#2e1a0a", color: unit === u ? "#e8a020" : "#a08060", fontFamily: "'DM Mono', monospace" }}>
                  {u}
                </button>
              ))}
            </div>
          </div>
          <FieldBox label="Date" focused={false}>
            <div className="flex items-center">
              <span className="pl-4 text-muted-foreground"><Calendar className="w-4 h-4" /></span>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="flex-1 px-3 py-3.5 bg-transparent text-foreground text-sm outline-none" style={{ fontFamily: "'DM Sans', sans-serif", colorScheme: "dark" }} />
            </div>
          </FieldBox>
          <FieldBox label="Notes (optional)" focused={fNotes}>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} onFocus={() => setFNotes(true)} onBlur={() => setFNotes(false)} rows={3}
              className="w-full px-4 py-3.5 bg-transparent text-foreground placeholder-muted-foreground text-sm outline-none resize-none" style={{ fontFamily: "'DM Sans', sans-serif" }} />
          </FieldBox>
          <div className="mt-2"><PrimaryButton loading={loading} label="Save Changes" loadingLabel="Saving…" /></div>
        </form>
      </div>
    </ScreenShell>
  );
}

// ─── Bills Tab ────────────────────────────────────────────────────────────────

function BillRow({ bill, onClick }: { bill: MockBill; onClick: () => void }) {
  const meta = BILL_META[bill.category];
  return (
    <motion.button type="button" onClick={onClick} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
      className="w-full flex items-center gap-3 p-4 rounded-2xl border border-border bg-card hover:border-primary/40 transition-all text-left"
      style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border"
        style={{ background: `${meta.color}20`, borderColor: `${meta.color}40`, color: meta.color }}>{meta.icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>{bill.title}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <Avatar user={bill.user} size={16} />
          <p className="text-xs text-muted-foreground truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>{bill.user.name}</p>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs px-1.5 py-0.5 rounded-md font-medium" style={{ background: `${meta.color}18`, color: meta.color, fontFamily: "'DM Mono', monospace" }}>{meta.label}</span>
          <span className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>{fmtDate(bill.date)}</span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <p className="text-sm font-bold text-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>{fmtFull(bill.amount)}</p>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
      </div>
    </motion.button>
  );
}

function BillsTab({ bills, onDetail }: { bills: MockBill[]; onDetail: (b: MockBill) => void }) {
  const [filter, setFilter] = useState<"month" | "all">("month");
  const filtered = filter === "month" ? bills.filter(b => isThisMonth(b.date)) : bills;
  const total = filtered.reduce((s, b) => s + b.amount, 0);
  const mn = now.toLocaleString("default", { month: "long" });
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="px-6 pt-12 pb-4">
        <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>Monthly <span className="text-primary">Bills</span></h2>
        <p className="text-xs text-muted-foreground mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {filtered.length} bills · <span className="text-primary font-semibold" style={{ fontFamily: "'DM Mono', monospace" }}>{fmtFull(total)}</span>
          {filter === "month" && <span className="text-muted-foreground"> in {mn}</span>}
        </p>
      </div>
      <FilterTabs active={filter} onChange={setFilter} />
      <div className="flex-1 overflow-y-auto px-6 pb-4 flex flex-col gap-3">
        {filtered.length === 0
          ? <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
              <div className="text-4xl mb-3">🧾</div>
              <p className="text-muted-foreground text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>No bills this month</p>
            </div>
          : filtered.map((b, i) => (
              <motion.div key={b.id} transition={{ delay: i * 0.04 }}>
                <BillRow bill={b} onClick={() => onDetail(b)} />
              </motion.div>
            ))
        }
      </div>
    </div>
  );
}

// ─── Bill Detail ──────────────────────────────────────────────────────────────

function BillDetailScreen({ bill, onBack, onEdit, onDelete }: {
  bill: MockBill; onBack: () => void; onEdit: () => void; onDelete: () => void;
}) {
  const meta = BILL_META[bill.category];
  const [confirmDelete, setConfirmDelete] = useState(false);
  return (
    <ScreenShell scrollable>
      <div className="flex flex-col px-6 pt-12 pb-8">
        <div className="flex items-center justify-between mb-6">
          <button type="button" onClick={onBack}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <ArrowLeft className="w-4 h-4" /> Bills
          </button>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/40 text-primary text-sm font-medium hover:bg-primary/10 transition-all"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
            <button type="button" onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-destructive/40 text-destructive text-sm font-medium hover:bg-destructive/10 transition-all"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border p-6 mb-5 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${meta.color}18 0%, ${meta.color}06 100%)`, borderColor: `${meta.color}40`, boxShadow: `0 4px 24px ${meta.color}25` }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 border"
            style={{ background: `${meta.color}25`, borderColor: `${meta.color}50`, color: meta.color }}>
            <span className="scale-150">{meta.icon}</span>
          </div>
          <span className="text-xs px-2 py-1 rounded-lg font-semibold mb-2 inline-block"
            style={{ background: `${meta.color}20`, color: meta.color, fontFamily: "'DM Mono', monospace" }}>{meta.label}</span>
          <h2 className="text-xl font-bold text-foreground mb-2" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>{bill.title}</h2>
          <p className="text-4xl font-bold" style={{ fontFamily: "'DM Mono', monospace", color: meta.color }}>{fmtFull(bill.amount)}</p>
        </motion.div>

        <div className="flex flex-col gap-3">
          {[
            { icon: <Calendar className="w-4 h-4 text-primary" />, label: "Date", value: fmtDate(bill.date) },
            { icon: <CreditCard className="w-4 h-4 text-primary" />, label: "Category", value: meta.label },
          ].map((row, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.06 }}
              className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
              <div className="w-8 h-8 rounded-lg bg-primary/12 border border-primary/25 flex items-center justify-center">{row.icon}</div>
              <div>
                <p className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>{row.label}</p>
                <p className="text-sm font-semibold text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>{row.value}</p>
              </div>
            </motion.div>
          ))}

          <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.22 }}
            className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
            <Avatar user={bill.user} size={36} />
            <div>
              <p className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>Paid by</p>
              <p className="text-sm font-semibold text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>{bill.user.name}</p>
              <p className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>{bill.user.phone}</p>
            </div>
          </motion.div>

          {bill.notes && (
            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.28 }}
              className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
              <div className="w-8 h-8 rounded-lg bg-primary/12 border border-primary/25 flex items-center justify-center mt-0.5"><AlignLeft className="w-4 h-4 text-primary" /></div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>Notes</p>
                <p className="text-sm text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>{bill.notes}</p>
              </div>
            </motion.div>
          )}

          {confirmDelete && (
            <DeleteConfirm label="Bill" onConfirm={onDelete} onCancel={() => setConfirmDelete(false)} />
          )}
        </div>
      </div>
    </ScreenShell>
  );
}

// ─── Bill Edit ────────────────────────────────────────────────────────────────

function BillEditScreen({ bill, onBack, onSave }: {
  bill: MockBill; onBack: () => void; onSave: (updated: MockBill) => void;
}) {
  const [category, setCategory] = useState<BillCategory>(bill.category);
  const [title, setTitle] = useState(bill.title);
  const [amount, setAmount] = useState(String(bill.amount));
  const [date, setDate] = useState(toInputDate(bill.date));
  const [notes, setNotes] = useState(bill.notes ?? "");
  const [loading, setLoading] = useState(false);
  const [showCatPicker, setShowCatPicker] = useState(false);
  const [fTitle, setFTitle] = useState(false);
  const [fAmount, setFAmount] = useState(false);
  const [fNotes, setFNotes] = useState(false);
  const meta = BILL_META[category];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSave({ ...bill, category, title, amount: Number(amount), date: new Date(date), notes: notes || undefined });
    }, 1200);
  };

  return (
    <ScreenShell scrollable>
      <div className="flex flex-col px-6 pt-12 pb-8 relative">
        <BackButton onBack={onBack} label="Cancel" />
        <div className="flex items-center gap-3 mb-7">
          <div className="w-11 h-11 rounded-2xl bg-accent flex items-center justify-center shadow-md shadow-accent/30">
            <Edit3 className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>Edit Bill</h2>
            <p className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>{bill.title}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground/80" style={{ fontFamily: "'DM Sans', sans-serif" }}>Category</label>
            <button type="button" onClick={() => setShowCatPicker(true)}
              className="flex items-center gap-3 p-4 rounded-xl border transition-all text-left"
              style={{ borderColor: "rgba(232,160,32,0.3)", background: "#2e1a0a" }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border"
                style={{ background: `${meta.color}20`, borderColor: `${meta.color}40`, color: meta.color }}>{meta.icon}</div>
              <span className="flex-1 text-sm font-medium text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>{meta.label}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <FieldBox label="Title" focused={fTitle}>
            <div className="flex items-center" onFocus={() => setFTitle(true)} onBlur={() => setFTitle(false)}>
              <span className="pl-4 text-muted-foreground"><AlignLeft className="w-4 h-4" /></span>
              <input value={title} onChange={e => setTitle(e.target.value)} required
                className="flex-1 px-3 py-3.5 bg-transparent text-foreground text-sm outline-none" style={{ fontFamily: "'DM Sans', sans-serif" }} />
            </div>
          </FieldBox>
          <FieldBox label="Amount (৳)" focused={fAmount}>
            <div className="flex items-center" onFocus={() => setFAmount(true)} onBlur={() => setFAmount(false)}>
              <span className="pl-4 text-muted-foreground text-sm font-bold">৳</span>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required
                className="flex-1 px-3 py-3.5 bg-transparent text-foreground text-sm outline-none" style={{ fontFamily: "'DM Sans', sans-serif" }} />
            </div>
          </FieldBox>
          <FieldBox label="Date" focused={false}>
            <div className="flex items-center">
              <span className="pl-4 text-muted-foreground"><Calendar className="w-4 h-4" /></span>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="flex-1 px-3 py-3.5 bg-transparent text-foreground text-sm outline-none" style={{ fontFamily: "'DM Sans', sans-serif", colorScheme: "dark" }} />
            </div>
          </FieldBox>
          <FieldBox label="Notes (optional)" focused={fNotes}>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} onFocus={() => setFNotes(true)} onBlur={() => setFNotes(false)} rows={3}
              className="w-full px-4 py-3.5 bg-transparent text-foreground placeholder-muted-foreground text-sm outline-none resize-none" style={{ fontFamily: "'DM Sans', sans-serif" }} />
          </FieldBox>
          <div className="mt-2"><PrimaryButton loading={loading} label="Save Changes" loadingLabel="Saving…" /></div>
        </form>

        {showCatPicker && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 flex flex-col justify-end"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
            onClick={() => setShowCatPicker(false)}>
            <motion.div initial={{ y: 60 }} animate={{ y: 0 }} transition={{ type: "spring", damping: 28 }}
              className="bg-card rounded-t-3xl border-t border-border p-5 pb-8 max-h-[70vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>Select Category</h3>
                <button onClick={() => setShowCatPicker(false)} className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center"><X className="w-3.5 h-3.5 text-muted-foreground" /></button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {BILL_CATEGORIES.map(c => (
                  <button key={c.key} type="button" onClick={() => { setCategory(c.key); setShowCatPicker(false); }}
                    className="flex items-center gap-2.5 p-3 rounded-xl border transition-all text-left"
                    style={{ borderColor: category === c.key ? `${c.color}70` : "rgba(232,160,32,0.15)", background: category === c.key ? `${c.color}15` : "rgba(46,26,10,0.8)" }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border"
                      style={{ background: `${c.color}20`, borderColor: `${c.color}40`, color: c.color }}>{c.icon}</div>
                    <span className="text-xs font-medium text-foreground truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>{c.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </ScreenShell>
  );
}

// ─── Add Picker / Forms ───────────────────────────────────────────────────────

function AddPicker({ onExpense, onBill, onClose }: { onExpense: () => void; onBill: () => void; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="absolute inset-0 z-50 flex flex-col justify-end"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={onClose}>
      <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="bg-card rounded-t-3xl border-t border-border p-6 pb-10" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>Add New Entry</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <div className="flex flex-col gap-4">
          {[
            { icon: <ShoppingBag className="w-6 h-6 text-primary-foreground" strokeWidth={2} />, bg: "bg-primary", label: "Add Expense", sub: "Record a bazar purchase with product, price & quantity", onClick: onExpense, border: "border-primary/40" },
            { icon: <Receipt className="w-6 h-6 text-white" strokeWidth={2} />, bg: "bg-accent", label: "Add Bill", sub: "Log rent, utilities, subscriptions and other bills", onClick: onBill, border: "border-accent/40" },
          ].map(item => (
            <motion.button key={item.label} onClick={item.onClick} whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-4 p-5 rounded-2xl border ${item.border} text-left transition-all`}
              style={{ background: "rgba(232,160,32,0.05)" }}>
              <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0 shadow-lg`}>{item.icon}</div>
              <div className="flex-1">
                <p className="text-base font-semibold text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.label}</p>
                <p className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.sub}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function AddExpenseScreen({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  const [product, setProduct] = useState(""); const [price, setPrice] = useState(""); const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState<BazarUnit>("KG"); const [date, setDate] = useState(toInputDate(new Date())); const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [fProduct, setFProduct] = useState(false); const [fPrice, setFPrice] = useState(false); const [fQty, setFQty] = useState(false); const [fNotes, setFNotes] = useState(false);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setLoading(true); setTimeout(() => { setLoading(false); onDone(); }, 1400); };
  return (
    <ScreenShell scrollable>
      <div className="flex flex-col px-6 pt-12 pb-8">
        <BackButton onBack={onBack} label="Cancel" />
        <div className="flex items-center gap-3 mb-7">
          <div className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center shadow-md shadow-primary/30"><ShoppingBag className="w-5 h-5 text-primary-foreground" strokeWidth={2} /></div>
          <div><h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>Add Expense</h2>
            <p className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>Bazar purchase entry</p></div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FieldBox label="Product Name" focused={fProduct}>
            <div className="flex items-center" onFocus={() => setFProduct(true)} onBlur={() => setFProduct(false)}>
              <span className="pl-4 text-muted-foreground"><Package className="w-4 h-4" /></span>
              <input value={product} onChange={e => setProduct(e.target.value)} placeholder="e.g. Hilsha Fish, Rice, Onion" required
                className="flex-1 px-3 py-3.5 bg-transparent text-foreground placeholder-muted-foreground text-sm outline-none" style={{ fontFamily: "'DM Sans', sans-serif" }} />
            </div>
          </FieldBox>
          <div className="grid grid-cols-2 gap-3">
            <FieldBox label="Price (৳)" focused={fPrice}>
              <div className="flex items-center" onFocus={() => setFPrice(true)} onBlur={() => setFPrice(false)}>
                <span className="pl-4 text-sm font-bold text-muted-foreground">৳</span>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" required
                  className="flex-1 px-3 py-3.5 bg-transparent text-foreground placeholder-muted-foreground text-sm outline-none" style={{ fontFamily: "'DM Sans', sans-serif" }} />
              </div>
            </FieldBox>
            <FieldBox label="Quantity" focused={fQty}>
              <div className="flex items-center" onFocus={() => setFQty(true)} onBlur={() => setFQty(false)}>
                <span className="pl-4 text-muted-foreground"><Weight className="w-4 h-4" /></span>
                <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="0" required
                  className="flex-1 px-3 py-3.5 bg-transparent text-foreground placeholder-muted-foreground text-sm outline-none" style={{ fontFamily: "'DM Sans', sans-serif" }} />
              </div>
            </FieldBox>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground/80" style={{ fontFamily: "'DM Sans', sans-serif" }}>Unit</label>
            <div className="flex gap-2">
              {(["KG", "PIECE", "GM"] as BazarUnit[]).map(u => (
                <button key={u} type="button" onClick={() => setUnit(u)} className="flex-1 py-3 rounded-xl border text-sm font-semibold transition-all"
                  style={{ borderColor: unit === u ? "rgba(232,160,32,0.8)" : "rgba(232,160,32,0.18)", background: unit === u ? "rgba(232,160,32,0.15)" : "#2e1a0a", color: unit === u ? "#e8a020" : "#a08060", fontFamily: "'DM Mono', monospace" }}>{u}</button>
              ))}
            </div>
          </div>
          <FieldBox label="Date" focused={false}>
            <div className="flex items-center">
              <span className="pl-4 text-muted-foreground"><Calendar className="w-4 h-4" /></span>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="flex-1 px-3 py-3.5 bg-transparent text-foreground text-sm outline-none" style={{ fontFamily: "'DM Sans', sans-serif", colorScheme: "dark" }} />
            </div>
          </FieldBox>
          <FieldBox label="Notes (optional)" focused={fNotes}>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} onFocus={() => setFNotes(true)} onBlur={() => setFNotes(false)} placeholder="Any additional info…" rows={3}
              className="w-full px-4 py-3.5 bg-transparent text-foreground placeholder-muted-foreground text-sm outline-none resize-none" style={{ fontFamily: "'DM Sans', sans-serif" }} />
          </FieldBox>
          <div className="mt-2"><PrimaryButton loading={loading} label="Save Expense" loadingLabel="Saving…" /></div>
        </form>
      </div>
    </ScreenShell>
  );
}

function AddBillScreen({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  const [category, setCategory] = useState<BillCategory>("RENT"); const [title, setTitle] = useState(""); const [amount, setAmount] = useState("");
  const [date, setDate] = useState(toInputDate(new Date())); const [notes, setNotes] = useState(""); const [loading, setLoading] = useState(false);
  const [showCatPicker, setShowCatPicker] = useState(false); const [fTitle, setFTitle] = useState(false); const [fAmount, setFAmount] = useState(false); const [fNotes, setFNotes] = useState(false);
  const meta = BILL_META[category];
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setLoading(true); setTimeout(() => { setLoading(false); onDone(); }, 1400); };
  return (
    <ScreenShell scrollable>
      <div className="flex flex-col px-6 pt-12 pb-8 relative">
        <BackButton onBack={onBack} label="Cancel" />
        <div className="flex items-center gap-3 mb-7">
          <div className="w-11 h-11 rounded-2xl bg-accent flex items-center justify-center shadow-md shadow-accent/30"><Receipt className="w-5 h-5 text-white" strokeWidth={2} /></div>
          <div><h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>Add Bill</h2>
            <p className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>Utility or recurring expense</p></div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground/80" style={{ fontFamily: "'DM Sans', sans-serif" }}>Category</label>
            <button type="button" onClick={() => setShowCatPicker(true)} className="flex items-center gap-3 p-4 rounded-xl border transition-all text-left" style={{ borderColor: "rgba(232,160,32,0.3)", background: "#2e1a0a" }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border" style={{ background: `${meta.color}20`, borderColor: `${meta.color}40`, color: meta.color }}>{meta.icon}</div>
              <span className="flex-1 text-sm font-medium text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>{meta.label}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <FieldBox label="Title" focused={fTitle}>
            <div className="flex items-center" onFocus={() => setFTitle(true)} onBlur={() => setFTitle(false)}>
              <span className="pl-4 text-muted-foreground"><AlignLeft className="w-4 h-4" /></span>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. July House Rent" required
                className="flex-1 px-3 py-3.5 bg-transparent text-foreground placeholder-muted-foreground text-sm outline-none" style={{ fontFamily: "'DM Sans', sans-serif" }} />
            </div>
          </FieldBox>
          <FieldBox label="Amount (৳)" focused={fAmount}>
            <div className="flex items-center" onFocus={() => setFAmount(true)} onBlur={() => setFAmount(false)}>
              <span className="pl-4 text-sm font-bold text-muted-foreground">৳</span>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" required
                className="flex-1 px-3 py-3.5 bg-transparent text-foreground placeholder-muted-foreground text-sm outline-none" style={{ fontFamily: "'DM Sans', sans-serif" }} />
            </div>
          </FieldBox>
          <FieldBox label="Date" focused={false}>
            <div className="flex items-center">
              <span className="pl-4 text-muted-foreground"><Calendar className="w-4 h-4" /></span>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="flex-1 px-3 py-3.5 bg-transparent text-foreground text-sm outline-none" style={{ fontFamily: "'DM Sans', sans-serif", colorScheme: "dark" }} />
            </div>
          </FieldBox>
          <FieldBox label="Notes (optional)" focused={fNotes}>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} onFocus={() => setFNotes(true)} onBlur={() => setFNotes(false)} placeholder="Any additional info…" rows={3}
              className="w-full px-4 py-3.5 bg-transparent text-foreground placeholder-muted-foreground text-sm outline-none resize-none" style={{ fontFamily: "'DM Sans', sans-serif" }} />
          </FieldBox>
          <div className="mt-2"><PrimaryButton loading={loading} label="Save Bill" loadingLabel="Saving…" /></div>
        </form>
        {showCatPicker && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 flex flex-col justify-end"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
            onClick={() => setShowCatPicker(false)}>
            <motion.div initial={{ y: 60 }} animate={{ y: 0 }} transition={{ type: "spring", damping: 28 }}
              className="bg-card rounded-t-3xl border-t border-border p-5 pb-8 max-h-[70vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>Select Category</h3>
                <button onClick={() => setShowCatPicker(false)} className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center"><X className="w-3.5 h-3.5 text-muted-foreground" /></button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {BILL_CATEGORIES.map(c => (
                  <button key={c.key} type="button" onClick={() => { setCategory(c.key); setShowCatPicker(false); }}
                    className="flex items-center gap-2.5 p-3 rounded-xl border transition-all text-left"
                    style={{ borderColor: category === c.key ? `${c.color}70` : "rgba(232,160,32,0.15)", background: category === c.key ? `${c.color}15` : "rgba(46,26,10,0.8)" }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border" style={{ background: `${c.color}20`, borderColor: `${c.color}40`, color: c.color }}>{c.icon}</div>
                    <span className="text-xs font-medium text-foreground truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>{c.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </ScreenShell>
  );
}

// ─── Profile: Edit Profile ────────────────────────────────────────────────────

function EditProfileScreen({ onBack }: { onBack: () => void }) {
  const me = MOCK_USERS[0];
  const [photo, setPhoto] = useState<string | null>(null);
  const [name, setName] = useState(me.name);
  const [email, setEmail] = useState(me.email);
  const [phone, setPhone] = useState(me.phone);
  const [lang, setLang] = useState("English");
  const [about, setAbout] = useState("Managing our family bazar hisab since 2024.");
  const [street, setStreet] = useState("42 Mirpur Road");
  const [city, setCity] = useState("Dhaka");
  const [state, setState] = useState("Dhaka Division");
  const [zip, setZip] = useState("1216");
  const [country, setCountry] = useState("Bangladesh");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [fName, setFName] = useState(false); const [fEmail, setFEmail] = useState(false); const [fPhone, setFPhone] = useState(false);
  const [fLang, setFLang] = useState(false); const [fAbout, setFAbout] = useState(false);
  const [fStreet, setFStreet] = useState(false); const [fCity, setFCity] = useState(false);
  const [fState, setFState] = useState(false); const [fZip, setFZip] = useState(false); const [fCountry, setFCountry] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSaved(true); setTimeout(() => { setSaved(false); onBack(); }, 1500); }, 1200);
  };

  return (
    <ScreenShell scrollable>
      <div className="flex flex-col px-6 pt-12 pb-8">
        <BackButton onBack={onBack} label="Profile" />
        <h2 className="text-xl font-bold text-foreground mb-6" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>Edit <span className="text-primary">Profile</span></h2>

        <div className="flex justify-center mb-7">
          <button type="button" onClick={() => fileRef.current?.click()} className="relative group">
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-primary/40 group-hover:border-primary/80 transition-all overflow-hidden"
              style={{ boxShadow: "0 0 0 4px rgba(232,160,32,0.08)" }}>
              {photo
                ? <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-white" style={{ background: avatarColor(me.id) }}>{initials(me.name)}</div>
              }
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-md">
              <Camera className="w-4 h-4 text-primary-foreground" strokeWidth={2} />
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) setPhoto(URL.createObjectURL(f)); }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <SectionLabel>Basic Info</SectionLabel>
          {[
            { label: "Full Name", value: name, set: setName, f: fName, setF: setFName, icon: <User className="w-4 h-4" />, type: "text" },
            { label: "Email Address", value: email, set: setEmail, f: fEmail, setF: setFEmail, icon: <Mail className="w-4 h-4" />, type: "email" },
            { label: "Phone Number", value: phone, set: setPhone, f: fPhone, setF: setFPhone, icon: <Phone className="w-4 h-4" />, type: "tel" },
            { label: "Language", value: lang, set: setLang, f: fLang, setF: setFLang, icon: <Globe className="w-4 h-4" />, type: "text" },
          ].map(field => (
            <FieldBox key={field.label} label={field.label} focused={field.f}>
              <div className="flex items-center" onFocus={() => field.setF(true)} onBlur={() => field.setF(false)}>
                <span className="pl-4 text-muted-foreground flex-shrink-0">{field.icon}</span>
                <input type={field.type} value={field.value} onChange={e => field.set(e.target.value)}
                  className="flex-1 px-3 py-3.5 bg-transparent text-foreground text-sm outline-none" style={{ fontFamily: "'DM Sans', sans-serif" }} />
              </div>
            </FieldBox>
          ))}
          <FieldBox label="About Me" focused={fAbout}>
            <textarea value={about} onChange={e => setAbout(e.target.value)} onFocus={() => setFAbout(true)} onBlur={() => setFAbout(false)} rows={3}
              className="w-full px-4 py-3.5 bg-transparent text-foreground text-sm outline-none resize-none" style={{ fontFamily: "'DM Sans', sans-serif" }} />
          </FieldBox>

          <SectionLabel>Address</SectionLabel>
          {[
            { label: "Street", value: street, set: setStreet, f: fStreet, setF: setFStreet },
            { label: "City", value: city, set: setCity, f: fCity, setF: setFCity },
            { label: "State / Division", value: state, set: setState, f: fState, setF: setFState },
            { label: "ZIP Code", value: zip, set: setZip, f: fZip, setF: setFZip },
            { label: "Country", value: country, set: setCountry, f: fCountry, setF: setFCountry },
          ].map(field => (
            <FieldBox key={field.label} label={field.label} focused={field.f}>
              <div className="flex items-center" onFocus={() => field.setF(true)} onBlur={() => field.setF(false)}>
                <span className="pl-4 text-muted-foreground"><MapPin className="w-4 h-4" /></span>
                <input value={field.value} onChange={e => field.set(e.target.value)}
                  className="flex-1 px-3 py-3.5 bg-transparent text-foreground text-sm outline-none" style={{ fontFamily: "'DM Sans', sans-serif" }} />
              </div>
            </FieldBox>
          ))}

          <div className="mt-2">
            {saved
              ? <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center gap-2 py-4 rounded-xl bg-green-500/15 border border-green-500/30">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>Profile updated!</span>
                </motion.div>
              : <PrimaryButton loading={loading} label="Save Profile" loadingLabel="Saving…" />
            }
          </div>
        </form>
      </div>
    </ScreenShell>
  );
}

// ─── Profile: Change Password ─────────────────────────────────────────────────

function ChangePasswordScreen({ onBack }: { onBack: () => void }) {
  const [current, setCurrent] = useState(""); const [newPass, setNewPass] = useState(""); const [repeat, setRepeat] = useState("");
  const [showCurrent, setShowCurrent] = useState(false); const [showNew, setShowNew] = useState(false); const [showRepeat, setShowRepeat] = useState(false);
  const [loading, setLoading] = useState(false); const [done, setDone] = useState(false);
  const [fCurrent, setFCurrent] = useState(false); const [fNew, setFNew] = useState(false); const [fRepeat, setFRepeat] = useState(false);
  const mismatch = repeat.length > 0 && newPass !== repeat;
  const sl = newPass.length === 0 ? 0 : newPass.length < 6 ? 1 : newPass.length < 10 ? 2 : 3;
  const sc = ["", "#ef4444", "#e8a020", "#22c55e"]; const slb = ["", "Weak", "Fair", "Strong"];

  return (
    <ScreenShell>
      <div className="flex flex-col px-6 pt-12 pb-8 flex-1">
        <BackButton onBack={onBack} label="Profile" />
        <div className="mb-7">
          <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-primary" strokeWidth={1.8} />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-1" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>Change Password</h2>
          <p className="text-muted-foreground text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>Choose a strong new password for your account.</p>
        </div>
        <form onSubmit={e => {
          e.preventDefault();
          if (mismatch || newPass.length < 8) return;
          setLoading(true);
          setTimeout(() => { setLoading(false); setDone(true); }, 1200);
        }} className="flex flex-col gap-4 flex-1">
          {[
            { id: "current", label: "Current Password", value: current, set: setCurrent, show: showCurrent, setShow: setShowCurrent, f: fCurrent, setF: setFCurrent },
            { id: "new", label: "New Password", value: newPass, set: setNewPass, show: showNew, setShow: setShowNew, f: fNew, setF: setFNew },
            { id: "repeat", label: "Confirm New Password", value: repeat, set: setRepeat, show: showRepeat, setShow: setShowRepeat, f: fRepeat, setF: setFRepeat },
          ].map((field, idx) => (
            <div key={field.id}>
              <FieldBox label={field.label} focused={field.f} error={field.id === "repeat" && mismatch ? "Passwords do not match" : undefined}>
                <div className="flex items-center" onFocus={() => field.setF(true)} onBlur={() => field.setF(false)}>
                  <span className="pl-4 text-muted-foreground"><Lock className="w-4 h-4" /></span>
                  <input type={field.show ? "text" : "password"} value={field.value} onChange={e => field.set(e.target.value)}
                    className="flex-1 px-3 py-3.5 bg-transparent text-foreground placeholder-muted-foreground text-sm outline-none" style={{ fontFamily: "'DM Sans', sans-serif" }} placeholder="••••••••" />
                  <button type="button" tabIndex={-1} onClick={() => field.setShow(!field.show)} className="pr-4 text-muted-foreground hover:text-foreground transition-colors">
                    {field.show ? <EyeOff className="w-4 h-4" strokeWidth={1.8} /> : <Eye className="w-4 h-4" strokeWidth={1.8} />}
                  </button>
                </div>
              </FieldBox>
              {idx === 1 && newPass.length > 0 && (
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3].map(l => <div key={l} className="h-1 flex-1 rounded-full transition-all" style={{ background: sl >= l ? sc[sl] : "rgba(232,160,32,0.15)" }} />)}
                  </div>
                  <span className="text-xs font-medium" style={{ color: sc[sl], fontFamily: "'DM Mono', monospace" }}>{slb[sl]}</span>
                </div>
              )}
            </div>
          ))}
          <div className="mt-auto pt-4">
            {done
              ? <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center gap-2 py-4 rounded-xl bg-green-500/15 border border-green-500/30">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>Password updated!</span>
                </motion.div>
              : <PrimaryButton loading={loading} label="Update Password" loadingLabel="Updating…" disabled={mismatch || newPass.length < 8 || !current} />
            }
          </div>
        </form>
      </div>
    </ScreenShell>
  );
}

// ─── Profile Tab ──────────────────────────────────────────────────────────────

function ProfileTab({ onEditProfile, onChangePassword }: { onEditProfile: () => void; onChangePassword: () => void }) {
  const me = MOCK_USERS[0];
  const [pushNotif, setPushNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
      <div className="px-6 pt-12 pb-4">
        <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>My <span className="text-primary">Profile</span></h2>
        <p className="text-xs text-muted-foreground mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>Account & settings</p>
      </div>
      <div className="mx-6 h-px bg-border mb-4" />

      <div className="flex flex-col px-6 pb-8 gap-5">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.35)" }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xl text-white"
            style={{ background: avatarColor(me.id) }}>{initials(me.name)}</div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-foreground truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>{me.name}</p>
            <p className="text-xs text-muted-foreground truncate mt-0.5" style={{ fontFamily: "'DM Mono', monospace" }}>{me.email}</p>
            <p className="text-xs text-muted-foreground mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>{me.phone}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="text-xs text-green-400 font-medium" style={{ fontFamily: "'DM Mono', monospace" }}>Active · Verified</span>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}
          className="rounded-2xl border border-border bg-card overflow-hidden" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.3)" }}>
          <div className="px-4 py-3 border-b border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>Account</p>
          </div>
          <SettingsRow icon={<User className="w-4 h-4" />} label="Edit Profile" sub="Update your name, photo, address & more" onClick={onEditProfile} />
          <div className="h-px bg-border mx-4" />
          <SettingsRow icon={<Shield className="w-4 h-4" />} label="Change Password" sub="Update your account password" onClick={onChangePassword} />
          <div className="h-px bg-border mx-4" />
          <SettingsRow icon={<Info className="w-4 h-4" />} label="Account Info" sub="Last login: Today · Member since Jan 2025" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl border border-border bg-card overflow-hidden" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.3)" }}>
          <div className="px-4 py-3 border-b border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>Notifications</p>
          </div>
          <SettingsRow
            icon={pushNotif ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
            label="Push Notifications"
            sub={pushNotif ? "Receive alerts for new entries" : "Notifications are off"}
            right={<Toggle on={pushNotif} onToggle={() => setPushNotif(v => !v)} />}
          />
          <div className="h-px bg-border mx-4" />
          <SettingsRow
            icon={<Mail className="w-4 h-4" />}
            label="Email Notifications"
            sub={emailNotif ? "Get email summaries & alerts" : "Email notifications are off"}
            right={<Toggle on={emailNotif} onToggle={() => setEmailNotif(v => !v)} />}
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}
          className="rounded-2xl border border-border bg-card overflow-hidden" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.3)" }}>
          <div className="px-4 py-3 border-b border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>Preferences</p>
          </div>
          <SettingsRow icon={<Globe className="w-4 h-4" />} label="Language" sub="English" right={<span className="text-xs text-muted-foreground font-semibold" style={{ fontFamily: "'DM Mono', monospace" }}>EN</span>} />
          <div className="h-px bg-border mx-4" />
          <SettingsRow icon={<MapPin className="w-4 h-4" />} label="Address" sub="42 Mirpur Road, Dhaka, Bangladesh" />
          <div className="h-px bg-border mx-4" />
          <SettingsRow icon={<FileText className="w-4 h-4" />} label="About Me" sub="Managing our family bazar hisab since 2024." />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
          className="rounded-2xl border border-destructive/25 bg-card overflow-hidden" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.3)" }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(212,24,61,0.2)" }}>
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ fontFamily: "'DM Mono', monospace", color: "#d4183d" }}>Danger Zone</p>
          </div>
          <SettingsRow icon={<LogOut className="w-4 h-4" />} label="Sign Out" sub="Sign out from this device" onClick={() => {}} danger />
          <div className="h-px mx-4" style={{ background: "rgba(212,24,61,0.15)" }} />
          <SettingsRow icon={<Trash2 className="w-4 h-4" />} label="Delete Account" sub="Permanently remove your account and data" onClick={() => setShowDeleteConfirm(v => !v)} danger />
        </motion.div>

        {showDeleteConfirm && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-destructive/40 p-5" style={{ background: "rgba(212,24,61,0.06)" }}>
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-destructive" style={{ fontFamily: "'DM Sans', sans-serif" }}>Delete your account?</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  All your data, entries, and group memberships will be permanently removed. This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-border text-foreground text-sm font-medium hover:bg-secondary transition-all"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
              <button type="button"
                className="flex-1 py-2.5 rounded-xl bg-destructive text-white text-sm font-semibold hover:opacity-90 transition-all"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>Delete Account</button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─── App Shell ────────────────────────────────────────────────────────────────

function AppShell({ stats }: { stats: GroupStats }) {
  const [tab, setTab] = useState<AppTab>("home");
  const [subScreen, setSubScreen] = useState<AppSubScreen>(null);
  const [entries, setEntries] = useState<MockBazarEntry[]>(INITIAL_ENTRIES);
  const [bills, setBills] = useState<MockBill[]>(INITIAL_BILLS);
  const [selectedEntry, setSelectedEntry] = useState<MockBazarEntry | null>(null);
  const [selectedBill, setSelectedBill] = useState<MockBill | null>(null);

  const showNav = subScreen === null || subScreen === "add-picker";

  if (subScreen === "expense-detail" && selectedEntry) {
    return <ExpenseDetailScreen entry={selectedEntry}
      onBack={() => { setSelectedEntry(null); setSubScreen(null); }}
      onEdit={() => setSubScreen("expense-edit")}
      onDelete={() => { setEntries(es => es.filter(e => e.id !== selectedEntry.id)); setSelectedEntry(null); setSubScreen(null); }}
    />;
  }
  if (subScreen === "expense-edit" && selectedEntry) {
    return <ExpenseEditScreen entry={selectedEntry}
      onBack={() => setSubScreen("expense-detail")}
      onSave={updated => { setEntries(es => es.map(e => e.id === updated.id ? updated : e)); setSelectedEntry(updated); setSubScreen("expense-detail"); }}
    />;
  }
  if (subScreen === "bill-detail" && selectedBill) {
    return <BillDetailScreen bill={selectedBill}
      onBack={() => { setSelectedBill(null); setSubScreen(null); }}
      onEdit={() => setSubScreen("bill-edit")}
      onDelete={() => { setBills(bs => bs.filter(b => b.id !== selectedBill.id)); setSelectedBill(null); setSubScreen(null); }}
    />;
  }
  if (subScreen === "bill-edit" && selectedBill) {
    return <BillEditScreen bill={selectedBill}
      onBack={() => setSubScreen("bill-detail")}
      onSave={updated => { setBills(bs => bs.map(b => b.id === updated.id ? updated : b)); setSelectedBill(updated); setSubScreen("bill-detail"); }}
    />;
  }
  if (subScreen === "add-expense") return <AddExpenseScreen onBack={() => setSubScreen("add-picker")} onDone={() => { setSubScreen(null); setTab("expenses"); }} />;
  if (subScreen === "add-bill")    return <AddBillScreen    onBack={() => setSubScreen("add-picker")} onDone={() => { setSubScreen(null); setTab("bills"); }} />;
  if (subScreen === "profile-edit") return <EditProfileScreen onBack={() => setSubScreen(null)} />;
  if (subScreen === "profile-change-password") return <ChangePasswordScreen onBack={() => setSubScreen(null)} />;

  return (
    <ScreenShell>
      <div className="flex flex-col flex-1 min-h-0 relative">
        <div className="flex-1 min-h-0 relative">
          {tab === "home"     && <HomeTab stats={stats} />}
          {tab === "expenses" && <ExpensesTab entries={entries} onDetail={e => { setSelectedEntry(e); setSubScreen("expense-detail"); }} />}
          {tab === "bills"    && <BillsTab bills={bills} onDetail={b => { setSelectedBill(b); setSubScreen("bill-detail"); }} />}
          {tab === "profile"  && <ProfileTab onEditProfile={() => setSubScreen("profile-edit")} onChangePassword={() => setSubScreen("profile-change-password")} />}
          {subScreen === "add-picker" && (
            <AddPicker onExpense={() => setSubScreen("add-expense")} onBill={() => setSubScreen("add-bill")} onClose={() => setSubScreen(null)} />
          )}
        </div>
        {showNav && <BottomNav tab={tab} onTab={t => { setTab(t); setSubScreen(null); }} onAdd={() => setSubScreen("add-picker")} />}
      </div>
    </ScreenShell>
  );
}

// ─── Auth screens ─────────────────────────────────────────────────────────────

function makeMockStats(groupName: string): GroupStats {
  return {
    groupName, totalMembers: 8, totalGroupBazarEntries: 134, totalMyBazarEntries: 47, totalProductsCreatedByMe: 23,
    thisMonthBazarExpense: 12840, prevMonthBazarExpense: 10950, thisYearBazarExpense: 98400, prevYearBazarExpense: 87200,
    thisMonthBillExpense: 4200, prevMonthBillExpense: 5100, thisYearBillExpense: 43600, prevYearBillExpense: 39800,
    thisMonthTotalExpense: 17040, prevMonthTotalExpense: 16050, thisYearTotalExpense: 142000, prevYearTotalExpense: 127000,
  };
}

function SplashScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3200); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="relative size-full flex flex-col items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 60%, rgba(232,160,32,0.18) 0%, transparent 80%)" }} />
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />
      {BG_DOTS}
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex flex-col items-center">
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-3xl bg-primary/10 border border-primary/30 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
              <BookOpen className="w-8 h-8 text-primary-foreground" strokeWidth={2} />
            </div>
          </div>
          <motion.div initial={{ opacity: 0, x: -8, y: 8 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ delay: 0.5 }}
            className="absolute -bottom-2 -left-5 w-10 h-10 rounded-xl bg-accent/80 flex items-center justify-center border border-primary/20">
            <ShoppingBag className="w-5 h-5 text-primary-foreground" strokeWidth={1.8} />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 8, y: 8 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ delay: 0.6 }}
            className="absolute -bottom-2 -right-5 w-10 h-10 rounded-xl bg-accent/80 flex items-center justify-center border border-primary/20">
            <TrendingUp className="w-5 h-5 text-primary-foreground" strokeWidth={1.8} />
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-1" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>My Bazar</h1>
          <span className="text-4xl font-bold tracking-tight text-primary" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>Hisab</span>
        </motion.div>
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="mt-4 text-muted-foreground text-sm uppercase" style={{ fontFamily: "'DM Mono', monospace", letterSpacing: "0.18em" }}>
          Your Market Account Book
        </motion.p>
      </motion.div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}
        className="absolute bottom-24 text-center text-muted-foreground text-sm px-8 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        Track your market expenses,<br />manage your bazar accounts with ease.
      </motion.p>
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-32 h-0.5 bg-border rounded-full overflow-hidden">
        <motion.div className="h-full bg-primary rounded-full" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ delay: 0.4, duration: 2.4, ease: "easeInOut" }} />
      </div>
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />
    </div>
  );
}

function AuthForms({ onLogin }: { onLogin: () => void }) {
  const [screen, setScreen] = useState<"login" | "register" | "forgot-email" | "forgot-otp" | "forgot-newpass" | "forgot-success">("login");
  const [forgotEmail, setForgotEmail] = useState("");
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [showPw, setShowPw] = useState(false); const [loginLoading, setLoginLoading] = useState(false);
  const [fE, setFE] = useState(false); const [fP, setFP] = useState(false);

  if (screen === "register") return <RegisterScreen onBack={() => setScreen("login")} onDone={onLogin} />;
  if (screen === "forgot-email") return <ForgotEmailScreen onBack={() => setScreen("login")} onNext={em => { setForgotEmail(em); setScreen("forgot-otp"); }} />;
  if (screen === "forgot-otp") return <ForgotOtpScreen email={forgotEmail} onBack={() => setScreen("forgot-email")} onNext={() => setScreen("forgot-newpass")} />;
  if (screen === "forgot-newpass") return <ForgotNewPassScreen onBack={() => setScreen("forgot-otp")} onDone={() => setScreen("forgot-success")} />;
  if (screen === "forgot-success") {
    return (
      <ScreenShell>
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="mb-8">
            <div className="w-24 h-24 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto">
              <CheckCircle className="w-12 h-12 text-primary" strokeWidth={1.5} />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="text-2xl font-bold text-foreground mb-3" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>Password Reset!</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>Your password has been updated. You can now sign in.</p>
            <PrimaryButton type="button" label="Back to Sign In" onClick={() => setScreen("login")} />
          </motion.div>
        </div>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center pt-14 pb-8 px-8">
        <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 mb-4">
          <BookOpen className="w-7 h-7 text-primary-foreground" strokeWidth={2} />
        </div>
        <h1 className="text-3xl font-bold text-foreground text-center" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>My Bazar <span className="text-primary">Hisab</span></h1>
        <p className="mt-1 text-muted-foreground text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>Sign in to your account</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="flex-1 mx-5 rounded-3xl border border-border bg-card p-7 flex flex-col" style={{ boxShadow: "0 8px 48px rgba(0,0,0,0.5)" }}>
        <h2 className="text-xl font-semibold text-foreground mb-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>Welcome back</h2>
        <p className="text-muted-foreground text-sm mb-7" style={{ fontFamily: "'DM Sans', sans-serif" }}>Enter your credentials to continue</p>
        <form onSubmit={e => { e.preventDefault(); setLoginLoading(true); setTimeout(() => { setLoginLoading(false); onLogin(); }, 1500); }} className="flex flex-col gap-4">
          <FieldBox label="Email Address" focused={fE}>
            <div className="flex items-center" onFocus={() => setFE(true)} onBlur={() => setFE(false)}>
              <span className="pl-4 text-muted-foreground"><Mail className="w-4 h-4" /></span>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required
                className="flex-1 px-3 py-3.5 bg-transparent text-foreground placeholder-muted-foreground text-sm outline-none" style={{ fontFamily: "'DM Sans', sans-serif" }} />
            </div>
          </FieldBox>
          <FieldBox label="Password" focused={fP}>
            <div className="flex items-center" onFocus={() => setFP(true)} onBlur={() => setFP(false)}>
              <span className="pl-4 text-muted-foreground"><Lock className="w-4 h-4" /></span>
              <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
                className="flex-1 px-3 py-3.5 bg-transparent text-foreground placeholder-muted-foreground text-sm outline-none" style={{ fontFamily: "'DM Sans', sans-serif" }} />
              <button type="button" tabIndex={-1} onClick={() => setShowPw(v => !v)} className="pr-4 text-muted-foreground hover:text-foreground transition-colors">
                {showPw ? <EyeOff className="w-4 h-4" strokeWidth={1.8} /> : <Eye className="w-4 h-4" strokeWidth={1.8} />}
              </button>
            </div>
          </FieldBox>
          <div className="flex justify-end">
            <button type="button" onClick={() => setScreen("forgot-email")} className="text-primary text-sm hover:text-accent transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>Forgot password?</button>
          </div>
          <PrimaryButton loading={loginLoading} label="Sign In" loadingLabel="Signing in…" />
        </form>
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-border" />
          <span className="text-muted-foreground text-xs uppercase tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>New here?</span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <button type="button" onClick={() => setScreen("register")}
          className="w-full py-3.5 rounded-xl border border-border text-foreground text-sm font-medium hover:border-primary/50 hover:bg-primary/5 transition-all"
          style={{ fontFamily: "'DM Sans', sans-serif" }}>Create an Account</button>
      </motion.div>
      <div className="h-6" />
    </ScreenShell>
  );
}

function RegisterScreen({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState<string | null>(null); const [password, setPassword] = useState(""); const [repeat, setRepeat] = useState("");
  const [showPass, setShowPass] = useState(false); const [showRepeat, setShowRepeat] = useState(false); const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [fN, setFN] = useState(false); const [fE, setFE] = useState(false); const [fPh, setFPh] = useState(false); const [fP, setFP] = useState(false); const [fR, setFR] = useState(false);
  const mismatch = repeat.length > 0 && password !== repeat;
  const sl = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const sc = ["", "#ef4444", "#e8a020", "#22c55e"]; const slb = ["", "Weak", "Fair", "Strong"];
  return (
    <ScreenShell scrollable>
      <div className="flex flex-col px-6 pt-12 pb-8">
        <BackButton onBack={onBack} />
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-1" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>Create Account</h2>
          <p className="text-muted-foreground text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>Fill in your details to get started</p>
        </div>
        <div className="flex justify-center mb-7">
          <button type="button" onClick={() => fileRef.current?.click()} className="relative group">
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-primary/40 group-hover:border-primary/80 transition-all overflow-hidden flex items-center justify-center bg-card"
              style={{ boxShadow: "0 0 0 4px rgba(232,160,32,0.08)" }}>
              {photo ? <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                : <div className="flex flex-col items-center gap-1"><User className="w-8 h-8 text-muted-foreground" strokeWidth={1.5} /><span className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>Photo</span></div>}
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-md"><Camera className="w-4 h-4 text-primary-foreground" strokeWidth={2} /></div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) setPhoto(URL.createObjectURL(f)); }} />
          </button>
        </div>
        <form onSubmit={e => { e.preventDefault(); if (mismatch || password.length < 8) return; setLoading(true); setTimeout(() => { setLoading(false); onDone(); }, 1600); }} className="flex flex-col gap-4">
          {[
            { label: "Full Name", v: name, sv: setName, f: fN, sf: setFN, icon: <User className="w-4 h-4" />, type: "text" },
            { label: "Email Address", v: email, sv: setEmail, f: fE, sf: setFE, icon: <Mail className="w-4 h-4" />, type: "email" },
            { label: "Phone Number", v: phone, sv: setPhone, f: fPh, sf: setFPh, icon: <Phone className="w-4 h-4" />, type: "tel" },
          ].map(field => (
            <FieldBox key={field.label} label={field.label} focused={field.f}>
              <div className="flex items-center" onFocus={() => field.sf(true)} onBlur={() => field.sf(false)}>
                <span className="pl-4 text-muted-foreground">{field.icon}</span>
                <input type={field.type} value={field.v} onChange={e => field.sv(e.target.value)} required
                  className="flex-1 px-3 py-3.5 bg-transparent text-foreground placeholder-muted-foreground text-sm outline-none" style={{ fontFamily: "'DM Sans', sans-serif" }} />
              </div>
            </FieldBox>
          ))}
          <FieldBox label="Password" focused={fP}>
            <div className="flex items-center" onFocus={() => setFP(true)} onBlur={() => setFP(false)}>
              <span className="pl-4 text-muted-foreground"><Lock className="w-4 h-4" /></span>
              <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" required
                className="flex-1 px-3 py-3.5 bg-transparent text-foreground placeholder-muted-foreground text-sm outline-none" style={{ fontFamily: "'DM Sans', sans-serif" }} />
              <button type="button" tabIndex={-1} onClick={() => setShowPass(v => !v)} className="pr-4 text-muted-foreground hover:text-foreground transition-colors">
                {showPass ? <EyeOff className="w-4 h-4" strokeWidth={1.8} /> : <Eye className="w-4 h-4" strokeWidth={1.8} />}
              </button>
            </div>
          </FieldBox>
          {password.length > 0 && (
            <div className="flex items-center gap-3 -mt-2">
              <div className="flex gap-1 flex-1">{[1, 2, 3].map(l => <div key={l} className="h-1 flex-1 rounded-full transition-all" style={{ background: sl >= l ? sc[sl] : "rgba(232,160,32,0.15)" }} />)}</div>
              <span className="text-xs font-medium" style={{ color: sc[sl], fontFamily: "'DM Mono', monospace" }}>{slb[sl]}</span>
            </div>
          )}
          <FieldBox label="Repeat Password" focused={fR} error={mismatch ? "Passwords do not match" : undefined}>
            <div className="flex items-center" onFocus={() => setFR(true)} onBlur={() => setFR(false)}>
              <span className="pl-4 text-muted-foreground"><Lock className="w-4 h-4" /></span>
              <input type={showRepeat ? "text" : "password"} value={repeat} onChange={e => setRepeat(e.target.value)} placeholder="Re-enter password" required
                className="flex-1 px-3 py-3.5 bg-transparent text-foreground placeholder-muted-foreground text-sm outline-none" style={{ fontFamily: "'DM Sans', sans-serif" }} />
              <button type="button" tabIndex={-1} onClick={() => setShowRepeat(v => !v)} className="pr-4 text-muted-foreground hover:text-foreground transition-colors">
                {showRepeat ? <EyeOff className="w-4 h-4" strokeWidth={1.8} /> : <Eye className="w-4 h-4" strokeWidth={1.8} />}
              </button>
            </div>
          </FieldBox>
          <div className="mt-2"><PrimaryButton loading={loading} label="Create Account" loadingLabel="Creating…" disabled={mismatch} /></div>
        </form>
        <p className="text-center text-muted-foreground text-sm mt-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Already have an account?{" "}
          <button type="button" onClick={onBack} className="text-primary hover:text-accent transition-colors font-medium">Sign In</button>
        </p>
      </div>
    </ScreenShell>
  );
}

function ForgotEmailScreen({ onBack, onNext }: { onBack: () => void; onNext: (e: string) => void }) {
  const [email, setEmail] = useState(""); const [loading, setLoading] = useState(false); const [f, setF] = useState(false);
  return (
    <ScreenShell>
      <div className="flex flex-col px-6 pt-14 pb-6 flex-1">
        <BackButton onBack={onBack} /><StepDots current={0} total={3} />
        <div className="mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center mb-5"><Mail className="w-6 h-6 text-primary" strokeWidth={1.8} /></div>
          <h2 className="text-2xl font-bold text-foreground mb-1" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>Forgot Password?</h2>
          <p className="text-muted-foreground text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>Enter your registered email and we will send a code.</p>
        </div>
        <form onSubmit={e => { e.preventDefault(); setLoading(true); setTimeout(() => { setLoading(false); onNext(email); }, 1500); }} className="flex flex-col gap-5 flex-1">
          <FieldBox label="Email Address" focused={f}>
            <div className="flex items-center" onFocus={() => setF(true)} onBlur={() => setF(false)}>
              <span className="pl-4 text-muted-foreground"><Mail className="w-4 h-4" /></span>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required autoFocus
                className="flex-1 px-3 py-3.5 bg-transparent text-foreground placeholder-muted-foreground text-sm outline-none" style={{ fontFamily: "'DM Sans', sans-serif" }} />
            </div>
          </FieldBox>
          <div className="mt-auto pt-4"><PrimaryButton loading={loading} label="Send OTP" loadingLabel="Sending…" /></div>
        </form>
      </div>
    </ScreenShell>
  );
}

function ForgotOtpScreen({ email, onBack, onNext }: { email: string; onBack: () => void; onNext: () => void }) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  useEffect(() => { if (timer <= 0) return; const t = setInterval(() => setTimer(v => v - 1), 1000); return () => clearInterval(t); }, [timer]);
  const handleChange = useCallback((i: number, val: string) => {
    const c = val.replace(/\D/g, "").slice(-1);
    setOtp(p => { const n = [...p]; n[i] = c; return n; });
    if (c && i < 5) refs.current[i + 1]?.focus();
  }, []);
  const handleKeyDown = useCallback((i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  }, [otp]);
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const p = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    setOtp(prev => { const n = [...prev]; p.split("").forEach((ch, i) => { n[i] = ch; }); return n; });
    refs.current[Math.min(p.length, 5)]?.focus();
  }, []);
  const filled = otp.every(d => d !== "");
  return (
    <ScreenShell>
      <div className="flex flex-col px-6 pt-14 pb-6 flex-1">
        <BackButton onBack={onBack} /><StepDots current={1} total={3} />
        <div className="mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center mb-5 text-xl">🔐</div>
          <h2 className="text-2xl font-bold text-foreground mb-1" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>Enter OTP</h2>
          <p className="text-muted-foreground text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>6-digit code sent to <span className="text-primary font-medium">{email}</span></p>
        </div>
        <form onSubmit={e => { e.preventDefault(); if (!filled) return; setLoading(true); setTimeout(() => { setLoading(false); onNext(); }, 1500); }} className="flex flex-col gap-6 flex-1">
          <div className="flex gap-3" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="flex-1">
                <input ref={el => { refs.current[i] = el; }} type="text" inputMode="numeric" maxLength={1} value={digit}
                  onChange={e => handleChange(i, e.target.value)} onKeyDown={e => handleKeyDown(i, e)}
                  className="w-full aspect-square text-center text-xl font-bold text-foreground rounded-xl outline-none transition-all"
                  style={{ background: "#2e1a0a", border: digit ? "1.5px solid rgba(232,160,32,0.8)" : "1.5px solid rgba(232,160,32,0.2)", boxShadow: digit ? "0 0 0 3px rgba(232,160,32,0.1)" : "none", fontFamily: "'DM Mono', monospace" }} />
              </motion.div>
            ))}
          </div>
          <div className="text-center">
            {timer > 0
              ? <p className="text-muted-foreground text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>Resend in <span className="text-primary font-medium" style={{ fontFamily: "'DM Mono', monospace" }}>00:{String(timer).padStart(2, "0")}</span></p>
              : <button type="button" onClick={() => setTimer(30)} className="text-primary text-sm font-medium hover:text-accent" style={{ fontFamily: "'DM Sans', sans-serif" }}>Resend OTP</button>}
          </div>
          <div className="mt-auto pt-2"><PrimaryButton loading={loading} label="Verify Code" loadingLabel="Verifying…" disabled={!filled} /></div>
        </form>
      </div>
    </ScreenShell>
  );
}

function ForgotNewPassScreen({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  const [np, setNp] = useState(""); const [rp, setRp] = useState(""); const [sn, setSn] = useState(false); const [sr, setSr] = useState(false); const [loading, setLoading] = useState(false);
  const [fn, setFn] = useState(false); const [fr, setFr] = useState(false);
  const mm = rp.length > 0 && np !== rp;
  const sl = np.length === 0 ? 0 : np.length < 6 ? 1 : np.length < 10 ? 2 : 3;
  const sc = ["", "#ef4444", "#e8a020", "#22c55e"]; const slb = ["", "Weak", "Fair", "Strong"];
  return (
    <ScreenShell>
      <div className="flex flex-col px-6 pt-14 pb-6 flex-1">
        <BackButton onBack={onBack} /><StepDots current={2} total={3} />
        <div className="mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center mb-5 text-xl">🔑</div>
          <h2 className="text-2xl font-bold text-foreground mb-1" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>New Password</h2>
          <p className="text-muted-foreground text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>Create a strong password. At least 8 characters.</p>
        </div>
        <form onSubmit={e => { e.preventDefault(); if (mm || np.length < 8) return; setLoading(true); setTimeout(() => { setLoading(false); onDone(); }, 1500); }} className="flex flex-col gap-4 flex-1">
          <FieldBox label="New Password" focused={fn}>
            <div className="flex items-center" onFocus={() => setFn(true)} onBlur={() => setFn(false)}>
              <span className="pl-4 text-muted-foreground"><Lock className="w-4 h-4" /></span>
              <input type={sn ? "text" : "password"} value={np} onChange={e => setNp(e.target.value)} placeholder="Min. 8 characters" autoFocus
                className="flex-1 px-3 py-3.5 bg-transparent text-foreground placeholder-muted-foreground text-sm outline-none" style={{ fontFamily: "'DM Sans', sans-serif" }} />
              <button type="button" tabIndex={-1} onClick={() => setSn(v => !v)} className="pr-4 text-muted-foreground hover:text-foreground">
                {sn ? <EyeOff className="w-4 h-4" strokeWidth={1.8} /> : <Eye className="w-4 h-4" strokeWidth={1.8} />}
              </button>
            </div>
          </FieldBox>
          {np.length > 0 && (
            <div className="flex items-center gap-3 -mt-2">
              <div className="flex gap-1 flex-1">{[1, 2, 3].map(l => <div key={l} className="h-1 flex-1 rounded-full" style={{ background: sl >= l ? sc[sl] : "rgba(232,160,32,0.15)" }} />)}</div>
              <span className="text-xs font-medium" style={{ color: sc[sl], fontFamily: "'DM Mono', monospace" }}>{slb[sl]}</span>
            </div>
          )}
          <FieldBox label="Repeat Password" focused={fr} error={mm ? "Passwords do not match" : undefined}>
            <div className="flex items-center" onFocus={() => setFr(true)} onBlur={() => setFr(false)}>
              <span className="pl-4 text-muted-foreground"><Lock className="w-4 h-4" /></span>
              <input type={sr ? "text" : "password"} value={rp} onChange={e => setRp(e.target.value)} placeholder="Re-enter password"
                className="flex-1 px-3 py-3.5 bg-transparent text-foreground placeholder-muted-foreground text-sm outline-none" style={{ fontFamily: "'DM Sans', sans-serif" }} />
              <button type="button" tabIndex={-1} onClick={() => setSr(v => !v)} className="pr-4 text-muted-foreground hover:text-foreground">
                {sr ? <EyeOff className="w-4 h-4" strokeWidth={1.8} /> : <Eye className="w-4 h-4" strokeWidth={1.8} />}
              </button>
            </div>
          </FieldBox>
          <div className="mt-auto pt-2"><PrimaryButton loading={loading} label="Reset Password" loadingLabel="Saving…" disabled={mm || np.length < 8} /></div>
        </form>
      </div>
    </ScreenShell>
  );
}

function GroupPickerScreen({ onGroupReady }: { onGroupReady: (s: GroupStats) => void }) {
  const [joinCode, setJoinCode] = useState(""); const [groupName, setGroupName] = useState("");
  const [jf, setJf] = useState(false); const [cf, setCf] = useState(false); const [jl, setJl] = useState(false); const [cl, setCl] = useState(false);
  return (
    <ScreenShell>
      <div className="flex items-center justify-between px-6 pt-14 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>My Bazar <span className="text-primary">Hisab</span></h1>
          <p className="text-muted-foreground text-sm mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>Manage your market groups</p>
        </div>
        <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center shadow-md shadow-primary/30"><Home className="w-5 h-5 text-primary-foreground" strokeWidth={2} /></div>
      </div>
      <div className="mx-6 h-px bg-border mb-6" />
      <div className="flex-1 flex flex-col px-6 pb-8 gap-6 overflow-y-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-card p-6" style={{ boxShadow: "0 4px 32px rgba(0,0,0,0.4)" }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center"><LogIn className="w-5 h-5 text-primary" strokeWidth={1.8} /></div>
            <div><h3 className="text-base font-semibold text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>Join a Group</h3>
              <p className="text-muted-foreground text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>Enter a code shared by your admin</p></div>
          </div>
          <form onSubmit={e => { e.preventDefault(); if (!joinCode.trim()) return; setJl(true); setTimeout(() => { setJl(false); onGroupReady(makeMockStats("Sabzi Mandi Group")); }, 1500); }} className="flex flex-col gap-3">
            <div className="rounded-xl border transition-all" style={{ borderColor: jf ? "rgba(232,160,32,0.7)" : "rgba(232,160,32,0.18)", background: "#2e1a0a", boxShadow: jf ? "0 0 0 3px rgba(232,160,32,0.12)" : "none" }}>
              <div className="flex items-center">
                <span className="pl-4 text-muted-foreground"><Users className="w-4 h-4" /></span>
                <input type="text" value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())} onFocus={() => setJf(true)} onBlur={() => setJf(false)} placeholder="e.g. BZR-4821"
                  className="flex-1 px-3 py-3.5 bg-transparent text-foreground placeholder-muted-foreground text-sm outline-none tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }} />
              </div>
            </div>
            <PrimaryButton loading={jl} label="Join Group" loadingLabel="Joining…" />
          </form>
        </motion.div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" /><span className="text-muted-foreground text-xs uppercase tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>or</span><div className="flex-1 h-px bg-border" />
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="rounded-2xl border border-border bg-card p-6" style={{ boxShadow: "0 4px 32px rgba(0,0,0,0.4)" }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center"><Plus className="w-5 h-5 text-accent" strokeWidth={2} /></div>
            <div><h3 className="text-base font-semibold text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>Create a Group</h3>
              <p className="text-muted-foreground text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>Start a new bazar hisab group</p></div>
          </div>
          <form onSubmit={e => { e.preventDefault(); if (!groupName.trim()) return; setCl(true); setTimeout(() => { setCl(false); onGroupReady(makeMockStats(groupName.trim())); }, 1500); }} className="flex flex-col gap-3">
            <div className="rounded-xl border transition-all" style={{ borderColor: cf ? "rgba(192,96,16,0.8)" : "rgba(192,96,16,0.25)", background: "#2e1a0a", boxShadow: cf ? "0 0 0 3px rgba(192,96,16,0.12)" : "none" }}>
              <div className="flex items-center">
                <span className="pl-4 text-muted-foreground"><Users className="w-4 h-4" /></span>
                <input type="text" value={groupName} onChange={e => setGroupName(e.target.value)} onFocus={() => setCf(true)} onBlur={() => setCf(false)} placeholder="e.g. Sabzi Mandi"
                  className="flex-1 px-3 py-3.5 bg-transparent text-foreground placeholder-muted-foreground text-sm outline-none" style={{ fontFamily: "'DM Sans', sans-serif" }} />
              </div>
            </div>
            <motion.button type="submit" disabled={cl || !groupName.trim()} whileTap={{ scale: 0.97 }}
              className="w-full py-4 rounded-xl border text-foreground font-semibold text-base disabled:opacity-50"
              style={{ fontFamily: "'DM Sans', sans-serif", borderColor: "rgba(192,96,16,0.5)" }}>
              {cl ? <span className="flex items-center justify-center gap-2 text-accent"><SpinnerIcon />Creating…</span>
                : <span className="flex items-center justify-center gap-2"><Plus className="w-4 h-4 text-accent" strokeWidth={2} />Create Group</span>}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </ScreenShell>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [groupStats, setGroupStats] = useState<GroupStats | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) return <SplashScreen onDone={() => setShowSplash(false)} />;

  if (!isLoggedIn) {
    return (
      <motion.div key="auth" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }} className="size-full">
        <AuthForms onLogin={() => setIsLoggedIn(true)} />
      </motion.div>
    );
  }
  if (!groupStats) {
    return (
      <motion.div key="group" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }} className="size-full">
        <GroupPickerScreen onGroupReady={s => setGroupStats(s)} />
      </motion.div>
    );
  }
  return (
    <motion.div key="app" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="size-full">
      <AppShell stats={groupStats} />
    </motion.div>
  );
}
