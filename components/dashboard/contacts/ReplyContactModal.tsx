"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Reply, X, Send } from "lucide-react";
import { toast } from "sonner";
import { TContact, useReplyToMessageMutation } from "@/redux/features/contact/contactApi";

interface ReplyContactModalProps {
    contact: TContact | null;
    onClose: () => void;
}

export function ReplyContactModal({ contact, onClose }: ReplyContactModalProps) {
    const [replyToMessage, { isLoading }] = useReplyToMessageMutation();
    const [replyText, setReplyText] = useState("");

    useEffect(() => {
        if (contact) {
            setReplyText(contact.replyMessage || "");
        }
    }, [contact]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!contact) return;
        if (!replyText.trim()) {
            toast.error("Please enter a reply message");
            return;
        }

        try {
            await replyToMessage({
                id: contact._id,
                replyMessage: replyText.trim(),
            }).unwrap();

            toast.success("Reply sent successfully!");
            onClose();
        } catch (err: any) {
            toast.error(err?.data?.message || err?.message || "Failed to send reply");
        }
    };

    return (
        <AnimatePresence>
            {contact && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#251508] border border-border rounded-3xl p-6 w-full max-w-lg shadow-2xl flex flex-col gap-5">
                        <div className="flex items-center justify-between border-b border-border pb-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center">
                                    <Reply className="w-5 h-5 text-accent" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-foreground">Reply to Message</h3>
                                    <p className="text-xs text-muted-foreground">Replying to {contact.name}</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="bg-[#1a0e07] border border-border rounded-xl p-3.5 flex flex-col gap-1 text-xs">
                            <div className="flex justify-between font-mono text-muted-foreground">
                                <span>
                                    To: {contact.name} ({contact.email})
                                </span>
                                <span>Subject: {contact.subject}</span>
                            </div>
                            <p className="text-foreground italic mt-1 font-sans">"{contact.message}"</p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                                    Admin Response Message <span className="text-destructive">*</span>
                                </label>
                                <textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Write your response message here…"
                                    rows={5}
                                    required
                                    className="w-full px-4 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none focus:border-accent/60 text-foreground"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:bg-white/5 cursor-pointer">
                                    Cancel
                                </button>
                                <button type="submit" disabled={isLoading} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent text-accent-foreground font-bold text-xs hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer shadow-md">
                                    <Send className="w-4 h-4" />
                                    <span>{isLoading ? "Sending Reply…" : "Send Reply"}</span>
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
