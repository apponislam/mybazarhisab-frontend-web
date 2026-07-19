import React, { useState } from "react";
import { motion } from "motion/react";
import { Home, Users, LogIn, Plus } from "lucide-react";
import { GroupStats } from "@/types";
import { ScreenShell, PrimaryButton, SpinnerIcon } from "@/components/ui/Shared";
import { makeMockStats } from "@/lib/mockData";

export function GroupPickerScreen({ onGroupReady }: { onGroupReady: (s: GroupStats) => void }) {
    const [joinCode, setJoinCode] = useState("");
    const [groupName, setGroupName] = useState("");
    const [jf, setJf] = useState(false);
    const [cf, setCf] = useState(false);
    const [jl, setJl] = useState(false);
    const [cl, setCl] = useState(false);

    return (
        <ScreenShell scrollable>
            <div className="flex items-center justify-between px-6 pt-14 pb-6 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                        My Bazar <span className="text-primary">Hisab</span>
                    </h1>
                    <p className="text-muted-foreground text-sm mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        Manage your market groups
                    </p>
                </div>
                <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center shadow-md shadow-primary/30">
                    <Home className="w-5 h-5 text-primary-foreground" strokeWidth={2} />
                </div>
            </div>
            <div className="mx-6 h-px bg-border mb-6 shrink-0" />
            <div className="flex-1 flex flex-col px-6 pb-8 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-card p-6" style={{ boxShadow: "0 4px 32px rgba(0,0,0,0.4)" }}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
                            <LogIn className="w-5 h-5 text-primary" strokeWidth={1.8} />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                Join a Group
                            </h3>
                            <p className="text-muted-foreground text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                Enter a code shared by your admin
                            </p>
                        </div>
                    </div>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (!joinCode.trim()) return;
                            setJl(true);
                            setTimeout(() => {
                                setJl(false);
                                onGroupReady(makeMockStats("Sabzi Mandi Group"));
                            }, 1500);
                        }}
                        className="flex flex-col gap-3"
                    >
                        <div className="rounded-xl border transition-all" style={{ borderColor: jf ? "rgba(232,160,32,0.7)" : "rgba(232,160,32,0.18)", background: "#2e1a0a", boxShadow: jf ? "0 0 0 3px rgba(232,160,32,0.12)" : "none" }}>
                            <div className="flex items-center">
                                <span className="pl-4 text-muted-foreground">
                                    <Users className="w-4 h-4" />
                                </span>
                                <input
                                    type="text"
                                    value={joinCode}
                                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                    onFocus={() => setJf(true)}
                                    onBlur={() => setJf(false)}
                                    placeholder="e.g. BZR-4821"
                                    className="flex-1 px-3 py-3.5 bg-transparent text-foreground placeholder-muted-foreground text-sm outline-none tracking-widest font-mono"
                                />
                            </div>
                        </div>
                        <PrimaryButton loading={jl} label="Join Group" loadingLabel="Joining…" />
                    </form>
                </motion.div>
                <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-muted-foreground text-xs uppercase tracking-widest font-mono">or</span>
                    <div className="flex-1 h-px bg-border" />
                </div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="rounded-2xl border border-border bg-card p-6" style={{ boxShadow: "0 4px 32px rgba(0,0,0,0.4)" }}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center">
                            <Plus className="w-5 h-5 text-accent" strokeWidth={2} />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                Create a Group
                            </h3>
                            <p className="text-muted-foreground text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                Start a new bazar hisab group
                            </p>
                        </div>
                    </div>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (!groupName.trim()) return;
                            setCl(true);
                            setTimeout(() => {
                                setCl(false);
                                onGroupReady(makeMockStats(groupName.trim()));
                            }, 1500);
                        }}
                        className="flex flex-col gap-3"
                    >
                        <div className="rounded-xl border transition-all" style={{ borderColor: cf ? "rgba(192,96,16,0.8)" : "rgba(192,96,16,0.25)", background: "#2e1a0a", boxShadow: cf ? "0 0 0 3px rgba(192,96,16,0.12)" : "none" }}>
                            <div className="flex items-center">
                                <span className="pl-4 text-muted-foreground">
                                    <Users className="w-4 h-4" />
                                </span>
                                <input
                                    type="text"
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                    onFocus={() => setCf(true)}
                                    onBlur={() => setCf(false)}
                                    placeholder="e.g. Sabzi Mandi"
                                    className="flex-1 px-3 py-3.5 bg-transparent text-foreground placeholder-muted-foreground text-sm outline-none"
                                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                                />
                            </div>
                        </div>
                        <motion.button
                            type="submit"
                            disabled={cl || !groupName.trim()}
                            whileTap={{ scale: 0.97 }}
                            className="w-full py-4 rounded-xl border text-foreground font-semibold text-base disabled:opacity-50 cursor-pointer"
                            style={{ fontFamily: "'DM Sans', sans-serif", borderColor: "rgba(192,96,16,0.5)" }}
                        >
                            {cl ? (
                                <span className="flex items-center justify-center gap-2 text-accent">
                                    <SpinnerIcon />
                                    Creating…
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <Plus className="w-4 h-4 text-accent" strokeWidth={2} />
                                    Create Group
                                </span>
                            )}
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </ScreenShell>
    );
}
export default GroupPickerScreen;
