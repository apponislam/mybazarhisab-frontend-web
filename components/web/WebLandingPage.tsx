import React from "react";
import { motion } from "motion/react";
import { 
    ShoppingBag, 
    Receipt, 
    Users, 
    ArrowRight, 
    CheckCircle2, 
    TrendingUp, 
    BarChart3, 
    ShieldCheck,
    Sparkles,
    ArrowUpRight,
    Activity,
    Lock
} from "lucide-react";

export function WebLandingPage({ onSignIn }: { onSignIn: () => void }) {
    return (
        <div className="min-h-screen bg-[#130a04] text-[#f5ede2] flex flex-col font-sans overflow-x-hidden selection:bg-primary selection:text-primary-foreground relative">
            
            {/* ─── FLOATING AMBIENT ORBS & BACKGROUNDS ─────────────────────────────────── */}
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] pointer-events-none animate-pulse" style={{ animationDuration: "10s" }} />
            <div className="absolute top-[35%] right-[-10%] w-[700px] h-[700px] bg-accent/8 rounded-full blur-[160px] pointer-events-none animate-pulse" style={{ animationDuration: "14s" }} />
            <div className="absolute bottom-[15%] left-[-15%] w-[550px] h-[550px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            
            {/* Grid Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #e8a020 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

            {/* ─── HEADER NAVIGATION ─────────────────────────────────────────────── */}
            <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#130a04]/80 border-b border-[rgba(232,160,32,0.06)] transition-all select-none">
                <div className="container mx-auto px-6 md:px-8 h-20 flex items-center justify-between">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3"
                    >
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-primary flex items-center justify-center shadow-lg shadow-primary/20 p-0.5 border border-primary/20">
                            <img src="/assets/logo.png" alt="Bazar Hisab Logo" className="w-full h-full object-contain rounded-lg" />
                        </div>
                        <span className="text-xl font-bold text-foreground tracking-tight" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                            My Bazar <span className="text-primary font-sans font-extrabold tracking-normal">Hisab</span>
                        </span>
                    </motion.div>

                    <nav className="hidden md:flex items-center gap-8">
                        {["Features", "How it Works", "Benefits"].map((link) => {
                            const href = `#${link.toLowerCase().replace(/\s+/g, "")}`;
                            return (
                                <a 
                                    key={link} 
                                    href={href} 
                                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative py-1 group"
                                >
                                    {link}
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                                </a>
                            );
                        })}
                    </nav>

                    <motion.button 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={onSignIn} 
                        className="px-5 py-2.5 bg-gradient-to-r from-primary/10 to-accent/5 border border-primary/30 text-primary rounded-xl text-sm font-semibold hover:from-primary hover:to-accent hover:text-[#1a0e07] hover:border-transparent transition-all duration-300 cursor-pointer shadow-md shadow-primary/5 active:scale-95"
                    >
                        Sign In
                    </motion.button>
                </div>
            </header>

            {/* ─── HERO SECTION ─────────────────────────────────────────────────── */}
            <section className="relative z-10 container mx-auto px-6 md:px-8 pt-16 md:pt-28 pb-20 flex-1 flex flex-col lg:flex-row items-center gap-16">
                <div className="flex-1 text-center lg:text-left space-y-7">
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-semibold font-mono shadow-inner"
                    >
                        <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "3s" }} /> 
                        <span>THE PREMIUM FLAT ACCOUNT COMPANION</span>
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 15 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: 0.1 }} 
                        className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]" 
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                        Track Room Bazar <br />& Split Bills <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-accent">Effortlessly</span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 15 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: 0.2 }} 
                        className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-lg mx-auto lg:mx-0"
                    >
                        Stop scratching your head over paper account books and messy calculations. Record daily market items, rent payments, Wi-Fi bills, and let our split calculator settle flat balances automatically.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        transition={{ delay: 0.3 }} 
                        className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-3"
                    >
                        <button 
                            onClick={onSignIn} 
                            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary to-orange-500 text-[#1a0e07] font-bold text-base rounded-xl hover:from-accent hover:to-orange-600 transition-all duration-300 cursor-pointer shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group active:scale-[0.98]"
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
                <motion.div 
                    initial={{ opacity: 0, scale: 0.93, y: 30 }} 
                    animate={{ opacity: 1, scale: 1, y: 0 }} 
                    transition={{ delay: 0.25, duration: 0.6, type: "spring", stiffness: 80 }} 
                    className="flex-1 w-full max-w-[500px] relative group"
                >
                    {/* Background glow behind container */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-accent/10 rounded-[32px] blur-xl opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
                    
                    <div 
                        className="rounded-[32px] border border-primary/15 bg-card/85 p-6 shadow-2xl relative overflow-hidden transition-all duration-500 group-hover:border-primary/30" 
                        style={{ boxShadow: "0 25px 80px rgba(0,0,0,0.65)", backdropFilter: "blur(16px)" }}
                    >
                        {/* Header Mockup */}
                        <div className="flex items-center justify-between pb-4 border-b border-[rgba(232,160,32,0.08)] mb-5">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center text-sm">🏢</div>
                                <div>
                                    <h4 className="text-xs font-bold text-foreground">Flat 4B Shared Accounts</h4>
                                    <div className="flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                                        <p className="text-[9px] text-muted-foreground">Active calculation session</p>
                                    </div>
                                </div>
                            </div>
                            <span className="text-[9px] font-mono text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20 font-bold uppercase tracking-wider">Live Demo</span>
                        </div>

                        {/* Simulated totals */}
                        <div className="grid grid-cols-2 gap-4 mb-5">
                            <div className="p-3.5 bg-[#170c05] border border-[rgba(232,160,32,0.06)] rounded-2xl relative overflow-hidden group/box">
                                <div className="absolute top-0 right-0 w-8 h-8 bg-primary/5 rounded-bl-full" />
                                <p className="text-[9px] text-muted-foreground font-mono uppercase tracking-wider">Month spent</p>
                                <p className="text-lg font-black text-primary mt-0.5">৳16,840</p>
                            </div>
                            <div className="p-3.5 bg-[#170c05] border border-[rgba(232,160,32,0.06)] rounded-2xl relative overflow-hidden group/box">
                                <div className="absolute top-0 right-0 w-8 h-8 bg-accent/5 rounded-bl-full" />
                                <p className="text-[9px] text-muted-foreground font-mono uppercase tracking-wider">Common Bills</p>
                                <p className="text-lg font-black text-accent mt-0.5">৳4,800</p>
                            </div>
                        </div>

                        {/* Split result card */}
                        <div className="p-4 bg-gradient-to-r from-[#170c05] to-[#251508]/40 border border-dashed border-primary/25 rounded-2xl mb-5 shadow-inner">
                            <div className="flex justify-between items-center mb-2.5">
                                <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">Net Settlement</p>
                                <Activity className="w-3 h-3 text-primary animate-pulse" />
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-5 h-5 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center text-[9px] font-bold text-red-400">AH</div>
                                    <span className="font-semibold text-foreground/95">Ahmed</span>
                                </div>
                                <span className="text-[10px] text-muted-foreground px-2 py-0.5 bg-[#2e1a0a]/50 rounded-full border border-border/40 font-mono">owes BDT</span>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-[9px] font-bold text-green-400">SA</div>
                                    <span className="font-semibold text-green-400">Salim</span>
                                </div>
                                <span className="font-mono font-bold text-primary text-sm">৳1,420</span>
                            </div>
                        </div>

                        {/* Transaction Feed */}
                        <div className="space-y-3">
                            <div className="p-3 rounded-2xl bg-[#201107]/60 border border-[rgba(232,160,32,0.04)] hover:bg-[#201107] hover:border-primary/10 transition-all duration-300 flex items-center justify-between text-xs">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-sm">🐟</div>
                                    <div>
                                        <p className="font-bold text-[12px] text-foreground">Hilsha Fish & Veggies</p>
                                        <p className="text-[9px] text-muted-foreground font-mono">Ahmed • Today, 4:20 PM</p>
                                    </div>
                                </div>
                                <span className="font-extrabold text-[12px] text-primary">৳1,250</span>
                            </div>
                            <div className="p-3 rounded-2xl bg-[#201107]/60 border border-[rgba(232,160,32,0.04)] hover:bg-[#201107] hover:border-primary/10 transition-all duration-300 flex items-center justify-between text-xs">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-sm">💡</div>
                                    <div>
                                        <p className="font-bold text-[12px] text-foreground">Electricity Bill (July)</p>
                                        <p className="text-[9px] text-muted-foreground font-mono">Salim • Yesterday</p>
                                    </div>
                                </div>
                                <span className="font-extrabold text-[12px] text-primary">৳3,200</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* ─── FEATURES GRID SECTION ────────────────────────────────────────── */}
            <section id="features" className="relative z-10 bg-gradient-to-b from-transparent via-[#201107]/30 to-transparent border-y border-[rgba(232,160,32,0.06)] py-24 select-none">
                <div className="container mx-auto px-6 md:px-8">
                    <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
                        <h3 className="text-xs uppercase tracking-widest text-primary font-mono font-bold">Premium features</h3>
                        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                            Tailored for Room & Shared Apartments
                        </h2>
                        <p className="text-muted-foreground text-sm">Everything you need to stop manual ledger entries and avoid room debates about expenses.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { 
                                icon: <ShoppingBag className="w-6 h-6 text-primary" />, 
                                title: "Detailed Bazar Ledger", 
                                desc: "Add fish, rice, oil, onion, and vegetables with specific pricing, weights, and quantity. Sync your logs instantly in real-time." 
                            },
                            { 
                                icon: <Receipt className="w-6 h-6 text-accent" />, 
                                title: "Common Utility Bills", 
                                desc: "Keep track of flat rent, Wi-Fi bills, gas charges, electricity bills, maid salaries, and common cleaner fees monthly." 
                            },
                            { 
                                icon: <Users className="w-6 h-6 text-green-400" />, 
                                title: "Smart Split Engine", 
                                desc: "Our algorithm calculates net balances instantly based on individual spending shares. Know exactly who owes whom." 
                            },
                        ].map((f, i) => (
                            <motion.div 
                                key={i}
                                whileHover={{ y: -6 }}
                                className="p-8 bg-card/40 border border-primary/5 rounded-3xl hover:border-primary/25 hover:bg-card/70 transition-all duration-300 shadow-xl relative overflow-hidden group"
                            >
                                <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-all duration-300" />
                                <div className="w-12 h-12 rounded-2xl bg-[#170c05] border border-primary/15 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 group-hover:border-primary/30 transition-transform duration-300">
                                    {f.icon}
                                </div>
                                <h4 className="text-lg font-bold text-foreground mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                    {f.title}
                                </h4>
                                <p className="text-muted-foreground text-xs leading-relaxed">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── HOW IT WORKS (STEPS) SECTION ─────────────────────────────────── */}
            <section id="howitworks" className="relative z-10 py-24 select-none">
                <div className="container mx-auto px-6 md:px-8">
                    <div className="text-center max-w-2xl mx-auto space-y-4 mb-20">
                        <h3 className="text-xs uppercase tracking-widest text-primary font-mono font-bold">Process flow</h3>
                        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                            Three Steps to Shared Transparency
                        </h2>
                        <p className="text-muted-foreground text-sm">Setting up and managing shared apartment accounts with your flatmates is effortless.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 relative">
                        {/* Connecting Line for desktop */}
                        <div className="hidden lg:block absolute top-14 left-[15%] right-[15%] h-0.5 border-t border-dashed border-primary/15 -z-10" />

                        {[
                            { num: "01", title: "Join or Create a Flat Group", desc: "Create a group for your room or flat, copy the secure join code, and share it with your roommates." },
                            { num: "02", title: "Log Purchases on the Go", desc: "Whenever flatmates buy bazar items or pay common bills, they quickly log details on their phones." },
                            { num: "03", title: "Get Automated Splits", desc: "Instantly see computed balances and net transfers. Easily settle balances with roommates." },
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

            {/* ─── BENEFITS & METRICS SECTION ───────────────────────────────────── */}
            <section id="benefits" className="relative z-10 bg-gradient-to-t from-transparent via-[#201107]/20 to-transparent border-t border-[rgba(232,160,32,0.06)] py-24 select-none">
                <div className="container mx-auto px-6 md:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1 space-y-7 text-center lg:text-left">
                            <h3 className="text-xs uppercase tracking-widest text-primary font-mono font-bold">Why Bazar Hisab</h3>
                            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                Keep Roommate Relations Smooth & Fair
                            </h2>
                            <p className="text-muted-foreground text-sm leading-relaxed max-w-xl mx-auto lg:mx-0">
                                Messy spreadsheets, lost paper slips, and manual calculations can easily cause flat arguments. My Bazar Hisab guarantees absolute mathematical accuracy and visibility for all flatmates.
                            </p>

                            <div className="space-y-4 text-left max-w-md mx-auto lg:mx-0">
                                {[
                                    "100% accurate mathematical split calculator.",
                                    "Saves hours of calculator math at the end of each month.",
                                    "Complete visibility: transparent logs accessible by all flatmates.",
                                    "Secure database backups with instant mobile sync."
                                ].map((text, i) => (
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
                                { icon: <Lock className="w-5 h-5 text-green-400" />, label: "Privacy Protection", val: "Secured" },
                                { icon: <Users className="w-5 h-5 text-blue-400" />, label: "Flatmates Supported", val: "Unlimited" },
                            ].map((b, i) => (
                                <motion.div 
                                    key={i} 
                                    whileHover={{ scale: 1.03 }}
                                    className="p-6 rounded-2xl bg-card/50 border border-primary/5 flex flex-col gap-4 shadow-lg hover:border-primary/20 hover:bg-card/75 transition-all duration-300"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-[#170c05] border border-primary/15 flex items-center justify-center shadow-inner">
                                        {b.icon}
                                    </div>
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

            {/* ─── CTA FOOTER SECTION ────────────────────────────────────────────── */}
            <footer className="relative z-10 border-t border-[rgba(232,160,32,0.06)] py-16 select-none bg-[#0a0502]">
                <div className="container mx-auto px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl overflow-hidden bg-primary flex items-center justify-center p-0.5 border border-primary/20">
                            <img src="/assets/logo.png" alt="Bazar Hisab Logo" className="w-full h-full object-contain rounded-lg" />
                        </div>
                        <span className="text-lg font-bold text-foreground" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                            My Bazar <span className="text-primary font-sans font-extrabold">Hisab</span>
                        </span>
                    </div>

                    <p className="text-xs text-muted-foreground/50 font-mono text-center md:text-left">
                        © {new Date().getFullYear()} My Bazar Hisab. Built for room mates and flat mates.
                    </p>

                    <button 
                        onClick={onSignIn} 
                        className="px-6 py-3 bg-gradient-to-r from-primary to-orange-500 hover:from-accent hover:to-orange-600 text-[#1a0e07] font-bold text-sm rounded-xl transition-all duration-300 cursor-pointer shadow-lg shadow-primary/10 active:scale-95"
                    >
                        Launch Web App
                    </button>
                </div>
            </footer>
        </div>
    );
}

export default WebLandingPage;
