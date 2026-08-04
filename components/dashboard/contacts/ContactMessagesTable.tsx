"use client";

import React from "react";
import { Mail, CheckCircle2, Clock, Eye, Reply, Trash2 } from "lucide-react";
import { TContact } from "@/redux/features/contact/contactApi";

interface ContactMessagesTableProps {
    messages: TContact[];
    isLoading: boolean;
    onViewDetails: (id: string) => void;
    onReply: (contact: TContact) => void;
    onDelete: (contact: TContact) => void;
}

export function ContactMessagesTable({
    messages,
    isLoading,
    onViewDetails,
    onReply,
    onDelete,
}: ContactMessagesTableProps) {
    return (
        <div className="overflow-x-auto flex-1">
            <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-[#2e1a0a] text-muted-foreground font-mono text-xs border-b border-[rgba(232,160,32,0.1)] sticky top-0">
                    <tr>
                        <th className="p-4">Sender & ID</th>
                        <th className="p-4">Subject</th>
                        <th className="p-4">Message Snippet</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-center">Date</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(232,160,32,0.06)]">
                    {isLoading ? (
                        <tr>
                            <td colSpan={6} className="p-12 text-center text-muted-foreground">
                                <div className="flex flex-col items-center justify-center gap-3">
                                    <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                                    <p className="text-xs font-mono">Loading contact messages…</p>
                                </div>
                            </td>
                        </tr>
                    ) : messages.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="p-12 text-center text-muted-foreground">
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <Mail className="w-10 h-10 text-muted-foreground/40 mb-1" />
                                    <p className="text-sm font-semibold">No support messages found</p>
                                    <p className="text-xs text-muted-foreground">Submitted user inquiries will appear here.</p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        messages.map((contact) => (
                            <tr key={contact._id} className="hover:bg-primary/5 transition-colors group">
                                {/* Sender Info & ID */}
                                <td className="p-4">
                                    <div>
                                        <h4 className="font-semibold text-foreground">{contact.name}</h4>
                                        <p className="text-xs text-muted-foreground">{contact.email}</p>
                                        <p className="text-[10px] text-muted-foreground font-mono select-all mt-0.5" title={contact._id}>
                                            ID: {contact._id}
                                        </p>
                                    </div>
                                </td>

                                {/* Subject */}
                                <td className="p-4 font-medium text-foreground">
                                    <div className="max-w-xs truncate">{contact.subject}</div>
                                </td>

                                {/* Message Snippet */}
                                <td className="p-4 max-w-xs truncate text-xs text-muted-foreground">
                                    {contact.message}
                                </td>

                                {/* Status */}
                                <td className="p-4 text-center">
                                    {contact.isReplied ? (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono bg-green-500/15 text-green-400 border border-green-500/30">
                                            <CheckCircle2 className="w-3 h-3" /> Replied
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">
                                            <Clock className="w-3 h-3" /> Pending Reply
                                        </span>
                                    )}
                                </td>

                                {/* Date */}
                                <td className="p-4 text-center text-xs text-muted-foreground font-mono">
                                    {new Date(contact.createdAt).toLocaleDateString()}
                                </td>

                                {/* Actions */}
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                        <button
                                            onClick={() => onViewDetails(contact._id)}
                                            className="p-1.5 rounded-lg border border-border bg-[#1a0e07] hover:border-primary/50 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                                            title="View Message Details"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>

                                        <button
                                            onClick={() => onReply(contact)}
                                            className="p-1.5 rounded-lg border border-border bg-[#1a0e07] hover:border-accent/50 text-muted-foreground hover:text-accent transition-colors cursor-pointer"
                                            title="Reply to Message"
                                        >
                                            <Reply className="w-4 h-4" />
                                        </button>

                                        <button
                                            onClick={() => onDelete(contact)}
                                            className="p-1.5 rounded-lg border border-border bg-[#1a0e07] hover:border-destructive/50 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                                            title="Delete Message"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
