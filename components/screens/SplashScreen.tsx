import React, { useEffect } from "react";
import { motion } from "motion/react";
import { BookOpen, ShoppingBag, TrendingUp } from "lucide-react";
import { BG_DOTS } from "@/components/ui/Shared";

export function SplashScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="relative size-full flex flex-col items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 60%, rgba(232,160,32,0.18) 0%, transparent 80%)" }} />
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />
      {BG_DOTS}
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex flex-col items-center">
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-3xl bg-primary/10 border border-primary/30 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
              <BookOpen className="w-8 h-8 text-primary-foreground" strokeWidth={2} />
            </div>
          </div>
          <motion.div initial={{ opacity: 0, x: -8, y: 8 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ delay: 0.5 }}
            className="absolute -bottom-2 -left-5 w-10 h-10 rounded-xl bg-accent/80 flex items-center justify-center border border-primary/20">
            <ShoppingBag className="w-5 h-5 text-primary-foreground" strokeWidth={1.8} />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 8, y: 8 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ delay: 0.6 }}
            className="absolute -bottom-2 -right-5 w-10 h-10 rounded-xl bg-accent/80 flex items-center justify-center border border-primary/20">
            <TrendingUp className="w-5 h-5 text-primary-foreground" strokeWidth={1.8} />
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-1" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>My Bazar</h1>
          <span className="text-4xl font-bold tracking-tight text-primary" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>Hisab</span>
        </motion.div>
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="mt-4 text-muted-foreground text-sm uppercase" style={{ fontFamily: "'DM Mono', monospace", letterSpacing: "0.18em" }}>
          Your Market Account Book
        </motion.p>
      </motion.div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}
        className="absolute bottom-24 text-center text-muted-foreground text-sm px-8 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        Track your market expenses,<br />manage your bazar accounts with ease.
      </motion.p>
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-32 h-0.5 bg-border rounded-full overflow-hidden">
        <motion.div className="h-full bg-primary rounded-full" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ delay: 0.4, duration: 2.4, ease: "easeInOut" }} />
      </div>
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />
    </div>
  );
}
export default SplashScreen;
