import React, { useState } from "react";
import { motion } from "motion/react";
import { Mail, ArrowLeft } from "lucide-react";
import { PrimaryButton } from "@/components/app/ui/Shared";
import WebInputField from "./WebInputField";

interface WebForgotEmailScreenProps {
    onBack: () => void;
    onNext: (email: string) => void;
}

export default function WebForgotEmailScreen({ onBack, onNext }: WebForgotEmailScreenProps) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            onNext(email);
        }, 1500);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5 text-center relative pb-2">
                <button onClick={onBack} className="absolute left-0 top-0 text-muted-foreground hover:text-foreground p-1 transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer">
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <h2 className="text-2xl font-bold text-foreground mt-6" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                    Forgot Password?
                </h2>
                <p className="text-muted-foreground text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Enter email to send code verifier
                </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <WebInputField label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" required autoFocus icon={<Mail className="w-4 h-4" />} />

                <div className="pt-2">
                    <PrimaryButton loading={loading} label="Send OTP Code" loadingLabel="Sending…" />
                </div>
            </form>
        </motion.div>
    );
}
