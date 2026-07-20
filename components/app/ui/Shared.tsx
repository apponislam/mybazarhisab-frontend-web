import React from "react";
import { motion } from "motion/react";
import { ArrowLeft, AlertTriangle, ChevronRight } from "lucide-react";
import { MockUser } from "@/types";
import { initials, avatarColor } from "@/lib/mockData";

export const BG_DOTS = <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #e8a020 1px, transparent 1px)", backgroundSize: "28px 28px" }} />;

export const TOP_LINE = <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-primary to-transparent" />;

export function ScreenShell({ children, scrollable }: { children: React.ReactNode; scrollable?: boolean }) {
    return (
        <div className="relative size-full flex flex-col overflow-hidden bg-background">
            {TOP_LINE}
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(232,160,32,0.12) 0%, transparent 70%)" }} />
            {BG_DOTS}
            <div className={`relative flex flex-col flex-1 min-h-0 ${scrollable ? "overflow-y-auto" : "overflow-hidden"}`}>{children}</div>
        </div>
    );
}

export function SpinnerIcon() {
    return (
        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="31.4" strokeDashoffset="10" />
        </svg>
    );
}

export function PrimaryButton({ loading, label, loadingLabel, type = "submit", onClick, disabled }: { loading?: boolean; label: string; loadingLabel?: string; type?: "submit" | "button"; onClick?: () => void; disabled?: boolean }) {
    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={loading || disabled}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3.5 sm:py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-base transition-all hover:bg-accent disabled:opacity-50 cursor-pointer"
            style={{ fontFamily: "'DM Sans', sans-serif", boxShadow: "0 4px 20px rgba(232,160,32,0.3)" }}
        >
            {loading ? (
                <span className="flex items-center justify-center gap-2">
                    <SpinnerIcon />
                    {loadingLabel ?? "Please wait…"}
                </span>
            ) : (
                label
            )}
        </motion.button>
    );
}

export function BackButton({ onBack, label = "Back" }: { onBack: () => void; label?: string }) {
    return (
        <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm mb-5 cursor-pointer" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <ArrowLeft className="w-4 h-4" /> {label}
        </button>
    );
}

export function StepDots({ current, total }: { current: number; total: number }) {
    return (
        <div className="flex items-center gap-2 mb-6">
            {Array.from({ length: total }).map((_, i) => (
                <div key={i} className="transition-all duration-300 rounded-full" style={{ width: i === current ? 20 : 6, height: 6, background: i <= current ? "#e8a020" : "rgba(232,160,32,0.2)" }} />
            ))}
        </div>
    );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-3 mt-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>
                {children}
            </span>
            <div className="flex-1 h-px bg-border" />
        </div>
    );
}

export function FieldBox({ label, focused, error, children }: { label: string; focused: boolean; error?: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground/80" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {label}
            </label>
            <div
                className="rounded-xl border transition-all duration-200"
                style={{ borderColor: error ? "rgba(212,24,61,0.6)" : focused ? "rgba(232,160,32,0.7)" : "rgba(232,160,32,0.18)", background: "#2e1a0a", boxShadow: error ? "0 0 0 3px rgba(212,24,61,0.08)" : focused ? "0 0 0 3px rgba(232,160,32,0.12)" : "none" }}
            >
                {children}
            </div>
            {error && (
                <p className="text-xs text-destructive" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {error}
                </p>
            )}
        </div>
    );
}

export function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
    return (
        <button type="button" onClick={onToggle} className="w-12 h-6 rounded-full transition-all duration-300 flex items-center relative shrink-0 cursor-pointer" style={{ background: on ? "#e8a020" : "rgba(232,160,32,0.2)" }}>
            <div className="w-5 h-5 rounded-full bg-white shadow-md absolute transition-all duration-300" style={{ left: on ? "calc(100% - 22px)" : "2px" }} />
        </button>
    );
}

export function SettingsRow({ icon, label, sub, right, onClick, danger }: { icon: React.ReactNode; label: string; sub?: string; right?: React.ReactNode; onClick?: () => void; danger?: boolean }) {
    const Tag = onClick ? "button" : "div";
    return (
        <Tag type={onClick ? "button" : undefined} onClick={onClick} className={`w-full flex items-center gap-3 p-4 text-left transition-all ${onClick ? "hover:bg-primary/5 active:bg-primary/10 cursor-pointer" : ""}`}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: danger ? "rgba(212,24,61,0.12)" : "rgba(232,160,32,0.1)", color: danger ? "#d4183d" : "#e8a020" }}>
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{ fontFamily: "'DM Sans', sans-serif", color: danger ? "#d4183d" : undefined }}>
                    {label}
                </p>
                {sub && (
                    <p className="text-xs text-muted-foreground mt-0.5 truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {sub}
                    </p>
                )}
            </div>
            {right ?? (onClick && !danger && <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />)}
        </Tag>
    );
}

export function FilterTabs({ active, onChange }: { active: "month" | "all"; onChange: (v: "month" | "all") => void }) {
    return (
        <div className="flex gap-2 mx-6 mb-4 p-1 rounded-xl border border-border bg-card" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
            {(["month", "all"] as const).map((tab) => (
                <button
                    key={tab}
                    type="button"
                    onClick={() => onChange(tab)}
                    className="flex-1 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer"
                    style={{
                        fontFamily: "'DM Sans', sans-serif",
                        background: active === tab ? "#e8a020" : "transparent",
                        color: active === tab ? "#1a0e07" : "#a08060",
                        boxShadow: active === tab ? "0 2px 8px rgba(232,160,32,0.3)" : "none",
                    }}
                >
                    {tab === "month" ? "This Month" : "All"}
                </button>
            ))}
        </div>
    );
}

export function DeleteConfirm({ label, onConfirm, onCancel }: { label: string; onConfirm: () => void; onCancel: () => void }) {
    return (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-2xl border border-destructive/40 p-5" style={{ background: "rgba(212,24,61,0.06)" }}>
            <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm font-semibold text-destructive" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        Delete {label}?
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        This action cannot be undone.
                    </p>
                </div>
            </div>
            <div className="flex gap-3">
                <button type="button" onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-border text-foreground text-sm font-medium transition-all hover:bg-secondary cursor-pointer" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Cancel
                </button>
                <button type="button" onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-destructive text-white text-sm font-semibold transition-all hover:opacity-90 cursor-pointer" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Delete
                </button>
            </div>
        </motion.div>
    );
}

export function Avatar({ user, size = 36 }: { user: MockUser; size?: number }) {
    return (
        <div className="rounded-full flex items-center justify-center shrink-0 font-semibold text-white" style={{ width: size, height: size, background: avatarColor(user.id), fontSize: size * 0.36 }}>
            {initials(user.name)}
        </div>
    );
}
