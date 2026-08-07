"use client";

import React, { useState } from "react";
import { Layers, Plus, Trash2, Calendar, Package, Weight, ArrowLeft, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { BazarUnit } from "@/types";
import { useCreateBulkBazarEntriesMutation } from "@/redux/features/bazar-entry/bazarEntryApi";
import { ProductSelectInput } from "@/components/dashboard/expenses/ProductSelectInput";

interface RowItem {
    id: string;
    product: string;
    productId?: string;
    price: string;
    priceMode: "unit" | "total";
    quantity: string;
    unit: BazarUnit;
    date: string;
    notes: string;
}

export function WebBulkExpenseScreen({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
    const [createBulkBazarEntries, { isLoading }] = useCreateBulkBazarEntriesMutation();
    const todayDate = new Date().toISOString().slice(0, 10);

    const [rows, setRows] = useState<RowItem[]>([
        { id: "1", product: "", price: "", priceMode: "unit", quantity: "1", unit: "KG", date: todayDate, notes: "" },
        { id: "2", product: "", price: "", priceMode: "unit", quantity: "1", unit: "KG", date: todayDate, notes: "" },
    ]);

    const handleAddRow = () => {
        const lastRowDate = rows.length > 0 ? rows[rows.length - 1].date : todayDate;
        setRows((prev) => [...prev, { id: Date.now().toString(), product: "", price: "", priceMode: "unit", quantity: "1", unit: "KG", date: lastRowDate, notes: "" }]);
    };

    const handleRemoveRow = (id: string) => {
        if (rows.length <= 1) {
            toast.error("At least one entry item is required");
            return;
        }
        setRows((prev) => prev.filter((r) => r.id !== id));
    };

    const updateRow = (id: string, fields: Partial<RowItem>) => {
        setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...fields } : r)));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validRows = rows.filter((r) => r.product.trim().length > 0);
        if (validRows.length === 0) {
            toast.error("Please enter product name for at least one item");
            return;
        }

        try {
            const entries = validRows.map((r) => {
                const payload: any = {
                    productId: r.productId || undefined,
                    name: r.product.trim(),
                    quantity: Number(r.quantity) || 1,
                    unit: r.unit,
                    date: r.date || todayDate,
                    notes: r.notes.trim() || undefined,
                };
                if (r.priceMode === "unit") {
                    payload.price = Number(r.price) || 0;
                } else {
                    payload.totalPrice = Number(r.price) || 0;
                }
                return payload;
            });

            await createBulkBazarEntries({ entries }).unwrap();
            toast.success(`Successfully added ${entries.length} bazar expenses!`);
            onDone();
        } catch (err: any) {
            toast.error(err?.data?.message || err?.message || "Failed to create bulk expenses");
        }
    };

    return (
        <div className="w-full flex flex-col gap-6 container mx-auto py-4">
            {/* Header & Back Button */}
            <div className="flex items-center justify-between bg-[#251508] border border-border p-6 rounded-3xl shadow-xl">
                <div className="flex items-center gap-4">
                    <button type="button" onClick={onBack} className="p-2.5 rounded-xl border border-border bg-[#2e1a0a] text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors cursor-pointer">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                        <Layers className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                            Bulk Add Bazar Expenses
                        </h1>
                        <p className="text-xs text-muted-foreground font-mono">Add multiple bazar purchases at once in a desktop spreadsheet layout</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button type="button" onClick={handleAddRow} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-primary/40 text-primary bg-primary/10 hover:bg-primary/20 text-xs font-bold transition-all cursor-pointer">
                        <Plus className="w-4 h-4" /> Add Row
                    </button>
                    <button type="button" onClick={handleSubmit} disabled={isLoading} className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:bg-accent transition-all cursor-pointer shadow-lg shadow-primary/20 disabled:opacity-50">
                        {isLoading ? "Saving..." : `Save ${rows.filter((r) => r.product.trim()).length || rows.length} Entries`}
                    </button>
                </div>
            </div>

            {/* Desktop Items Table Layout */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="bg-[#251508] border border-border rounded-3xl p-6 shadow-xl overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[850px]">
                        <thead>
                            <tr className="border-b border-border/60 text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">
                                <th className="py-3 px-3 w-12 text-center">#</th>
                                <th className="py-3 px-3">Product Name</th>
                                <th className="py-3 px-3 w-44">Price (৳)</th>
                                <th className="py-3 px-3 w-40">Quantity</th>
                                <th className="py-3 px-3 w-44">Unit</th>
                                <th className="py-3 px-3 w-44">Date</th>
                                <th className="py-3 px-3 w-12 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30 text-sm">
                            {rows.map((row, index) => (
                                <tr key={row.id} className="hover:bg-[#2e1a0a]/50 transition-colors">
                                    <td className="py-3 px-3 font-mono text-xs text-muted-foreground text-center">{index + 1}</td>
                                    {/* Product Input */}
                                    <td className="py-3 px-3">
                                        <div className="relative">
                                            <ProductSelectInput
                                                valueName={row.product}
                                                onSelect={(p: any) => {
                                                    updateRow(row.id, {
                                                        product: p.name,
                                                        productId: p._id || p.id,
                                                    });
                                                }}
                                                customClass="w-full px-3 py-2 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none text-foreground"
                                                hideSearchIcon
                                            />
                                        </div>
                                    </td>
                                    {/* Price Input & Toggle Mode */}
                                    <td className="py-3 px-3">
                                        <div className="relative flex items-center">
                                            <span className="absolute left-3 text-xs font-bold text-muted-foreground">৳</span>
                                            <input type="number" step="any" value={row.price} onChange={(e) => updateRow(row.id, { price: e.target.value })} placeholder="0.00" className="w-full pl-7 pr-8 py-2 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none font-mono text-foreground" />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const p = Number(row.price);
                                                    const q = Number(row.quantity);
                                                    if (row.priceMode === "unit") {
                                                        if (p > 0 && q > 0) updateRow(row.id, { price: String(Number((p * q).toFixed(2))), priceMode: "total" });
                                                        else updateRow(row.id, { priceMode: "total" });
                                                    } else {
                                                        if (p > 0 && q > 0) updateRow(row.id, { price: String(Number((p / q).toFixed(2))), priceMode: "unit" });
                                                        else updateRow(row.id, { priceMode: "unit" });
                                                    }
                                                }}
                                                title={row.priceMode === "unit" ? "Unit Price (Click for Total)" : "Total Price (Click for Unit)"}
                                                className="absolute right-2 p-1 text-muted-foreground hover:text-primary transition-colors cursor-pointer text-xs"
                                            >
                                                <RefreshCw className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                    {/* Quantity Input */}
                                    <td className="py-3 px-3">
                                        <input type="number" step="any" value={row.quantity} onChange={(e) => updateRow(row.id, { quantity: e.target.value })} placeholder="1" className="w-full px-3 py-2 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none font-mono text-foreground" />
                                    </td>
                                    {/* Unit Selector Buttons */}
                                    <td className="py-3 px-3">
                                        <div className="flex gap-1">
                                            {(["KG", "PIECE", "GM"] as BazarUnit[]).map((u) => (
                                                <button
                                                    key={u}
                                                    type="button"
                                                    onClick={() => updateRow(row.id, { unit: u })}
                                                    className="flex-1 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer font-mono"
                                                    style={{
                                                        borderColor: row.unit === u ? "rgba(232,160,32,0.8)" : "rgba(232,160,32,0.18)",
                                                        background: row.unit === u ? "rgba(232,160,32,0.15)" : "#2e1a0a",
                                                        color: row.unit === u ? "#e8a020" : "#a08060",
                                                    }}
                                                >
                                                    {u}
                                                </button>
                                            ))}
                                        </div>
                                    </td>
                                    {/* Date Picker */}
                                    <td className="py-3 px-3">
                                        <input type="date" value={row.date} onChange={(e) => updateRow(row.id, { date: e.target.value })} className="w-full px-3 py-2 bg-[#2e1a0a] border border-border rounded-xl text-xs outline-none font-mono text-foreground" style={{ colorScheme: "dark" }} />
                                    </td>
                                    {/* Remove Row */}
                                    <td className="py-3 px-3 text-center">
                                        {rows.length > 1 && (
                                            <button type="button" onClick={() => handleRemoveRow(row.id)} className="p-1.5 text-destructive/80 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer" title="Remove Row">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between">
                        <button type="button" onClick={handleAddRow} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-primary/40 text-primary bg-primary/5 hover:bg-primary/10 text-xs font-semibold transition-colors cursor-pointer">
                            <Plus className="w-4 h-4" /> Add Another Entry Row
                        </button>
                        <span className="text-xs text-muted-foreground font-mono">
                            Total Items: <span className="text-foreground font-bold">{rows.length}</span>
                        </span>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={onBack} className="px-6 py-3 border border-border text-foreground font-bold rounded-xl hover:bg-secondary transition-all cursor-pointer text-sm">
                        Cancel
                    </button>
                    <button type="submit" disabled={isLoading} className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-accent transition-all cursor-pointer text-sm shadow-lg shadow-primary/20 disabled:opacity-50">
                        {isLoading ? "Saving Entries..." : `Save ${rows.filter((r) => r.product.trim()).length || rows.length} Expenses`}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default WebBulkExpenseScreen;
