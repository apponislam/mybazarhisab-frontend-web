import React, { useState, useRef } from "react";
import { motion } from "motion/react";
import { Mail, Lock, Eye, EyeOff, User, Camera, Phone, ArrowLeft } from "lucide-react";
import { PrimaryButton } from "@/components/app/ui/Shared";
import { toast } from "sonner";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/features/auth/authSlice";
import WebInputField from "./WebInputField";

interface WebRegisterScreenProps {
    onBack: () => void;
    onDone: () => void;
}

export default function WebRegisterScreen({ onBack, onDone }: WebRegisterScreenProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [photo, setPhoto] = useState<string | null>(null);
    const [password, setPassword] = useState("");
    const [repeat, setRepeat] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [showRepeat, setShowRepeat] = useState(false);
    const [loading, setLoading] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const mismatch = repeat.length > 0 && password !== repeat;
    const sl = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
    const sc = ["", "#ef4444", "#e8a020", "#22c55e"];
    const slb = ["", "Weak", "Fair", "Strong"];

    const dispatch = useAppDispatch();
    const [registerMutation] = useRegisterMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (mismatch || password.length < 8) return;
        setLoading(true);
        try {
            const res = await registerMutation({ name, email, phone, password }).unwrap();
            const userData = res?.data?.user;
            const token = res?.data?.accessToken;

            if (userData && token) {
                dispatch(setUser({ user: userData, token }));
            }
            toast.success(res?.message || "Account created successfully!");
            onDone();
        } catch (err: any) {
            const errorMessage = err?.data?.message || err?.message || "Registration failed. Please try again.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5 text-center relative pb-2">
                <button onClick={onBack} className="absolute left-0 top-0 text-muted-foreground hover:text-foreground p-1 transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer">
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <h2 className="text-2xl font-bold text-foreground mt-6" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                    Create Account
                </h2>
                <p className="text-muted-foreground text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Fill in details to set up your profile
                </p>
            </div>

            {/* Profile Photo */}
            <div className="flex justify-center select-none pb-2">
                <button type="button" onClick={() => fileRef.current?.click()} className="relative group cursor-pointer">
                    <div className="w-20 h-20 rounded-full border-2 border-dashed border-primary/30 group-hover:border-primary/80 transition-all overflow-hidden flex items-center justify-center bg-[#1a0e07]">
                        {photo ? (
                            <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center gap-0.5">
                                <User className="w-6 h-6 text-muted-foreground" strokeWidth={1.5} />
                                <span className="text-[10px] text-[#a08060] font-sans">Photo</span>
                            </div>
                        )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-md">
                        <Camera className="w-3.5 h-3.5 text-primary-foreground" />
                    </div>
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) setPhoto(URL.createObjectURL(f));
                        }}
                    />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <WebInputField label="Full Name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ahmed Hassan" required icon={<User className="w-4 h-4" />} />

                <WebInputField label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ahmed@email.com" required icon={<Mail className="w-4 h-4" />} />

                <WebInputField label="Phone Number" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+880 1712-345678" required icon={<Phone className="w-4 h-4" />} />

                <WebInputField
                    label="Password"
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    required
                    icon={<Lock className="w-4 h-4" />}
                    rightElement={
                        <button type="button" tabIndex={-1} onClick={() => setShowPass((v) => !v)} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    }
                />

                {password.length > 0 && (
                    <div className="flex items-center gap-3 -mt-2 select-none">
                        <div className="flex gap-1 flex-1">
                            {[1, 2, 3].map((l) => (
                                <div key={l} className="h-1 flex-1 rounded-full transition-all" style={{ background: sl >= l ? sc[sl] : "rgba(232,160,32,0.15)" }} />
                            ))}
                        </div>
                        <span className="text-xs font-semibold font-mono" style={{ color: sc[sl] }}>
                            {slb[sl]}
                        </span>
                    </div>
                )}

                <WebInputField
                    label="Repeat Password"
                    type={showRepeat ? "text" : "password"}
                    value={repeat}
                    onChange={(e) => setRepeat(e.target.value)}
                    placeholder="Re-enter password"
                    required
                    error={mismatch ? "Passwords do not match" : undefined}
                    icon={<Lock className="w-4 h-4" />}
                    rightElement={
                        <button type="button" tabIndex={-1} onClick={() => setShowRepeat((v) => !v)} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                            {showRepeat ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    }
                />

                <div className="pt-2">
                    <PrimaryButton loading={loading} label="Create Account" loadingLabel="Creating…" disabled={mismatch} />
                </div>
            </form>

            <p className="text-center text-muted-foreground text-sm select-none" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Already have an account?{" "}
                <button type="button" onClick={onBack} className="text-primary hover:underline font-semibold cursor-pointer">
                    Sign In
                </button>
            </p>
        </motion.div>
    );
}
