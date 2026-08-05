import React from "react";
import { motion } from "motion/react";
import { ShoppingBag, Receipt, ChevronRight, X } from "lucide-react";

export function AppAddPicker({ onExpense, onBill, onClose }: { onExpense: () => void; onBill: () => void; onClose: () => void }) {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-50 flex flex-col justify-end" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }} onClick={onClose}>
            <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", damping: 28, stiffness: 300 }} className="bg-card rounded-t-3xl border-t border-border p-6 pb-10" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                        Add New Entry
                    </h3>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <div className="flex flex-col gap-4">
                    {[
                        { icon: <ShoppingBag className="w-6 h-6 text-primary-foreground" strokeWidth={2} />, bg: "bg-primary", label: "Add Expense", sub: "Record a bazar purchase with product, price & quantity", onClick: onExpense, border: "border-primary/40" },
                        { icon: <Receipt className="w-6 h-6 text-white" strokeWidth={2} />, bg: "bg-accent", label: "Add Bill", sub: "Log rent, utilities, subscriptions and other bills", onClick: onBill, border: "border-accent/40" },
                    ].map((item) => (
                        <motion.button key={item.label} onClick={item.onClick} whileTap={{ scale: 0.97 }} className={`flex items-center gap-4 p-5 rounded-2xl border ${item.border} text-left transition-all cursor-pointer`} style={{ background: "rgba(232,160,32,0.05)" }}>
                            <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center shrink-0 shadow-lg`}>{item.icon}</div>
                            <div className="flex-1">
                                <p className="text-base font-semibold text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                    {item.label}
                                </p>
                                <p className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                    {item.sub}
                                </p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                        </motion.button>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}
