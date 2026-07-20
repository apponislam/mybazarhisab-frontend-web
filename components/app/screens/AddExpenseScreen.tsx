import React, { useState } from "react";
import { ShoppingBag, Package, Weight, Calendar } from "lucide-react";
import { BazarUnit } from "@/types";
import { ScreenShell, BackButton, PrimaryButton, FieldBox } from "@/components/app/ui/Shared";
import { toInputDate } from "@/lib/mockData";

export function AddExpenseScreen({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
    const [product, setProduct] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [unit, setUnit] = useState<BazarUnit>("KG");
    const [date, setDate] = useState(toInputDate(new Date()));
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [fProduct, setFProduct] = useState(false);
    const [fPrice, setFPrice] = useState(false);
    const [fQty, setFQty] = useState(false);
    const [fNotes, setFNotes] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            onDone();
        }, 1400);
    };

    return (
        <ScreenShell scrollable>
            <div className="flex flex-col px-6 pt-12 pb-8">
                <BackButton onBack={onBack} label="Cancel" />
                <div className="flex items-center gap-3 mb-7">
                    <div className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center shadow-md shadow-primary/30">
                        <ShoppingBag className="w-5 h-5 text-primary-foreground" strokeWidth={2} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                            Add Expense
                        </h2>
                        <p className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                            Bazar purchase entry
                        </p>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <FieldBox label="Product Name" focused={fProduct}>
                        <div className="flex items-center" onFocus={() => setFProduct(true)} onBlur={() => setFProduct(false)}>
                            <span className="pl-4 text-muted-foreground">
                                <Package className="w-4 h-4" />
                            </span>
                            <input value={product} onChange={(e) => setProduct(e.target.value)} placeholder="e.g. Hilsha Fish, Rice, Onion" required className="flex-1 px-3 py-3.5 bg-transparent text-sm outline-none" style={{ fontFamily: "'DM Sans', sans-serif" }} />
                        </div>
                    </FieldBox>
                    <div className="grid grid-cols-2 gap-3">
                        <FieldBox label="Price (৳)" focused={fPrice}>
                            <div className="flex items-center" onFocus={() => setFPrice(true)} onBlur={() => setFPrice(false)}>
                                <span className="pl-4 text-sm font-bold text-muted-foreground">৳</span>
                                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" required className="flex-1 px-3 py-3.5 bg-transparent text-sm outline-none" style={{ fontFamily: "'DM Sans', sans-serif" }} />
                            </div>
                        </FieldBox>
                        <FieldBox label="Quantity" focused={fQty}>
                            <div className="flex items-center" onFocus={() => setFQty(true)} onBlur={() => setFQty(false)}>
                                <span className="pl-4 text-muted-foreground">
                                    <Weight className="w-4 h-4" />
                                </span>
                                <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0" required className="flex-1 px-3 py-3.5 bg-transparent text-sm outline-none" style={{ fontFamily: "'DM Sans', sans-serif" }} />
                            </div>
                        </FieldBox>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-foreground/80" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                            Unit
                        </label>
                        <div className="flex gap-2">
                            {(["KG", "PIECE", "GM"] as BazarUnit[]).map((u) => (
                                <button
                                    key={u}
                                    type="button"
                                    onClick={() => setUnit(u)}
                                    className="flex-1 py-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer"
                                    style={{ borderColor: unit === u ? "rgba(232,160,32,0.8)" : "rgba(232,160,32,0.18)", background: unit === u ? "rgba(232,160,32,0.15)" : "#2e1a0a", color: unit === u ? "#e8a020" : "#a08060", fontFamily: "'DM Mono', monospace" }}
                                >
                                    {u}
                                </button>
                            ))}
                        </div>
                    </div>
                    <FieldBox label="Date" focused={false}>
                        <div className="flex items-center">
                            <span className="pl-4 text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                            </span>
                            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="flex-1 px-3 py-3.5 bg-transparent text-sm outline-none" style={{ fontFamily: "'DM Sans', sans-serif", colorScheme: "dark" }} />
                        </div>
                    </FieldBox>
                    <FieldBox label="Notes (optional)" focused={fNotes}>
                        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} onFocus={() => setFNotes(true)} onBlur={() => setFNotes(false)} placeholder="Any additional info…" rows={3} className="w-full px-4 py-3.5 bg-transparent text-sm outline-none resize-none" style={{ fontFamily: "'DM Sans', sans-serif" }} />
                    </FieldBox>
                    <div className="mt-2">
                        <PrimaryButton loading={loading} label="Save Expense" loadingLabel="Saving…" />
                    </div>
                </form>
            </div>
        </ScreenShell>
    );
}
export default AddExpenseScreen;
