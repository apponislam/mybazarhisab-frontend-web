import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";
import { Mail, Lock, Eye, EyeOff, CheckCircle, BookOpen, User, Camera, Phone } from "lucide-react";
import { ScreenShell, PrimaryButton, BackButton, StepDots, FieldBox, SpinnerIcon } from "@/components/ui/Shared";
import { avatarColor, initials } from "@/lib/mockData";

export function AuthForms({ onLogin }: { onLogin: () => void }) {
    const [screen, setScreen] = useState<"login" | "register" | "forgot-email" | "forgot-otp" | "forgot-newpass" | "forgot-success">("login");
    const [forgotEmail, setForgotEmail] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [loginLoading, setLoginLoading] = useState(false);
    const [fE, setFE] = useState(false);
    const [fP, setFP] = useState(false);

    if (screen === "register") return <RegisterScreen onBack={() => setScreen("login")} onDone={onLogin} />;
    if (screen === "forgot-email")
        return (
            <ForgotEmailScreen
                onBack={() => setScreen("login")}
                onNext={(em) => {
                    setForgotEmail(em);
                    setScreen("forgot-otp");
                }}
            />
        );
    if (screen === "forgot-otp") return <ForgotOtpScreen email={forgotEmail} onBack={() => setScreen("forgot-email")} onNext={() => setScreen("forgot-newpass")} />;
    if (screen === "forgot-newpass") return <ForgotNewPassScreen onBack={() => setScreen("forgot-otp")} onDone={() => setScreen("forgot-success")} />;
    if (screen === "forgot-success") {
        return (
            <ScreenShell scrollable>
                <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 text-center">
                    <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="mb-8">
                        <div className="w-24 h-24 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto">
                            <CheckCircle className="w-12 h-12 text-primary" strokeWidth={1.5} />
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <h2 className="text-2xl font-bold text-foreground mb-3" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                            Password Reset!
                        </h2>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                            Your password has been updated. You can now sign in.
                        </p>
                        <PrimaryButton type="button" label="Back to Sign In" onClick={() => setScreen("login")} />
                    </motion.div>
                </div>
            </ScreenShell>
        );
    }

    return (
        <ScreenShell scrollable>
            <div className="flex flex-col flex-1 pb-10">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center pt-14 pb-8 px-8">
                    <div className="w-16 h-16 mb-4 flex items-center justify-center">
                        <img src="/assets/logo.png" alt="My Bazar Hisab Logo" className="w-full h-full object-contain rounded-2xl" />
                    </div>
                    <h1 className="text-3xl font-bold text-foreground text-center" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                        My Bazar <span className="text-primary">Hisab</span>
                    </h1>
                    <p className="mt-1 text-muted-foreground text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        Sign in to your account
                    </p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mx-5 rounded-3xl border border-border bg-card p-7 flex flex-col" style={{ boxShadow: "0 8px 48px rgba(0,0,0,0.5)" }}>
                    <h2 className="text-xl font-semibold text-foreground mb-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        Welcome back
                    </h2>
                    <p className="text-muted-foreground text-sm mb-7" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        Enter your credentials to continue
                    </p>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            setLoginLoading(true);
                            setTimeout(() => {
                                setLoginLoading(false);
                                onLogin();
                            }, 1500);
                        }}
                        className="flex flex-col gap-4"
                    >
                        <FieldBox label="Email Address" focused={fE}>
                            <div className="flex items-center" onFocus={() => setFE(true)} onBlur={() => setFE(false)}>
                                <span className="pl-4 text-muted-foreground">
                                    <Mail className="w-4 h-4" />
                                </span>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="flex-1 px-3 py-3.5 bg-transparent text-foreground placeholder:text-muted-foreground text-sm outline-none" style={{ fontFamily: "'DM Sans', sans-serif" }} />
                            </div>
                        </FieldBox>
                        <FieldBox label="Password" focused={fP}>
                            <div className="flex items-center" onFocus={() => setFP(true)} onBlur={() => setFP(false)}>
                                <span className="pl-4 text-muted-foreground">
                                    <Lock className="w-4 h-4" />
                                </span>
                                <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="flex-1 px-3 py-3.5 bg-transparent text-foreground placeholder:text-muted-foreground text-sm outline-none" style={{ fontFamily: "'DM Sans', sans-serif" }} />
                                <button type="button" tabIndex={-1} onClick={() => setShowPw((v) => !v)} className="pr-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                                    {showPw ? <EyeOff className="w-4 h-4" strokeWidth={1.8} /> : <Eye className="w-4 h-4" strokeWidth={1.8} />}
                                </button>
                            </div>
                        </FieldBox>
                        <div className="flex justify-end">
                            <button type="button" onClick={() => setScreen("forgot-email")} className="text-primary text-sm hover:text-accent transition-colors cursor-pointer" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                Forgot password?
                            </button>
                        </div>
                        <PrimaryButton loading={loginLoading} label="Sign In" loadingLabel="Signing in…" />
                    </form>
                    <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px bg-border" />
                        <span className="text-muted-foreground text-xs uppercase tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>
                            New here?
                        </span>
                        <div className="flex-1 h-px bg-border" />
                    </div>
                    <button type="button" onClick={() => setScreen("register")} className="w-full py-3.5 rounded-xl border border-border text-foreground text-sm font-medium hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        Create an Account
                    </button>
                </motion.div>
                <div className="h-6" />
            </div>
        </ScreenShell>
    );
}

