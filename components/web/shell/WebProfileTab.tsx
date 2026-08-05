import React, { useState } from "react";
import { User, Phone, Globe, MapPin, MessageSquare, Mail, Star, Lock, Users, Copy, Check, RefreshCw, LogOut } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/dashboard/ImageUpload";
import { WebFieldBox as FieldBox } from "@/components/web/shell/WebDialogs";
import { initials } from "@/components/web/shell/WebMetricCard";
import {
    useGetMyGroupQuery,
    useUpdateGroupMutation,
    useGenerateInviteCodeMutation,
    useLeaveGroupMutation,
} from "@/redux/features/group/groupApi";

function WebMyGroupSection({ currentUser }: { currentUser?: any }) {
    const { data: groupResponse, isLoading } = useGetMyGroupQuery();
    const [updateGroup, { isLoading: isUpdating }] = useUpdateGroupMutation();
    const [generateCode, { isLoading: isGenerating }] = useGenerateInviteCodeMutation();
    const [leaveGroup, { isLoading: isLeaving }] = useLeaveGroupMutation();

    const group = groupResponse?.data;
    const [isEditingName, setIsEditingName] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [copied, setCopied] = useState(false);

    const isCreator = group?.creator && (typeof group.creator === "string" ? group.creator === currentUser?._id : group.creator._id === currentUser?._id);

    const handleCopyCode = () => {
        if (!group?.inviteCode) return;
        navigator.clipboard.writeText(group.inviteCode);
        setCopied(true);
        toast.success("Invite code copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleUpdateName = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!groupName.trim()) return;
        try {
            await updateGroup({ name: groupName.trim() }).unwrap();
            toast.success("Group name updated!");
            setIsEditingName(false);
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to update group name");
        }
    };

    const handleRegenerateCode = async () => {
        try {
            await generateCode().unwrap();
            toast.success("Invite code regenerated!");
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to regenerate invite code");
        }
    };

    const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

    const handleLeaveGroup = async () => {
        try {
            await leaveGroup().unwrap();
            toast.success("Left group successfully!");
            setShowLeaveConfirm(false);
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to leave group");
        }
    };

    return (
        <div className="pt-4 border-t border-border flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <h4 className="text-xs font-bold text-foreground font-mono uppercase tracking-wider">My Group & Invitation Code</h4>
                </div>
                {isCreator && !isEditingName && (
                    <button
                        onClick={() => {
                            setGroupName(group?.name || "");
                            setIsEditingName(true);
                        }}
                        className="text-[11px] font-semibold text-primary hover:underline cursor-pointer"
                    >
                        Rename Group
                    </button>
                )}
            </div>

            <div className="p-5 rounded-2xl bg-[#1a0e07] border border-border/60 flex flex-col gap-4">
                {isEditingName ? (
                    <form onSubmit={handleUpdateName} className="flex gap-2">
                        <input
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            placeholder="Group Name"
                            className="flex-1 px-3 py-2 bg-[#2a170a] border border-primary/50 rounded-xl text-sm text-foreground outline-none font-bold"
                            autoFocus
                        />
                        <button type="button" onClick={() => setIsEditingName(false)} className="px-3 py-2 rounded-xl border border-border text-xs text-muted-foreground">
                            Cancel
                        </button>
                        <button type="submit" disabled={isUpdating} className="px-4 py-2 rounded-xl bg-primary text-xs font-bold text-primary-foreground">
                            {isUpdating ? "Saving..." : "Save"}
                        </button>
                    </form>
                ) : (
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-bold text-foreground">{group?.name || (isLoading ? "Loading group..." : "My Group")}</h3>
                            <p className="text-xs text-muted-foreground font-mono mt-0.5">
                                Created by {typeof group?.creator === "object" ? group.creator?.name : currentUser?.name || "Admin"}
                            </p>
                        </div>
                        {showLeaveConfirm ? (
                            <div className="flex items-center gap-2">
                                <button onClick={() => setShowLeaveConfirm(false)} className="px-2.5 py-1 rounded-lg border border-border text-[11px] font-semibold text-foreground">
                                    Cancel
                                </button>
                                <button onClick={handleLeaveGroup} disabled={isLeaving} className="px-2.5 py-1 rounded-lg bg-destructive text-white text-[11px] font-bold">
                                    {isLeaving ? "Leaving..." : "Confirm Leave"}
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowLeaveConfirm(true)}
                                className="px-3 py-1.5 rounded-xl border border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                                <span>Leave</span>
                            </button>
                        )}
                    </div>
                )}

                {/* Invitation Code Box */}
                <div className="p-3.5 rounded-xl bg-[#241307] border border-primary/30 flex items-center justify-between gap-3">
                    <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">Invitation Code</span>
                        <span className="text-lg font-bold font-mono text-primary tracking-wider">{group?.inviteCode || "BAZAR-XXXXXX"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleCopyCode}
                            className="px-3 py-1.5 rounded-lg border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copied ? "Copied!" : "Copy Code"}</span>
                        </button>
                        {isCreator && (
                            <button
                                onClick={handleRegenerateCode}
                                disabled={isGenerating}
                                className="p-1.5 rounded-lg border border-border bg-secondary/60 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                title="Regenerate Code"
                            >
                                <RefreshCw className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Group Members List */}
                <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-bold font-mono text-muted-foreground uppercase tracking-wider block">
                        Members ({group?.members?.length || 0})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {group?.members?.map((m: any) => {
                            const memberIsCreator = typeof group.creator === "string" ? group.creator === m._id : group.creator?._id === m._id;
                            return (
                                <div key={m._id} className="p-2.5 rounded-xl bg-[#201006] border border-border/40 flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-full overflow-hidden bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0">
                                        {m.profileImage ? <img src={m.profileImage} alt={m.name} className="w-full h-full object-cover" /> : initials(m.name || "User")}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-foreground truncate">{m.name}</p>
                                        <p className="text-[10px] text-muted-foreground font-mono truncate">{m.phone || m.email}</p>
                                    </div>
                                    {memberIsCreator && <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded bg-primary/15 text-primary border border-primary/30">ADMIN</span>}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function WebProfileTab({
    currentUser,
    isEditingProfile,
    setIsEditingProfile,
    profileImage,
    setProfileImage,
    name,
    setName,
    email,
    phone,
    setPhone,
    language,
    setLanguage,
    aboutme,
    setAboutme,
    street,
    setStreet,
    city,
    setCity,
    state,
    setState,
    zipCode,
    setZipCode,
    country,
    setCountry,
    updateProfile,
    profileLoading,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    repeatPassword,
    setRepeatPassword,
    changePassword,
    passLoading,
    setShowFeedback,
    setShowContact,
    setShowReview,
}: {
    currentUser?: any;
    isEditingProfile: boolean;
    setIsEditingProfile: (val: boolean) => void;
    profileImage: string;
    setProfileImage: (val: string) => void;
    name: string;
    setName: (val: string) => void;
    email: string;
    phone: string;
    setPhone: (val: string) => void;
    language: string;
    setLanguage: (val: string) => void;
    aboutme: string;
    setAboutme: (val: string) => void;
    street: string;
    setStreet: (val: string) => void;
    city: string;
    setCity: (val: string) => void;
    state: string;
    setState: (val: string) => void;
    zipCode: string;
    setZipCode: (val: string) => void;
    country: string;
    setCountry: (val: string) => void;
    updateProfile: (data: any) => any;
    profileLoading: boolean;
    currentPassword: string;
    setCurrentPassword: (val: string) => void;
    newPassword: string;
    setNewPassword: (val: string) => void;
    repeatPassword: string;
    setRepeatPassword: (val: string) => void;
    changePassword: (data: any) => any;
    passLoading: boolean;
    setShowFeedback: (val: boolean) => void;
    setShowContact: (val: boolean) => void;
    setShowReview: (val: boolean) => void;
}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start font-sans">
            {/* Profile Overview / Edit Panel */}
            {!isEditingProfile ? (
                <div className="bg-[#251508] border border-border rounded-3xl p-8 shadow-xl flex flex-col gap-6">
                    <div className="flex items-center justify-between border-b border-border pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
                                <User className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-foreground">User Profile Overview</h3>
                                <p className="text-xs text-muted-foreground">Your account & contact details</p>
                            </div>
                        </div>
                        <button onClick={() => setIsEditingProfile(true)} className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-accent transition-all cursor-pointer shadow-md">
                            <User className="w-3.5 h-3.5" />
                            <span>Edit Profile</span>
                        </button>
                    </div>

                    {/* Avatar & Name Header */}
                    <div className="flex flex-col items-center justify-center py-2 text-center border-b border-border/60 pb-6">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-primary flex items-center justify-center font-bold text-2xl text-primary-foreground border-2 border-primary/40 shadow-xl mb-3">
                            {profileImage ? <img src={profileImage} alt={name} className="w-full h-full object-cover" /> : initials(name || "User")}
                        </div>
                        <h3 className="text-lg font-bold text-foreground">{name || "User Name"}</h3>
                        <p className="text-xs text-muted-foreground font-mono mt-0.5">{email}</p>
                        {currentUser?.role && <span className="mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-primary/15 text-primary border border-primary/30">{currentUser.role} ROLE</span>}
                    </div>

                    {/* Details Grid */}
                    <div className="space-y-3.5 text-xs">
                        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#1a0e07] border border-border/60">
                            <span className="text-muted-foreground font-semibold flex items-center gap-2">
                                <Phone className="w-3.5 h-3.5 text-primary" /> Phone Number:
                            </span>
                            <span className="font-mono font-bold text-foreground">{phone || "Not specified"}</span>
                        </div>

                        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#1a0e07] border border-border/60">
                            <span className="text-muted-foreground font-semibold flex items-center gap-2">
                                <Globe className="w-3.5 h-3.5 text-primary" /> Language:
                            </span>
                            <span className="font-bold text-foreground">{language || "English"}</span>
                        </div>

                        {aboutme && (
                            <div className="p-3.5 rounded-2xl bg-[#1a0e07] border border-border/60 space-y-1">
                                <span className="text-muted-foreground font-semibold block">About Me / Bio:</span>
                                <p className="text-foreground italic">{aboutme}</p>
                            </div>
                        )}

                        <div className="p-4 rounded-2xl bg-[#1a0e07] border border-border/60 space-y-2">
                            <span className="text-muted-foreground font-bold font-mono flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                                <MapPin className="w-3.5 h-3.5 text-primary" /> Address Details
                            </span>
                            <p className="text-foreground font-mono text-xs">{[street, city, state, zipCode, country].filter(Boolean).join(", ") || "No address specified"}</p>
                        </div>
                    </div>

                    {/* My Group Details & Invitation Code */}
                    <WebMyGroupSection currentUser={currentUser} />

                    {/* Quick Actions & Support Section inside Profile */}
                    <div className="pt-4 border-t border-border flex flex-col gap-3">
                        <h4 className="text-xs font-bold text-muted-foreground font-mono uppercase tracking-wider">Help & Support Actions</h4>
                        <div className="grid grid-cols-3 gap-3">
                            <button onClick={() => setShowFeedback(true)} className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#1a0e07] border border-border/60 hover:border-primary/50 text-muted-foreground hover:text-primary transition-all cursor-pointer gap-1.5">
                                <MessageSquare className="w-5 h-5 text-primary" />
                                <span className="text-[11px] font-bold">Feedback</span>
                            </button>
                            <button onClick={() => setShowContact(true)} className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#1a0e07] border border-border/60 hover:border-primary/50 text-muted-foreground hover:text-primary transition-all cursor-pointer gap-1.5">
                                <Mail className="w-5 h-5 text-primary" />
                                <span className="text-[11px] font-bold">Contact</span>
                            </button>
                            <button onClick={() => setShowReview(true)} className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#1a0e07] border border-border/60 hover:border-amber-400/50 text-muted-foreground hover:text-amber-400 transition-all cursor-pointer gap-1.5">
                                <Star className="w-5 h-5 text-amber-400" />
                                <span className="text-[11px] font-bold">Review</span>
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                /* Editable Profile Form Panel */
                <div className="bg-[#251508] border border-border rounded-3xl p-8 shadow-xl flex flex-col gap-6">
                    <div className="flex items-center justify-between border-b border-border pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
                                <User className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-foreground">Edit Profile Details</h3>
                                <p className="text-xs text-muted-foreground">Update your contact information</p>
                            </div>
                        </div>
                        <button onClick={() => setIsEditingProfile(false)} className="px-3 py-1.5 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:bg-white/5 cursor-pointer">
                            Cancel
                        </button>
                    </div>

                    {/* Profile Avatar Photo (Full Round & Centered) */}
                    <div className="flex flex-col items-center justify-center text-center py-2">
                        <ImageUpload label="Profile Avatar Photo" variant="circle" value={profileImage} onChange={(url) => setProfileImage(url)} onRemove={() => setProfileImage("")} />
                    </div>

                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            if (!name.trim()) {
                                toast.error("Name cannot be empty");
                                return;
                            }
                            try {
                                await updateProfile({
                                    profileImage: profileImage || undefined,
                                    name: name.trim(),
                                    phone: phone.trim() || undefined,
                                    language: language.trim() || undefined,
                                    aboutme: aboutme.trim() || undefined,
                                    address: {
                                        street: street.trim() || undefined,
                                        city: city.trim() || undefined,
                                        state: state.trim() || undefined,
                                        zipCode: zipCode.trim() || undefined,
                                        country: country.trim() || undefined,
                                    },
                                }).unwrap();
                                toast.success("Complete profile details updated successfully!");
                                setIsEditingProfile(false);
                            } catch (err: any) {
                                toast.error(err?.data?.message || err?.message || "Failed to update profile");
                            }
                        }}
                        className="flex flex-col gap-4"
                    >
                        <FieldBox label="Full Name" focused={false}>
                            <div className="flex items-center">
                                <span className="pl-4 text-muted-foreground">
                                    <User className="w-4 h-4" />
                                </span>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="flex-1 px-3 py-3.5 bg-transparent text-sm outline-none text-foreground" />
                            </div>
                        </FieldBox>

                        <div>
                            <div className="flex items-center justify-between mb-1.5 px-1">
                                <span className="text-xs font-semibold text-muted-foreground">Email Address</span>
                                <span className="text-[10px] text-muted-foreground/80 font-mono flex items-center gap-1">
                                    <Lock className="w-3 h-3 text-muted-foreground" /> Cannot be updated
                                </span>
                            </div>
                            <div className="flex items-center bg-[#170c06] border border-border/40 rounded-2xl opacity-60 cursor-not-allowed">
                                <span className="pl-4 text-muted-foreground/50">
                                    <Mail className="w-4 h-4" />
                                </span>
                                <input type="email" value={email} disabled readOnly title="Email address cannot be changed." className="flex-1 px-3 py-3.5 bg-transparent text-sm text-muted-foreground font-mono cursor-not-allowed select-none outline-none" />
                            </div>
                        </div>

                        <FieldBox label="Phone Number" focused={false}>
                            <div className="flex items-center">
                                <span className="pl-4 text-muted-foreground">
                                    <Phone className="w-4 h-4" />
                                </span>
                                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+880 1700-000000" className="flex-1 px-3 py-3.5 bg-transparent text-sm outline-none font-mono text-foreground" />
                            </div>
                        </FieldBox>

                        <FieldBox label="Preferred Language" focused={false}>
                            <div className="flex items-center">
                                <span className="pl-4 text-muted-foreground">
                                    <Globe className="w-4 h-4" />
                                </span>
                                <input type="text" value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="e.g. English, Bengali" className="flex-1 px-3 py-3.5 bg-transparent text-sm outline-none text-foreground" />
                            </div>
                        </FieldBox>

                        <div>
                            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 px-1">About Me / Bio</label>
                            <textarea
                                value={aboutme}
                                onChange={(e) => setAboutme(e.target.value)}
                                rows={2}
                                placeholder="Write a brief intro about yourself…"
                                className="w-full px-4 py-3 bg-[#170c06] border border-border/60 rounded-2xl text-sm outline-none text-foreground focus:border-primary/60 transition-colors"
                            />
                        </div>

                        {/* Address Section */}
                        <div className="border-t border-border/60 pt-4 flex flex-col gap-4">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary" />
                                <span className="text-xs font-bold text-foreground uppercase tracking-wider font-mono">Address Details</span>
                            </div>

                            <FieldBox label="Street Address" focused={false}>
                                <div className="flex items-center">
                                    <span className="pl-4 text-muted-foreground">
                                        <MapPin className="w-4 h-4" />
                                    </span>
                                    <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} placeholder="House / Flat #, Road name" className="flex-1 px-3 py-3.5 bg-transparent text-sm outline-none text-foreground" />
                                </div>
                            </FieldBox>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FieldBox label="City" focused={false}>
                                    <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Dhaka" className="w-full px-4 py-3.5 bg-transparent text-sm outline-none text-foreground" />
                                </FieldBox>
                                <FieldBox label="State / Division" focused={false}>
                                    <input type="text" value={state} onChange={(e) => setState(e.target.value)} placeholder="Dhaka" className="w-full px-4 py-3.5 bg-transparent text-sm outline-none text-foreground" />
                                </FieldBox>
                                <FieldBox label="Zip Code" focused={false}>
                                    <input type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)} placeholder="1212" className="w-full px-4 py-3.5 bg-transparent text-sm outline-none font-mono text-foreground" />
                                </FieldBox>
                                <FieldBox label="Country" focused={false}>
                                    <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Bangladesh" className="w-full px-4 py-3.5 bg-transparent text-sm outline-none text-foreground" />
                                </FieldBox>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-border/60">
                            <button type="button" onClick={() => setIsEditingProfile(false)} className="flex-1 py-3 border border-border text-foreground font-bold text-xs rounded-xl hover:bg-secondary transition-all cursor-pointer text-center">
                                Cancel
                            </button>
                            <button type="submit" disabled={profileLoading} className="flex-1 py-3 bg-primary text-primary-foreground font-bold text-xs rounded-xl hover:bg-accent transition-all cursor-pointer shadow-md shadow-primary/10 disabled:opacity-50 text-center">
                                {profileLoading ? "Saving…" : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Change Password Panel */}
            <div className="bg-[#251508] border border-border rounded-3xl p-8 shadow-xl flex flex-col gap-6">
                <div className="flex items-center gap-3 border-b border-border pb-4">
                    <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-foreground">Update Account Password</h3>
                        <p className="text-xs text-muted-foreground">Change your password regularly for security</p>
                    </div>
                </div>

                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        if (!currentPassword || !newPassword) {
                            toast.error("Please fill in all password fields");
                            return;
                        }
                        if (newPassword !== repeatPassword) {
                            toast.error("Passwords do not match");
                            return;
                        }
                        try {
                            await changePassword({ currentPassword, newPassword }).unwrap();
                            toast.success("Password changed successfully!");
                            setCurrentPassword("");
                            setNewPassword("");
                            setRepeatPassword("");
                        } catch (err: any) {
                            toast.error(err?.data?.message || err?.message || "Failed to change password");
                        }
                    }}
                    className="flex flex-col gap-4"
                >
                    <FieldBox label="Current Password" focused={false}>
                        <div className="flex items-center">
                            <span className="pl-4 text-muted-foreground">
                                <Lock className="w-4 h-4" />
                            </span>
                            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required placeholder="••••••••" className="flex-1 px-3 py-3.5 bg-transparent text-sm outline-none text-foreground" />
                        </div>
                    </FieldBox>

                    <FieldBox label="New Password" focused={false}>
                        <div className="flex items-center">
                            <span className="pl-4 text-muted-foreground">
                                <Lock className="w-4 h-4" />
                            </span>
                            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required placeholder="Min. 8 characters" className="flex-1 px-3 py-3.5 bg-transparent text-sm outline-none text-foreground" />
                        </div>
                    </FieldBox>

                    <FieldBox label="Re-enter New Password" focused={false}>
                        <div className="flex items-center">
                            <span className="pl-4 text-muted-foreground">
                                <Lock className="w-4 h-4" />
                            </span>
                            <input type="password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} required placeholder="Re-enter new password" className="flex-1 px-3 py-3.5 bg-transparent text-sm outline-none text-foreground" />
                        </div>
                    </FieldBox>

                    <div className="pt-4 border-t border-border/60 flex justify-end">
                        <button type="submit" disabled={passLoading} className="w-full py-3 bg-primary text-primary-foreground font-bold text-xs rounded-xl hover:bg-accent transition-all cursor-pointer shadow-md shadow-primary/10 disabled:opacity-50 text-center">
                            {passLoading ? "Resetting Password…" : "Reset Password"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
