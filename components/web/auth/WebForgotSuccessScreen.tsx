import React from "react";
import { motion } from "motion/react";
import { CheckCircle } from "lucide-react";

interface WebForgotSuccessScreenProps {
    onDone: () => void;
}

export default function WebForgotSuccessScreen({ onDone }: WebForgotSuccessScreenProps) {
    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center gap-6">
            <div className="w-20 h-20 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-primary" strokeWidth={1.5} />
            </div>

            <div>
                <h2 className="text-2xl font-bold text-[#f5ede2] mb-2" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                    Success!
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Your password was successfully reset. You can now login.
                </p>
            </div>

            <div className="w-full">
                <button onClick={onDone} className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:bg-accent transition-all cursor-pointer shadow-lg shadow-primary/20">
                    Back to Sign In
                </button>
            </div>
        </motion.div>
    );
}
