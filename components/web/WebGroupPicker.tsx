import React, { useState } from "react";
import { motion } from "motion/react";
import { Home, Users, LogIn, Plus } from "lucide-react";
import { GroupStats } from "@/types";
import { ScreenShell, PrimaryButton, SpinnerIcon } from "@/components/ui/Shared";
import { makeMockStats } from "@/lib/mockData";

export function WebGroupPicker({ onGroupReady }: { onGroupReady: (s: GroupStats) => void }) {
    const [joinCode, setJoinCode] = useState("");
    const [groupName, setGroupName] = useState("");
    const [jf, setJf] = useState(false);
    const [cf, setCf] = useState(false);
    const [jl, setJl] = useState(false);
    const [cl, setCl] = useState(false);

    return (
        <ScreenShell scrollable>
            <div className="w-full max-w-5xl mx-auto flex flex-col min-h-full justify-center py-12 px-6 md:px-12 bg-transparent">
                {/* Header Title */}
                <div className="flex items-center justify-between pb-6 shrink-0">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                            My Bazar <span className="text-primary">Hisab</span>
                        </h1>
                        <p className="text-muted-foreground text-sm mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                            Manage your market groups
                        </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                        <Home className="w-5 h-5 text-primary-foreground" strokeWidth={2} />
                    </div>
                </div>

                <div className="h-px bg-border mb-10 shrink-0" />

                {/* Dual Panel Layout: Join Group & Create Group side-by-side */}
                <div className="flex flex-col md:flex-row md:items-stretch md:justify-center gap-8">
                    {/* Card 1: Join a Group */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 rounded-3xl border border-border bg-card p-8 flex flex-col justify-between shadow-xl" style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.5)" }}>
                        <div>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center">
                                    <LogIn className="w-6 h-6 text-primary" strokeWidth={1.8} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
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
                                className="flex flex-col gap-5"
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
                                <div className="mt-4">
                                    <PrimaryButton loading={jl} label="Join Group" loadingLabel="Joining…" />
                                </div>
                            </form>
                        </div>
                    </motion.div>

                    {/* Responsive Divider */}
                    <div className="flex md:flex-col items-center gap-3 justify-center select-none py-2 md:py-0">
                        <div className="flex-1 h-px md:w-px md:h-24 bg-border" />
                        <span className="text-muted-foreground text-sm uppercase tracking-widest font-mono font-semibold">or</span>
                        <div className="flex-1 h-px md:w-px md:h-24 bg-border" />
                    </div>

                    {/* Card 2: Create a Group */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="flex-1 rounded-3xl border border-border bg-card p-8 flex flex-col justify-between shadow-xl" style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.5)" }}>
                        <div>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-accent/20 border border-accent/30 flex items-center justify-center">
                                    <Plus className="w-6 h-6 text-accent" strokeWidth={2} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
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
                                className="flex flex-col gap-5"
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
                                <div className="mt-4">
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
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </ScreenShell>
    );
}

export default WebGroupPicker;
