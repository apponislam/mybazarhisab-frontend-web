import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard, ShoppingBag, Receipt, Users, Settings, Plus,
  Search, X, LogOut
} from "lucide-react";
import { BazarUnit, BillCategory, MockBazarEntry, MockBill, GroupStats } from "@/types";
import { INITIAL_ENTRIES, INITIAL_BILLS, MOCK_USERS, MOCK_PRODUCTS, BILL_META, fmt, fmtFull, fmtDate } from "@/lib/mockData";

export function WebAppShell({ stats, onLogout }: { stats: GroupStats; onLogout: () => void }) {
  // Core App States
  const [tab, setTab] = useState<"overview" | "expenses" | "bills" | "members" | "settings">("overview");
  const [entries, setEntries] = useState<MockBazarEntry[]>(INITIAL_ENTRIES);
  const [bills, setBills] = useState<MockBill[]>(INITIAL_BILLS);

  // Search & Filter States
  const [expenseSearch, setExpenseSearch] = useState("");
  const [billSearch, setBillSearch] = useState("");
  const [expenseFilter, setExpenseFilter] = useState<"month" | "all">("month");
  const [billFilter, setBillFilter] = useState<"month" | "all">("month");

  // Modal States
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddBill, setShowAddBill] = useState(false);

  // Calculations
  const calculations = useMemo(() => {
    const isThisMonth = (d: Date) => {
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    };

    // Filtered entries
    const monthEntries = entries.filter(e => isThisMonth(e.date));
    const monthBills = bills.filter(b => isThisMonth(b.date));

    const totalBazar = monthEntries.reduce((sum, e) => sum + e.price * e.quantity, 0);
    const totalBills = monthBills.reduce((sum, b) => sum + b.amount, 0);
    const grandTotal = totalBazar + totalBills;

    // Member-wise spending
    const memberSpendMap: Record<string, number> = {};
    MOCK_USERS.forEach(u => {
      memberSpendMap[u.id] = 0;
    });

    entries.forEach(e => {
      if (memberSpendMap[e.user.id] !== undefined) {
        memberSpendMap[e.user.id] += e.price * e.quantity;
      }
    });

    bills.forEach(b => {
      if (memberSpendMap[b.user.id] !== undefined) {
        memberSpendMap[b.user.id] += b.amount;
      }
    });

    const averageSpend = grandTotal / MOCK_USERS.length;

    const memberSplits = MOCK_USERS.map(u => {
      const spent = memberSpendMap[u.id] || 0;
      const balance = spent - averageSpend;
      return {
        user: u,
        spent,
        balance,
      };
    });

    // Calculate settlements (who owes whom)
    const debtors: { id: string; name: string; amount: number }[] = [];
    const creditors: { id: string; name: string; amount: number }[] = [];

    memberSplits.forEach(s => {
      if (s.balance < -0.01) {
        debtors.push({ id: s.user.id, name: s.user.name, amount: Math.abs(s.balance) });
      } else if (s.balance > 0.01) {
        creditors.push({ id: s.user.id, name: s.user.name, amount: s.balance });
      }
    });

    const settlements: { from: string; to: string; amount: number }[] = [];
    let dIdx = 0, cIdx = 0;

    while (dIdx < debtors.length && cIdx < creditors.length) {
      const debtor = debtors[dIdx];
      const creditor = creditors[cIdx];
      const settlementAmount = Math.min(debtor.amount, creditor.amount);

      settlements.push({
        from: debtor.name,
        to: creditor.name,
        amount: settlementAmount,
      });

      debtor.amount -= settlementAmount;
      creditor.amount -= settlementAmount;

      if (debtor.amount < 0.01) dIdx++;
      if (creditor.amount < 0.01) cIdx++;
    }

    return {
      totalBazar,
      totalBills,
      grandTotal,
      averageSpend,
      memberSplits,
      settlements,
      monthEntriesCount: monthEntries.length,
      monthBillsCount: monthBills.length,
    };
  }, [entries, bills]);

  // Action handlers
  const handleAddExpense = (productName: string, price: number, quantity: number, unit: BazarUnit, dateStr: string, notes: string) => {
    const matchedProduct = MOCK_PRODUCTS.find(p => p.name.toLowerCase() === productName.toLowerCase()) || {
      id: "p_" + Date.now(),
      name: productName,
      emoji: "🛒"
    };

    const newEntry: MockBazarEntry = {
      id: "e_" + Date.now(),
      product: matchedProduct,
      price,
      quantity,
      unit,
      date: new Date(dateStr),
      notes: notes || undefined,
      user: MOCK_USERS[0] // Ahmed Hassan
    };

    setEntries(prev => [newEntry, ...prev]);
  };

  const handleAddBill = (category: BillCategory, title: string, amount: number, dateStr: string, notes: string) => {
    const newBill: MockBill = {
      id: "b_" + Date.now(),
      category,
      title,
      amount,
      date: new Date(dateStr),
      notes: notes || undefined,
      user: MOCK_USERS[0] // Ahmed Hassan
    };

    setBills(prev => [newBill, ...prev]);
  };

  const handleDeleteExpense = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const handleDeleteBill = (id: string) => {
    setBills(prev => prev.filter(b => b.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#1a0e07] text-[#f5ede2] flex font-sans overflow-hidden size-full">
      
      {/* Left Sidebar */}
      <aside className="w-80 bg-[#251508] border-r border-[rgba(232,160,32,0.15)] flex flex-col flex-shrink-0 select-none">
        {/* App Logo */}
        <div className="flex items-center gap-3 p-6 border-b border-[rgba(232,160,32,0.1)]">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-primary flex items-center justify-center">
            <img src="/assets/logo.png" alt="Bazar Hisab" className="w-full h-full object-contain rounded-xl" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground leading-none" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
              My Bazar <span className="text-primary">Hisab</span>
            </h1>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">Desktop Manager</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5">
          {[
            { id: "overview", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
            { id: "expenses", label: "Bazar Expenses", icon: <ShoppingBag className="w-4 h-4" /> },
            { id: "bills", label: "Monthly Bills", icon: <Receipt className="w-4 h-4" /> },
            { id: "members", label: "Group Members", icon: <Users className="w-4 h-4" /> },
            { id: "settings", label: "Account Settings", icon: <Settings className="w-4 h-4" /> },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setTab(item.id as never)}
              className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer text-left"
              style={{
                background: tab === item.id ? "rgba(232,160,32,0.15)" : "transparent",
                color: tab === item.id ? "#e8a020" : "#a08060",
                border: tab === item.id ? "1px solid rgba(232,160,32,0.25)" : "1px solid transparent",
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* User Card with functional Logout */}
        <div className="p-4 border-t border-[rgba(232,160,32,0.1)] flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-sm text-primary-foreground">
            AH
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold truncate">Ahmed Hassan</h4>
            <p className="text-[10px] text-muted-foreground truncate font-mono">ahmed@email.com</p>
          </div>
          <button 
            onClick={onLogout}
            className="p-2 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Workspace Content */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Header */}
        <header className="h-20 border-b border-[rgba(232,160,32,0.1)] px-8 flex items-center justify-between flex-shrink-0 bg-[#251508]/30">
          <div>
            <h2 className="text-xl font-bold tracking-tight capitalize" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {tab === "overview" ? "Dashboard Overview" : tab === "members" ? "Group split billing" : `${tab} dashboard`}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold font-mono">
              <span>{stats.groupName} ⭐️</span>
            </div>
            
            {/* Action buttons */}
            <button
              onClick={() => setShowAddExpense(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-xl transition-all hover:bg-accent cursor-pointer shadow-md shadow-primary/20"
            >
              <Plus className="w-4 h-4" /> Add Expense
            </button>
            <button
              onClick={() => setShowAddBill(true)}
              className="flex items-center gap-2 px-4 py-2 border border-accent text-accent text-sm font-semibold rounded-xl transition-all hover:bg-accent/10 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Bill
            </button>
          </div>
        </header>

        {/* Tab content scroll viewport */}
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="h-full flex flex-col gap-6 animate-fade-in"
            >
              
              {/* TAB: OVERVIEW */}
              {tab === "overview" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 flex-shrink-0">
                    <StatCard title="Bazar Total" value={calculations.totalBazar} subtitle={`${calculations.monthEntriesCount} items this month`} color="text-primary" />
                    <StatCard title="Bills Total" value={calculations.totalBills} subtitle={`${calculations.monthBillsCount} bills this month`} color="text-accent" />
                    <StatCard title="Grand Total" value={calculations.grandTotal} subtitle="Combined account volume" color="text-green-400" />
                    <StatCard title="Group Members" value={MOCK_USERS.length} subtitle="Active shared billers" color="text-blue-400" isCount />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                    {/* Balances list */}
                    <div className="lg:col-span-2 bg-[#251508]/50 border border-[rgba(232,160,32,0.15)] rounded-2xl p-6 flex flex-col">
                      <h3 className="text-base font-bold mb-4 font-mono uppercase text-muted-foreground tracking-wider">Group Balances</h3>
                      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                        {calculations.memberSplits.map(s => {
                          const isPositive = s.balance >= 0;
                          return (
                            <div key={s.user.id} className="flex items-center justify-between p-4 rounded-xl border border-[rgba(232,160,32,0.08)] bg-[#251508]">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[#f5ede2]" style={{ background: avatarColor(s.user.id) }}>
                                  {initials(s.user.name)}
                                </div>
                                <div>
                                  <h4 className="text-sm font-semibold">{s.user.name}</h4>
                                  <p className="text-[10px] text-muted-foreground font-mono">Spent: {fmtFull(s.spent)}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className={`text-sm font-bold font-mono ${isPositive ? "text-green-400" : "text-destructive"}`}>
                                  {isPositive ? "+" : ""}{fmtFull(s.balance)}
                                </p>
                                <p className="text-[9px] text-muted-foreground">
                                  {isPositive ? "Owed to them" : "They owe"}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Split settlements */}
                    <div className="bg-[#251508]/50 border border-[rgba(232,160,32,0.15)] rounded-2xl p-6 flex flex-col">
                      <h3 className="text-base font-bold mb-4 font-mono uppercase text-muted-foreground tracking-wider">Who owes Whom</h3>
                      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                        {calculations.settlements.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground py-10">
                            <span className="text-3xl mb-2">🎉</span>
                            <p className="text-xs">All accounts settled!</p>
                          </div>
                        ) : (
                          calculations.settlements.map((s, idx) => (
                            <div key={idx} className="p-4 rounded-xl border border-dashed border-primary/25 bg-primary/5 flex flex-col gap-2">
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span className="font-semibold text-destructive">{s.from}</span>
                                <span>owes</span>
                                <span className="font-semibold text-green-400">{s.to}</span>
                              </div>
                              <div className="text-lg font-bold text-primary font-mono text-center">
                                {fmtFull(s.amount)}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* TAB: EXPENSES */}
              {tab === "expenses" && (
                <div className="flex-1 flex flex-col gap-4 min-h-0 bg-[#251508]/50 border border-[rgba(232,160,32,0.15)] rounded-2xl p-6">
                  <div className="flex items-center justify-between gap-4 flex-shrink-0">
                    <div className="relative w-80">
                      <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        value={expenseSearch}
                        onChange={e => setExpenseSearch(e.target.value)}
                        placeholder="Search product or buyer..."
                        className="w-full pl-10 pr-4 py-2 bg-[#2e1a0a] border border-border rounded-xl text-sm placeholder-muted-foreground outline-none text-[#f5ede2]"
                      />
                    </div>

                    <div className="flex gap-2 p-0.5 border border-border rounded-xl bg-[#251508]">
                      {(["month", "all"] as const).map(f => (
                        <button
                          key={f}
                          onClick={() => setExpenseFilter(f)}
                          className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                          style={{
                            background: expenseFilter === f ? "#e8a020" : "transparent",
                            color: expenseFilter === f ? "#1a0e07" : "#a08060",
                          }}
                        >
                          {f === "month" ? "This Month" : "All Time"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 overflow-auto rounded-xl border border-[rgba(232,160,32,0.1)]">
                    <table className="w-full border-collapse text-left text-sm">
                      <thead className="bg-[#2e1a0a] text-muted-foreground font-mono text-xs border-b border-[rgba(232,160,32,0.1)] sticky top-0">
                        <tr>
                          <th className="p-4">Item</th>
                          <th className="p-4">Added by</th>
                          <th className="p-4">Date</th>
                          <th className="p-4 text-right">Price</th>
                          <th className="p-4 text-right">Qty</th>
                          <th className="p-4 text-right">Total</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[rgba(232,160,32,0.06)] bg-[#251508]/20">
                        {entries
                          .filter(e => {
                            const isThisMonth = (d: Date) => {
                              const now = new Date();
                              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                            };
                            if (expenseFilter === "month" && !isThisMonth(e.date)) return false;
                            const query = expenseSearch.toLowerCase();
                            return (
                              e.product.name.toLowerCase().includes(query) ||
                              e.user.name.toLowerCase().includes(query) ||
                              (e.notes && e.notes.toLowerCase().includes(query))
                            );
                          })
                          .map(e => (
                            <tr key={e.id} className="hover:bg-primary/5 transition-colors">
                              <td className="p-4 font-semibold flex items-center gap-2">
                                <span className="text-xl">{e.product.emoji}</span>
                                <div>
                                  <p>{e.product.name}</p>
                                  {e.notes && <p className="text-[10px] text-muted-foreground font-normal italic">{e.notes}</p>}
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <AvatarCircle name={e.user.name} id={e.user.id} />
                                  <span>{e.user.name}</span>
                                </div>
                              </td>
                              <td className="p-4 text-muted-foreground font-mono text-xs">{fmtDate(e.date)}</td>
                              <td className="p-4 text-right font-mono">৳{e.price.toLocaleString()}</td>
                              <td className="p-4 text-right font-mono text-xs">{e.quantity} {e.unit}</td>
                              <td className="p-4 text-right font-bold text-primary font-mono">৳{(e.price * e.quantity).toLocaleString()}</td>
                              <td className="p-4 text-center">
                                <button
                                  onClick={() => handleDeleteExpense(e.id)}
                                  className="p-1.5 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB: BILLS */}
              {tab === "bills" && (
                <div className="flex-1 flex flex-col gap-4 min-h-0 bg-[#251508]/50 border border-[rgba(232,160,32,0.15)] rounded-2xl p-6">
                  <div className="flex items-center justify-between gap-4 flex-shrink-0">
                    <div className="relative w-80">
                      <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        value={billSearch}
                        onChange={e => setBillSearch(e.target.value)}
                        placeholder="Search bill or payer..."
                        className="w-full pl-10 pr-4 py-2 bg-[#2e1a0a] border border-border rounded-xl text-sm placeholder-muted-foreground outline-none text-[#f5ede2]"
                      />
                    </div>

                    <div className="flex gap-2 p-0.5 border border-border rounded-xl bg-[#251508]">
                      {(["month", "all"] as const).map(f => (
                        <button
                          key={f}
                          onClick={() => setPageFilter(f)}
                          className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                          style={{
                            background: billFilter === f ? "#e8a020" : "transparent",
                            color: billFilter === f ? "#1a0e07" : "#a08060",
                          }}
                        >
                          {f === "month" ? "This Month" : "All Time"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 overflow-auto rounded-xl border border-[rgba(232,160,32,0.1)]">
                    <table className="w-full border-collapse text-left text-sm">
                      <thead className="bg-[#2e1a0a] text-muted-foreground font-mono text-xs border-b border-[rgba(232,160,32,0.1)] sticky top-0">
                        <tr>
                          <th className="p-4">Category</th>
                          <th className="p-4">Bill Title</th>
                          <th className="p-4">Paid by</th>
                          <th className="p-4">Date</th>
                          <th className="p-4 text-right">Amount</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[rgba(232,160,32,0.06)] bg-[#251508]/20">
                        {bills
                          .filter(b => {
                            const isThisMonth = (d: Date) => {
                              const now = new Date();
                              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                            };
                            if (billFilter === "month" && !isThisMonth(b.date)) return false;
                            const query = billSearch.toLowerCase();
                            return (
                              b.title.toLowerCase().includes(query) ||
                              b.user.name.toLowerCase().includes(query) ||
                              b.category.toLowerCase().includes(query)
                            );
                          })
                          .map(b => {
                            const meta = BILL_META[b.category];
                            return (
                              <tr key={b.id} className="hover:bg-accent/5 transition-colors">
                                <td className="p-4">
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold font-mono"
                                    style={{ background: `${meta.color}15`, color: meta.color, border: `1px solid ${meta.color}30` }}>
                                    {meta.icon}
                                    {meta.label}
                                  </span>
                                </td>
                                <td className="p-4 font-semibold">
                                  <p>{b.title}</p>
                                  {b.notes && <p className="text-[10px] text-muted-foreground font-normal italic">{b.notes}</p>}
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center gap-2">
                                    <AvatarCircle name={b.user.name} id={b.user.id} />
                                    <span>{b.user.name}</span>
                                  </div>
                                </td>
                                <td className="p-4 text-muted-foreground font-mono text-xs">{fmtDate(b.date)}</td>
                                <td className="p-4 text-right font-bold text-accent font-mono">৳{b.amount.toLocaleString()}</td>
                                <td className="p-4 text-center">
                                  <button
                                    onClick={() => handleDeleteBill(b.id)}
                                    className="p-1.5 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors cursor-pointer"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB: MEMBERS */}
              {tab === "members" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-shrink-0">
                  {calculations.memberSplits.map(s => (
                    <div key={s.user.id} className="bg-[#251508]/50 border border-[rgba(232,160,32,0.15)] rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-primary/5 -translate-y-8 translate-x-8 pointer-events-none" />
                      
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-white" style={{ background: avatarColor(s.user.id) }}>
                          {initials(s.user.name)}
                        </div>
                        <div>
                          <h3 className="text-base font-bold">{s.user.name}</h3>
                          <p className="text-xs text-muted-foreground">{s.user.phone}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">{s.user.email}</p>
                        </div>
                      </div>

                      <div className="h-px bg-border my-2" />

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">Total Spent</p>
                          <p className="text-lg font-bold text-foreground font-mono">{fmtFull(s.spent)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">Average Share</p>
                          <p className="text-lg font-semibold text-muted-foreground font-mono">{fmtFull(calculations.averageSpend)}</p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl border flex items-center justify-between"
                        style={{
                          background: s.balance >= 0 ? "rgba(34,197,94,0.06)" : "rgba(239,68,68,0.06)",
                          borderColor: s.balance >= 0 ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)",
                        }}>
                        <span className="text-xs font-semibold" style={{ color: s.balance >= 0 ? "#4ade80" : "#f87171" }}>
                          {s.balance >= 0 ? "Owed Balance" : "Owning Balance"}
                        </span>
                        <span className="text-sm font-bold font-mono" style={{ color: s.balance >= 0 ? "#4ade80" : "#f87171" }}>
                          {s.balance >= 0 ? "+" : ""}{fmtFull(s.balance)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB: SETTINGS */}
              {tab === "settings" && (
                <div className="max-w-2xl bg-[#251508]/50 border border-[rgba(232,160,32,0.15)] rounded-2xl p-8 flex flex-col gap-6">
                  <h3 className="text-lg font-bold" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>Edit Desktop Configuration</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Bazar Group Name</label>
                      <input type="text" defaultValue={stats.groupName} className="px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl outline-none font-sans" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Currency Sign</label>
                      <input type="text" defaultValue="৳ (BDT)" className="px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl outline-none font-mono" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-4">
                    <div className="flex items-center justify-between p-4 rounded-xl border border-[rgba(232,160,32,0.1)] bg-[#251508]">
                      <div>
                        <h4 className="text-sm font-bold">Auto Split Recalculator</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">Automatically calculates debtors and creditors dynamically on change.</p>
                      </div>
                      <div className="w-10 h-6 bg-primary rounded-full relative flex items-center px-1"><div className="w-4 h-4 bg-white rounded-full absolute right-1" /></div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-xl border border-[rgba(232,160,32,0.1)] bg-[#251508]">
                      <div>
                        <h4 className="text-sm font-bold">Local Storage Sync</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">Saves all state entries locally inside the client browser storage.</p>
                      </div>
                      <div className="w-10 h-6 bg-primary rounded-full relative flex items-center px-1"><div className="w-4 h-4 bg-white rounded-full absolute right-1" /></div>
                    </div>
                  </div>

                  <button className="px-6 py-3.5 bg-primary text-primary-foreground font-bold rounded-xl self-start transition-all hover:bg-accent cursor-pointer">
                    Save Setup
                  </button>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* ADD EXPENSE MODAL */}
      <Modal show={showAddExpense} onClose={() => setShowAddExpense(false)} title="Add Bazar Expense">
        <AddExpenseForm
          onSubmit={(prod, price, qty, unit, date, notes) => {
            handleAddExpense(prod, price, qty, unit, date, notes);
            setShowAddExpense(false);
          }}
          onClose={() => setShowAddExpense(false)}
        />
      </Modal>

      {/* ADD BILL MODAL */}
      <Modal show={showAddBill} onClose={() => setShowAddBill(false)} title="Add Monthly Bill">
        <AddBillForm
          onSubmit={(cat, title, amount, date, notes) => {
            handleAddBill(cat, title, amount, date, notes);
            setShowAddBill(false);
          }}
          onClose={() => setShowAddBill(false)}
        />
      </Modal>

    </div>
  );

  // Helper set page filter for bills
  function setPageFilter(f: "month" | "all") {
    setBillFilter(f);
  }
}

// Helper components for workspace
function StatCard({ title, value, subtitle, color, isCount = false }: { title: string; value: number; subtitle: string; color: string; isCount?: boolean }) {
  return (
    <div className="bg-[#251508]/50 border border-[rgba(232,160,32,0.15)] rounded-2xl p-6 flex flex-col gap-2 relative overflow-hidden"
      style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest font-mono">{title}</p>
      <p className={`text-3xl font-extrabold ${color} font-mono mt-1`}>
        {isCount ? value.toLocaleString() : fmt(value)}
      </p>
      <p className="text-[10px] text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>{subtitle}</p>
    </div>
  );
}

function AvatarCircle({ name, id }: { name: string; id: string }) {
  return (
    <div className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[9px] text-[#f5ede2] flex-shrink-0"
      style={{ background: avatarColor(id) }}>
      {initials(name)}
    </div>
  );
}

function Modal({ show, onClose, title, children }: { show: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-lg bg-[#251508] border border-border rounded-3xl p-8 relative z-10 shadow-2xl"
            style={{ boxShadow: "0 20px 80px rgba(0,0,0,0.7)" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>{title}</h3>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#2e1a0a] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function AddExpenseForm({ onSubmit, onClose }: { onSubmit: (prod: string, price: number, qty: number, unit: BazarUnit, date: string, notes: string) => void; onClose: () => void }) {
  const [product, setProduct] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState<BazarUnit>("KG");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !price || !quantity) return;
    onSubmit(product, Number(price), Number(quantity), unit, date, notes);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Product Name</label>
        <input type="text" value={product} onChange={e => setProduct(e.target.value)} required placeholder="e.g. Rice, Hilsha Fish, Onion"
          className="w-full px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl text-sm placeholder-muted-foreground outline-none" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Price (৳)</label>
          <input type="number" value={price} onChange={e => setPrice(e.target.value)} required placeholder="0.00"
            className="w-full px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl text-sm placeholder-muted-foreground outline-none font-mono" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Quantity</label>
          <input type="number" step="any" value={quantity} onChange={e => setQuantity(e.target.value)} required placeholder="e.g. 2, 1.5"
            className="w-full px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl text-sm placeholder-muted-foreground outline-none font-mono" />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Unit</label>
        <div className="flex gap-2">
          {(["KG", "PIECE", "GM"] as BazarUnit[]).map(u => (
            <button key={u} type="button" onClick={() => setUnit(u)} className="flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer font-mono"
              style={{ borderColor: unit === u ? "rgba(232,160,32,0.8)" : "rgba(232,160,32,0.18)", background: unit === u ? "rgba(232,160,32,0.15)" : "#2e1a0a", color: unit === u ? "#e8a020" : "#a08060" }}>{u}</button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Purchase Date</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} required
          className="w-full px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none text-foreground font-mono" style={{ colorScheme: "dark" }} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Notes (optional)</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Add purchase details..."
          className="w-full px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl text-sm placeholder-muted-foreground outline-none resize-none" />
      </div>
      <div className="flex gap-3 mt-4">
        <button type="button" onClick={onClose} className="flex-1 py-3 border border-border text-foreground font-bold rounded-xl transition-all hover:bg-secondary cursor-pointer">Cancel</button>
        <button type="submit" className="flex-1 py-3 bg-primary text-primary-foreground font-bold rounded-xl transition-all hover:bg-accent cursor-pointer">Save Entry</button>
      </div>
    </form>
  );
}

function AddBillForm({ onSubmit, onClose }: { onSubmit: (cat: BillCategory, title: string, amount: number, date: string, notes: string) => void; onClose: () => void }) {
  const [category, setCategory] = useState<BillCategory>("RENT");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;
    onSubmit(category, title, Number(amount), date, notes);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Category</label>
          <select value={category} onChange={e => setCategory(e.target.value as BillCategory)}
            className="w-full px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none text-foreground font-sans" style={{ colorScheme: "dark" }}>
            {BILL_CATEGORIES_LIST.map(c => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Amount (৳)</label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required placeholder="0.00"
            className="w-full px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl text-sm placeholder-muted-foreground outline-none font-mono" />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Bill Title</label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. July House Rent, Wi-Fi Bill"
          className="w-full px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl text-sm placeholder-muted-foreground outline-none" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Billing Date</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} required
          className="w-full px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none text-foreground font-mono" style={{ colorScheme: "dark" }} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Notes (optional)</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Add billing details..."
          className="w-full px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl text-sm placeholder-muted-foreground outline-none resize-none" />
      </div>
      <div className="flex gap-3 mt-4">
        <button type="button" onClick={onClose} className="flex-1 py-3 border border-border text-foreground font-bold rounded-xl transition-all hover:bg-secondary cursor-pointer">Cancel</button>
        <button type="submit" className="flex-1 py-3 bg-primary text-primary-foreground font-bold rounded-xl transition-all hover:bg-accent cursor-pointer">Save Bill</button>
      </div>
    </form>
  );
}

const AVATAR_COLORS = ["#c06010", "#8b6914", "#3d7a5c", "#5a4a8a", "#7a3d3d"];

function avatarColor(id: string) {
  return AVATAR_COLORS[id.charCodeAt(1) % AVATAR_COLORS.length];
}

function initials(name: string) {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

const BILL_CATEGORIES_LIST = Object.entries(BILL_META).map(([k, v]) => ({ key: k as BillCategory, label: v.label }));
