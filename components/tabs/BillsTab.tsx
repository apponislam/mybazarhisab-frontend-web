import React, { useState } from "react";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { MockBill } from "@/types";
import { FilterTabs, Avatar } from "@/components/ui/Shared";
import { fmtFull, fmtDate, isThisMonth, BILL_META } from "@/lib/mockData";

const now = new Date();

function BillRow({ bill, onClick }: { bill: MockBill; onClick: () => void }) {
    const meta = BILL_META[bill.category];
    return (
        <motion.button
            type="button"
            onClick={onClick}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full flex items-center gap-3 p-4 rounded-2xl border border-border bg-card hover:border-primary/40 transition-all text-left cursor-pointer"
            style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.3)" }}
        >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border" style={{ background: `${meta.color}20`, borderColor: `${meta.color}40`, color: meta.color }}>
                {meta.icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {bill.title}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                    <Avatar user={bill.user} size={16} />
                    <p className="text-xs text-muted-foreground truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {bill.user.name}
                    </p>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs px-1.5 py-0.5 rounded-md font-medium font-mono" style={{ background: `${meta.color}18`, color: meta.color }}>
                        {meta.label}
                    </span>
                    <span className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {fmtDate(bill.date)}
                    </span>
                </div>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
                <p className="text-sm font-bold text-foreground font-mono">{fmtFull(bill.amount)}</p>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
        </motion.button>
    );
}

export function BillsTab({ bills, onDetail }: { bills: MockBill[]; onDetail: (b: MockBill) => void }) {
    const [filter, setFilter] = useState<"month" | "all">("month");
    const filtered = filter === "month" ? bills.filter((b) => isThisMonth(b.date)) : bills;
    const total = filtered.reduce((s, b) => s + b.amount, 0);
    const mn = now.toLocaleString("default", { month: "long" });

    return (
        <div className="flex flex-col flex-1 min-h-0">
            <div className="px-6 pt-12 pb-4 shrink-0">
                <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                    Monthly <span className="text-primary">Bills</span>
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {filtered.length} bills · <span className="text-primary font-semibold font-mono">{fmtFull(total)}</span>
                    {filter === "month" && <span className="text-muted-foreground"> in {mn}</span>}
                </p>
            </div>
            <div className="shrink-0">
                <FilterTabs active={filter} onChange={setFilter} />
            </div>
            <div className="flex-1 overflow-y-auto px-6 pb-4 flex flex-col gap-3">
                {filtered.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
                        <div className="text-4xl mb-3">🧾</div>
                        <p className="text-muted-foreground text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                            No bills this month
                        </p>
                    </div>
                ) : (
                    filtered.map((b, i) => (
                        <motion.div key={b.id} transition={{ delay: i * 0.04 }}>
                            <BillRow bill={b} onClick={() => onDetail(b)} />
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
export default BillsTab;
