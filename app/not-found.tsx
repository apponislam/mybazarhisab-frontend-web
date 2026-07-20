"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { AlertTriangle, Home } from "lucide-react";
import { BG_DOTS, TOP_LINE } from "@/components/app/ui/Shared";

export default function NotFound() {
    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-background px-4">
            {TOP_LINE}
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 65% 65% at 50% 50%, rgba(232,160,32,0.08) 0%, transparent 80%)" }} />
            {BG_DOTS}

            <div className="w-full max-w-md relative z-10 flex flex-col items-center text-center">
                {/* Animated Error Code */}
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="relative mb-6">
                    <span className="text-8xl font-black tracking-widest text-primary/20 select-none font-mono">404</span>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center animate-pulse">
                            <AlertTriangle className="w-8 h-8 text-primary" strokeWidth={1.8} />
                        </div>
                    </div>
                </motion.div>

                {/* Text Details */}
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="flex flex-col items-center">
                    <h2 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        Page Not Found
                    </h2>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        The page you are looking for doesn't exist, has been removed, or has changed locations.
                    </p>

                    {/* Button Link */}
                    <Link href="/">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl text-sm transition-all hover:bg-accent cursor-pointer shadow-lg shadow-primary/15">
                            <Home className="w-4 h-4" />
                            Return to Home
                        </motion.div>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