function RegisterScreen({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
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
    const [fN, setFN] = useState(false);
    const [fE, setFE] = useState(false);
    const [fPh, setFPh] = useState(false);
    const [fP, setFP] = useState(false);
    const [fR, setFR] = useState(false);
    const mismatch = repeat.length > 0 && password !== repeat;
    const sl = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
    const sc = ["", "#ef4444", "#e8a020", "#22c55e"];
    const slb = ["", "Weak", "Fair", "Strong"];

    return (
        <ScreenShell scrollable>
            <div className="flex flex-col px-6 pt-12 pb-8">
                <BackButton onBack={onBack} />
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-foreground mb-1" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                        Create Account
                    </h2>
                    <p className="text-muted-foreground text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        Fill in your details to get started
                    </p>
                </div>
                <div className="flex justify-center mb-7">
                    <button type="button" onClick={() => fileRef.current?.click()} className="relative group cursor-pointer">
                        <div className="w-24 h-24 rounded-full border-2 border-dashed border-primary/40 group-hover:border-primary/80 transition-all overflow-hidden flex items-center justify-center bg-card" style={{ boxShadow: "0 0 0 4px rgba(232,160,32,0.08)" }}>
                            {photo ? (
                                <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center gap-1">
                                    <User className="w-8 h-8 text-muted-foreground" strokeWidth={1.5} />
                                    <span className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                        Photo
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-md">
                            <Camera className="w-4 h-4 text-primary-foreground" strokeWidth={2} />
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
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (mismatch || password.length < 8) return;
                        setLoading(true);
                        setTimeout(() => {
                            setLoading(false);
                            onDone();
                        }, 1600);
                    }}
                    className="flex flex-col gap-4"
                >
                    {[
                        { label: "Full Name", v: name, sv: setName, f: fN, sf: setFN, icon: <User className="w-4 h-4" />, type: "text" },
                        { label: "Email Address", v: email, sv: setEmail, f: fE, sf: setFE, icon: <Mail className="w-4 h-4" />, type: "email" },
                        { label: "Phone Number", v: phone, sv: setPhone, f: fPh, sf: setFPh, icon: <Phone className="w-4 h-4" />, type: "tel" },
                    ].map((field) => (
                        <FieldBox key={field.label} label={field.label} focused={field.f}>
                            <div className="flex items-center" onFocus={() => field.sf(true)} onBlur={() => field.sf(false)}>
                                <span className="pl-4 text-muted-foreground">{field.icon}</span>
                                <input type={field.type} value={field.v} onChange={(e) => field.sv(e.target.value)} required className="flex-1 px-3 py-3.5 bg-transparent text-foreground placeholder:text-muted-foreground text-sm outline-none" style={{ fontFamily: "'DM Sans', sans-serif" }} />
                            </div>
                        </FieldBox>
                    ))}
                    <FieldBox label="Password" focused={fP}>
                        <div className="flex items-center" onFocus={() => setFP(true)} onBlur={() => setFP(false)}>
                            <span className="pl-4 text-muted-foreground">
                                <Lock className="w-4 h-4" />
                            </span>
                            <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 characters" required className="flex-1 px-3 py-3.5 bg-transparent text-foreground placeholder:text-muted-foreground text-sm outline-none" style={{ fontFamily: "'DM Sans', sans-serif" }} />
                            <button type="button" tabIndex={-1} onClick={() => setShowPass((v) => !v)} className="pr-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                                {showPass ? <EyeOff className="w-4 h-4" strokeWidth={1.8} /> : <Eye className="w-4 h-4" strokeWidth={1.8} />}
                            </button>
                        </div>
                    </FieldBox>
                    {password.length > 0 && (
                        <div className="flex items-center gap-3 -mt-2">
                            <div className="flex gap-1 flex-1">
                                {[1, 2, 3].map((l) => (
                                    <div key={l} className="h-1 flex-1 rounded-full transition-all" style={{ background: sl >= l ? sc[sl] : "rgba(232,160,32,0.15)" }} />
                                ))}
                            </div>
                            <span className="text-xs font-medium" style={{ color: sc[sl], fontFamily: "'DM Mono', monospace" }}>
                                {slb[sl]}
                            </span>
                        </div>
                    )}
                    <FieldBox label="Repeat Password" focused={fR} error={mismatch ? "Passwords do not match" : undefined}>
                        <div className="flex items-center" onFocus={() => setFR(true)} onBlur={() => setFR(false)}>
                            <span className="pl-4 text-muted-foreground">
                                <Lock className="w-4 h-4" />
                            </span>
                            <input type={showRepeat ? "text" : "password"} value={repeat} onChange={(e) => setRepeat(e.target.value)} placeholder="Re-enter password" required className="flex-1 px-3 py-3.5 bg-transparent text-foreground placeholder:text-muted-foreground text-sm outline-none" style={{ fontFamily: "'DM Sans', sans-serif" }} />
                            <button type="button" tabIndex={-1} onClick={() => setShowRepeat((v) => !v)} className="pr-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                                {showRepeat ? <EyeOff className="w-4 h-4" strokeWidth={1.8} /> : <Eye className="w-4 h-4" strokeWidth={1.8} />}
                            </button>
                        </div>
                    </FieldBox>
                    <div className="mt-2">
                        <PrimaryButton loading={loading} label="Create Account" loadingLabel="Creating…" disabled={mismatch} />
                    </div>
                </form>
                <p className="text-center text-muted-foreground text-sm mt-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Already have an account?{" "}
                    <button type="button" onClick={onBack} className="text-primary hover:text-accent transition-colors font-medium cursor-pointer">
                        Sign In
                    </button>
                </p>
            </div>
        </ScreenShell>
    );
}

function ForgotEmailScreen({ onBack, onNext }: { onBack: () => void; onNext: (e: string) => void }) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [f, setF] = useState(false);

    return (
        <ScreenShell scrollable>
            <div className="flex flex-col px-6 pt-12 pb-8 flex-1">
                <BackButton onBack={onBack} />
                <StepDots current={0} total={3} />
                <div className="mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center mb-5">
                        <Mail className="w-6 h-6 text-primary" strokeWidth={1.8} />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-1" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                        Forgot Password?
                    </h2>
                    <p className="text-muted-foreground text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        Enter your registered email and we will send a code.
                    </p>
                </div>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        setLoading(true);
                        setTimeout(() => {
                            setLoading(false);
                            onNext(email);
                        }, 1500);
                    }}
                    className="flex flex-col gap-5 flex-1 justify-between"
                >
                    <FieldBox label="Email Address" focused={f}>
                        <div className="flex items-center" onFocus={() => setF(true)} onBlur={() => setF(false)}>
                            <span className="pl-4 text-muted-foreground">
                                <Mail className="w-4 h-4" />
                            </span>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required autoFocus className="flex-1 px-3 py-3.5 bg-transparent text-foreground placeholder:text-muted-foreground text-sm outline-none" style={{ fontFamily: "'DM Sans', sans-serif" }} />
                        </div>
                    </FieldBox>
                    <div className="mt-8 pt-4">
                        <PrimaryButton loading={loading} label="Send OTP" loadingLabel="Sending…" />
                    </div>
                </form>
            </div>
        </ScreenShell>
    );
}

