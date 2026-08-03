import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { PrimaryButton } from "@/components/app/ui/Shared";

interface WebForgotOtpScreenProps {
    email: string;
    onBack: () => void;
    onNext: () => void;
}

export default function WebForgotOtpScreen({ email, onBack, onNext }: WebForgotOtpScreenProps) {
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(30);
    const refs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (timer <= 0) return;
        const t = setInterval(() => setTimer((v) => v - 1), 1000);
        return () => clearInterval(t);
    }, [timer]);

    const handleChange = useCallback((i: number, val: string) => {
        const c = val.replace(/\D/g, "").slice(-1);
        setOtp((p) => {
            const n = [...p];
            n[i] = c;
            return n;
        });
        if (c && i < 5) refs.current[i + 1]?.focus();
    }, []);

    const handleKeyDown = useCallback(
        (i: number, e: React.KeyboardEvent) => {
            if (e.key === "Backspace" && !otp[i] && i > 0) refs.current[i - 1]?.focus();
        },
        [otp],
    );

    const handlePaste = useCallback((e: React.ClipboardEvent) => {
        e.preventDefault();
        const p = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        setOtp((prev) => {
            const n = [...prev];
            p.split("").forEach((ch, i) => {
                n[i] = ch;
            });
            return n;
        });
        refs.current[Math.min(p.length, 5)]?.focus();
    }, []);

    const filled = otp.every((d) => d !== "");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!filled) return;
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            onNext();
        }, 1500);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5 text-center relative pb-2">
                <button onClick={onBack} className="absolute left-0 top-0 text-muted-foreground hover:text-foreground p-1 transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer">
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <h2 className="text-2xl font-bold text-foreground mt-6" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                    Enter OTP
                </h2>
                <p className="text-muted-foreground text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    We sent a code to <span className="text-primary font-medium">{email}</span>
                </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex gap-3" onPaste={handlePaste}>
                    {otp.map((digit, i) => (
                        <div key={i} className="flex-1">
                            <input
                                ref={(el) => {
                                    refs.current[i] = el;
                                }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(i, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(i, e)}
                                className="w-full aspect-square text-center text-xl font-bold text-[#f5ede2] rounded-xl outline-none transition-all border border-base-amber bg-[#2e1a0a] focus:border-primary focus:shadow-[0_0_0_3px_rgba(232,160,32,0.1)] font-mono"
                            />
                        </div>
                    ))}
                </div>

                <div className="text-center select-none">
                    {timer > 0 ? (
                        <p className="text-muted-foreground text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                            Resend code in <span className="text-primary font-medium font-mono">00:{String(timer).padStart(2, "0")}</span>
                        </p>
                    ) : (
                        <button type="button" onClick={() => setTimer(30)} className="text-primary text-sm font-semibold hover:underline cursor-pointer" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                            Resend OTP
                        </button>
                    )}
                </div>

                <PrimaryButton loading={loading} label="Verify Code" loadingLabel="Verifying…" disabled={!filled} />
            </form>
        </motion.div>
    );
}
