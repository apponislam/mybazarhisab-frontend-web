"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, X, CheckCircle2, Clock, Send } from "lucide-react";
import { useGetMessageByIdQuery } from "@/redux/features/contact/contactApi";

interface ContactDetailsModalProps {
    id: string | null;
    onClose: () => void;
}

export function ContactDetailsModal({ id, onClose }: ContactDetailsModalProps) {
    const { data, isLoading, isError } = useGetMessageByIdQuery(id || "", {
        skip: !id,
    });
    const contact = data?.data;

    return (
        <AnimatePresence>
            {id && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#251508] border border-border rounded-3xl p-6 w-full max-w-lg shadow-2xl flex flex-col gap-5">
                        <div className="flex items-center justify-between border-b border-border pb-3">
                            <div className="flex items-center gap-2.5">
                                <Mail className="w-5 h-5 text-primary" />
                                <h3 className="text-base font-bold text-foreground">Support Message Details</h3>
                            </div>
                            <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {isLoading ? (
                            <div className="py-8 flex flex-col items-center justify-center gap-2">
                                <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                                <p className="text-xs text-muted-foreground font-mono">Loading message details…</p>
                            </div>
                        ) : isError || !contact ? (
                            <div className="py-8 text-center text-destructive text-xs">Failed to load message details</div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <div className="bg-[#1a0e07] border border-border rounded-xl p-4 flex flex-col gap-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="text-base font-bold text-foreground">{contact.name}</h4>
                                            <p className="text-xs text-muted-foreground font-mono">{contact.email}</p>
                                        </div>
                                        {contact.isReplied ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono bg-green-500/15 text-green-400 border border-green-500/30">
                                                <CheckCircle2 className="w-3 h-3" /> Replied
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">
                                                <Clock className="w-3 h-3" /> Pending
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-muted-foreground font-mono select-all">ID: {contact._id}</p>
                                    <p className="text-[10px] text-muted-foreground font-mono">Date: {new Date(contact.createdAt).toLocaleString()}</p>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-muted-foreground">Subject</label>
                                    <p className="px-4 py-2.5 bg-[#1a0e07] border border-border rounded-xl text-sm font-semibold text-foreground">{contact.subject}</p>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-muted-foreground">User Message</label>
                                    <div className="px-4 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm text-foreground leading-relaxed whitespace-pre-wrap">{contact.message}</div>
                                </div>

                                {contact.isReplied && contact.replyMessage && (
                                    <div className="flex flex-col gap-1.5 pt-2 border-t border-border">
                                        <label className="text-xs font-semibold text-green-400 flex items-center gap-1.5">
                                            <Send className="w-3.5 h-3.5" /> Admin Reply Message
                                        </label>
                                        <div className="px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-xl text-sm text-foreground leading-relaxed whitespace-pre-wrap font-mono text-xs">{contact.replyMessage}</div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="pt-2 flex justify-end">
                            <button onClick={onClose} className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-accent cursor-pointer">
                                Close
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
