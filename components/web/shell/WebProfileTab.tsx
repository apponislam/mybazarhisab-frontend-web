"use client";

import React from "react";
import { User, KeyRound, HelpCircle, MessageSquare, Star } from "lucide-react";
import { avatarColor, initials } from "./WebUtils";

interface WebProfileTabProps {
    currentUser: any;
    profileName: string;
    setProfileName: (v: string) => void;
    profilePhone: string;
    setProfilePhone: (v: string) => void;
    editingProfile: boolean;
    setEditingProfile: (v: boolean) => void;
    updateUserLoading: boolean;
    onSaveProfile: (e: React.FormEvent) => void;

    oldPassword: string;
    setOldPassword: (v: string) => void;
    newPassword: string;
    setNewPassword: (v: string) => void;
    confirmPassword: string;
    setConfirmPassword: (v: string) => void;
    changePasswordLoading: boolean;
    onChangePassword: (e: React.FormEvent) => void;

    onOpenContact: () => void;
    onOpenFeedback: () => void;
    onOpenReview: () => void;
}

export function WebProfileTab({
    currentUser,
    profileName,
    setProfileName,
    profilePhone,
    setProfilePhone,
    editingProfile,
    setEditingProfile,
    updateUserLoading,
    onSaveProfile,

    oldPassword,
    setOldPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    changePasswordLoading,
    onChangePassword,

    onOpenContact,
    onOpenFeedback,
    onOpenReview,
}: WebProfileTabProps) {
    return (
        <div className="flex-1 overflow-y-auto space-y-6 select-none font-sans text-left pr-1">
            {/* Header Profile Card */}
            <div className="bg-[#251508] border border-border rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div
                        className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl text-[#f5ede2] shrink-0 border-2 border-primary/40 shadow-inner"
                        style={{ background: avatarColor(currentUser?._id || "u") }}
                    >
                        {initials(profileName || currentUser?.name || "User")}
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-xl font-bold text-foreground">{profileName || currentUser?.name || "User"}</h3>
                        <p className="text-xs text-muted-foreground font-mono">{currentUser?.email || "user@bazarhisab.com"}</p>
                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-primary/10 text-primary border border-primary/20">
                            {currentUser?.role || "MEMBER"}
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Information Form */}
            <div className="bg-[#251508] border border-border rounded-3xl p-6 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-border pb-3">
                    <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        <h4 className="text-base font-bold text-foreground">Profile Information</h4>
                    </div>
                    {!editingProfile && (
                        <button
                            onClick={() => setEditingProfile(true)}
                            className="px-4 py-1.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-accent transition-all cursor-pointer shadow-md"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>

                <form onSubmit={onSaveProfile} className="space-y-4 max-w-xl">
                    <div className="space-y-1.5">
                        <label className="text-xs font-mono font-semibold text-muted-foreground uppercase">Full Name</label>
                        <input
                            type="text"
                            value={profileName}
                            onChange={(e) => setProfileName(e.target.value)}
                            disabled={!editingProfile}
                            className="w-full px-4 py-2.5 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none disabled:opacity-60 text-foreground"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-mono font-semibold text-muted-foreground uppercase">Phone Number</label>
                        <input
                            type="text"
                            value={profilePhone}
                            onChange={(e) => setProfilePhone(e.target.value)}
                            disabled={!editingProfile}
                            placeholder="Add phone number..."
                            className="w-full px-4 py-2.5 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none disabled:opacity-60 text-foreground font-mono"
                        />
                    </div>

                    {editingProfile && (
                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setEditingProfile(false)}
                                className="flex-1 py-3 rounded-xl border border-border bg-[#1a0e07] text-foreground font-bold text-xs hover:bg-white/5 transition-all cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={updateUserLoading}
                                className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-accent transition-all cursor-pointer shadow-md disabled:opacity-50"
                            >
                                {updateUserLoading ? "Saving…" : "Save Changes"}
                            </button>
                        </div>
                    )}
                </form>
            </div>

            {/* Change Password Form */}
            <div className="bg-[#251508] border border-border rounded-3xl p-6 shadow-xl space-y-5">
                <div className="flex items-center gap-2 border-b border-border pb-3">
                    <KeyRound className="w-5 h-5 text-primary" />
                    <h4 className="text-base font-bold text-foreground">Security & Password</h4>
                </div>

                <form onSubmit={onChangePassword} className="space-y-4 max-w-xl">
                    <div className="space-y-1.5">
                        <label className="text-xs font-mono font-semibold text-muted-foreground uppercase">Current Password</label>
                        <input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            className="w-full px-4 py-2.5 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none text-foreground font-mono"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-mono font-semibold text-muted-foreground uppercase">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            className="w-full px-4 py-2.5 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none text-foreground font-mono"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-mono font-semibold text-muted-foreground uppercase">Re-enter New Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            className="w-full px-4 py-2.5 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none text-foreground font-mono"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={changePasswordLoading}
                        className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-accent transition-all cursor-pointer shadow-md disabled:opacity-50 mt-2"
                    >
                        {changePasswordLoading ? "Resetting…" : "Reset Password"}
                    </button>
                </form>
            </div>

            {/* Help & Support Quick Action Cards */}
            <div className="bg-[#251508] border border-border rounded-3xl p-6 shadow-xl space-y-4">
                <h4 className="text-base font-bold text-foreground border-b border-border pb-3">Help & Support Actions</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button
                        onClick={onOpenContact}
                        className="p-4 rounded-2xl border border-border bg-[#1a0e07] hover:border-primary/50 transition-all text-left flex flex-col gap-2 cursor-pointer group"
                    >
                        <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <HelpCircle className="w-4 h-4" />
                        </div>
                        <h5 className="text-sm font-bold text-foreground">Contact Support</h5>
                        <p className="text-[11px] text-muted-foreground">Get help from our customer support team</p>
                    </button>

                    <button
                        onClick={onOpenFeedback}
                        className="p-4 rounded-2xl border border-border bg-[#1a0e07] hover:border-primary/50 transition-all text-left flex flex-col gap-2 cursor-pointer group"
                    >
                        <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <MessageSquare className="w-4 h-4" />
                        </div>
                        <h5 className="text-sm font-bold text-foreground">Submit Feedback</h5>
                        <p className="text-[11px] text-muted-foreground">Share feature ideas or report bugs</p>
                    </button>

                    <button
                        onClick={onOpenReview}
                        className="p-4 rounded-2xl border border-border bg-[#1a0e07] hover:border-primary/50 transition-all text-left flex flex-col gap-2 cursor-pointer group"
                    >
                        <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <Star className="w-4 h-4 text-amber-400" />
                        </div>
                        <h5 className="text-sm font-bold text-foreground">Leave a Review</h5>
                        <p className="text-[11px] text-muted-foreground">Rate your experience using Bazar Hisab</p>
                    </button>
                </div>
            </div>
        </div>
    );
}
