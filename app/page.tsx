"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Laptop, Smartphone, AlertTriangle, ChevronRight, Settings } from "lucide-react";
import { BG_DOTS, TOP_LINE } from "@/components/ui/Shared";

export default function RootPage() {
  const router = useRouter();
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const checkScreen = () => {
      if (window.innerWidth < 768) {
        router.replace("/web");
      } else {
        setIsDesktop(true);
      }
    };

    checkScreen();

    const handleResize = () => {
      if (window.innerWidth < 768) {
        router.replace("/web");
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [router]);

  if (isDesktop === null) {
    return (
      <div className="min-h-screen bg-[#1a0e07] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-background px-4">
      {TOP_LINE}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(232,160,32,0.1) 0%, transparent 80%)" }} />
      {BG_DOTS}

      <div className="w-full max-w-2xl relative z-10 flex flex-col items-center">
        {/* App Logo */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 mb-4 flex items-center justify-center">
            <img src="/assets/logo.png" alt="Bazar Hisab Logo" className="w-full h-full object-contain rounded-2xl" />
          </div>
          <h1 className="text-4xl font-bold text-foreground" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
            My Bazar <span className="text-primary">Hisab</span>
          </h1>
          <p className="mt-1 text-muted-foreground text-sm uppercase font-mono tracking-widest">Your Market Account Book</p>
        </motion.div>

        {/* Maintenance Box */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15, duration: 0.4 }}
          className="w-full bg-card border border-border rounded-3xl p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center"
          style={{ boxShadow: "0 12px 64px rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}>
          
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/20 border border-accent/40 text-accent text-xs font-semibold mb-5 font-mono">
              <AlertTriangle className="w-3.5 h-3.5" />
              DESKTOP MODE UNDER MAINTENANCE
            </div>
            
            <h2 className="text-2xl font-bold text-foreground mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Mobile-Only Experience
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Bazar Hisab is currently optimized as a mobile web application. We are actively refactoring and developing a desktop-friendly layout.
            </p>

            {/* Instruction list */}
            <div className="rounded-2xl border border-border bg-[#2e1a0a]/50 p-5 text-left">
              <h3 className="text-xs font-semibold uppercase text-primary tracking-wider mb-3 font-mono flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "6s" }} /> How to test on Desktop:
              </h3>
              <ul className="text-xs text-muted-foreground space-y-2.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">1.</span>
                  <span>Press <kbd className="px-1.5 py-0.5 rounded bg-secondary border border-border text-foreground font-mono">F12</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-secondary border border-border text-foreground font-mono">Ctrl+Shift+I</kbd> to open Developer Tools.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">2.</span>
                  <span>Click the <strong>device emulator toggle</strong> button (or press <kbd className="px-1.5 py-0.5 rounded bg-secondary border border-border text-foreground font-mono">Ctrl+Shift+M</kbd>).</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">3.</span>
                  <span>Set dimensions to a mobile viewport (e.g. <strong>Responsive</strong>, <strong>iPhone</strong>, or <strong>Pixel</strong>).</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">4.</span>
                  <span><strong>Refresh</strong> the browser (<kbd className="px-1.5 py-0.5 rounded bg-secondary border border-border text-foreground font-mono">F5</kbd>) to load the mobile interface!</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Visual Emulation graphic */}
          <div className="w-48 flex-shrink-0 flex flex-col items-center justify-center relative">
            {/* Desktop Monitor Screen Graphic */}
            <div className="w-44 h-28 rounded-xl border-2 border-border bg-[#100905] flex items-center justify-center relative shadow-inner">
              <Laptop className="w-10 h-10 text-muted-foreground opacity-30" />
              <div className="absolute inset-0 flex items-center justify-center flex-col gap-1 text-[9px] text-muted-foreground font-mono">
                <span>width &gt;= 768px</span>
                <span className="text-accent">Maintenance</span>
              </div>
            </div>
            {/* Transition line/arrow */}
            <div className="h-6 w-0.5 bg-dashed border-l border-primary/40 my-2 relative">
              <ChevronRight className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 w-4 h-4 text-primary" />
            </div>
            {/* Phone screen graphic */}
            <div className="w-20 h-32 rounded-xl border-2 border-primary bg-[#2e1a0a] flex items-center justify-center shadow-lg relative"
              style={{ boxShadow: "0 0 20px rgba(232,160,32,0.15)" }}>
              <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-primary/30" />
              <Smartphone className="w-6 h-6 text-primary animate-pulse" />
              <div className="absolute bottom-1 text-[8px] text-primary/70 font-mono">width &lt; 768px</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
