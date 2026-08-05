"use client";

import React from "react";
import { X } from "lucide-react";

interface WebModalProps {
    show: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export function WebModal({ show, onClose, title, children }: WebModalProps) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#251508] border border-border w-full max-w-md rounded-3xl shadow-2xl p-6 relative overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between pb-4 border-b border-border mb-5">
                    <h3 className="text-lg font-bold text-foreground">{title}</h3>
                    <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

interface WebConfirmModalProps {
    show: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
}

export function WebConfirmModal({ show, onClose, onConfirm, title, message, confirmText = "Confirm Delete" }: WebConfirmModalProps) {
    if (!show) return null;

    return (
        <WebModal show={show} onClose={onClose} title={title}>
            <div className="flex flex-col gap-4 font-sans text-left">
                <p className="text-sm text-foreground">{message}</p>
                <div className="flex gap-3 pt-2 border-t border-border/60">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:bg-white/5 transition-colors cursor-pointer">
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="flex-1 py-2.5 bg-destructive text-destructive-foreground font-bold text-xs rounded-xl hover:bg-destructive/90 transition-all cursor-pointer shadow-md"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </WebModal>
    );
}
