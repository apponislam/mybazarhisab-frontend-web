import React, { useState } from "react";
import { Users, Copy, Check, RefreshCw, LogOut } from "lucide-react";
import { toast } from "sonner";
import { ScreenShell, BackButton, PrimaryButton, Avatar } from "@/components/app/ui/Shared";
import {
    useGetMyGroupQuery,
    useUpdateGroupMutation,
    useGenerateInviteCodeMutation,
    useLeaveGroupMutation,
} from "@/redux/features/group/groupApi";
import { useGetMeQuery } from "@/redux/features/auth/authApi";

export function GroupScreen({ onBack }: { onBack: () => void }) {
    const { data: groupResponse, isLoading } = useGetMyGroupQuery();
    const { data: userResponse } = useGetMeQuery();
    const [updateGroup, { isLoading: isUpdating }] = useUpdateGroupMutation();
    const [generateCode, { isLoading: isGenerating }] = useGenerateInviteCodeMutation();
    const [leaveGroup, { isLoading: isLeaving }] = useLeaveGroupMutation();

    const group = groupResponse?.data;
    const currentUser = userResponse?.data;

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

    const handleLeaveGroup = async () => {
        if (!window.confirm("Are you sure you want to leave this group?")) return;
        try {
            await leaveGroup().unwrap();
            toast.success("Left group successfully!");
            onBack();
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to leave group");
        }
    };

    return (
        <ScreenShell scrollable>
            <div className="flex flex-col px-6 pt-12 pb-8 gap-6">
                <BackButton onBack={onBack} label="Profile" />

                {/* Group Card */}
                <div className="rounded-3xl border border-border bg-card p-6 flex flex-col items-center text-center gap-3 relative shadow-2xl">
                    <div className="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shadow-inner">
                        <Users className="w-8 h-8" />
                    </div>

                    {isEditingName ? (
                        <form onSubmit={handleUpdateName} className="w-full flex flex-col gap-3 mt-1">
                            <input
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                placeholder="Group Name"
                                className="w-full px-4 py-2.5 bg-[#2e1a0a] border border-primary/50 rounded-xl text-center font-bold text-foreground outline-none text-base font-serif"
                                autoFocus
                            />
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsEditingName(false)}
                                    className="flex-1 py-2 rounded-xl border border-border text-xs font-semibold text-muted-foreground"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="flex-1 py-2 rounded-xl bg-primary text-xs font-bold text-primary-foreground"
                                >
                                    {isUpdating ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div>
                            <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                                {group?.name || (isLoading ? "Loading group..." : "My Group")}
                            </h2>
                            <p className="text-xs text-muted-foreground mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                Created by {typeof group?.creator === "object" ? group.creator?.name : currentUser?.name || "Admin"}
                            </p>
                            {isCreator && (
                                <button
                                    onClick={() => {
                                        setGroupName(group?.name || "");
                                        setIsEditingName(true);
                                    }}
                                    className="mt-3 px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
                                >
                                    Rename Group
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Invitation Code Section */}
                <div className="flex flex-col gap-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest font-mono">Invitation Code</p>
                    <div className="rounded-3xl border border-border bg-card p-6 flex flex-col items-center text-center gap-3 shadow-xl">
                        <div className="flex items-center justify-center gap-3 w-full">
                            <span className="text-2xl font-bold font-mono text-foreground tracking-wider selection:bg-primary selection:text-primary-foreground">
                                {group?.inviteCode || "BAZAR-XXXXXX"}
                            </span>
                            <button
                                onClick={handleCopyCode}
                                className="w-9 h-9 rounded-xl border border-primary/30 bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                                title="Copy code"
                            >
                                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>
                        <p className="text-xs text-muted-foreground max-w-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                            Share this code with others so they can join your group.
                        </p>
                        {isCreator && (
                            <button
                                onClick={handleRegenerateCode}
                                disabled={isGenerating}
                                className="mt-1 px-4 py-2 rounded-xl border border-border bg-secondary/50 text-xs font-medium text-foreground hover:border-primary/40 flex items-center gap-2 transition-colors"
                            >
                                <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin" : ""}`} />
                                {isGenerating ? "Regenerating..." : "Regenerate Code"}
                            </button>
                        )}
                    </div>
                </div>

                {/* Members Section */}
                <div className="flex flex-col gap-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest font-mono">
                        Members ({group?.members?.length || 0})
                    </p>
                    <div className="rounded-3xl border border-border bg-card divide-y divide-border overflow-hidden shadow-xl">
                        {group?.members?.map((member: any) => {
                            const memberIsCreator = typeof group.creator === "string" ? group.creator === member._id : group.creator?._id === member._id;
                            return (
                                <div key={member._id} className="p-4 flex items-center gap-3">
                                    <Avatar user={{ id: member._id, name: member.name, email: member.email, phone: member.phone || "" }} size={42} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-foreground truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                            {member.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground font-mono truncate">{member.phone || member.email}</p>
                                    </div>
                                    {memberIsCreator && (
                                        <span className="px-2.5 py-1 rounded-lg border border-primary/40 bg-primary/10 text-[11px] font-bold text-primary font-mono">
                                            Admin
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Leave Group Button */}
                <div className="pt-2">
                    <button
                        onClick={handleLeaveGroup}
                        disabled={isLeaving}
                        className="w-full py-3.5 rounded-2xl border border-destructive/40 bg-destructive/10 text-sm font-bold text-destructive hover:bg-destructive/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        {isLeaving ? "Leaving Group..." : "Leave Group"}
                    </button>
                </div>
            </div>
        </ScreenShell>
    );
}
