import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { Mail, Lock, Eye, EyeOff, CheckCircle, User, Camera, Phone, ArrowLeft } from "lucide-react";
import { PrimaryButton } from "@/components/app/ui/Shared";
import { toast } from "sonner";
import { useLoginMutation, useRegisterMutation } from "@/redux/features/auth/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/features/auth/authSlice";

// ─── Web Custom Input Field Component ─────────────────────────────────────────
interface WebInputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon: React.ReactNode;
    rightElement?: React.ReactNode;
    error?: string;
}

function WebInputField({ label, icon, rightElement, error, ...props }: WebInputFieldProps) {
    const [focused, setFocused] = useState(false);
    return (
        <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">{label}</label>
            <div
                className={`flex items-center rounded-xl border transition-all duration-200 ${error ? "border-destructive/60 bg-[#2e1a0a] shadow-[0_0_0_3px_rgba(212,24,61,0.08)]" : focused ? "border-primary bg-[#2e1a0a] shadow-[0_0_0_3px_rgba(232,160,32,0.12)]" : "border-primary/20 bg-[#2e1a0a]"}`}
            >
                <span className="pl-4 text-muted-foreground shrink-0">{icon}</span>
                <input
                    {...props}
                    onFocus={(e) => {
                        setFocused(true);
                        props.onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setFocused(false);
                        props.onBlur?.(e);
                    }}
                    className="flex-1 px-3 py-3.5 bg-transparent text-sm outline-none font-sans"
                />
                {rightElement && <div className="pr-4 flex items-center">{rightElement}</div>}
            </div>
            {error && (
                <p className="text-xs text-destructive mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {error}
                </p>
            )}
        </div>
    );
}

// ─── Desktop Website Split Layout: Image Left, Forms Right ──────────────────
function WebLayoutWrapper({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen w-full flex bg-[#1a0e07] text-[#f5ede2] overflow-hidden">
            {/* Left Side — Hero Image Panel (Desktop only) */}
            <div className="hidden md:flex md:w-[45%] lg:w-[50%] relative shrink-0 overflow-hidden select-none">
                {/* Warm overlay gradient blending into right side */}
                <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, #1a0e07 0%, transparent 25%)" }} />
                <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: "linear-gradient(to top, #1a0e07 0%, transparent 30%)" }} />

                {/* Hero image fills */}
                <img src="/assets/auth-hero.png" alt="Bazar Hisab — shared kitchen table with groceries" className="w-full h-full object-cover" />

                {/* Bottom brand tag */}
                <div className="absolute bottom-6 left-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-[#1a0e07]/70 backdrop-blur-sm">
                    <img src="/assets/logo.png" alt="Logo" className="w-5 h-5 rounded-md object-contain" />
                    <span className="text-xs font-bold text-foreground" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                        My Bazar <span className="text-primary">Hisab</span>
                    </span>
                </div>
            </div>

            {/* Right Side — Form Content centered in the middle of right 50% */}
            <div className="flex-1 flex flex-col justify-center items-center overflow-y-auto px-6 sm:px-8 md:px-12 py-8 sm:py-12 relative">
                {/* Subtle dot grid background */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle, #e8a020 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

                <div className="w-full max-w-105 relative z-10">{children}</div>
            </div>
        </div>
    );
}

// ─── Web Auth Forms Switcher Component ───────────────────────────────────────
export function WebAuthForms({ onLogin, onBack }: { onLogin: () => void; onBack?: () => void }) {
    const [screen, setScreen] = useState<"login" | "register" | "forgot-email" | "forgot-otp" | "forgot-newpass" | "forgot-success">("login");
    const [forgotEmail, setForgotEmail] = useState("");

    const wrap = (node: React.ReactNode) => <WebLayoutWrapper>{node}</WebLayoutWrapper>;

    if (screen === "register") {
        return wrap(<WebRegisterScreen onBack={() => setScreen("login")} onDone={onLogin} />);
    }
    if (screen === "forgot-email") {
        return wrap(
            <WebForgotEmailScreen
                onBack={() => setScreen("login")}
                onNext={(em) => {
                    setForgotEmail(em);
                    setScreen("forgot-otp");
                }}
            />,
        );
    }
    if (screen === "forgot-otp") {
        return wrap(<WebForgotOtpScreen email={forgotEmail} onBack={() => setScreen("forgot-email")} onNext={() => setScreen("forgot-newpass")} />);
    }
    if (screen === "forgot-newpass") {
        return wrap(<WebForgotNewPassScreen onBack={() => setScreen("forgot-otp")} onDone={() => setScreen("forgot-success")} />);
    }
    if (screen === "forgot-success") {
        return wrap(<WebForgotSuccessScreen onDone={() => setScreen("login")} />);
    }

    return wrap(<WebLoginScreen onLogin={onLogin} onBack={onBack} onRegister={() => setScreen("register")} onForgot={() => setScreen("forgot-email")} />);
}

