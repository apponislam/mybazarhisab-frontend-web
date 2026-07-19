import React, { useState } from "react";
import { motion } from "motion/react";
import { Home, ShoppingBag, Receipt, User, Plus, ChevronRight, X } from "lucide-react";
import { GroupStats, AppTab, AppSubScreen, MockBazarEntry, MockBill } from "@/types";
import { ScreenShell } from "@/components/ui/Shared";
import { INITIAL_ENTRIES, INITIAL_BILLS } from "@/lib/mockData";

// Import tabs
import { HomeTab } from "@/components/tabs/HomeTab";
import { ExpensesTab } from "@/components/tabs/ExpensesTab";
import { BillsTab } from "@/components/tabs/BillsTab";
import { ProfileTab } from "@/components/tabs/ProfileTab";

// Import subscreens
import { AddExpenseScreen } from "@/components/screens/AddExpenseScreen";
import { AddBillScreen } from "@/components/screens/AddBillScreen";
import { ExpenseDetailScreen } from "@/components/screens/ExpenseDetailScreen";
import { ExpenseEditScreen } from "@/components/screens/ExpenseEditScreen";
import { BillDetailScreen } from "@/components/screens/BillDetailScreen";
import { BillEditScreen } from "@/components/screens/BillEditScreen";
import { EditProfileScreen } from "@/components/screens/EditProfileScreen";
import { ChangePasswordScreen } from "@/components/screens/ChangePasswordScreen";

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
          className="flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl transition-all cursor-pointer"
          style={{ color: tab === t.id ? "#e8a020" : "#a08060" }}>
          {t.icon}
          <span className="text-[10px] font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>{t.label}</span>
          {tab === t.id && <div className="w-1 h-1 rounded-full bg-primary" />}
        </button>
      ))}
      <div className="flex-1 flex flex-col items-center pb-1">
        <motion.button onClick={onAdd} whileTap={{ scale: 0.9 }}
          className="w-14 h-14 rounded-full bg-primary flex items-center justify-center -mt-6 shadow-xl cursor-pointer"
          style={{ boxShadow: "0 4px 20px rgba(232,160,32,0.5)" }}>
          <Plus className="w-7 h-7 text-primary-foreground" strokeWidth={2.5} />
        </motion.button>
        <span className="text-[10px] font-medium mt-1" style={{ fontFamily: "'DM Sans', sans-serif", color: "#a08060" }}>Add</span>
      </div>
      {tabs.slice(2).map(t => (
        <button key={t.id} onClick={() => onTab(t.id)}
          className="flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl transition-all cursor-pointer"
          style={{ color: tab === t.id ? "#e8a020" : "#a08060" }}>
          {t.icon}
          <span className="text-[10px] font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>{t.label}</span>
          {tab === t.id && <div className="w-1 h-1 rounded-full bg-primary" />}
        </button>
      ))}
    </div>
  );
}

// ─── Add Picker ───────────────────────────────────────────────────────────────

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
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"><X className="w-4 h-4" /></button>
        </div>
        <div className="flex flex-col gap-4">
          {[
            { icon: <ShoppingBag className="w-6 h-6 text-primary-foreground" strokeWidth={2} />, bg: "bg-primary", label: "Add Expense", sub: "Record a bazar purchase with product, price & quantity", onClick: onExpense, border: "border-primary/40" },
            { icon: <Receipt className="w-6 h-6 text-white" strokeWidth={2} />, bg: "bg-accent", label: "Add Bill", sub: "Log rent, utilities, subscriptions and other bills", onClick: onBill, border: "border-accent/40" },
          ].map(item => (
            <motion.button key={item.label} onClick={item.onClick} whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-4 p-5 rounded-2xl border ${item.border} text-left transition-all cursor-pointer`}
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

// ─── App Shell ────────────────────────────────────────────────────────────────

export function AppShell({ stats }: { stats: GroupStats }) {
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
        {/* Changed tab wrapper to be a flex column container to properly constrain inner tab height */}
        <div className="flex-1 min-h-0 relative flex flex-col">
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
export default AppShell;
