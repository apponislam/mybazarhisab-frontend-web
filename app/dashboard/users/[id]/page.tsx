"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw, User, Mail, Phone, ShieldCheck, CheckCircle2, XCircle, ShoppingBag, Receipt, Star, Activity, Package, Calendar, Globe, MapPin, DollarSign, Clock, ChevronLeft, ChevronRight, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { useGetUserProfileAndSummaryQuery, useGetUserBazarEntriesQuery, useGetUserBillsQuery, useGetUserReviewsQuery, useGetUserProductsQuery, useGetUserActivitiesQuery, useUpdateUserRoleMutation, useUpdateUserStatusMutation } from "@/redux/features/user/userApi";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { AdminSetPasswordModal } from "@/components/dashboard/users/AdminSetPasswordModal";

export default function UserDetailPage() {
    const params = useParams();
    const router = useRouter();
    const userId = (params?.id as string) || "";

    const [activeTab, setActiveTab] = useState<"overview" | "bazar" | "bills" | "products" | "reviews" | "activities">("overview");

    // Sub-resource Pagination States
    const [bazarPage, setBazarPage] = useState(1);
    const [billsPage, setBillsPage] = useState(1);
    const [productsPage, setProductsPage] = useState(1);
    const [reviewsPage, setReviewsPage] = useState(1);
    const [activitiesPage, setActivitiesPage] = useState(1);
    const [subLimit, setSubLimit] = useState(10);

    // Main Profile & Stats Query
    const {
        data: responseData,
        isLoading,
        isFetching,
        refetch,
    } = useGetUserProfileAndSummaryQuery(userId, {
        skip: !userId,
    });

    const userSummary = responseData?.data;
    const user = userSummary?.user;
    const stats = userSummary?.stats;
    const groupStats = userSummary?.groupStats;

    // Sub-resource Queries
    const { data: bazarData, isFetching: bazarFetching } = useGetUserBazarEntriesQuery({ userId, page: bazarPage, limit: subLimit }, { skip: !userId || activeTab !== "bazar" });
    const { data: billsData, isFetching: billsFetching } = useGetUserBillsQuery({ userId, page: billsPage, limit: subLimit }, { skip: !userId || activeTab !== "bills" });
    const { data: productsData, isFetching: productsFetching } = useGetUserProductsQuery({ userId, page: productsPage, limit: subLimit }, { skip: !userId || activeTab !== "products" });
    const { data: reviewsData, isFetching: reviewsFetching } = useGetUserReviewsQuery({ userId, page: reviewsPage, limit: subLimit }, { skip: !userId || activeTab !== "reviews" });
    const { data: activitiesData, isFetching: activitiesFetching } = useGetUserActivitiesQuery({ userId, page: activitiesPage, limit: subLimit }, { skip: !userId || activeTab !== "activities" });

    // Role & Status Mutations
    const [updateUserRole, { isLoading: roleLoading }] = useUpdateUserRoleMutation();
    const [updateUserStatus, { isLoading: statusLoading }] = useUpdateUserStatusMutation();

    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const handleRoleToggle = async () => {
        if (!user) return;
        const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
        try {
            await updateUserRole({ id: user._id, role: newRole }).unwrap();
            toast.success(`Updated ${user.name}'s role to ${newRole}`);
            refetch();
        } catch (err: any) {
            toast.error(err?.data?.message || err?.message || "Failed to update role");
        }
    };

    const handleStatusToggle = async () => {
        if (!user) return;
        const nextStatus = user.isActive === false ? true : false;
        try {
            await updateUserStatus({ id: user._id, isActive: nextStatus }).unwrap();
            toast.success(`${user.name}'s account ${nextStatus ? "activated" : "suspended"}`);
            refetch();
        } catch (err: any) {
            toast.error(err?.data?.message || err?.message || "Failed to update status");
        }
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
        <div className="min-h-screen bg-[#1a0e07] text-[#f5ede2] flex font-sans overflow-hidden">
            {/* Sidebar */}
            <DashboardSidebar activeTab="users" onTabChange={(t) => router.push(`/dashboard/${t === "overview" ? "" : t}`)} />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 relative">
                <DashboardHeader title={`User Details & Analytics - ${user?.name || "Loading..."}`}>
                    <div className="flex items-center gap-2">
                        <button onClick={() => router.push("/dashboard/users")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-[#1a0e07] hover:bg-white/5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all cursor-pointer">
                            <ArrowLeft className="w-4 h-4" /> Back to Users
                        </button>
                        <button onClick={() => refetch()} className="p-2 rounded-xl border border-border bg-[#1a0e07] hover:border-primary/40 text-muted-foreground hover:text-primary transition-all cursor-pointer" title="Refresh data">
                            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin text-primary" : ""}`} />
                        </button>
                    </div>
                </DashboardHeader>

                <div className="flex-1 p-8 flex flex-col gap-6 overflow-y-auto">
                    {isLoading || !user ? (
                        <div className="flex-1 flex items-center justify-center p-12 text-muted-foreground font-mono text-xs gap-3">
                            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            <span>Loading user profile & activity metrics…</span>
                        </div>
                    ) : (
                        <>
                            {/* Profile Banner Header Card */}
                            <div className="bg-[#251508] border border-border rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left min-w-0">
                                    <div className="w-20 h-20 rounded-full overflow-hidden bg-primary flex items-center justify-center font-bold text-2xl text-primary-foreground shrink-0 shadow-xl border-2 border-primary/40">
                                        {user.profileImage ? <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" /> : initials(user.name)}
                                    </div>

                                    <div className="min-w-0">
                                        <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                                            <h2 className="text-xl font-bold text-foreground truncate">{user.name}</h2>
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${user.role === "ADMIN" ? "bg-primary/20 text-primary border-primary/40" : "bg-white/10 text-muted-foreground border-white/20"}`}>{user.role || "USER"}</span>
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${user.isActive !== false ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" : "bg-destructive/15 text-destructive border-destructive/30"}`}>
                                                {user.isActive !== false ? "Active Account" : "Suspended"}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-center sm:justify-start gap-4 mt-2 text-xs font-mono text-muted-foreground flex-wrap">
                                            <span className="flex items-center gap-1">
                                                <Mail className="w-3.5 h-3.5 text-primary" /> {user.email}
                                            </span>
                                            {user.phone && (
                                                <span className="flex items-center gap-1">
                                                    <Phone className="w-3.5 h-3.5 text-primary" /> {user.phone}
                                                </span>
                                            )}
                                            {user.createdAt && (
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3.5 h-3.5 text-primary" /> Joined {new Date(user.createdAt).toLocaleDateString()}
                                                </span>
                                            )}
                                            {user.lastLogin && (
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3.5 h-3.5 text-primary" /> Last login {new Date(user.lastLogin).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Action Controls */}
                                <div className="flex items-center gap-3 shrink-0">
                                    <button onClick={() => setShowPasswordModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold text-xs hover:bg-amber-500/25 transition-all cursor-pointer">
                                        <KeyRound className="w-4 h-4" />
                                        <span>Change Password</span>
                                    </button>

                                    <button onClick={handleRoleToggle} disabled={roleLoading} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/15 border border-primary/30 text-primary font-bold text-xs hover:bg-primary/25 transition-all cursor-pointer">
                                        <ShieldCheck className="w-4 h-4" />
                                        <span>Make {user.role === "ADMIN" ? "USER" : "ADMIN"}</span>
                                    </button>

                                    <button
                                        onClick={handleStatusToggle}
                                        disabled={statusLoading}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                                            user.isActive !== false ? "bg-destructive/15 text-destructive border-destructive/30 hover:bg-destructive/25" : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25"
                                        }`}
                                    >
                                        {user.isActive !== false ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                                        <span>{user.isActive !== false ? "Suspend User" : "Activate User"}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Financial Spent Stats Bar */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-[#251508] border border-border rounded-3xl p-5 shadow-xl flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-muted-foreground font-mono">Bazar Spent</p>
                                        <h3 className="text-2xl font-bold text-primary font-mono mt-1">৳{(stats?.totalBazarSpent || 0).toLocaleString()}</h3>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                                        <ShoppingBag className="w-6 h-6" />
                                    </div>
                                </div>

                                <div className="bg-[#251508] border border-border rounded-3xl p-5 shadow-xl flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-muted-foreground font-mono">Bills Spent</p>
                                        <h3 className="text-2xl font-bold text-amber-400 font-mono mt-1">৳{(stats?.totalBillSpent || 0).toLocaleString()}</h3>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                                        <Receipt className="w-6 h-6" />
                                    </div>
                                </div>

                                <div className="bg-[#251508] border border-primary/40 rounded-3xl p-5 shadow-xl flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-primary font-mono font-bold">Total Overall Spent</p>
                                        <h3 className="text-2xl font-bold text-primary font-mono mt-1">৳{(stats?.totalOverallSpent || 0).toLocaleString()}</h3>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                                        <DollarSign className="w-6 h-6" />
                                    </div>
                                </div>
                            </div>
                            {/* Group Stats Bar */}
                            {groupStats && (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                                    <div className="bg-[#251508] border border-border rounded-3xl p-5 shadow-xl flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-muted-foreground font-mono">Group Bazar Spent</p>
                                            <h3 className="text-2xl font-bold text-primary font-mono mt-1">৳{(groupStats?.totalBazarSpent || 0).toLocaleString()}</h3>
                                        </div>
                                        <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                                            <ShoppingBag className="w-6 h-6" />
                                        </div>
                                    </div>
                                    <div className="bg-[#251508] border border-border rounded-3xl p-5 shadow-xl flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-muted-foreground font-mono">Group Bill Spent</p>
                                            <h3 className="text-2xl font-bold text-primary font-mono mt-1">৳{(groupStats?.totalBillSpent || 0).toLocaleString()}</h3>
                                        </div>
                                        <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                                            <Receipt className="w-6 h-6" />
                                        </div>
                                    </div>
                                    <div className="bg-[#251508] border border-primary/40 rounded-3xl p-5 shadow-xl flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-primary font-mono font-bold">Group Overall Spent</p>
                                            <h3 className="text-2xl font-bold text-primary font-mono mt-1">৳{(groupStats?.totalOverallSpent || 0).toLocaleString()}</h3>
                                        </div>
                                        <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                                            <DollarSign className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Sub-Resource Navigation Tabs */}
                            <div className="bg-[#251508] border border-border rounded-3xl p-6 shadow-xl flex flex-col gap-6 flex-1 min-h-100 overflow-y-auto">
                                <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border/60 scrollbar-none">
                                    {[
                                        { id: "overview", label: "Overview Metrics", icon: <User className="w-4 h-4" /> },
                                        { id: "bazar", label: `Bazar Entries (${stats?.totalBazarEntries || 0})`, icon: <ShoppingBag className="w-4 h-4" /> },
                                        { id: "bills", label: `Bills (${stats?.totalBills || 0})`, icon: <Receipt className="w-4 h-4" /> },
                                        { id: "products", label: `Products Created (${stats?.totalProducts || 0})`, icon: <Package className="w-4 h-4" /> },
                                        { id: "reviews", label: `Reviews Posted (${stats?.totalReviews || 0})`, icon: <Star className="w-4 h-4" /> },
                                        { id: "activities", label: `Audit Logs (${stats?.totalActivities || 0})`, icon: <Activity className="w-4 h-4" /> },
                                    ].map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => setActiveTab(t.id as any)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                                                activeTab === t.id ? "bg-primary text-primary-foreground border-primary shadow-md" : "bg-[#1a0e07] text-muted-foreground border-border/60 hover:text-foreground hover:bg-white/5"
                                            }`}
                                        >
                                            {t.icon}
                                            <span>{t.label}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* TAB 1: OVERVIEW METRICS */}
                                {activeTab === "overview" && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-5 rounded-2xl bg-[#1a0e07] border border-border/60 space-y-3">
                                            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider font-mono border-b border-border/60 pb-2">Account Attributes & Location</h4>
                                            <div className="space-y-2 text-xs">
                                                <div className="flex justify-between py-1 border-b border-border/30">
                                                    <span className="text-muted-foreground">User ID:</span>
                                                    <span className="font-mono text-foreground font-bold">{user._id}</span>
                                                </div>
                                                <div className="flex justify-between py-1 border-b border-border/30">
                                                    <span className="text-muted-foreground">Language Preference:</span>
                                                    <span className="font-bold text-foreground">{user.language || "English"}</span>
                                                </div>
                                                {user.aboutme && (
                                                    <div className="py-1">
                                                        <span className="text-muted-foreground block mb-1">About / Bio:</span>
                                                        <p className="text-foreground italic bg-[#251508] p-2.5 rounded-xl border border-border/40">{user.aboutme}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="p-5 rounded-2xl bg-[#1a0e07] border border-border/60 space-y-3">
                                            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider font-mono border-b border-border/60 pb-2">Group & Membership Info</h4>
                                            {user.groupId ? (
                                                <div className="space-y-2 text-xs">
                                                    {/* Group Name */}
                                                    <div className="flex justify-between py-1 border-b border-border/30">
                                                        <span className="text-muted-foreground">Group Name:</span>
                                                        <span className="font-bold text-primary font-mono">{typeof user.groupId === "object" ? (user.groupId as any).name : user.groupId}</span>
                                                    </div>
                                                    {/* Creator Info */}
                                                    {typeof user.groupId === "object" && (user.groupId as any).creator && (
                                                        <div className="flex items-center gap-2 py-1 border-b border-border/30">
                                                            <span className="text-muted-foreground">Creator:</span>
                                                            <div className="flex items-center gap-2">
                                                                {(user.groupId as any).creator.profileImage ? (
                                                                    <img src={(user.groupId as any).creator.profileImage} alt={(user.groupId as any).creator.name} className="w-6 h-6 rounded-full object-cover" />
                                                                ) : (
                                                                    <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold">{(user.groupId as any).creator.name?.[0] || "C"}</div>
                                                                )}
                                                                <span className="font-medium text-foreground">{(user.groupId as any).creator.name}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {/* Members List */}
                                                    {typeof user.groupId === "object" && (user.groupId as any).members && (user.groupId as any).members.length > 0 && (
                                                        <div className="py-1 border-b border-border/30">
                                                            <span className="text-muted-foreground">Members ({(user.groupId as any).members.length}):</span>
                                                            <div className="flex flex-wrap gap-2 mt-1">
                                                                {(user.groupId as any).members.map((m: any) => (
                                                                    <div key={m._id} className="flex items-center gap-1">
                                                                        {m.profileImage ? (
                                                                            <img src={m.profileImage} alt={m.name} className="w-5 h-5 rounded-full object-cover" />
                                                                        ) : (
                                                                            <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center text-primary text-xs font-bold">{m.name?.[0] || "?"}</div>
                                                                        )}
                                                                        <span className="text-foreground text-xs">{m.name}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {/* Invite Code */}
                                                    {typeof user.groupId === "object" && (user.groupId as any).inviteCode && (
                                                        <div className="flex justify-between py-1">
                                                            <span className="text-muted-foreground">Invite Code:</span>
                                                            <span className="font-mono text-foreground">{(user.groupId as any).inviteCode}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-xs text-muted-foreground font-mono">User has not joined any active group room yet.</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* TAB 2: BAZAR ENTRIES */}
                                {activeTab === "bazar" && (
                                    <div className="flex-1 flex flex-col justify-between overflow-auto">
                                        <div>
                                            {bazarFetching ? (
                                                <div className="p-8 text-center text-xs font-mono text-muted-foreground">Fetching bazar entries…</div>
                                            ) : bazarData?.data?.length ? (
                                                <table className="w-full text-left text-xs border-collapse font-mono">
                                                    <thead className="bg-[#1a0e07] text-muted-foreground border-b border-border/60">
                                                        <tr>
                                                            <th className="p-3">Product Item</th>
                                                            <th className="p-3">Quantity</th>
                                                            <th className="p-3">Date</th>
                                                            <th className="p-3 text-right">Unit Price</th>
                                                            <th className="p-3 text-right">Total Price</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-border/40">
                                                        {bazarData.data.map((b: any) => {
                                                            const calculatedTotal = b.totalPrice ?? (b.price ? b.price * (b.quantity || 1) : 0);
                                                            return (
                                                                <tr key={b._id} className="hover:bg-primary/5">
                                                                    <td className="p-3 font-bold text-foreground">{b.product?.name || "Bazar Entry"}</td>
                                                                    <td className="p-3 text-muted-foreground">
                                                                        {b.quantity} {b.unit}
                                                                    </td>
                                                                    <td className="p-3 text-muted-foreground">{new Date(b.date).toLocaleDateString()}</td>
                                                                    <td className="p-3 text-right text-muted-foreground">৳{(b.price || 0).toLocaleString()}</td>
                                                                    <td className="p-3 text-right font-bold text-primary">৳{calculatedTotal.toLocaleString()}</td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <p className="p-8 text-center text-xs font-mono text-muted-foreground">No bazar expense entries recorded for this user.</p>
                                            )}
                                        </div>
                                        <TabPaginationFooter meta={bazarData?.meta} page={bazarPage} onPageChange={setBazarPage} />
                                    </div>
                                )}

                                {/* TAB 3: BILLS */}
                                {activeTab === "bills" && (
                                    <div className="flex-1 flex flex-col justify-between overflow-auto">
                                        <div>
                                            {billsFetching ? (
                                                <div className="p-8 text-center text-xs font-mono text-muted-foreground">Fetching bills…</div>
                                            ) : billsData?.data?.length ? (
                                                <table className="w-full text-left text-xs border-collapse font-mono">
                                                    <thead className="bg-[#1a0e07] text-muted-foreground border-b border-border/60">
                                                        <tr>
                                                            <th className="p-3">Bill Title</th>
                                                            <th className="p-3">Category</th>
                                                            <th className="p-3">Date</th>
                                                            <th className="p-3 text-right">Amount Paid</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-border/40">
                                                        {billsData.data.map((b: any) => (
                                                            <tr key={b._id} className="hover:bg-primary/5">
                                                                <td className="p-3 font-bold text-foreground">{b.title}</td>
                                                                <td className="p-3 text-muted-foreground">{b.category}</td>
                                                                <td className="p-3 text-muted-foreground">{new Date(b.date).toLocaleDateString()}</td>
                                                                <td className="p-3 text-right font-bold text-amber-400">৳{(b.amount || 0).toLocaleString()}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <p className="p-8 text-center text-xs font-mono text-muted-foreground">No bill entries recorded for this user.</p>
                                            )}
                                        </div>
                                        <TabPaginationFooter meta={billsData?.meta} page={billsPage} onPageChange={setBillsPage} />
                                    </div>
                                )}

                                {/* TAB 4: PRODUCTS */}
                                {activeTab === "products" && (
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                            {productsFetching ? (
                                                <div className="p-8 col-span-full text-center text-xs font-mono text-muted-foreground">Fetching products…</div>
                                            ) : productsData?.data?.length ? (
                                                productsData.data.map((p: any) => (
                                                    <div key={p._id} className="p-4 rounded-2xl bg-[#1a0e07] border border-border/60 flex items-center gap-3">
                                                        <div className="w-12 h-12 rounded-xl bg-primary/15 overflow-hidden flex items-center justify-center text-primary shrink-0">
                                                            {p.photo ? <img src={p.photo} alt={p.name} className="w-full h-full object-cover" /> : <Package className="w-6 h-6" />}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <h5 className="text-xs font-bold text-foreground truncate">{p.name}</h5>
                                                            <p className="text-[10px] text-muted-foreground font-mono">{p.category}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="p-8 col-span-full text-center text-xs font-mono text-muted-foreground">No products created by this user.</p>
                                            )}
                                        </div>
                                        <TabPaginationFooter meta={productsData?.meta} page={productsPage} onPageChange={setProductsPage} />
                                    </div>
                                )}

                                {/* TAB 5: REVIEWS */}
                                {activeTab === "reviews" && (
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div className="space-y-3">
                                            {reviewsFetching ? (
                                                <div className="p-8 text-center text-xs font-mono text-muted-foreground">Fetching reviews…</div>
                                            ) : reviewsData?.data?.length ? (
                                                reviewsData.data.map((r: any) => (
                                                    <div key={r._id} className="p-4 rounded-2xl bg-[#1a0e07] border border-border/60 space-y-1.5 text-xs">
                                                        <div className="flex items-center justify-between font-mono">
                                                            <span className="text-amber-400 font-bold">Rating: {r.rating} ⭐</span>
                                                            <span className="text-[10px] text-muted-foreground">{new Date(r.createdAt).toLocaleString()}</span>
                                                        </div>
                                                        <p className="text-foreground italic font-sans">"{r.comment}"</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="p-8 text-center text-xs font-mono text-muted-foreground">No reviews posted by this user.</p>
                                            )}
                                        </div>
                                        <TabPaginationFooter meta={reviewsData?.meta} page={reviewsPage} onPageChange={setReviewsPage} />
                                    </div>
                                )}

                                {/* TAB 6: AUDIT ACTIVITIES */}
                                {activeTab === "activities" && (
                                    <div className="flex-1 flex flex-col justify-between overflow-auto">
                                        <div>
                                            {activitiesFetching ? (
                                                <div className="p-8 text-center text-xs font-mono text-muted-foreground">Fetching audit logs…</div>
                                            ) : activitiesData?.data?.length ? (
                                                <table className="w-full text-left text-xs border-collapse font-mono">
                                                    <thead className="bg-[#1a0e07] text-muted-foreground border-b border-border/60">
                                                        <tr>
                                                            <th className="p-3">Action</th>
                                                            <th className="p-3">Details Description</th>
                                                            <th className="p-3 text-right">Timestamp</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-border/40">
                                                        {activitiesData.data.map((act: any) => (
                                                            <tr key={act._id} className="hover:bg-primary/5">
                                                                <td className="p-3">
                                                                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-primary/20 text-primary border border-primary/30 uppercase">{act.action}</span>
                                                                </td>
                                                                <td className="p-3 text-foreground font-sans">{act.details}</td>
                                                                <td className="p-3 text-right text-muted-foreground">{new Date(act.createdAt).toLocaleString()}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <p className="p-8 text-center text-xs font-mono text-muted-foreground">No audit activity logs recorded for this user.</p>
                                            )}
                                        </div>
                                        <TabPaginationFooter meta={activitiesData?.meta} page={activitiesPage} onPageChange={setActivitiesPage} />
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </main>

            <AdminSetPasswordModal user={showPasswordModal && user ? user : null} onClose={() => setShowPasswordModal(false)} />
        </div>
    );
}

function TabPaginationFooter({ meta, page, onPageChange }: { meta?: any; page: number; onPageChange: (p: number) => void }) {
    if (!meta) return null;
    return (
        <div className="bg-[#1a0e07] border border-border/60 rounded-2xl px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground font-mono mt-4 shrink-0">
            <div>
                Page <span className="font-bold text-primary">{meta.page}</span> of {meta.totalPages || 1} (Total {meta.total} items)
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(Math.max(1, page - 1))}
                    disabled={!meta.hasPrev || page <= 1}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border bg-[#251508] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/10 hover:text-primary transition-all cursor-pointer text-[11px]"
                >
                    <ChevronLeft className="w-3.5 h-3.5" /> Previous
                </button>
                <span className="font-bold text-foreground text-[11px]">
                    {meta.page} / {meta.totalPages || 1}
                </span>
                <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={!meta.hasNext}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border bg-[#251508] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/10 hover:text-primary transition-all cursor-pointer text-[11px]"
                >
                    Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
}
