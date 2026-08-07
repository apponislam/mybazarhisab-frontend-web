"use client";

import React, { useState } from "react";
import { Receipt, Plus, Trash2, Calendar, ArrowLeft, ChevronRight, X } from "lucide-react";
import { toast } from "sonner";
import { BillCategory } from "@/types";
import { BILL_META, BILL_CATEGORIES } from "@/lib/mockData";
import { useCreateBulkBillsMutation } from "@/redux/features/bill/billApi";

interface BillRowItem {
    id: string;
    category: BillCategory;
    title: string;
    amount: string;
    date: string;
    notes: string;
}

export function WebBulkBillScreen({ onBack, onDone, onSwitchToBulkExpense }: { onBack: () => void; onDone: () => void; onSwitchToBulkExpense?: () => void }) {
    const [createBulkBills, { isLoading }] = useCreateBulkBillsMutation();
    const todayDate = new Date().toISOString().slice(0, 10);

    const [rows, setRows] = useState<BillRowItem[]>([
        { id: "1", category: "RENT", title: "", amount: "", date: todayDate, notes: "" },
        { id: "2", category: "UTILITIES", title: "", amount: "", date: todayDate, notes: "" },
    ]);

    const [activeCategoryPickerId, setActiveCategoryPickerId] = useState<string | null>(null);

    const handleAddRow = () => {
        const lastRowDate = rows.length > 0 ? rows[rows.length - 1].date : todayDate;
        setRows((prev) => [...prev, { id: Date.now().toString(), category: "UTILITIES", title: "", amount: "", date: lastRowDate, notes: "" }]);
    };

    const handleRemoveRow = (id: string) => {
        if (rows.length <= 1) {
            toast.error("At least one bill item is required");
            return;
        }
        setRows((prev) => prev.filter((r) => r.id !== id));
    };

    const updateRow = (id: string, fields: Partial<BillRowItem>) => {
        setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...fields } : r)));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validRows = rows.filter((r) => r.title.trim().length > 0 && Number(r.amount) > 0);
        if (validRows.length === 0) {
            toast.error("Please enter a title and amount for at least one bill item");
            return;
        }

        try {
            const bills = validRows.map((r) => ({
                category: r.category,
                title: r.title.trim(),
                amount: Number(r.amount),
                date: r.date || todayDate,
                notes: r.notes.trim() || undefined,
            }));

            await createBulkBills({ bills }).unwrap();
            toast.success(`Successfully added ${bills.length} bills!`);
            onDone();
        } catch (err: any) {
            toast.error(err?.data?.message || err?.message || "Failed to create bulk bills");
        }
    };

    return (
        <div className="w-full flex flex-col gap-6 container mx-auto py-4">
            {/* Header & Back Button */}
            <div className="flex items-center justify-between bg-[#251508] border border-border p-6 rounded-3xl shadow-xl">
                <div className="flex items-center gap-4">
                    <button type="button" onClick={onBack} className="p-2.5 rounded-xl border border-border bg-[#2e1a0a] text-muted-foreground hover:text-foreground hover:border-accent/50 transition-colors cursor-pointer">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="w-12 h-12 rounded-2xl bg-accent/20 border border-accent/30 flex items-center justify-center text-accent">
                        <Receipt className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                            Bulk Add Monthly Bills
                        </h1>
                        <p className="text-xs text-muted-foreground font-mono">Add multiple utility or recurring bills at once using interactive bill cards</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {onSwitchToBulkExpense && (
                        <button type="button" onClick={onSwitchToBulkExpense} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-primary/40 text-primary bg-primary/10 hover:bg-primary/20 text-xs font-bold transition-all cursor-pointer">
                            <Plus className="w-3.5 h-3.5" /> Bulk Expense
                        </button>
                    )}
                    <button type="button" onClick={handleAddRow} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-accent/40 text-accent bg-accent/10 hover:bg-accent/20 text-xs font-bold transition-all cursor-pointer">
                        <Plus className="w-4 h-4" /> Add Bill Card
                    </button>
                    <button type="button" onClick={handleSubmit} disabled={isLoading} className="flex items-center gap-2 px-6 py-2.5 bg-accent text-white text-sm font-bold rounded-xl hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-accent/20 disabled:opacity-50">
                        {isLoading ? "Saving..." : `Save ${rows.filter((r) => r.title.trim() && Number(r.amount) > 0).length || rows.length} Bills`}
                    </button>
                </div>
            </div>

            {/* Desktop Responsive Cards Grid */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {rows.map((row, index) => {
                        const meta = BILL_META[row.category];
                        return (
                            <div key={row.id} className="p-5 rounded-3xl border border-border/80 bg-[#251508] flex flex-col gap-4 relative shadow-xl hover:border-accent/40 transition-all">
                                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                                    <span className="text-xs font-bold text-accent uppercase tracking-wider font-mono">Bill Item #{index + 1}</span>
                                    {rows.length > 1 && (
                                        <button type="button" onClick={() => handleRemoveRow(row.id)} className="text-destructive/80 hover:text-destructive p-1.5 hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer" title="Remove Bill">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Category</label>
                                        <button type="button" onClick={() => setActiveCategoryPickerId(row.id)} className="w-full px-3.5 py-2.5 bg-[#2e1a0a] border border-border rounded-xl text-xs flex items-center justify-between text-foreground hover:border-accent/50 transition-colors cursor-pointer">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <div className="w-4 h-4 flex items-center justify-center shrink-0" style={{ color: meta?.color || "#e8a020" }}>
                                                    {meta?.icon}
                                                </div>
                                                <span className="truncate font-medium">{meta?.label || row.category}</span>
                                            </div>
                                            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                        </button>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Bill Title</label>
                                        <input type="text" value={row.title} onChange={(e) => updateRow(row.id, { title: e.target.value })} placeholder="e.g. House Rent, Wi-Fi" className="w-full px-3.5 py-2.5 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none text-foreground font-sans" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Amount (৳)</label>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-3.5 text-xs font-bold text-muted-foreground">৳</span>
                                            <input type="number" step="any" value={row.amount} onChange={(e) => updateRow(row.id, { amount: e.target.value })} placeholder="0.00" className="w-full pl-8 pr-3 py-2.5 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none font-mono text-foreground" />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Billing Date</label>
                                        <input type="date" value={row.date} onChange={(e) => updateRow(row.id, { date: e.target.value })} className="w-full px-3.5 py-2.5 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none font-mono text-foreground" style={{ colorScheme: "dark" }} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/40">
                    <button type="button" onClick={handleAddRow} className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-dashed border-accent/40 text-accent bg-accent/5 hover:bg-accent/10 text-sm font-semibold transition-colors cursor-pointer">
                        <Plus className="w-4 h-4" /> Add Another Bill Card
                    </button>
                    <div className="flex items-center gap-3">
                        <button type="button" onClick={onBack} className="px-6 py-3 border border-border text-foreground font-bold rounded-xl hover:bg-secondary transition-all cursor-pointer text-sm">
                            Cancel
                        </button>
                        <button type="submit" disabled={isLoading} className="px-8 py-3 bg-accent text-white font-bold rounded-xl hover:opacity-90 transition-all cursor-pointer text-sm shadow-lg shadow-accent/20 disabled:opacity-50">
                            {isLoading ? "Saving Bills..." : `Save ${rows.filter((r) => r.title.trim() && Number(r.amount) > 0).length || rows.length} Bills`}
                        </button>
                    </div>
                </div>
            </form>

            {/* Desktop Modal for Category Picker */}
            {activeCategoryPickerId && (
                <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => setActiveCategoryPickerId(null)}>
                    <div className="w-full max-w-lg bg-[#251508] border border-border rounded-3xl p-6 flex flex-col gap-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between border-b border-border pb-3">
                            <h3 className="text-base font-bold text-foreground">Select Category</h3>
                            <button type="button" onClick={() => setActiveCategoryPickerId(null)} className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
                            {BILL_CATEGORIES.map((c) => {
                                const currentRow = rows.find((r) => r.id === activeCategoryPickerId);
                                const isSelected = currentRow?.category === c.key;
                                return (
                                    <button
                                        key={c.key}
                                        type="button"
                                        onClick={() => {
                                            updateRow(activeCategoryPickerId, { category: c.key });
                                            setActiveCategoryPickerId(null);
                                        }}
                                        className="flex items-center gap-2.5 p-3 rounded-xl border transition-all text-left cursor-pointer"
                                        style={{
                                            borderColor: isSelected ? `${c.color}70` : "rgba(232,160,32,0.15)",
                                            background: isSelected ? `${c.color}15` : "rgba(46,26,10,0.8)",
                                        }}
                                    >
                                        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border text-xs" style={{ background: `${c.color}20`, borderColor: `${c.color}40`, color: c.color }}>
                                            {c.icon}
                                        </div>
                                        <span className="text-xs font-medium text-foreground truncate">{c.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default WebBulkBillScreen;
