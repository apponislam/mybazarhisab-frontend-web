import React, { useState } from "react";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { MockBazarEntry } from "@/types";
import { FilterTabs, Avatar } from "@/components/app/ui/Shared";
import { fmtFull, fmtDate, isThisMonth } from "@/lib/mockData";

const now = new Date();

function ExpenseRow({ entry, onClick }: { entry: MockBazarEntry; onClick: () => void }) {
    const total = entry.price * entry.quantity;
    return (
        <motion.button
            type="button"
            onClick={onClick}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full flex items-center gap-3 p-4 rounded-2xl border border-border bg-card hover:border-primary/40 transition-all text-left cursor-pointer"
            style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.3)" }}
        >
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-2xl">{entry.product.emoji}</div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {entry.product.name}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                    <Avatar user={entry.user} size={16} />
                    <p className="text-xs text-muted-foreground truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {entry.user.name}
                    </p>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                    {entry.quantity} {entry.unit} · {fmtDate(entry.date)}
                </p>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
                <p className="text-sm font-bold text-primary font-mono">{fmtFull(total)}</p>
                <p className="text-xs text-muted-foreground font-mono">
                    ৳{entry.price}/{entry.unit}
                </p>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
        </motion.button>
    );
}

export function ExpensesTab({ entries, onDetail }: { entries: MockBazarEntry[]; onDetail: (e: MockBazarEntry) => void }) {
    const [filter, setFilter] = useState<"month" | "all">("month");
    const filtered = filter === "month" ? entries.filter((e) => isThisMonth(e.date)) : entries;
    const total = filtered.reduce((s, e) => s + e.price * e.quantity, 0);
    const mn = now.toLocaleString("default", { month: "long" });

    return (
        <div className="flex flex-col flex-1 min-h-0">
            <div className="px-6 pt-12 pb-4 shrink-0">
                <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                    Bazar <span className="text-primary">Expenses</span>
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {filtered.length} entries · <span className="text-primary font-semibold font-mono">{fmtFull(total)}</span>
                    {filter === "month" && <span className="text-muted-foreground"> in {mn}</span>}
                </p>
            </div>
            <div className="shrink-0">
                <FilterTabs active={filter} onChange={setFilter} />
            </div>
            <div className="flex-1 overflow-y-auto px-6 pb-4 flex flex-col gap-3">
                {filtered.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
                        <div className="text-4xl mb-3">🛒</div>
                        <p className="text-muted-foreground text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                            No expenses this month
                        </p>
                    </div>
                ) : (
                    filtered.map((e, i) => (
                        <motion.div key={e.id} transition={{ delay: i * 0.04 }}>
                            <ExpenseRow entry={e} onClick={() => onDetail(e)} />
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
export default ExpensesTab;
