import React, { useState } from "react";
import { motion } from "motion/react";
import { User, Shield, Info, Bell, BellOff, Mail, Globe, MapPin, FileText, LogOut, Trash2, AlertTriangle } from "lucide-react";
import { Toggle, SettingsRow } from "@/components/ui/Shared";
import { initials, avatarColor, MOCK_USERS } from "@/lib/mockData";

export function ProfileTab({ onEditProfile, onChangePassword }: { onEditProfile: () => void; onChangePassword: () => void }) {
    const me = MOCK_USERS[0];
    const [pushNotif, setPushNotif] = useState(true);
    const [emailNotif, setEmailNotif] = useState(true);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    return (
        <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
            <div className="px-6 pt-12 pb-4 shrink-0">
                <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                    My <span className="text-primary">Profile</span>
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Account & settings
                </p>
            </div>
            <div className="mx-6 h-px bg-border mb-4 shrink-0" />

            <div className="flex flex-col px-6 pb-8 gap-5">
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.35)" }}>
                    <div className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 font-bold text-xl text-white" style={{ background: avatarColor(me.id) }}>
                        {initials(me.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-base font-bold text-foreground truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                            {me.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate mt-0.5 font-mono">{me.email}</p>
                        <p className="text-xs text-muted-foreground mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                            {me.phone}
                        </p>
                        <div className="flex items-center gap-1.5 mt-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                            <span className="text-xs text-green-400 font-medium font-mono">Active · Verified</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }} className="rounded-2xl border border-border bg-card overflow-hidden" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.3)" }}>
                    <div className="px-4 py-3 border-b border-border">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest font-mono">Account</p>
                    </div>
                    <SettingsRow icon={<User className="w-4 h-4" />} label="Edit Profile" sub="Update your name, photo, address & more" onClick={onEditProfile} />
                    <div className="h-px bg-border mx-4" />
                    <SettingsRow icon={<Shield className="w-4 h-4" />} label="Change Password" sub="Update your account password" onClick={onChangePassword} />
                    <div className="h-px bg-border mx-4" />
                    <SettingsRow icon={<Info className="w-4 h-4" />} label="Account Info" sub="Last login: Today · Member since Jan 2025" />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-border bg-card overflow-hidden" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.3)" }}>
                    <div className="px-4 py-3 border-b border-border">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest font-mono">Notifications</p>
                    </div>
                    <SettingsRow icon={pushNotif ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />} label="Push Notifications" sub={pushNotif ? "Receive alerts for new entries" : "Notifications are off"} right={<Toggle on={pushNotif} onToggle={() => setPushNotif((v) => !v)} />} />
                    <div className="h-px bg-border mx-4" />
                    <SettingsRow icon={<Mail className="w-4 h-4" />} label="Email Notifications" sub={emailNotif ? "Get email summaries & alerts" : "Email notifications are off"} right={<Toggle on={emailNotif} onToggle={() => setEmailNotif((v) => !v)} />} />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }} className="rounded-2xl border border-border bg-card overflow-hidden" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.3)" }}>
                    <div className="px-4 py-3 border-b border-border">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest font-mono">Preferences</p>
                    </div>
                    <SettingsRow icon={<Globe className="w-4 h-4" />} label="Language" sub="English" right={<span className="text-xs text-muted-foreground font-semibold font-mono">EN</span>} />
                    <div className="h-px bg-border mx-4" />
                    <SettingsRow icon={<MapPin className="w-4 h-4" />} label="Address" sub="42 Mirpur Road, Dhaka, Bangladesh" />
                    <div className="h-px bg-border mx-4" />
                    <SettingsRow icon={<FileText className="w-4 h-4" />} label="About Me" sub="Managing our family bazar hisab since 2024." />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="rounded-2xl border border-destructive/25 bg-card overflow-hidden" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.3)" }}>
                    <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(212,24,61,0.2)" }}>
                        <p className="text-xs font-semibold uppercase tracking-widest font-mono" style={{ color: "#d4183d" }}>
                            Danger Zone
                        </p>
                    </div>
                    <SettingsRow icon={<LogOut className="w-4 h-4" />} label="Sign Out" sub="Sign out from this device" onClick={() => {}} danger />
                    <div className="h-px mx-4" style={{ background: "rgba(212,24,61,0.15)" }} />
                    <SettingsRow icon={<Trash2 className="w-4 h-4" />} label="Delete Account" sub="Permanently remove your account and data" onClick={() => setShowDeleteConfirm((v) => !v)} danger />
                </motion.div>

                {showDeleteConfirm && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-destructive/40 p-5" style={{ background: "rgba(212,24,61,0.06)" }}>
                        <div className="flex items-start gap-3 mb-4">
                            <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-semibold text-destructive" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                    Delete your account?
                                </p>
                                <p className="text-xs text-muted-foreground mt-1 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                    All your data, entries, and group memberships will be permanently removed. This action cannot be undone.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button type="button" onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-2.5 rounded-xl border border-border text-foreground text-sm font-medium hover:bg-secondary transition-all cursor-pointer" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                Cancel
                            </button>
                            <button type="button" className="flex-1 py-2.5 rounded-xl bg-destructive text-white text-sm font-semibold hover:opacity-90 transition-all cursor-pointer" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                Delete Account
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
export default ProfileTab;