// ─── SCREEN: LOGIN ───────────────────────────────────────────────────────────
function WebLoginScreen({ onLogin, onBack, onRegister, onForgot }: { onLogin: () => void; onBack?: () => void; onRegister: () => void; onForgot: () => void }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();
    const [loginMutation] = useLoginMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await loginMutation({ email, password }).unwrap();
            const userData = res?.data?.user || res?.user || res?.data;
            const token = res?.data?.accessToken || res?.token || res?.accessToken;

            if (userData && token) {
                dispatch(setUser({ user: userData, token }));
            }
            toast.success(res?.message || "Login successful!");
            onLogin();
        } catch (err: any) {
            const errorMessage = err?.data?.message || err?.message || "Login failed. Please check your credentials.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 sm:gap-6">
            {/* Back link */}
            {onBack && (
                <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 text-xs sm:text-sm font-semibold cursor-pointer mb-1 sm:mb-2 self-start">
                    <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Back to Home
                </button>
            )}

            {/* Logo & Title */}
            <div className="flex flex-col gap-1 sm:gap-2">
                <div className="flex items-center gap-2.5 sm:gap-3 mb-2 sm:mb-4">
                    <img src="/assets/logo.png" alt="Logo" className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl object-contain" />
                    <span className="text-sm sm:text-base font-bold" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                        My Bazar <span className="text-primary">Hisab</span>
                    </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Welcome back
                </h2>
                <p className="text-muted-foreground text-xs sm:text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Enter your credentials to sign in
                </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">
                <WebInputField label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" required icon={<Mail className="w-4 h-4" />} />

                <WebInputField
                    label="Password"
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    icon={<Lock className="w-4 h-4" />}
                    rightElement={
                        <button type="button" tabIndex={-1} onClick={() => setShowPw((v) => !v)} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    }
                />

                <div className="flex justify-end -mt-1">
                    <button type="button" onClick={onForgot} className="text-primary text-xs hover:underline cursor-pointer" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        Forgot password?
                    </button>
                </div>

                <div className="pt-1 sm:pt-2">
                    <PrimaryButton loading={loading} label="Sign In" loadingLabel="Signing in…" />
                </div>
            </form>

            <div className="flex items-center gap-3 my-1.5 sm:my-2 select-none">
                <div className="flex-1 h-px bg-border" />
                <span className="text-muted-foreground text-[10px] uppercase tracking-widest font-mono">New Here?</span>
                <div className="flex-1 h-px bg-border" />
            </div>

            <button type="button" onClick={onRegister} className="w-full py-2.5 sm:py-3.5 rounded-xl border border-border text-foreground text-sm font-semibold hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Create an Account
            </button>
        </motion.div>
    );
}

// ─── SCREEN: REGISTER ────────────────────────────────────────────────────────
function WebRegisterScreen({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
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
            const userData = res?.data?.user || res?.user || res?.data;
            const token = res?.data?.accessToken || res?.token || res?.accessToken;

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

// ─── SCREEN: FORGOT EMAIL ────────────────────────────────────────────────────
function WebForgotEmailScreen({ onBack, onNext }: { onBack: () => void; onNext: (e: string) => void }) {
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

// ─── SCREEN: ENTER OTP CODE ──────────────────────────────────────────────────
function WebForgotOtpScreen({ email, onBack, onNext }: { email: string; onBack: () => void; onNext: () => void }) {
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

// ─── SCREEN: NEW PASSWORD ────────────────────────────────────────────────────
function WebForgotNewPassScreen({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
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

// ─── SCREEN: PASSWORD SUCCESS ────────────────────────────────────────────────
function WebForgotSuccessScreen({ onDone }: { onDone: () => void }) {
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
