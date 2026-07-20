import React from "react";
import { motion } from "motion/react";
import { Sparkles, ArrowRight } from "lucide-react";

export function CtaBanner({ onSignIn }: { onSignIn: () => void }) {
    return (
        <section className="relative z-10 py-16 select-none">
            <div className="container mx-auto px-6 md:px-8">
                <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#201107] via-[#1a0e07] to-[#2b1609] border border-primary/20 p-8 md:p-14 shadow-2xl">
                    {/* Background ambient glow */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="space-y-3 text-center md:text-left max-w-xl">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/25 bg-primary/10 text-primary text-xs font-semibold font-mono">
                                <Sparkles className="w-3.5 h-3.5" /> Start Managing Today
                            </span>
                            <h3 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                Ready to Simplify Your Household & Family Expenses?
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Join households keeping clean, transparent bazar records and monthly budget tracking.
                            </p>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={onSignIn}
                            className="px-8 py-4 bg-linear-to-r from-primary to-orange-500 hover:from-accent hover:to-orange-600 text-[#1a0e07] font-bold text-base rounded-2xl transition-all duration-300 cursor-pointer shadow-xl shadow-primary/20 shrink-0 flex items-center gap-2 group"
                        >
                            Launch Web App
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </motion.button>
                    </div>
                </div>
            </div>
        </section>
    );
}
