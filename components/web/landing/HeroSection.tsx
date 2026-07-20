import React from "react";
import { motion } from "motion/react";
import { Sparkles, ArrowRight, ArrowUpRight } from "lucide-react";

export function HeroSection({ onSignIn }: { onSignIn: () => void }) {
    return (
        <section className="relative z-10 container mx-auto px-6 md:px-8 pt-16 md:pt-28 pb-20 flex-1 flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left space-y-7">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-semibold font-mono shadow-inner">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "3s" }} />
                    <span>SHARED HOUSEHOLD & GROUP BUDGET ACCOUNT</span>
                </motion.div>

                <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Track Family Bazar <br />& Monthly Costs, <br />
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-orange-400 to-accent">Compare Spending</span>
                </motion.h1>

                <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-lg mx-auto lg:mx-0">
                    A secure, shared ledger for your household. Let all family members log daily bazar purchases and bills, track monthly and yearly expenses, and easily compare costs over time to manage your budget together.
                </motion.p>

                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-3">
                    <button
                        onClick={onSignIn}
                        className="w-full sm:w-auto px-8 py-4 bg-linear-to-r from-primary to-orange-500 text-[#1a0e07] font-bold text-base rounded-xl hover:from-accent hover:to-orange-600 transition-all duration-300 cursor-pointer shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group active:scale-[0.98]"
                    >
                        Get Started Now
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                    <a
                        href="#features"
                        className="w-full sm:w-auto px-8 py-4 border border-border/60 bg-[#2e1a0a]/30 text-foreground font-semibold text-base rounded-xl hover:bg-[#2e1a0a]/60 hover:border-primary/30 transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                        Learn More <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                    </a>
                </motion.div>
            </div>

            {/* Hero Interactive App Mockup Graphic */}
            <motion.div initial={{ opacity: 0, scale: 0.93, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.6, type: "spring", stiffness: 80 }} className="flex-1 w-full max-w-[500px] relative group">
                {/* Background glow behind container */}
                <div className="absolute inset-0 bg-linear-to-tr from-primary/10 to-accent/10 rounded-[32px] blur-xl opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

                <div className="rounded-[32px] border border-primary/15 bg-card/85 p-6 shadow-2xl relative overflow-hidden transition-all duration-500 group-hover:border-primary/30" style={{ boxShadow: "0 25px 80px rgba(0,0,0,0.65)", backdropFilter: "blur(16px)" }}>
                    {/* Header Mockup */}
                    <div className="flex items-center justify-between pb-4 border-b border-[rgba(232,160,32,0.08)] mb-5">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center text-sm">🏠</div>
                            <div>
                                <h4 className="text-xs font-bold text-foreground">My Sweet Home Accounts</h4>
                                <div className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                                    <p className="text-[9px] text-muted-foreground">Family Sharing Active</p>
                                </div>
                            </div>
                        </div>
                        <span className="text-[9px] font-mono text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20 font-bold uppercase tracking-wider">Live Preview</span>
                    </div>

                    {/* Simulated totals */}
                    <div className="grid grid-cols-2 gap-4 mb-5">
                        <div className="p-3.5 bg-[#170c05] border border-[rgba(232,160,32,0.06)] rounded-2xl relative overflow-hidden group/box">
                            <div className="absolute top-0 right-0 w-8 h-8 bg-primary/5 rounded-bl-full" />
                            <p className="text-[9px] text-muted-foreground font-mono uppercase tracking-wider">This Month Spent</p>
                            <p className="text-lg font-black text-primary mt-0.5">৳16,840</p>
                        </div>
                        <div className="p-3.5 bg-[#170c05] border border-[rgba(232,160,32,0.06)] rounded-2xl relative overflow-hidden group/box">
                            <div className="absolute top-0 right-0 w-8 h-8 bg-accent/5 rounded-bl-full" />
                            <p className="text-[9px] text-muted-foreground font-mono uppercase tracking-wider">Yearly Spent</p>
                            <p className="text-lg font-black text-accent mt-0.5">৳1,92,400</p>
                        </div>
                    </div>

                    {/* Split result card / budget status */}
                    <div className="p-4 bg-linear-to-r from-[#170c05] to-[#251508]/40 border border-dashed border-primary/25 rounded-2xl mb-5 shadow-inner">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">Household Budget Status</p>
                            <span className="text-[9px] font-mono text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/25">On Track</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-foreground/95">Monthly Limit: ৳25,000</span>
                            <span className="font-mono text-muted-foreground text-[10px]">Remaining: ৳8,160</span>
                        </div>
                        {/* Visual Progress bar */}
                        <div className="w-full bg-[#1e0e04] rounded-full h-1.5 mt-2.5 overflow-hidden">
                            <div className="bg-linear-to-r from-primary to-accent h-full rounded-full animate-pulse" style={{ width: "67%", animationDuration: "3s" }} />
                        </div>
                    </div>

                    {/* Transaction Feed */}
                    <div className="space-y-3">
                        <div className="p-3 rounded-2xl bg-[#201107]/60 border border-[rgba(232,160,32,0.04)] hover:bg-[#201107] hover:border-primary/10 transition-all duration-300 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-sm">🍎</div>
                                <div>
                                    <p className="font-bold text-[12px] text-foreground">Weekly Bazar & Groceries</p>
                                    <p className="text-[9px] text-muted-foreground font-mono">Mother • Today, 4:20 PM</p>
                                </div>
                            </div>
                            <span className="font-extrabold text-[12px] text-primary">৳2,450</span>
                        </div>
                        <div className="p-3 rounded-2xl bg-[#201107]/60 border border-[rgba(232,160,32,0.04)] hover:bg-[#201107] hover:border-primary/10 transition-all duration-300 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-sm">💡</div>
                                <div>
                                    <p className="font-bold text-[12px] text-foreground">Electricity Bill (July)</p>
                                    <p className="text-[9px] text-muted-foreground font-mono">Father • Yesterday</p>
                                </div>
                            </div>
                            <span className="font-extrabold text-[12px] text-primary">৳3,200</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
