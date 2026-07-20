import React from "react";
import { motion } from "motion/react";
import { ArrowLeft, ShieldCheck, Lock, Eye, FileText, Database, UserCheck, Mail } from "lucide-react";

export function PrivacyPolicyView({ onBack }: { onBack: () => void }) {
    return (
        <div className="min-h-screen w-full bg-[#130a04] text-[#f5ede2] flex flex-col font-sans relative selection:bg-primary selection:text-primary-foreground">
            {/* Background Orbs */}
            <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-0 right-[-10%] w-[600px] h-[600px] bg-accent/8 rounded-full blur-[160px] pointer-events-none" />

            {/* Header / Top Navigation */}
            <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#130a04]/85 border-b border-[rgba(232,160,32,0.08)] select-none">
                <div className="container mx-auto px-6 md:px-8 h-20 flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </button>

                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                            <ShieldCheck className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-bold text-foreground font-mono">PRIVACY POLICY</span>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 container mx-auto px-6 md:px-8 py-12 md:py-16 max-w-4xl relative z-10">
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    {/* Page Title & Banner */}
                    <div className="space-y-3 border-b border-primary/15 pb-8">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold font-mono">
                            <Lock className="w-3.5 h-3.5" />
                            <span>DATA PROTECTION & PRIVACY COMMITMENT</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                            Privacy Policy
                        </h1>
                        <p className="text-muted-foreground text-sm font-mono">
                            Last Updated: July 20, 2026 • Effective Date: January 1, 2025
                        </p>
                    </div>

                    {/* Intro Note */}
                    <div className="p-6 rounded-2xl bg-card/60 border border-primary/20 backdrop-blur-xl">
                        <p className="text-sm text-foreground/90 leading-relaxed">
                            At <strong>My Bazar Hisab</strong>, we prioritize the privacy and security of your household budget data. This Privacy Policy details how we collect, use, protect, and handle your daily market expenses, utility bills, and personal information when you use our mobile and web applications.
                        </p>
                    </div>

                    {/* Policy Sections */}
                    <div className="space-y-10 text-muted-foreground text-sm leading-relaxed font-sans">
                        <section className="space-y-3">
                            <div className="flex items-center gap-3 text-foreground">
                                <div className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                                    <Database className="w-4 h-4" />
                                </div>
                                <h2 className="text-xl font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                    1. Information We Collect
                                </h2>
                            </div>
                            <p className="pl-11">
                                We collect information that you directly provide when registering an account or collaborating in household groups:
                            </p>
                            <ul className="pl-16 list-disc space-y-1.5 text-xs text-muted-foreground">
                                <li><strong>Account Information:</strong> Name, Email address, Phone number, and Profile picture.</li>
                                <li><strong>Household Expenses:</strong> Daily market purchases (item names, categories, quantities, unit prices, total cost), monthly utility bills (electricity, gas, water, internet), and group budget limits.</li>
                                <li><strong>Device & Usage Data:</strong> IP address, device type, browser information, and application crash diagnostics.</li>
                            </ul>
                        </section>

                        <section className="space-y-3">
                            <div className="flex items-center gap-3 text-foreground">
                                <div className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                                    <Eye className="w-4 h-4" />
                                </div>
                                <h2 className="text-xl font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                    2. How We Use Your Information
                                </h2>
                            </div>
                            <p className="pl-11">
                                Your data is strictly utilized to provide and improve the shared account ledger services:
                            </p>
                            <ul className="pl-16 list-disc space-y-1.5 text-xs text-muted-foreground">
                                <li>Syncing live transactions seamlessly across all authorized members of your family group.</li>
                                <li>Generating monthly and yearly expense comparison charts and budget tracking reports.</li>
                                <li>Sending real-time push notifications and email summaries when new entries are added.</li>
                                <li>Preventing unauthorized access and securing user accounts against fraud.</li>
                            </ul>
                        </section>

                        <section className="space-y-3">
                            <div className="flex items-center gap-3 text-foreground">
                                <div className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                                    <ShieldCheck className="w-4 h-4" />
                                </div>
                                <h2 className="text-xl font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                    3. Data Security & Encryption
                                </h2>
                            </div>
                            <p className="pl-11">
                                We implement industry-standard encryption protocols (TLS/SSL for data in transit and AES-256 for data at rest). Your group code access control ensures that only family members you explicitly invite can view or contribute entries to your household ledger.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <div className="flex items-center gap-3 text-foreground">
                                <div className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                                    <UserCheck className="w-4 h-4" />
                                </div>
                                <h2 className="text-xl font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                    4. Data Ownership & Deletion Rights
                                </h2>
                            </div>
                            <p className="pl-11">
                                You retain 100% ownership of your data. You may edit or delete individual transaction logs at any time. If you choose to delete your account from the Profile settings, all your personal data, transaction records, and group memberships will be permanently wiped from our database.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <div className="flex items-center gap-3 text-foreground">
                                <div className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                                    <FileText className="w-4 h-4" />
                                </div>
                                <h2 className="text-xl font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                    5. Third-Party Sharing Policy
                                </h2>
                            </div>
                            <p className="pl-11">
                                <strong>We do not sell, rent, or monetize your household financial records to advertisers or third-party data brokers.</strong> Information is shared only with trusted infrastructure providers (such as cloud hosting and database backup services) under strict confidentiality agreements.
                            </p>
                        </section>

                        <section className="space-y-3 pt-4 border-t border-primary/15">
                            <div className="flex items-center gap-3 text-foreground">
                                <div className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <h2 className="text-xl font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                    6. Contact Privacy Officer
                                </h2>
                            </div>
                            <p className="pl-11">
                                If you have questions or concerns regarding this Privacy Policy, please contact our Data Protection Officer at:
                            </p>
                            <div className="pl-11 font-mono text-xs text-primary space-y-1">
                                <p>Email: privacy@bazarhisab.com</p>
                                <p>Helpline: +880 1700-000000</p>
                            </div>
                        </section>
                    </div>

                    {/* Back Button Footer */}
                    <div className="pt-8 flex justify-start">
                        <button
                            onClick={onBack}
                            className="px-6 py-3 bg-primary text-[#1a0e07] font-bold text-sm rounded-xl hover:bg-accent transition-all cursor-pointer shadow-lg shadow-primary/20 flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" /> Return to Home Page
                        </button>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
