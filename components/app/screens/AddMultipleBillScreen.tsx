import React, { useState } from "react";
import { motion } from "motion/react";
import { Receipt, AlignLeft, Calendar, Plus, Trash2, Layers, ChevronRight, X } from "lucide-react";
import { toast } from "sonner";
import { BillCategory } from "@/types";
import { ScreenShell, BackButton, PrimaryButton, FieldBox } from "@/components/app/ui/Shared";
import { toInputDate, BILL_META, BILL_CATEGORIES } from "@/lib/mockData";
import { useCreateBulkBillsMutation } from "@/redux/features/bill/billApi";

interface BillRowItem {
    id: string;
    category: BillCategory;
    title: string;
    amount: string;
    date: string;
    notes: string;
}

export function AddMultipleBillScreen({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
    const [createBulkBills, { isLoading }] = useCreateBulkBillsMutation();
    const todayDate = toInputDate(new Date());

    const [rows, setRows] = useState<BillRowItem[]>([
        { id: "1", category: "RENT", title: "", amount: "", date: todayDate, notes: "" },
        { id: "2", category: "UTILITIES", title: "", amount: "", date: todayDate, notes: "" },
    ]);

    const [activeCategoryPickerId, setActiveCategoryPickerId] = useState<string | null>(null);

    const handleAddRow = () => {
        const lastRowDate = rows.length > 0 ? rows[rows.length - 1].date : todayDate;
        setRows((prev) => [
            ...prev,
            { id: Date.now().toString(), category: "UTILITIES", title: "", amount: "", date: lastRowDate, notes: "" },
        ]);
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
        <ScreenShell scrollable>
            <div className="flex flex-col px-6 pt-12 pb-8 relative">
                <BackButton onBack={onBack} label="Cancel" />
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-accent flex items-center justify-center shadow-md shadow-accent/30">
                            <Receipt className="w-5 h-5 text-white" strokeWidth={2} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                                Bulk Add Bills
                            </h2>
                            <p className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                Add multiple bills at once
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* Bill Rows */}
                    <div className="flex flex-col gap-4">
                        {rows.map((row, index) => {
                            const meta = BILL_META[row.category];
                            return (
                                <div key={row.id} className="p-4 rounded-2xl border border-border/60 bg-card/60 flex flex-col gap-3 relative shadow-xs">
                                    <div className="flex items-center justify-between border-b border-border/40 pb-2">
                                        <span className="text-xs font-semibold text-accent">Bill Item #{index + 1}</span>
                                        {rows.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveRow(row.id)}
                                                className="text-destructive/80 hover:text-destructive p-1 transition-colors cursor-pointer"
                                                title="Remove Item"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Category Select Button */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-medium text-foreground/80" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                            Category
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setActiveCategoryPickerId(row.id)}
                                            className="flex items-center gap-3 p-2 rounded-xl border transition-all text-left cursor-pointer"
                                            style={{ borderColor: "rgba(232,160,32,0.3)", background: "#2e1a0a" }}
                                        >
                                            <div
                                                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border text-xs"
                                                style={{ background: `${meta.color}20`, borderColor: `${meta.color}40`, color: meta.color }}
                                            >
                                                {meta.icon}
                                            </div>
                                            <span className="flex-1 text-xs font-medium text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                                {meta.label}
                                            </span>
                                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <FieldBox label="Title">
                                            <div className="flex items-center">
                                                <span className="pl-3 text-muted-foreground">
                                                    <AlignLeft className="w-4 h-4" />
                                                </span>
                                                <input
                                                    value={row.title}
                                                    onChange={(e) => updateRow(row.id, { title: e.target.value })}
                                                    placeholder="e.g. July Rent"
                                                    className="w-full px-3 py-2.5 bg-transparent text-sm outline-none font-sans"
                                                />
                                            </div>
                                        </FieldBox>

                                        <FieldBox label="Date">
                                            <div className="flex items-center relative">
                                                <span className="pl-3 text-muted-foreground">
                                                    <Calendar className="w-4 h-4" />
                                                </span>
                                                <input
                                                    type="date"
                                                    value={row.date}
                                                    onChange={(e) => updateRow(row.id, { date: e.target.value })}
                                                    className="w-full px-3 py-2.5 bg-transparent text-sm outline-none font-sans"
                                                />
                                            </div>
                                        </FieldBox>
                                    </div>

                                    <FieldBox label="Amount (৳)">
                                        <div className="flex items-center relative">
                                            <span className="pl-3 text-xs font-bold text-muted-foreground">৳</span>
                                            <input
                                                type="number"
                                                step="any"
                                                value={row.amount}
                                                onChange={(e) => updateRow(row.id, { amount: e.target.value })}
                                                placeholder="0.00"
                                                className="w-full pl-2 pr-3 py-2.5 bg-transparent text-sm outline-none font-sans"
                                            />
                                        </div>
                                    </FieldBox>
                                </div>
                            );
                        })}
                    </div>

                    <button
                        type="button"
                        onClick={handleAddRow}
                        className="flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-accent/40 text-accent bg-accent/5 hover:bg-accent/10 transition-colors font-medium text-sm cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        Add Another Bill
                    </button>

                    <div className="pt-2">
                        <PrimaryButton
                            type="submit"
                            disabled={isLoading}
                            loading={isLoading}
                            label={`Save ${rows.filter((r) => r.title.trim() && Number(r.amount) > 0).length || rows.length} Bills`}
                            loadingLabel="Saving Bills..."
                        />
                    </div>
                </form>

                {/* Category Picker Sheet */}
                {activeCategoryPickerId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-50 flex flex-col justify-end"
                        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
                        onClick={() => setActiveCategoryPickerId(null)}
                    >
                        <motion.div
                            initial={{ y: 60 }}
                            animate={{ y: 0 }}
                            transition={{ type: "spring", damping: 28 }}
                            className="bg-card rounded-t-3xl border-t border-border p-5 pb-8 max-h-[70vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-base font-bold text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                    Select Category
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setActiveCategoryPickerId(null)}
                                    className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center cursor-pointer"
                                >
                                    <X className="w-3.5 h-3.5 text-muted-foreground" />
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
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
                                            <div
                                                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border"
                                                style={{ background: `${c.color}20`, borderColor: `${c.color}40`, color: c.color }}
                                            >
                                                {c.icon}
                                            </div>
                                            <span className="text-xs font-medium text-foreground truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                                {c.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </ScreenShell>
    );
}

export default AddMultipleBillScreen;
