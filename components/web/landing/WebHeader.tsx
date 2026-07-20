import React from "react";
import { motion } from "motion/react";

export function WebHeader({ onSignIn }: { onSignIn: () => void }) {
    return (
        <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#130a04]/80 border-b border-[rgba(232,160,32,0.06)] transition-all select-none">
            <div className="container mx-auto px-6 md:px-8 h-20 flex items-center justify-between">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-primary flex items-center justify-center shadow-lg shadow-primary/20 p-0.5 border border-primary/20">
                        <img src="/assets/logo.png" alt="Bazar Hisab Logo" className="w-full h-full object-contain rounded-lg" />
                    </div>
                    <span className="text-xl font-bold text-foreground tracking-tight" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                        My Bazar <span className="text-primary font-sans font-extrabold tracking-normal">Hisab</span>
                    </span>
                </motion.div>

                <nav className="hidden md:flex items-center gap-8">
                    {["Features", "How it Works", "Benefits", "Ratings"].map((link) => {
                        const href = `#${link.toLowerCase().replace(/\s+/g, "")}`;
                        return (
                            <a key={link} href={href} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative py-1 group">
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
                    className="px-5 py-2.5 bg-linear-to-r from-primary/10 to-accent/5 border border-primary/30 text-primary rounded-xl text-sm font-semibold hover:from-primary hover:to-accent hover:text-[#1a0e07] hover:border-transparent transition-all duration-300 cursor-pointer shadow-md shadow-primary/5 active:scale-95"
                >
                    Sign In
                </motion.button>
            </div>
        </header>
    );
}
