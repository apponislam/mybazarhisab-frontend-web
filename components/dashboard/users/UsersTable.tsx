"use client";

import { useRouter } from "next/navigation";
import { Users, ShieldCheck, Eye, Trash2, CheckCircle2, XCircle, Mail, Phone, Calendar } from "lucide-react";
import { toast } from "sonner";
import { TUser } from "@/redux/features/auth/authSlice";
import { useUpdateUserRoleMutation, useUpdateUserStatusMutation, useDeleteUserMutation } from "@/redux/features/user/userApi";

interface UsersTableProps {
    users: TUser[];
    isLoading: boolean;
    onDeleteUser?: (user: TUser) => void;
}

export function UsersTable({ users, isLoading, onDeleteUser }: UsersTableProps) {
    const router = useRouter();

    const [updateUserRole, { isLoading: roleLoading }] = useUpdateUserRoleMutation();
    const [updateUserStatus, { isLoading: statusLoading }] = useUpdateUserStatusMutation();
    const [deleteUser, { isLoading: deleteLoading }] = useDeleteUserMutation();

    const handleRoleToggle = async (user: TUser) => {
        const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
        try {
            await updateUserRole({ id: user._id, role: newRole }).unwrap();
            toast.success(`Updated ${user.name}'s role to ${newRole}`);
        } catch (err: any) {
            toast.error(err?.data?.message || err?.message || "Failed to update role");
        }
    };

    const handleStatusToggle = async (user: TUser) => {
        const nextStatus = user.isActive === false ? true : false;
        try {
            await updateUserStatus({ id: user._id, isActive: nextStatus }).unwrap();
            toast.success(`${user.name}'s account ${nextStatus ? "activated" : "suspended"}`);
        } catch (err: any) {
            toast.error(err?.data?.message || err?.message || "Failed to update user status");
        }
    };

    const handleDelete = (user: TUser) => {
        onDeleteUser?.(user);
    };

    function initials(name?: string) {
        if (!name) return "U";
        return name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    }

    return (
        <div className="flex-1 bg-[#251508] border border-border rounded-3xl p-6 shadow-xl flex flex-col gap-4 font-sans overflow-hidden">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                        <Users className="w-4 h-4" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-foreground uppercase tracking-wider font-mono">User Accounts Registry</h4>
                        <p className="text-xs text-muted-foreground font-mono">Manage application user credentials & privileges</p>
                    </div>
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                    Total Registered: <strong className="text-primary font-bold">{users.length}</strong>
                </div>
            </div>

            <div className="flex-1 overflow-auto rounded-2xl border border-[rgba(232,160,32,0.1)]">
                <table className="w-full border-collapse text-left text-sm">
                    <thead className="bg-[#1a0e07] text-muted-foreground font-mono text-xs border-b border-[rgba(232,160,32,0.1)] sticky top-0 z-10">
                        <tr>
                            <th className="p-4">User</th>
                            <th className="p-4">Contact</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Registered Date</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgba(232,160,32,0.06)] bg-[#251508]">
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="p-12 text-center text-muted-foreground font-mono text-xs">
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                        <span>Fetching registered user accounts…</span>
                                    </div>
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-12 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Users className="w-10 h-10 text-muted-foreground/40 mb-1" />
                                        <p className="text-sm font-semibold">No users found</p>
                                        <p className="text-xs text-muted-foreground">Registered app users will appear here.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            users.map((u) => {
                                const isSuspended = u.isActive === false;
                                return (
                                    <tr key={u._id} className="hover:bg-primary/5 transition-colors group">
                                        {/* User Name & Photo */}
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full overflow-hidden bg-primary flex items-center justify-center font-bold text-xs text-primary-foreground shrink-0 shadow-sm border border-primary/30">
                                                    {u.profileImage ? <img src={u.profileImage} alt={u.name} className="w-full h-full object-cover" /> : initials(u.name)}
                                                </div>
                                                <div className="min-w-0">
                                                    <h5 className="text-xs font-bold text-foreground truncate">{u.name}</h5>
                                                    <span className="text-[10px] text-muted-foreground/80 font-mono truncate block">ID: {u._id}</span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Email & Phone */}
                                        <td className="p-4">
                                            <div className="space-y-0.5">
                                                <p className="text-xs text-foreground font-mono flex items-center gap-1.5 truncate">
                                                    <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                                    <span>{u.email}</span>
                                                </p>
                                                {u.phone && (
                                                    <p className="text-[10px] text-muted-foreground font-mono flex items-center gap-1.5 truncate">
                                                        <Phone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                                        <span>{u.phone}</span>
                                                    </p>
                                                )}
                                            </div>
                                        </td>

                                        {/* Role Badge & Toggle Button */}
                                        <td className="p-4">
                                            <button
                                                onClick={() => handleRoleToggle(u)}
                                                disabled={roleLoading}
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-bold font-mono border uppercase tracking-wider transition-all cursor-pointer ${
                                                    u.role === "ADMIN" ? "bg-primary/20 text-primary border-primary/40 hover:bg-primary/30" : "bg-white/10 text-muted-foreground border-white/20 hover:bg-white/15"
                                                }`}
                                                title="Click to toggle ADMIN vs USER role"
                                            >
                                                {u.role === "ADMIN" ? <ShieldCheck className="w-3.5 h-3.5 text-primary" /> : <Users className="w-3.5 h-3.5 text-muted-foreground" />}
                                                <span>{u.role || "USER"}</span>
                                            </button>
                                        </td>

                                        {/* Status Badge & Toggle Button */}
                                        <td className="p-4">
                                            <button
                                                onClick={() => handleStatusToggle(u)}
                                                disabled={statusLoading}
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-bold font-mono border uppercase tracking-wider transition-all cursor-pointer ${
                                                    !isSuspended ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25" : "bg-destructive/15 text-destructive border-destructive/30 hover:bg-destructive/25"
                                                }`}
                                                title="Click to toggle Active vs Suspended"
                                            >
                                                {!isSuspended ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-destructive" />}
                                                <span>{!isSuspended ? "Active" : "Suspended"}</span>
                                            </button>
                                        </td>

                                        {/* Registered Date */}
                                        <td className="p-4 text-xs font-mono text-muted-foreground">
                                            <div className="flex items-center gap-1 text-[11px]">
                                                <Calendar className="w-3 h-3 text-muted-foreground/70" />
                                                <span>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}</span>
                                            </div>
                                        </td>

                                        {/* Action Controls */}
                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => router.push(`/dashboard/users/${u._id}`)}
                                                    className="p-1.5 rounded-lg border border-border bg-[#1a0e07] text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors cursor-pointer"
                                                    title="View Full Profile Details & Activity Analytics"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(u)}
                                                    disabled={deleteLoading}
                                                    className="p-1.5 rounded-lg border border-border bg-[#1a0e07] text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors cursor-pointer"
                                                    title="Delete User Account"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