function ForgotOtpScreen({ email, onBack, onNext }: { email: string; onBack: () => void; onNext: () => void }) {
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

    return (
        <ScreenShell scrollable>
            <div className="flex flex-col px-6 pt-12 pb-8 flex-1">
                <BackButton onBack={onBack} />
                <StepDots current={1} total={3} />
                <div className="mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center mb-5 text-xl">🔐</div>
                    <h2 className="text-2xl font-bold text-foreground mb-1" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                        Enter OTP
                    </h2>
                    <p className="text-muted-foreground text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        6-digit code sent to <span className="text-primary font-medium">{email}</span>
                    </p>
                </div>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (!filled) return;
                        setLoading(true);
                        setTimeout(() => {
                            setLoading(false);
                            onNext();
                        }, 1500);
                    }}
                    className="flex flex-col gap-6 flex-1 justify-between"
                >
                    <div className="flex gap-3" onPaste={handlePaste}>
                        {otp.map((digit, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="flex-1">
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
                                    className="w-full aspect-square text-center text-xl font-bold text-foreground rounded-xl outline-none transition-all"
                                    style={{ background: "#2e1a0a", border: digit ? "1.5px solid rgba(232,160,32,0.8)" : "1.5px solid rgba(232,160,32,0.2)", boxShadow: digit ? "0 0 0 3px rgba(232,160,32,0.1)" : "none", fontFamily: "'DM Mono', monospace" }}
                                />
                            </motion.div>
                        ))}
                    </div>
                    <div className="text-center">
                        {timer > 0 ? (
                            <p className="text-muted-foreground text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                Resend in{" "}
                                <span className="text-primary font-medium" style={{ fontFamily: "'DM Mono', monospace" }}>
                                    00:{String(timer).padStart(2, "0")}
                                </span>
                            </p>
                        ) : (
                            <button type="button" onClick={() => setTimer(30)} className="text-primary text-sm font-medium hover:text-accent cursor-pointer" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                Resend OTP
                            </button>
                        )}
                    </div>
                    <div className="mt-8 pt-2">
                        <PrimaryButton loading={loading} label="Verify Code" loadingLabel="Verifying…" disabled={!filled} />
                    </div>
                </form>
            </div>
        </ScreenShell>
    );
}

