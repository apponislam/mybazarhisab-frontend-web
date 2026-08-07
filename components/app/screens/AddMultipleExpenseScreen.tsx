import React, { useState } from "react";
import { ShoppingBag, Package, Weight, Plus, Trash2, Calendar, Layers, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { BazarUnit } from "@/types";
import { ScreenShell, BackButton, PrimaryButton, FieldBox } from "@/components/app/ui/Shared";
import { toInputDate } from "@/lib/mockData";
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

export function AddMultipleExpenseScreen({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
    const [createBulkBazarEntries, { isLoading }] = useCreateBulkBazarEntriesMutation();
    const todayDate = toInputDate(new Date());

    const [rows, setRows] = useState<RowItem[]>([
        { id: "1", product: "", price: "", priceMode: "unit", quantity: "1", unit: "KG", date: todayDate, notes: "" },
        { id: "2", product: "", price: "", priceMode: "unit", quantity: "1", unit: "KG", date: todayDate, notes: "" },
    ]);

    const handleAddRow = () => {
        const lastRowDate = rows.length > 0 ? rows[rows.length - 1].date : todayDate;
        setRows((prev) => [
            ...prev,
            { id: Date.now().toString(), product: "", price: "", priceMode: "unit", quantity: "1", unit: "KG", date: lastRowDate, notes: "" },
        ]);
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
        <ScreenShell scrollable>
            <div className="flex flex-col px-6 pt-12 pb-8">
                <BackButton onBack={onBack} label="Cancel" />
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center shadow-md shadow-primary/30">
                            <Layers className="w-5 h-5 text-primary-foreground" strokeWidth={2} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                                Bulk Add Expenses
                            </h2>
                            <p className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                Add multiple bazar entries at once
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* Entry Rows */}
                    <div className="flex flex-col gap-4">
                        {rows.map((row, index) => (
                            <div key={row.id} className="p-4 rounded-2xl border border-border/60 bg-card/60 flex flex-col gap-3 relative shadow-xs">
                                <div className="flex items-center justify-between border-b border-border/40 pb-2">
                                    <span className="text-xs font-semibold text-primary">Item #{index + 1}</span>
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

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <FieldBox label="Product Name">
                                        <div className="flex items-center">
                                            <span className="pl-3 text-muted-foreground">
                                                <Package className="w-4 h-4" />
                                            </span>
                                            <div className="flex-1 relative">
                                                <ProductSelectInput
                                                    valueName={row.product}
                                                    onSelect={(p: any) => {
                                                        updateRow(row.id, {
                                                            product: p.name,
                                                            productId: p._id || p.id,
                                                        });
                                                    }}
                                                    customClass="w-full px-3 py-2.5 bg-transparent text-sm outline-none border-none shadow-none font-sans"
                                                    hideSearchIcon
                                                />
                                            </div>
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
                                                className="w-full px-3 py-2.5 bg-transparent text-sm outline-none"
                                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                                            />
                                        </div>
                                    </FieldBox>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <FieldBox label={row.priceMode === "unit" ? "Unit Price (৳)" : "Total Price (৳)"}>
                                        <div className="flex items-center relative">
                                            <span className="pl-3 text-xs font-bold text-muted-foreground">৳</span>
                                            <input
                                                type="number"
                                                step="any"
                                                value={row.price}
                                                onChange={(e) => updateRow(row.id, { price: e.target.value })}
                                                placeholder="0.00"
                                                className="flex-1 pl-2 pr-8 py-2.5 bg-transparent text-sm outline-none font-sans"
                                            />
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
                                                title={row.priceMode === "unit" ? "Switch to Total Price" : "Switch to Unit Price"}
                                                className="absolute right-2 p-1 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                                            >
                                                <RefreshCw className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </FieldBox>

                                    <FieldBox label="Quantity">
                                        <div className="flex items-center">
                                            <span className="pl-3 text-muted-foreground">
                                                <Weight className="w-4 h-4" />
                                            </span>
                                            <input
                                                type="number"
                                                step="any"
                                                value={row.quantity}
                                                onChange={(e) => updateRow(row.id, { quantity: e.target.value })}
                                                placeholder="1"
                                                className="w-full pl-2 pr-2 py-2.5 bg-transparent text-sm outline-none"
                                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                                            />
                                        </div>
                                    </FieldBox>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-medium text-foreground/80" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                        Unit
                                    </label>
                                    <div className="flex gap-2">
                                        {(["KG", "PIECE", "GM"] as BazarUnit[]).map((u) => (
                                            <button
                                                key={u}
                                                type="button"
                                                onClick={() => updateRow(row.id, { unit: u })}
                                                className="flex-1 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer"
                                                style={{
                                                    borderColor: row.unit === u ? "rgba(232,160,32,0.8)" : "rgba(232,160,32,0.18)",
                                                    background: row.unit === u ? "rgba(232,160,32,0.15)" : "#2e1a0a",
                                                    color: row.unit === u ? "#e8a020" : "#a08060",
                                                    fontFamily: "'DM Mono', monospace",
                                                }}
                                            >
                                                {u}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={handleAddRow}
                        className="flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-primary/40 text-primary bg-primary/5 hover:bg-primary/10 transition-colors font-medium text-sm cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        Add Another Item
                    </button>

                    <div className="pt-2">
                        <PrimaryButton
                            type="submit"
                            disabled={isLoading}
                            loading={isLoading}
                            label={`Save ${rows.filter((r) => r.product.trim()).length || rows.length} Entries`}
                            loadingLabel="Saving Entries..."
                        />
                    </div>
                </form>
            </div>
        </ScreenShell>
    );
}

export default AddMultipleExpenseScreen;
