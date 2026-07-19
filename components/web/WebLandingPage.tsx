import React from "react";
import { motion } from "motion/react";
import {
  ShoppingBag, Receipt, Users, ArrowRight, CheckCircle2,
  TrendingUp, BarChart3, ShieldCheck
} from "lucide-react";

export function WebLandingPage({ onSignIn }: { onSignIn: () => void }) {
  return (
    <div className="min-h-screen bg-[#1a0e07] text-[#f5ede2] flex flex-col font-sans overflow-x-hidden selection:bg-primary selection:text-primary-foreground relative">
      
      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-[600px] pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% -100px, rgba(232,160,32,0.18) 0%, transparent 80%)" }} />
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{ backgroundImage: "radial-gradient(circle, #e8a020 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

      {/* ─── Header Navigation ─────────────────────────────────────────────── */}
      <header className="w-full relative z-10 border-b border-[rgba(232,160,32,0.1)] select-none">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <img src="/assets/logo.png" alt="Bazar Hisab Logo" className="w-full h-full object-contain rounded-xl" />
            </div>
            <span className="text-lg font-bold text-foreground" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
              My Bazar <span className="text-primary">Hisab</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">Features</a>
            <a href="#steps" className="text-sm text-muted-foreground hover:text-primary transition-colors">How it Works</a>
            <a href="#benefits" className="text-sm text-muted-foreground hover:text-primary transition-colors">Benefits</a>
          </nav>

          <button 
            onClick={onSignIn}
            className="px-5 py-2.5 bg-primary/10 border border-primary/30 text-primary rounded-xl text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer shadow-inner"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* ─── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-16 md:pt-24 pb-16 flex-1 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 text-center md:text-left space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold font-mono"
          >
            <span>✨</span> THE DEDICATED ROOM ACCOUNT COMPANION
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-tight"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Track Room Bazar <br />& Split Bills <br />
            <span className="text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Effortlessly</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-lg"
          >
            Stop scratching your head over paper account books. Record daily market items, rent payments, Wi-Fi bills, and let our split calculator settle room balances automatically.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start pt-2"
          >
            <button 
              onClick={onSignIn}
              className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground font-semibold text-base rounded-xl hover:bg-accent transition-all cursor-pointer shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            >
              Get Started Now <ArrowRight className="w-4 h-4" />
            </button>
            <a 
              href="#features"
              className="w-full sm:w-auto px-8 py-4 border border-border bg-[#2e1a0a]/50 text-foreground font-semibold text-base rounded-xl hover:bg-[#2e1a0a] transition-all flex items-center justify-center cursor-pointer"
            >
              Learn More
            </a>
          </motion.div>
        </div>

        {/* Hero Interactive App Mockup Graphic */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ delay: 0.25, duration: 0.6 }}
          className="flex-1 w-full max-w-[500px]"
        >
          <div 
            className="rounded-[32px] border border-border bg-card p-6 shadow-2xl relative overflow-hidden"
            style={{ boxShadow: "0 20px 80px rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[rgba(232,160,32,0.1)] mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">🏠</div>
                <div>
                  <h4 className="text-xs font-bold">Sabzi Mandi Group</h4>
                  <p className="text-[9px] text-muted-foreground">Active Shared Account</p>
                </div>
              </div>
              <span className="text-[9px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/25">Live Preview</span>
            </div>

            {/* Simulated totals */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="p-3 bg-[#1a0e07] border border-[rgba(232,160,32,0.08)] rounded-xl">
                <p className="text-[9px] text-muted-foreground font-mono uppercase">Bazar Spent</p>
                <p className="text-base font-extrabold text-primary mt-0.5">৳12,450</p>
              </div>
              <div className="p-3 bg-[#1a0e07] border border-[rgba(232,160,32,0.08)] rounded-xl">
                <p className="text-[9px] text-muted-foreground font-mono uppercase">Active Bills</p>
                <p className="text-base font-extrabold text-accent mt-0.5">৳4,500</p>
              </div>
            </div>

            {/* Split result card */}
            <div className="p-4 bg-[#1a0e07]/60 border border-dashed border-primary/30 rounded-xl mb-4">
              <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider mb-2">Calculated Room Settlement</p>
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="text-destructive font-semibold">Ahmed Hassan</span>
                <span className="text-[10px] text-muted-foreground">owes</span>
                <span className="text-green-400 font-semibold">Salim Ahmed</span>
                <span className="text-primary font-mono font-bold">৳1,200 BDT</span>
              </div>
            </div>

            {/* Mini Log feeds */}
            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-[#2e1a0a]/50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span>🐟</span>
                  <div>
                    <p className="font-semibold text-[11px]">Hilsha Fish</p>
                    <p className="text-[9px] text-muted-foreground font-mono">Ahmed • Today</p>
                  </div>
                </div>
                <span className="font-bold text-[11px] text-primary">৳850</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#2e1a0a]/50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span>🍚</span>
                  <div>
                    <p className="font-semibold text-[11px]">Miniket Rice 25KG</p>
                    <p className="text-[9px] text-muted-foreground font-mono">Salim • Yesterday</p>
                  </div>
                </div>
                <span className="font-bold text-[11px] text-primary">৳1,650</span>
              </div>
            </div>

          </div>
        </motion.div>
      </section>

      {/* ─── Features Grid Section ────────────────────────────────────────── */}
      <section id="features" className="relative z-10 bg-[#251508]/40 border-y border-[rgba(232,160,32,0.1)] py-20 select-none">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <h3 className="text-xs uppercase tracking-widest text-primary font-mono font-bold">Features list</h3>
            <h2 className="text-3xl md:text-4xl font-extrabold" style={{ fontFamily: "'DM Sans', sans-serif" }}>Designed for Modern Shared Rooms</h2>
            <p className="text-muted-foreground text-sm">Everything you need to stop ledger math and avoid room debates about room expenses.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <ShoppingBag className="w-6 h-6 text-primary" />, title: "Market Logs Book", desc: "Add fish, rice, oil, onion and vegetables with details. Specify the price, weights, and quantity. Sync list in real-time." },
              { icon: <Receipt className="w-6 h-6 text-accent" />, title: "Rent & Room Bills", desc: "Keep track of room rent, Wi-Fi bills, gas charges, electricity bills, maid salary and room cleaner fees monthly." },
              { icon: <Users className="w-6 h-6 text-green-400" />, title: "Debtors & Creditors Split", desc: "Our algorithm calculates who owes whom instantly based on members' individual total spending share." }
            ].map((f, i) => (
              <div 
                key={i} 
                className="p-8 bg-[#251508] border border-border rounded-3xl hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 shadow-lg"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#1a0e07] border border-border flex items-center justify-center mb-6 shadow-inner">
                  {f.icon}
                </div>
                <h4 className="text-lg font-bold text-foreground mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>{f.title}</h4>
                <p className="text-muted-foreground text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it Works (Steps) Section ─────────────────────────────────── */}
      <section id="steps" className="relative z-10 py-20 select-none">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <h3 className="text-xs uppercase tracking-widest text-primary font-mono font-bold">Simple steps</h3>
            <h2 className="text-3xl md:text-4xl font-extrabold" style={{ fontFamily: "'DM Sans', sans-serif" }}>How My Bazar Hisab Works</h2>
            <p className="text-muted-foreground text-sm">Manage accounts with your flatmates in three easy steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            
            {/* Step cards */}
            {[
              { num: "01", title: "Create or Join a Room Group", desc: "Generate a secure code for your room or flat, and invite your roommates to join." },
              { num: "02", title: "Log Purchases and Bills", desc: "Whenever someone buys bazar items or pays a room bill, they log it directly in the app." },
              { num: "03", title: "Instantly Settle Shares", desc: "Click the dashboard to see calculated net balances and who owes whom. Settle and reset easily." }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-4 relative z-10">
                <span className="text-5xl font-black text-primary/10 font-mono tracking-tighter select-none">{step.num}</span>
                <h4 className="text-lg font-bold text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>{step.title}</h4>
                <p className="text-muted-foreground text-xs leading-relaxed max-w-xs">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Benefits Section ─────────────────────────────────────────────── */}
      <section id="benefits" className="relative z-10 bg-[#251508]/40 border-t border-[rgba(232,160,32,0.1)] py-20 select-none">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl md:text-4xl font-extrabold leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Keep Flatmate Relations Smooth & Clear
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Money matters in a shared flat can get complex. My Bazar Hisab ensures full transparency and accuracy, keeping accounts stress-free.
              </p>

              <div className="space-y-4">
                {[
                  "100% accurate split billing algorithms.",
                  "Saves time: no manual record-keeping or calculator sessions.",
                  "Clear, auditable logs: everyone see who bought what.",
                  "Safe secure data, accessible from both desktop & mobile."
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm text-foreground/90">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-4">
              {[
                { icon: <TrendingUp className="w-6 h-6 text-primary" />, label: "Budget tracker", val: "Dynamic" },
                { icon: <BarChart3 className="w-6 h-6 text-accent" />, label: "Split Analytics", val: "Automatic" },
                { icon: <ShieldCheck className="w-6 h-6 text-green-400" />, label: "Room Privacy", val: "Secure" },
                { icon: <Users className="w-6 h-6 text-blue-400" />, label: "Member shares", val: "Unlimited" }
              ].map((b, i) => (
                <div key={i} className="p-6 rounded-2xl bg-[#251508] border border-border flex flex-col gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1a0e07] border border-border flex items-center justify-center">{b.icon}</div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-mono uppercase">{b.label}</p>
                    <p className="text-sm font-bold text-foreground mt-0.5">{b.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA Footer Section ────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-[rgba(232,160,32,0.1)] py-12 select-none bg-[#100905]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/assets/logo.png" alt="Bazar Hisab Logo" className="w-8 h-8 object-contain rounded-xl" />
            <span className="text-base font-bold text-foreground" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
              My Bazar <span className="text-primary">Hisab</span>
            </span>
          </div>

          <p className="text-xs text-muted-foreground/60 font-mono text-center sm:text-left">
            © {new Date().getFullYear()} My Bazar Hisab. Built for room mates and flat mates.
          </p>

          <button 
            onClick={onSignIn}
            className="px-6 py-3 bg-primary text-primary-foreground font-semibold text-xs rounded-xl hover:bg-accent transition-all cursor-pointer shadow-md shadow-primary/10"
          >
            Launch Web App
          </button>
        </div>
      </footer>

    </div>
  );
}

export default WebLandingPage;