function ForgotNewPassScreen({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
    const [np, setNp] = useState("");
    const [rp, setRp] = useState("");
    const [sn, setSn] = useState(false);
    const [sr, setSr] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fn, setFn] = useState(false);
    const [fr, setFr] = useState(false);
    const mm = rp.length > 0 && np !== rp;
    const sl = np.length === 0 ? 0 : np.length < 6 ? 1 : np.length < 10 ? 2 : 3;
    const sc = ["", "#ef4444", "#e8a020", "#22c55e"];
    const slb = ["", "Weak", "Fair", "Strong"];

    return (
        <ScreenShell scrollable>
            <div className="flex flex-col px-6 pt-12 pb-8 flex-1">
                <BackButton onBack={onBack} />
                <StepDots current={2} total={3} />
                <div className="mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center mb-5 text-xl">🔑</div>
                    <h2 className="text-2xl font-bold text-foreground mb-1" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                        New Password
                    </h2>
                    <p className="text-muted-foreground text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        Create a strong password. At least 8 characters.
                    </p>
                </div>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (mm || np.length < 8) return;
                        setLoading(true);
                        setTimeout(() => {
                            setLoading(false);
                            onDone();
                        }, 1500);
                    }}
                    className="flex flex-col gap-4 flex-1 justify-between"
                >
                    <div className="flex flex-col gap-4">
                        <FieldBox label="New Password" focused={fn}>
                            <div className="flex items-center" onFocus={() => setFn(true)} onBlur={() => setFn(false)}>
                                <span className="pl-4 text-muted-foreground">
                                    <Lock className="w-4 h-4" />
                                </span>
                                <input type={sn ? "text" : "password"} value={np} onChange={(e) => setNp(e.target.value)} placeholder="Min. 8 characters" autoFocus className="flex-1 px-3 py-3.5 bg-transparent text-foreground placeholder:text-muted-foreground text-sm outline-none" style={{ fontFamily: "'DM Sans', sans-serif" }} />
                                <button type="button" tabIndex={-1} onClick={() => setSn((v) => !v)} className="pr-4 text-muted-foreground hover:text-foreground cursor-pointer">
                                    {sn ? <EyeOff className="w-4 h-4" strokeWidth={1.8} /> : <Eye className="w-4 h-4" strokeWidth={1.8} />}
                                </button>
                            </div>
                        </FieldBox>
                        {np.length > 0 && (
                            <div className="flex items-center gap-3 -mt-2">
                                <div className="flex gap-1 flex-1">
                                    {[1, 2, 3].map((l) => (
                                        <div key={l} className="h-1 flex-1 rounded-full" style={{ background: sl >= l ? sc[sl] : "rgba(232,160,32,0.15)" }} />
                                    ))}
                                </div>
                                <span className="text-xs font-medium" style={{ color: sc[sl], fontFamily: "'DM Mono', monospace" }}>
                                    {slb[sl]}
                                </span>
                            </div>
                        )}
                        <FieldBox label="Repeat Password" focused={fr} error={mm ? "Passwords do not match" : undefined}>
                            <div className="flex items-center" onFocus={() => setFr(true)} onBlur={() => setFr(false)}>
                                <span className="pl-4 text-muted-foreground">
                                    <Lock className="w-4 h-4" />
                                </span>
                                <input type={sr ? "text" : "password"} value={rp} onChange={(e) => setRp(e.target.value)} placeholder="Re-enter password" className="flex-1 px-3 py-3.5 bg-transparent text-foreground placeholder:text-muted-foreground text-sm outline-none" style={{ fontFamily: "'DM Sans', sans-serif" }} />
                                <button type="button" tabIndex={-1} onClick={() => setSr((v) => !v)} className="pr-4 text-muted-foreground hover:text-foreground cursor-pointer">
                                    {sr ? <EyeOff className="w-4 h-4" strokeWidth={1.8} /> : <Eye className="w-4 h-4" strokeWidth={1.8} />}
                                </button>
                            </div>
                        </FieldBox>
                    </div>
                    <div className="mt-8 pt-2">
                        <PrimaryButton loading={loading} label="Reset Password" loadingLabel="Saving…" disabled={mm || np.length < 8} />
                    </div>
                </form>
            </div>
        </ScreenShell>
    );
}
