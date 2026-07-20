import React from "react";
import { motion } from "motion/react";
import { ArrowLeft, FileText, CheckCircle2, ShieldAlert, Scale, Users, RefreshCw, HelpCircle } from "lucide-react";

export function TermsView({ onBack }: { onBack: () => void }) {
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
                            <FileText className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-bold text-foreground font-mono">TERMS OF SERVICE</span>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 container mx-auto px-6 md:px-8 py-12 md:py-16 max-w-4xl relative z-10">
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    {/* Page Title & Banner */}
                    <div className="space-y-3 border-b border-primary/15 pb-8">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold font-mono">
                            <Scale className="w-3.5 h-3.5" />
                            <span>LEGAL TERMS & USAGE AGREEMENT</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                            Terms & Conditions
                        </h1>
                        <p className="text-muted-foreground text-sm font-mono">
                            Last Updated: July 20, 2026 • Effective Date: January 1, 2025
                        </p>
                    </div>

                    {/* Intro Note */}
                    <div className="p-6 rounded-2xl bg-card/60 border border-primary/20 backdrop-blur-xl">
                        <p className="text-sm text-foreground/90 leading-relaxed">
                            Welcome to <strong>My Bazar Hisab</strong>. These Terms and Conditions govern your access to and use of our household expense ledger platforms across web and mobile applications. By creating an account or joining a household group, you agree to these terms.
                        </p>
                    </div>

                    {/* Policy Sections */}
                    <div className="space-y-10 text-muted-foreground text-sm leading-relaxed font-sans">
                        <section className="space-y-3">
                            <div className="flex items-center gap-3 text-foreground">
                                <div className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                                <h2 className="text-xl font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                    1. User Account & Registration
                                </h2>
                            </div>
                            <p className="pl-11">
                                You must provide accurate registration details (Name, Email, and Phone number). You are solely responsible for maintaining the confidentiality of your account credentials and group access codes. Any activity occurring under your account is your responsibility.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <div className="flex items-center gap-3 text-foreground">
                                <div className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                                    <Users className="w-4 h-4" />
                                </div>
                                <h2 className="text-xl font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                    2. Household & Group Collaboration Rules
                                </h2>
                            </div>
                            <p className="pl-11">
                                My Bazar Hisab provides shared group ledgers for family members and mess flatmates. Group creators and members agree to log authentic transaction amounts. Abuse, fraudulent logging, or unauthorized sharing of group access codes is strictly prohibited.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <div className="flex items-center gap-3 text-foreground">
                                <div className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                                    <ShieldAlert className="w-4 h-4" />
                                </div>
                                <h2 className="text-xl font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                    3. Prohibited Activities
                                </h2>
                            </div>
                            <p className="pl-11">
                                Users agree not to engage in any of the following prohibited behaviors:
                            </p>
                            <ul className="pl-16 list-disc space-y-1.5 text-xs text-muted-foreground">
                                <li>Attempting to breach security measures or access group ledgers without proper invite authorization.</li>
                                <li>Automated data scraping, reverse engineering, or overloading service servers.</li>
                                <li>Using the application for illegal financial transactions or fraudulent activities.</li>
                            </ul>
                        </section>

                        <section className="space-y-3">
                            <div className="flex items-center gap-3 text-foreground">
                                <div className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                                    <Scale className="w-4 h-4" />
                                </div>
                                <h2 className="text-xl font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                    4. Financial Settlement Disclaimer
                                </h2>
                            </div>
                            <p className="pl-11">
                                My Bazar Hisab is a calculation and tracking application. We provide precision mathematical totals and expense split calculations. However, actual monetary payments and cash/mobile-banking settlements are conducted independently between household members.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <div className="flex items-center gap-3 text-foreground">
                                <div className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                                    <RefreshCw className="w-4 h-4" />
                                </div>
                                <h2 className="text-xl font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                    5. Service Modifications & Termination
                                </h2>
                            </div>
                            <p className="pl-11">
                                We continuously improve our application. We reserve the right to update features, perform maintenance, or terminate accounts violating these Terms & Conditions.
                            </p>
                        </section>

                        <section className="space-y-3 pt-4 border-t border-primary/15">
                            <div className="flex items-center gap-3 text-foreground">
                                <div className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                                    <HelpCircle className="w-4 h-4" />
                                </div>
                                <h2 className="text-xl font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                    6. Support & Inquiries
                                </h2>
                            </div>
                            <p className="pl-11">
                                For questions regarding these Terms & Conditions, please contact us:
                            </p>
                            <div className="pl-11 font-mono text-xs text-primary space-y-1">
                                <p>Email: legal@bazarhisab.com</p>
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
