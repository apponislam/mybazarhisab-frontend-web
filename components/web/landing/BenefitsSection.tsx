import React from "react";
import { motion } from "motion/react";
import { CheckCircle2, TrendingUp, BarChart3, Lock, Users } from "lucide-react";

export function BenefitsSection() {
    return (
        <section id="benefits" className="relative z-10 bg-linear-to-t from-transparent via-[#201107]/20 to-transparent border-t border-[rgba(232,160,32,0.06)] py-24 select-none">
            <div className="container mx-auto px-6 md:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1 space-y-7 text-center lg:text-left">
                        <h3 className="text-xs uppercase tracking-widest text-primary font-mono font-bold">Why Bazar Hisab</h3>
                        <h2 className="text-3xl md:text-4xl font-extrabold leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                            Clean, Auditable Records for the Family
                        </h2>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xl mx-auto lg:mx-0">Ditch the paper diaries and calendars. My Bazar Hisab keeps your family spending in perfect order, enabling everyone to stay updated and align with saving targets.</p>

                        <div className="space-y-4 text-left max-w-md mx-auto lg:mx-0">
                            {["Compare monthly and yearly bazar costs side-by-side.", "Save hours of end-of-month manual tally sessions.", "Clear logs showing exactly who spent what in the family.", "Secure shared database backups with live mobile sync."].map((text, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="w-4 h-4 text-primary" />
                                    </div>
                                    <span className="text-sm text-foreground/90 font-medium">{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Interactive Metrics Grid */}
                    <div className="flex-1 grid grid-cols-2 gap-4 w-full">
                        {[
                            { icon: <TrendingUp className="w-5 h-5 text-primary" />, label: "Budget Tracker", val: "Continuous" },
                            { icon: <BarChart3 className="w-5 h-5 text-accent" />, label: "Split Analytics", val: "Real-time" },
                            { icon: <Lock className="w-5 h-5 text-green-400" />, label: "Family Privacy", val: "Secured" },
                            { icon: <Users className="w-5 h-5 text-blue-400" />, label: "Family Members", val: "Up to 20" },
                        ].map((b, i) => (
                            <motion.div key={i} whileHover={{ scale: 1.03 }} className="p-6 rounded-2xl bg-card/50 border border-primary/5 flex flex-col gap-4 shadow-lg hover:border-primary/20 hover:bg-card/75 transition-all duration-300">
                                <div className="w-10 h-10 rounded-xl bg-[#170c05] border border-primary/15 flex items-center justify-center shadow-inner">{b.icon}</div>
                                <div>
                                    <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">{b.label}</p>
                                    <p className="text-base font-extrabold text-foreground mt-0.5">{b.val}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
