import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, FileText } from "lucide-react";

export function TermsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    if (!isOpen) return null;

    return (
        <AnimatePresence mode="wait">
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0a0502]/80 backdrop-blur-md overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    className="w-full max-w-2xl bg-card border border-primary/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-auto max-h-[85vh] flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-border shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                    Terms & Conditions
                                </h3>
                                <p className="text-xs text-muted-foreground font-mono">Effective: July 2026</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-9 h-9 rounded-full bg-[#1a0e07] border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Scrollable Policy Body */}
                    <div className="flex-1 overflow-y-auto py-6 space-y-5 text-xs text-muted-foreground leading-relaxed font-sans pr-2">
                        <section className="space-y-2">
                            <h4 className="text-sm font-bold text-foreground">1. Acceptance of Terms</h4>
                            <p>
                                By accessing or using My Bazar Hisab, you agree to comply with and be bound by these Terms and Conditions. If you do not agree, please do not use the application.
                            </p>
                        </section>

                        <section className="space-y-2">
                            <h4 className="text-sm font-bold text-foreground">2. Account Responsibility</h4>
                            <p>
                                Users are responsible for maintaining the confidentiality of their login credentials and group access codes. You agree to take full responsibility for all transactions logged under your user account.
                            </p>
                        </section>

                        <section className="space-y-2">
                            <h4 className="text-sm font-bold text-foreground">3. Acceptable Use</h4>
                            <p>
                                You agree not to upload fraudulent expense records, engage in unauthorized data scraping, or attempt to breach group privacy controls of other users.
                            </p>
                        </section>

                        <section className="space-y-2">
                            <h4 className="text-sm font-bold text-foreground">4. Service Availability & Modification</h4>
                            <p>
                                We strive for 99.9% uptime. However, My Bazar Hisab reserves the right to modify or temporarily suspend features for scheduled maintenance or performance upgrades.
                            </p>
                        </section>

                        <section className="space-y-2">
                            <h4 className="text-sm font-bold text-foreground">5. Limitation of Liability</h4>
                            <p>
                                My Bazar Hisab is a budget ledger calculation tool. While we ensure calculation precision, users remain responsible for financial settlements between mess members or family members.
                            </p>
                        </section>
                    </div>

                    {/* Footer Close Button */}
                    <div className="pt-4 border-t border-border flex justify-end shrink-0">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold text-xs rounded-xl hover:bg-accent transition-all cursor-pointer"
                        >
                            Accept & Close
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
