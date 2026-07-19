import React, { useState } from "react";
import { motion } from "motion/react";
import { Shield, Lock, EyeOff, Eye, CheckCircle } from "lucide-react";
import { ScreenShell, BackButton, PrimaryButton, FieldBox } from "@/components/ui/Shared";

export function ChangePasswordScreen({ onBack }: { onBack: () => void }) {
    const [current, setCurrent] = useState("");
    const [newPass, setNewPass] = useState("");
    const [repeat, setRepeat] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showRepeat, setShowRepeat] = useState(false);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [fCurrent, setFCurrent] = useState(false);
    const [fNew, setFNew] = useState(false);
    const [fRepeat, setFRepeat] = useState(false);
    const mismatch = repeat.length > 0 && newPass !== repeat;
    const sl = newPass.length === 0 ? 0 : newPass.length < 6 ? 1 : newPass.length < 10 ? 2 : 3;
    const sc = ["", "#ef4444", "#e8a020", "#22c55e"];
    const slb = ["", "Weak", "Fair", "Strong"];

    return (
        <ScreenShell scrollable>
            <div className="flex flex-col px-6 pt-12 pb-8 flex-1">
                <BackButton onBack={onBack} label="Profile" />
                <div className="mb-7 shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center mb-4">
                        <Shield className="w-6 h-6 text-primary" strokeWidth={1.8} />
                    </div>
                    <h2 className="text-xl font-bold text-foreground mb-1" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                        Change Password
                    </h2>
                    <p className="text-muted-foreground text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        Choose a strong new password for your account.
                    </p>
                </div>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (mismatch || newPass.length < 8) return;
                        setLoading(true);
                        setTimeout(() => {
                            setLoading(false);
                            setDone(true);
                        }, 1200);
                    }}
                    className="flex flex-col gap-4 flex-1 justify-between"
                >
                    <div className="flex flex-col gap-4">
                        {[
                            { id: "current", label: "Current Password", value: current, set: setCurrent, show: showCurrent, setShow: setShowCurrent, f: fCurrent, setF: setFCurrent },
                            { id: "new", label: "New Password", value: newPass, set: setNewPass, show: showNew, setShow: setShowNew, f: fNew, setF: setFNew },
                            { id: "repeat", label: "Confirm New Password", value: repeat, set: setRepeat, show: showRepeat, setShow: setShowRepeat, f: fRepeat, setF: setFRepeat },
                        ].map((field, idx) => (
                            <div key={field.id}>
                                <FieldBox label={field.label} focused={field.f} error={field.id === "repeat" && mismatch ? "Passwords do not match" : undefined}>
                                    <div className="flex items-center" onFocus={() => field.setF(true)} onBlur={() => field.setF(false)}>
                                        <span className="pl-4 text-muted-foreground">
                                            <Lock className="w-4 h-4" />
                                        </span>
                                        <input
                                            type={field.show ? "text" : "password"}
                                            value={field.value}
                                            onChange={(e) => field.set(e.target.value)}
                                            className="flex-1 px-3 py-3.5 bg-transparent text-sm outline-none"
                                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                                            placeholder="••••••••"
                                        />
                                        <button type="button" tabIndex={-1} onClick={() => field.setShow(!field.show)} className="pr-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                                            {field.show ? <EyeOff className="w-4 h-4" strokeWidth={1.8} /> : <Eye className="w-4 h-4" strokeWidth={1.8} />}
                                        </button>
                                    </div>
                                </FieldBox>
                                {idx === 1 && newPass.length > 0 && (
                                    <div className="flex items-center gap-3 mt-2">
                                        <div className="flex gap-1 flex-1">
                                            {[1, 2, 3].map((l) => (
                                                <div key={l} className="h-1 flex-1 rounded-full transition-all" style={{ background: sl >= l ? sc[sl] : "rgba(232,160,32,0.15)" }} />
                                            ))}
                                        </div>
                                        <span className="text-xs font-medium font-mono" style={{ color: sc[sl] }}>
                                            {slb[sl]}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 pt-4">
                        {done ? (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center justify-center gap-2 py-4 rounded-xl bg-green-500/15 border border-green-500/30">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                                <span className="text-green-400 font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                    Password updated!
                                </span>
                            </motion.div>
                        ) : (
                            <PrimaryButton loading={loading} label="Update Password" loadingLabel="Updating…" disabled={mismatch || newPass.length < 8 || !current} />
                        )}
                    </div>
                </form>
            </div>
        </ScreenShell>
    );
}
export default ChangePasswordScreen;
