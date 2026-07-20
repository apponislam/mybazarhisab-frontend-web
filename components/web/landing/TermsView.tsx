import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function TermsView({ onBack }: { onBack?: () => void }) {
    return (
        <div className="min-h-screen w-full bg-[#130a04] text-[#f5ede2] flex flex-col font-sans">
            {/* Simple Top Header */}
            <header className="sticky top-0 z-50 w-full bg-[#130a04]/90 border-b border-border backdrop-blur-sm">
                <div className="container mx-auto px-6 max-w-4xl h-16 flex items-center justify-between">
                    {onBack ? (
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back to Home
                        </button>
                    ) : (
                        <Link
                            href="/web"
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back to Home
                        </Link>
                    )}

                    <span className="text-sm font-semibold text-muted-foreground">My Bazar Hisab</span>
                </div>
            </header>

            {/* Clean Readable Document Body */}
            <main className="flex-1 container mx-auto px-6 py-12 max-w-3xl">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Terms & Conditions
                </h1>
                <p className="text-xs text-muted-foreground mb-8 font-mono">
                    Last Updated: July 20, 2026
                </p>

                <div className="space-y-6 text-sm text-foreground/80 leading-relaxed font-sans border-t border-border pt-6">
                    <p>
                        Welcome to My Bazar Hisab. By accessing or using our website and mobile application, you agree to be bound by these Terms & Conditions. Please read them carefully before using our service.
                    </p>

                    <h2 className="text-lg font-bold text-foreground pt-4 mb-2">1. Account Terms</h2>
                    <p>
                        You must provide accurate and complete registration information. You are responsible for keeping your login credentials and group access codes confidential. You are responsible for all activity occurring under your account.
                    </p>

                    <h2 className="text-lg font-bold text-foreground pt-4 mb-2">2. Acceptable Use</h2>
                    <p>
                        You agree to use My Bazar Hisab only for lawful household expense tracking and budget recording. You must not:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                        <li>Attempt to access group ledgers or accounts of other users without explicit invitation.</li>
                        <li>Intentionally input fraudulent or deceptive expense logs to misrepresent shared group figures.</li>
                        <li>Attempt to interfere with or compromise the security or integrity of our servers or database.</li>
                    </ul>

                    <h2 className="text-lg font-bold text-foreground pt-4 mb-2">3. Shared Group Collaboration</h2>
                    <p>
                        My Bazar Hisab enables multiple users to join a shared group ledger. All members of a group will be able to see expenses logged within that group. The group owner and members are responsible for managing member access.
                    </p>

                    <h2 className="text-lg font-bold text-foreground pt-4 mb-2">4. Calculation & Settlement Disclaimer</h2>
                    <p>
                        My Bazar Hisab provides tools for logging expenses and calculating shared balances. We provide mathematical accuracy based on the figures you input. However, actual monetary payments or cash settlements take place off-platform between household members.
                    </p>

                    <h2 className="text-lg font-bold text-foreground pt-4 mb-2">5. Service Availability & Updates</h2>
                    <p>
                        We strive to keep the service running smoothly, but we do not guarantee uninterrupted access. We reserve the right to modify, update, or temporarily suspend parts of the service for routine maintenance or improvements.
                    </p>

                    <h2 className="text-lg font-bold text-foreground pt-4 mb-2">6. Contact Information</h2>
                    <p>
                        If you have any questions or concerns regarding these Terms & Conditions, please contact us at <a href="mailto:support@bazarhisab.com" className="text-primary hover:underline">support@bazarhisab.com</a>.
                    </p>
                </div>
            </main>
        </div>
    );
}
