import React, { useState } from "react";

interface WebInputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon: React.ReactNode;
    rightElement?: React.ReactNode;
    error?: string;
}

export default function WebInputField({ label, icon, rightElement, error, ...props }: WebInputFieldProps) {
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
