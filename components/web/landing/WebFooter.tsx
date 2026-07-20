import React from "react";
import Link from "next/link";
import { ShoppingBag, Receipt, Users, TrendingUp, Shield, Heart, ArrowRight } from "lucide-react";

export function WebFooter({ onSignIn }: { onSignIn: () => void }) {
    return (
        <footer className="relative z-10 border-t border-[rgba(232,160,32,0.08)] bg-[#090402] pt-16 pb-12 select-none">
            <div className="container mx-auto px-6 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[rgba(232,160,32,0.06)]">
                    {/* Brand Column */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-primary flex items-center justify-center p-0.5 border border-primary/20 shadow-md shadow-primary/10">
                                <img src="/assets/logo.png" alt="Bazar Hisab Logo" className="w-full h-full object-contain rounded-lg" />
                            </div>
                            <span className="text-xl font-bold text-foreground" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                                My Bazar <span className="text-primary font-sans font-extrabold">Hisab</span>
                            </span>
                        </div>
                        <p className="text-muted-foreground text-xs leading-relaxed max-w-md">
                            The modern collaborative spending ledger for families and shared households. Track daily groceries, utility bills, and monthly budgets effortlessly.
                        </p>
                        <div className="flex items-center gap-2 pt-2 text-[11px] text-muted-foreground font-mono">
                            <Shield className="w-3.5 h-3.5 text-primary" />
                            <span>Private & Encrypted Accounts</span>
                        </div>
                    </div>

                    {/* Navigation Column */}
                    <div className="space-y-4">
                        <h4 className="text-xs uppercase tracking-widest text-primary font-mono font-bold">Quick Navigation</h4>
                        <ul className="space-y-2.5 text-sm text-muted-foreground">
                            {["Features", "How it Works", "Benefits", "Ratings", "Contact"].map((link) => (
                                <li key={link}>
                                    <a href={`#${link.toLowerCase().replace(/\s+/g, "")}`} className="hover:text-primary transition-colors text-xs flex items-center gap-1.5 group">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:w-2.5 group-hover:bg-primary transition-all" />
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal & Support Column */}
                    <div className="space-y-4">
                        <h4 className="text-xs uppercase tracking-widest text-primary font-mono font-bold">Legal & Support</h4>
                        <ul className="space-y-2.5 text-xs text-muted-foreground">
                            <li>
                                <Link
                                    href="/privacy-policy"
                                    className="hover:text-primary transition-colors text-xs flex items-center gap-1.5 cursor-pointer"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/terms-and-conditions"
                                    className="hover:text-primary transition-colors text-xs flex items-center gap-1.5 cursor-pointer"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                    Terms & Conditions
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-primary transition-colors text-xs flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                    Contact Support
                                </Link>
                            </li>
                            <li>
                                <Link href="/feedback" className="hover:text-primary transition-colors text-xs flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                    Give Feedback & Review
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
                    <p className="font-mono text-[11px] text-center sm:text-left">
                        © {new Date().getFullYear()} My Bazar Hisab. All rights reserved.
                    </p>
                    <p className="flex items-center gap-1.5 text-[11px]">
                        Built for families with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" /> & care.
                    </p>
                </div>
            </div>
        </footer>
    );
}
