import React from "react";
import { motion } from "motion/react";
import { ShoppingBag, Receipt, Users } from "lucide-react";

export function FeaturesSection() {
    return (
        <section id="features" className="relative z-10 bg-linear-to-b from-transparent via-[#201107]/30 to-transparent border-y border-[rgba(232,160,32,0.06)] py-24 select-none">
            <div className="container mx-auto px-6 md:px-8">
                <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
                    <h3 className="text-xs uppercase tracking-widest text-primary font-mono font-bold">Key Capabilities</h3>
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        Everything You Need for Household Bazar & Bills
                    </h2>
                    <p className="text-muted-foreground text-sm">Easily record daily market purchases, manage monthly utility bills, and track your family group expenses together.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <ShoppingBag className="w-6 h-6 text-primary" />,
                            title: "Daily Bazar & Groceries",
                            desc: "Record market items like fish, meat, oil, rice, and vegetables with unit quantities (KG, GM, Piece) and exact prices.",
                        },
                        {
                            icon: <Receipt className="w-6 h-6 text-accent" />,
                            title: "Monthly Bills & Rent",
                            desc: "Keep track of fixed and recurring household costs like house rent, electricity, gas, water, Wi-Fi, and maid fees.",
                        },
                        {
                            icon: <Users className="w-6 h-6 text-blue-400" />,
                            title: "Group & Family Members",
                            desc: "Invite up to 20 family members or flatmates into your group to log entries, track contributions, and view monthly totals.",
                        },
                    ].map((f, i) => (
                        <motion.div key={i} whileHover={{ y: -6 }} className="p-8 bg-card/40 border border-primary/5 rounded-3xl hover:border-primary/25 hover:bg-card/70 transition-all duration-300 shadow-xl relative overflow-hidden group">
                            <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-all duration-300" />
                            <div className="w-12 h-12 rounded-2xl bg-[#170c05] border border-primary/15 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 group-hover:border-primary/30 transition-transform duration-300">{f.icon}</div>
                            <h4 className="text-lg font-bold text-foreground mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                {f.title}
                            </h4>
                            <p className="text-muted-foreground text-xs leading-relaxed">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
