import React, { useState } from "react";
import { motion } from "motion/react";
import { Edit3, ChevronRight, AlignLeft, Calendar, X } from "lucide-react";
import { MockBill, BillCategory } from "@/types";
import { ScreenShell, BackButton, PrimaryButton, FieldBox } from "@/components/ui/Shared";
import { toInputDate, BILL_META, BILL_CATEGORIES } from "@/lib/mockData";

export function BillEditScreen({ bill, onBack, onSave }: { bill: MockBill; onBack: () => void; onSave: (updated: MockBill) => void }) {
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
            onSave({
                ...bill,
                category,
                title,
                amount: Number(amount),
                date: new Date(date),
                notes: notes || undefined,
            });
        }, 1200);
    };

    return (
        <ScreenShell scrollable>
            <div className="flex flex-col px-6 pt-12 pb-8 relative">
                <BackButton onBack={onBack} label="Cancel" />
                <div className="flex items-center gap-3 mb-7 flex-shrink-0">
                    <div className="w-11 h-11 rounded-2xl bg-accent flex items-center justify-center shadow-md shadow-accent/30">
                        <Edit3 className="w-5 h-5 text-white" strokeWidth={2} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                            Edit Bill
                        </h2>
                        <p className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                            {bill.title}
                        </p>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-foreground/80" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                            Category
                        </label>
                        <button type="button" onClick={() => setShowCatPicker(true)} className="flex items-center gap-3 p-4 rounded-xl border transition-all text-left cursor-pointer" style={{ borderColor: "rgba(232,160,32,0.3)", background: "#2e1a0a" }}>
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border" style={{ background: `${meta.color}20`, borderColor: `${meta.color}40`, color: meta.color }}>
                                {meta.icon}
                            </div>
                            <span className="flex-1 text-sm font-medium text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                {meta.label}
                            </span>
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </button>
                    </div>
                    <FieldBox label="Title" focused={fTitle}>
                        <div className="flex items-center" onFocus={() => setFTitle(true)} onBlur={() => setFTitle(false)}>
                            <span className="pl-4 text-muted-foreground">
                                <AlignLeft className="w-4 h-4" />
                            </span>
                            <input value={title} onChange={(e) => setTitle(e.target.value)} required className="flex-1 px-3 py-3.5 bg-transparent text-foreground text-sm outline-none" style={{ fontFamily: "'DM Sans', sans-serif" }} />
                        </div>
                    </FieldBox>
                    <FieldBox label="Amount (৳)" focused={fAmount}>
                        <div className="flex items-center" onFocus={() => setFAmount(true)} onBlur={() => setFAmount(false)}>
                            <span className="pl-4 text-muted-foreground text-sm font-bold">৳</span>
                            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required className="flex-1 px-3 py-3.5 bg-transparent text-foreground text-sm outline-none" style={{ fontFamily: "'DM Sans', sans-serif" }} />
                        </div>
                    </FieldBox>
                    <FieldBox label="Date" focused={false}>
                        <div className="flex items-center">
                            <span className="pl-4 text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                            </span>
                            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="flex-1 px-3 py-3.5 bg-transparent text-foreground text-sm outline-none" style={{ fontFamily: "'DM Sans', sans-serif", colorScheme: "dark" }} />
                        </div>
                    </FieldBox>
                    <FieldBox label="Notes (optional)" focused={fNotes}>
                        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} onFocus={() => setFNotes(true)} onBlur={() => setFNotes(false)} rows={3} className="w-full px-4 py-3.5 bg-transparent text-foreground placeholder-muted-foreground text-sm outline-none resize-none" style={{ fontFamily: "'DM Sans', sans-serif" }} />
                    </FieldBox>
                    <div className="mt-2">
                        <PrimaryButton loading={loading} label="Save Changes" loadingLabel="Saving…" />
                    </div>
                </form>
                {showCatPicker && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-50 flex flex-col justify-end" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }} onClick={() => setShowCatPicker(false)}>
                        <motion.div initial={{ y: 60 }} animate={{ y: 0 }} transition={{ type: "spring", damping: 28 }} className="bg-card rounded-t-3xl border-t border-border p-5 pb-8 max-h-[70vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-base font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                    Select Category
                                </h3>
                                <button onClick={() => setShowCatPicker(false)} className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center cursor-pointer">
                                    <X className="w-3.5 h-3.5 text-muted-foreground" />
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {BILL_CATEGORIES.map((c) => (
                                    <button
                                        key={c.key}
                                        type="button"
                                        onClick={() => {
                                            setCategory(c.key);
                                            setShowCatPicker(false);
                                        }}
                                        className="flex items-center gap-2.5 p-3 rounded-xl border transition-all text-left cursor-pointer"
                                        style={{ borderColor: category === c.key ? `${c.color}70` : "rgba(232,160,32,0.15)", background: category === c.key ? `${c.color}15` : "rgba(46,26,10,0.8)" }}
                                    >
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border" style={{ background: `${c.color}20`, borderColor: `${c.color}40`, color: c.color }}>
                                            {c.icon}
                                        </div>
                                        <span className="text-xs font-medium text-foreground truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                            {c.label}
                                        </span>
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
export default BillEditScreen;
