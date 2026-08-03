import React, { useState } from "react";
import { motion } from "motion/react";
import { Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { PrimaryButton } from "@/components/app/ui/Shared";
import WebInputField from "./WebInputField";

interface WebForgotNewPassScreenProps {
    onBack: () => void;
    onDone: () => void;
}

export default function WebForgotNewPassScreen({ onBack, onDone }: WebForgotNewPassScreenProps) {
    const [np, setNp] = useState("");
    const [rp, setRp] = useState("");
    const [sn, setSn] = useState(false);
    const [sr, setSr] = useState(false);
    const [loading, setLoading] = useState(false);

    const mm = rp.length > 0 && np !== rp;
    const sl = np.length === 0 ? 0 : np.length < 6 ? 1 : np.length < 10 ? 2 : 3;
    const sc = ["", "#ef4444", "#e8a020", "#22c55e"];
    const slb = ["", "Weak", "Fair", "Strong"];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (mm || np.length < 8) return;
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            onDone();
        }, 1500);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5 text-center relative pb-2">
                <button onClick={onBack} className="absolute left-0 top-0 text-muted-foreground hover:text-foreground p-1 transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer">
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <h2 className="text-2xl font-bold text-foreground mt-6" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                    New Password
                </h2>
                <p className="text-muted-foreground text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Create a secure new password for your account
                </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <WebInputField
                    label="New Password"
                    type={sn ? "text" : "password"}
                    value={np}
                    onChange={(e) => setNp(e.target.value)}
                    placeholder="Min. 8 characters"
                    required
                    autoFocus
                    icon={<Lock className="w-4 h-4" />}
                    rightElement={
                        <button type="button" tabIndex={-1} onClick={() => setSn((v) => !v)} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                            {sn ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    }
                />

                {np.length > 0 && (
                    <div className="flex items-center gap-3 -mt-2 select-none">
                        <div className="flex gap-1 flex-1">
                            {[1, 2, 3].map((l) => (
                                <div key={l} className="h-1 flex-1 rounded-full" style={{ background: sl >= l ? sc[sl] : "rgba(232,160,32,0.15)" }} />
                            ))}
                        </div>
                        <span className="text-xs font-semibold font-mono" style={{ color: sc[sl] }}>
                            {slb[sl]}
                        </span>
                    </div>
                )}

                <WebInputField
                    label="Repeat Password"
                    type={sr ? "text" : "password"}
                    value={rp}
                    onChange={(e) => setRp(e.target.value)}
                    placeholder="Re-enter new password"
                    required
                    error={mm ? "Passwords do not match" : undefined}
                    icon={<Lock className="w-4 h-4" />}
                    rightElement={
                        <button type="button" tabIndex={-1} onClick={() => setSr((v) => !v)} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                            {sr ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    }
                />

                <div className="pt-2">
                    <PrimaryButton loading={loading} label="Reset Password" loadingLabel="Saving changes…" disabled={mm || np.length < 8} />
                </div>
            </form>
        </motion.div>
    );
}
