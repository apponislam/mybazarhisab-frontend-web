"use client";

import React, { useState } from "react";
import { Users, Trash2, ShieldCheck, UserX, Copy, Check, Search } from "lucide-react";
import { toast } from "sonner";
import { TGroup } from "@/redux/features/group/groupApi";
import { RemoveMemberModal } from "./RemoveMemberModal";
import { DeleteGroupModal } from "./DeleteGroupModal";

interface MembersGridProps {
    groups: TGroup[];
    isLoading: boolean;
    searchTerm: string;
    onSearchChange: (term: string) => void;
}

export function MembersGrid({ groups, isLoading, searchTerm, onSearchChange }: MembersGridProps) {
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    // Modal state for custom confirmations
    const [deletingGroup, setDeletingGroup] = useState<TGroup | null>(null);
    const [removingMemberData, setRemovingMemberData] = useState<{
        groupId: string;
        userId: string;
        userName: string;
        groupName: string;
    } | null>(null);

    const AVATAR_COLORS = ["#c06010", "#8b6914", "#3d7a5c", "#5a4a8a", "#7a3d3d"];

    function avatarColor(id: string) {
        if (!id) return AVATAR_COLORS[0];
        return AVATAR_COLORS[id.charCodeAt(id.length - 1) % AVATAR_COLORS.length];
    }

    function initials(name: string) {
        if (!name) return "U";
        return name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    }

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        toast.success(`Invite code copied: ${code}`);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    return (
        <div className="flex-1 bg-[#251508] border border-border rounded-3xl p-6 shadow-xl flex flex-col gap-6 font-sans">
            {/* Header & Controls Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                        <Users className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold font-mono uppercase text-foreground tracking-wider flex items-center gap-2">All User Groups & Members (Admin)</h3>
                        <p className="text-xs text-muted-foreground font-mono">Admin control panel to manage group rooms and roommate memberships</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative w-64">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Search groups (Press Enter to search)…"
                            className="w-full pl-9 pr-3 py-2 bg-[#1a0e07] border border-border rounded-xl text-xs outline-none text-foreground focus:border-primary/60 transition-colors"
                        />
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary font-mono font-semibold">
                        <ShieldCheck className="w-4 h-4" /> Admin Controls
                    </div>
                </div>
            </div>

            {/* Groups Grid */}
            {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                    <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <p className="text-xs font-mono">Loading group memberships catalog…</p>
                </div>
            ) : groups.length === 0 ? (
                <div className="py-20 text-center text-muted-foreground flex flex-col items-center gap-2">
                    <Users className="w-12 h-12 text-muted-foreground/30 mb-1" />
                    <p className="text-sm font-semibold">No groups found</p>
                    <p className="text-xs text-muted-foreground">Groups created by users will appear here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {groups.map((group) => {
                        const creatorName = typeof group.creator === "object" ? group.creator?.name : "Creator";
                        return (
                            <div key={group._id} className="p-6 rounded-3xl bg-[#1a0e07] border border-border flex flex-col gap-4 shadow-xl relative group/card">
                                {/* Group Title Bar */}
                                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                                    <div>
                                        <h4 className="text-base font-bold text-foreground">{group.name}</h4>
                                        <p className="text-[10px] text-muted-foreground font-mono select-all">
                                            ID: {group._id} • Created by <span className="text-primary font-semibold">{creatorName}</span>
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {group.inviteCode && (
                                            <button
                                                onClick={() => handleCopyCode(group.inviteCode)}
                                                className="px-2.5 py-1 rounded-xl border border-border bg-[#251508] hover:border-primary/40 text-[11px] font-mono text-muted-foreground hover:text-primary transition-all flex items-center gap-1.5 cursor-pointer"
                                                title="Copy Invite Code"
                                            >
                                                {copiedCode === group.inviteCode ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                                                <span>Code: {group.inviteCode}</span>
                                            </button>
                                        )}

                                        <button onClick={() => setDeletingGroup(group)} className="p-1.5 rounded-xl border border-border bg-[#251508] hover:border-destructive/50 text-muted-foreground hover:text-destructive transition-colors cursor-pointer" title="Delete Group">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Members List */}
                                <div className="space-y-2">
                                    <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">Members ({group.members?.length || 0})</span>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {group.members?.map((member) => (
                                            <div key={member._id} className="p-3 rounded-2xl bg-[#251508] border border-border/80 flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-2.5 min-w-0">
                                                    <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-md" style={{ background: avatarColor(member._id) }}>
                                                        {member.profileImage ? <img src={member.profileImage} alt={member.name} className="w-full h-full object-cover" /> : initials(member.name)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h5 className="text-xs font-semibold text-foreground truncate">{member.name}</h5>
                                                        <p className="text-[10px] text-muted-foreground font-mono truncate">{member.email}</p>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() =>
                                                        setRemovingMemberData({
                                                            groupId: group._id,
                                                            userId: member._id,
                                                            userName: member.name,
                                                            groupName: group.name,
                                                        })
                                                    }
                                                    className="p-1 text-muted-foreground hover:text-destructive transition-colors cursor-pointer shrink-0"
                                                    title="Remove Member from Group"
                                                >
                                                    <UserX className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Custom Modals */}
            <RemoveMemberModal memberData={removingMemberData} onClose={() => setRemovingMemberData(null)} />
            <DeleteGroupModal group={deletingGroup} onClose={() => setDeletingGroup(null)} />
        </div>
    );
}
