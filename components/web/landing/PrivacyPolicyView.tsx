import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function PrivacyPolicyView({ onBack }: { onBack?: () => void }) {
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
                    Privacy Policy
                </h1>
                <p className="text-xs text-muted-foreground mb-8 font-mono">
                    Last Updated: July 20, 2026
                </p>

                <div className="space-y-6 text-sm text-foreground/80 leading-relaxed font-sans border-t border-border pt-6">
                    <p>
                        At My Bazar Hisab, we respect your privacy and are committed to protecting your personal information and household financial records. This Privacy Policy explains how we collect, use, and protect your information when you use our services.
                    </p>

                    <h2 className="text-lg font-bold text-foreground pt-4 mb-2">1. Information We Collect</h2>
                    <p>
                        We collect information you provide directly to us when you create an account or record household expenses:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                        <li><strong>Personal Information:</strong> Name, email address, and phone number provided during account registration.</li>
                        <li><strong>Expense Data:</strong> Daily market item purchases, unit prices, utility bill items, and group budget limits logged by you and members of your household group.</li>
                        <li><strong>Technical Information:</strong> Basic device identifiers, browser type, and app diagnostics for performance monitoring.</li>
                    </ul>

                    <h2 className="text-lg font-bold text-foreground pt-4 mb-2">2. How We Use Your Information</h2>
                    <p>
                        We use the collected information solely for the following purposes:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                        <li>To maintain and sync shared expense ledgers between authorized members of your household group.</li>
                        <li>To calculate monthly totals, budget limits, and category-wise spending analytics.</li>
                        <li>To send important account notifications and expense alerts.</li>
                        <li>To ensure platform security and prevent unauthorized account access.</li>
                    </ul>

                    <h2 className="text-lg font-bold text-foreground pt-4 mb-2">3. Data Security & Group Privacy</h2>
                    <p>
                        Your data is encrypted during transmission and storage. Only individuals who enter your private household group invitation code have access to view or contribute to your shared group ledger.
                    </p>

                    <h2 className="text-lg font-bold text-foreground pt-4 mb-2">4. Third-Party Sharing</h2>
                    <p>
                        We do not sell, rent, or share your personal information or household expense records with third-party advertisers or data brokers.
                    </p>

                    <h2 className="text-lg font-bold text-foreground pt-4 mb-2">5. Your Data Rights</h2>
                    <p>
                        You have full control over your data. You can edit or delete your expense entries at any time. If you decide to delete your account, all your personal data and transaction records will be permanently removed from our systems.
                    </p>

                    <h2 className="text-lg font-bold text-foreground pt-4 mb-2">6. Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy, please contact our support team at <a href="mailto:support@bazarhisab.com" className="text-primary hover:underline">support@bazarhisab.com</a>.
                    </p>
                </div>
            </main>
        </div>
    );
}
