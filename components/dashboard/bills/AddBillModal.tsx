"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";
import { BillCategory, useCreateBillMutation } from "@/redux/features/bill/billApi";

interface AddBillModalProps {
    show: boolean;
    onClose: () => void;
}

const CATEGORY_OPTIONS: { key: BillCategory; label: string }[] = [
    { key: "RENT", label: "House Rent" },
    { key: "TRAVEL", label: "Travel / Transport" },
    { key: "WIFI", label: "WiFi / Internet" },
    { key: "ELECTRICITY", label: "Electricity" },
    { key: "GAS", label: "Gas Bill" },
    { key: "WATER", label: "Water Bill" },
    { key: "MAID", label: "Maid / Staff" },
    { key: "MAINTENANCE", label: "Maintenance" },
    { key: "SUBSCRIPTION", label: "Subscriptions" },
    { key: "MOBILE", label: "Mobile Recharge" },
    { key: "MEDICAL", label: "Medical" },
    { key: "EDUCATION", label: "Education" },
    { key: "SHOPPING", label: "Shopping" },
    { key: "ENTERTAINMENT", label: "Entertainment" },
    { key: "LAUNDRY", label: "Laundry" },
    { key: "LOAN_EMI", label: "Loan EMI" },
    { key: "SALON_GROOMING", label: "Salon & Grooming" },
    { key: "GIFTS_FESTIVALS", label: "Gifts & Festivals" },
    { key: "UTILITIES", label: "Utilities" },
    { key: "OTHERS", label: "Others" },
];

export function AddBillModal({ show, onClose }: AddBillModalProps) {
    const [createBill, { isLoading }] = useCreateBillMutation();
    const [category, setCategory] = useState<BillCategory>("RENT");
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [notes, setNotes] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !amount) {
            toast.error("Please enter a title and amount");
            return;
        }

        try {
            await createBill({
                category,
                title: title.trim(),
                amount: Number(amount),
                date: date ? new Date(date).toISOString() : undefined,
                notes: notes.trim() || undefined,
            }).unwrap();

            toast.success("Bill created successfully!");
            setTitle("");
            setAmount("");
            setNotes("");
            onClose();
        } catch (err: any) {
            toast.error(err?.data?.message || err?.message || "Failed to create bill");
        }
    };

    return (
        <AnimatePresence>
            {show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#251508] border border-border rounded-3xl p-6 w-full max-w-lg shadow-2xl flex flex-col gap-5">
                        <div className="flex items-center justify-between border-b border-border pb-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
                                    <Plus className="w-5 h-5 text-primary" />
                                </div>
                                <h3 className="text-base font-bold text-foreground font-sans">Add Monthly Bill</h3>
                            </div>
                            <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-sans">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Category</label>
                                    <select value={category} onChange={(e) => setCategory(e.target.value as BillCategory)} className="w-full px-3 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none text-foreground" style={{ colorScheme: "dark" }}>
                                        {CATEGORY_OPTIONS.map((c) => (
                                            <option key={c.key} value={c.key}>
                                                {c.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Amount (৳)</label>
                                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required placeholder="0" className="w-full px-3 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none font-mono text-foreground" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground mb-1">Title</label>
                                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. July House Rent" className="w-full px-4 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none text-foreground" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground mb-1">Date</label>
                                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full px-4 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none font-mono text-foreground" style={{ colorScheme: "dark" }} />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground mb-1">Notes (optional)</label>
                                <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add note…" className="w-full px-4 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none text-foreground" />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={onClose} className="flex-1 py-3 border border-border text-foreground font-bold rounded-xl hover:bg-white/5 cursor-pointer text-xs">
                                    Cancel
                                </button>
                                <button type="submit" disabled={isLoading} className="flex-1 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-accent cursor-pointer text-xs disabled:opacity-50">
                                    {isLoading ? "Saving…" : "Save Bill"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
