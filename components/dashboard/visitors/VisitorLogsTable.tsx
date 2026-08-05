"use client";

import React from "react";
import { Search, Globe, Smartphone, Monitor, ChevronLeft, ChevronRight, User as UserIcon, Shield, Clock } from "lucide-react";

interface VisitorLogsTableProps {
    visitors: any[];
    meta?: any;
    isLoading: boolean;
    page: number;
    setPage: (page: number) => void;
    platformFilter: string;
    setPlatformFilter: (platform: string) => void;
    searchTerm: string;
    setSearchTerm: (search: string) => void;
    dateFilter: string;
    setDateFilter: (date: string) => void;
}

export function VisitorLogsTable({ visitors, meta, isLoading, page, setPage, platformFilter, setPlatformFilter, searchTerm, setSearchTerm, dateFilter, setDateFilter }: VisitorLogsTableProps) {
    return (
        <div className="bg-[#251508] border border-border rounded-3xl p-6 shadow-xl flex flex-col gap-6 font-sans">
            {/* Header & Controls Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" /> Detailed Visitor Audit Logs
                    </h3>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">Real-time incoming client requests, IP tracking & user session logs</p>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Search Input */}
                    <div className="relative flex-1 sm:w-64">
                        <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search IP, route, user agent…"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setPage(1);
                            }}
                            className="w-full bg-[#1a0e07] border border-border/80 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-all"
                        />
                    </div>

                    {/* Platform Selector */}
                    <select
                        value={platformFilter}
                        onChange={(e) => {
                            setPlatformFilter(e.target.value);
                            setPage(1);
                        }}
                        className="bg-[#1a0e07] border border-border/80 rounded-xl px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-primary cursor-pointer"
                    >
                        <option value="">All Platforms</option>
                        <option value="WEB">Web Browser</option>
                        <option value="APP">Mobile App (General)</option>
                        <option value="ANDROID">Android</option>
                        <option value="IOS">iOS</option>
                    </select>

                    {/* Date Selector */}
                    <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => {
                            setDateFilter(e.target.value);
                            setPage(1);
                        }}
                        className="bg-[#1a0e07] border border-border/80 rounded-xl px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-primary cursor-pointer"
                    />

                    {(searchTerm || platformFilter || dateFilter) && (
                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setPlatformFilter("");
                                setDateFilter("");
                                setPage(1);
                            }}
                            className="px-3 py-2 rounded-xl border border-destructive/40 bg-destructive/10 text-destructive text-xs font-mono font-semibold hover:bg-destructive/20 transition-all cursor-pointer"
                        >
                            Reset
                        </button>
                    )}
                </div>
            </div>

            {/* Logs Table */}
            <div className="overflow-x-auto rounded-2xl border border-border/60 bg-[#1a0e07]">
                <table className="w-full text-left text-xs border-collapse font-mono">
                    <thead className="bg-[#251508] text-muted-foreground border-b border-border/60">
                        <tr>
                            <th className="p-3.5">Platform</th>
                            <th className="p-3.5">IP Address</th>
                            <th className="p-3.5">User Info</th>
                            <th className="p-3.5">Target Route / Path</th>
                            <th className="p-3.5 text-center">Hits</th>
                            <th className="p-3.5">User Agent</th>
                            <th className="p-3.5 text-right">Last Visit</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                        {isLoading ? (
                            <tr>
                                <td colSpan={7} className="p-12 text-center text-muted-foreground">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                        <span>Loading visitor audit log records…</span>
                                    </div>
                                </td>
                            </tr>
                        ) : visitors && visitors.length > 0 ? (
                            visitors.map((v: any) => {
                                const platform = (v.platform || "WEB").toUpperCase();
                                const userObj = typeof v.userId === "object" ? v.userId : null;

                                return (
                                    <tr key={v._id} className="hover:bg-white/5 transition-colors">
                                        {/* Platform Badge */}
                                        <td className="p-3.5">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                                                    platform === "WEB"
                                                        ? "bg-blue-500/15 text-blue-400 border-blue-500/30"
                                                        : platform === "ANDROID"
                                                          ? "bg-green-500/15 text-green-400 border-green-500/30"
                                                          : platform === "IOS"
                                                            ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                                                            : "bg-purple-500/15 text-purple-400 border-purple-500/30"
                                                }`}
                                            >
                                                {platform === "WEB" ? <Globe className="w-3 h-3" /> : platform === "ANDROID" || platform === "IOS" ? <Smartphone className="w-3 h-3" /> : <Monitor className="w-3 h-3" />}
                                                {platform}
                                            </span>
                                        </td>

                                        {/* IP Address */}
                                        <td className="p-3.5 font-bold text-foreground">{v.ipAddress || "Unknown"}</td>

                                        {/* User Info */}
                                        <td className="p-3.5">
                                            {userObj ? (
                                                <div className="flex items-center gap-2">
                                                    {userObj.profileImage ? (
                                                        <img src={userObj.profileImage} alt={userObj.name} className="w-6 h-6 rounded-full object-cover border border-primary/30" />
                                                    ) : (
                                                        <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-[10px]">{userObj.name?.[0] || "U"}</div>
                                                    )}
                                                    <div>
                                                        <p className="font-bold text-foreground text-xs leading-tight">{userObj.name}</p>
                                                        <p className="text-[10px] text-muted-foreground">{userObj.email}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground text-[11px] flex items-center gap-1">
                                                    <UserIcon className="w-3 h-3 opacity-50" /> Guest / Anonymous
                                                </span>
                                            )}
                                        </td>

                                        {/* Target Route */}
                                        <td className="p-3.5 text-primary font-bold max-w-[200px] truncate" title={v.path}>
                                            {v.path || "/"}
                                        </td>

                                        {/* Hit Count */}
                                        <td className="p-3.5 text-center font-bold text-foreground">
                                            <span className="px-2 py-0.5 rounded bg-white/10 border border-white/15 text-[11px]">{v.count || 1}</span>
                                        </td>

                                        {/* User Agent */}
                                        <td className="p-3.5 text-muted-foreground text-[10px] max-w-[220px] truncate" title={v.userAgent}>
                                            {v.userAgent || "N/A"}
                                        </td>

                                        {/* Last Visited */}
                                        <td className="p-3.5 text-right text-muted-foreground text-[11px]">
                                            <div className="flex items-center justify-end gap-1">
                                                <Clock className="w-3 h-3 text-muted-foreground/70" />
                                                <span>{v.lastVisitedAt ? new Date(v.lastVisitedAt).toLocaleString() : v.date}</span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={7} className="p-8 text-center text-muted-foreground">
                                    No visitor logs found matching your filter criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {meta && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-muted-foreground">
                    <div>
                        Showing page <span className="font-bold text-primary">{meta.page}</span> of {meta.totalPages || 1} ({meta.total} total visitor records)
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={!meta.hasPrev || page <= 1}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border bg-[#1a0e07] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/10 hover:text-primary transition-all cursor-pointer"
                        >
                            <ChevronLeft className="w-4 h-4" /> Previous
                        </button>
                        <span className="font-bold text-foreground px-2">
                            {meta.page} / {meta.totalPages || 1}
                        </span>
                        <button
                            onClick={() => setPage(page + 1)}
                            disabled={!meta.hasNext}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border bg-[#1a0e07] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/10 hover:text-primary transition-all cursor-pointer"
                        >
                            Next <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
