import React from "react";

export function HowItWorksSection() {
    return (
        <section id="howitworks" className="relative z-10 py-24 select-none">
            <div className="container mx-auto px-6 md:px-8">
                <div className="text-center max-w-2xl mx-auto space-y-4 mb-20">
                    <h3 className="text-xs uppercase tracking-widest text-primary font-mono font-bold">Process flow</h3>
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        Three Steps to Family Coordination
                    </h2>
                    <p className="text-muted-foreground text-sm">Managing family bazar budgets and tracking shared home costs is incredibly easy.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 relative">
                    {/* Connecting Line for desktop */}
                    <div className="hidden lg:block absolute top-14 left-[15%] right-[15%] h-0.5 border-t border-dashed border-primary/15 -z-10" />

                    {[
                        { num: "01", title: "Create Your Family Group", desc: "Create a private home group code, copy it, and share it with other members of your family." },
                        { num: "02", title: "Log Purchases Collaboratively", desc: "Whenever any member pays bills or buys groceries/bazar items, they easily record the entry." },
                        { num: "03", title: "Compare & Settle Budgets", desc: "Instantly compare monthly/yearly spending graphs, check family budget status, and save more together." },
                    ].map((step, i) => (
                        <div key={i} className="flex flex-col items-center text-center space-y-4 relative group">
                            <div className="w-20 h-20 rounded-full bg-[#1a0e07] border-2 border-primary/10 flex items-center justify-center shadow-lg group-hover:border-primary/40 group-hover:bg-[#201107] transition-all duration-300">
                                <span className="text-2xl font-black text-primary font-mono">{step.num}</span>
                            </div>
                            <h4 className="text-lg font-bold text-foreground pt-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                {step.title}
                            </h4>
                            <p className="text-muted-foreground text-xs leading-relaxed max-w-xs">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
