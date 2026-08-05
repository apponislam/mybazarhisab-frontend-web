import React from "react";
import { motion } from "motion/react";
import { Home, ShoppingBag, Receipt, User, Plus } from "lucide-react";
import { AppTab } from "@/types";

export function AppBottomNav({
    tab,
    onTab,
    onAdd,
    isAddOpen,
}: {
    tab: AppTab;
    onTab: (t: AppTab) => void;
    onAdd: () => void;
    isAddOpen?: boolean;
}) {
    const tabs: { id: AppTab; icon: React.ReactNode; label: string }[] = [
        { id: "home", icon: <Home className="w-5 h-5" strokeWidth={1.8} />, label: "Home" },
        { id: "expenses", icon: <ShoppingBag className="w-5 h-5" strokeWidth={1.8} />, label: "Expenses" },
        { id: "bills", icon: <Receipt className="w-5 h-5" strokeWidth={1.8} />, label: "Bills" },
        { id: "profile", icon: <User className="w-5 h-5" strokeWidth={1.8} />, label: "Profile" },
    ];

    return (
        <div className="relative z-50 flex items-end bg-card border-t border-border px-2 pb-2 pt-1 shrink-0" style={{ boxShadow: "0 -4px 24px rgba(0,0,0,0.4)" }}>
            {tabs.slice(0, 2).map((t) => (
                <button key={t.id} onClick={() => onTab(t.id)} className="flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl transition-all cursor-pointer" style={{ color: tab === t.id ? "#e8a020" : "#a08060" }}>
                    {t.icon}
                    <span className="text-[10px] font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {t.label}
                    </span>
                    {tab === t.id && <div className="w-1 h-1 rounded-full bg-primary" />}
                </button>
            ))}
            <div className="flex-1 flex flex-col items-center pb-1">
                <motion.button
                    onClick={onAdd}
                    whileTap={{ scale: 0.9 }}
                    className="w-14 h-14 rounded-full bg-primary flex items-center justify-center -mt-6 shadow-xl cursor-pointer"
                    style={{ boxShadow: "0 4px 20px rgba(232,160,32,0.5)" }}
                >
                    <motion.div animate={{ rotate: isAddOpen ? 45 : 0 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                        <Plus className="w-7 h-7 text-primary-foreground" strokeWidth={2.5} />
                    </motion.div>
                </motion.button>
                <span className="text-[10px] font-medium mt-1" style={{ fontFamily: "'DM Sans', sans-serif", color: isAddOpen ? "#e8a020" : "#a08060" }}>
                    {isAddOpen ? "Close" : "Add"}
                </span>
            </div>
            {tabs.slice(2).map((t) => (
                <button key={t.id} onClick={() => onTab(t.id)} className="flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl transition-all cursor-pointer" style={{ color: tab === t.id ? "#e8a020" : "#a08060" }}>
                    {t.icon}
                    <span className="text-[10px] font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {t.label}
                    </span>
                    {tab === t.id && <div className="w-1 h-1 rounded-full bg-primary" />}
                </button>
            ))}
        </div>
    );
}
