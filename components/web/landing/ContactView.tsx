import React, { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, HelpCircle, ChevronDown, Clock } from "lucide-react";

const FAQS = [
    {
        q: "How do I create and share a family household group?",
        a: "After signing in, click 'Create Group', set your household name and monthly budget limit. You will receive a unique group code that you can copy and send to family members or flatmates."
    },
    {
        q: "How many members can join a single household group?",
        a: "Each My Bazar Hisab group supports up to 20 members, allowing all family members and roommates to log daily market expenses simultaneously."
    },
    {
        q: "How do unit quantities work for groceries?",
        a: "When logging daily bazar items, you can specify exact units such as KG, GM, Litre, Piece, or Packet along with the total price to maintain clear inventory logs."
    },
    {
        q: "Is our family spending data private and secure?",
        a: "Yes. All transactions are encrypted. Only individuals who enter your secret household group invitation code can view or contribute entries."
    }
];

export function ContactView({ onBack }: { onBack?: () => void }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 1200);
    };

    return (
        <div className="min-h-screen w-full bg-[#130a04] text-[#f5ede2] flex flex-col font-sans">
            {/* Simple Top Header */}
            <header className="sticky top-0 z-50 w-full bg-[#130a04]/90 border-b border-border backdrop-blur-sm select-none">
                <div className="container mx-auto px-6 max-w-5xl h-16 flex items-center justify-between">
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

                    <span className="text-sm font-semibold text-muted-foreground">My Bazar Hisab Support</span>
                </div>
            </header>

            {/* Document Body */}
            <main className="flex-1 container mx-auto px-6 py-12 max-w-5xl space-y-16">
                {/* Title Section */}
                <div className="space-y-3">
                    <h1 className="text-3xl md:text-5xl font-bold text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        Contact Support & Help Center
                    </h1>
                    <p className="text-sm text-muted-foreground max-w-2xl">
                        Have questions about managing your family group, need technical assistance, or want to share feedback? We are here to help.
                    </p>
                </div>

                {/* Grid Section: Contact Info + Form */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 pt-4 border-t border-border">
                    {/* Left Contact Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                            Get in Touch
                        </h2>

                        <div className="space-y-4 text-xs text-muted-foreground">
                            <div className="p-5 rounded-2xl bg-card border border-border flex items-start gap-4">
                                <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-bold text-foreground text-sm">Email Support</h4>
                                    <p className="font-mono mt-0.5">support@bazarhisab.com</p>
                                    <p className="mt-1 text-[11px]">We respond to emails within 24 hours.</p>
                                </div>
                            </div>

                            <div className="p-5 rounded-2xl bg-card border border-border flex items-start gap-4">
                                <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-bold text-foreground text-sm">Phone Helpline</h4>
                                    <p className="font-mono mt-0.5">+880 1700-000000</p>
                                    <p className="mt-1 text-[11px] flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-primary" /> Sun - Thu: 9:00 AM - 6:00 PM
                                    </p>
                                </div>
                            </div>

                            <div className="p-5 rounded-2xl bg-card border border-border flex items-start gap-4">
                                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-bold text-foreground text-sm">Office Location</h4>
                                    <p className="mt-0.5 leading-relaxed">
                                        Level 5, Mirpur Commercial Plaza, Mirpur-10, Dhaka-1216, Bangladesh.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Contact Form */}
                    <div className="lg:col-span-3 p-8 rounded-2xl bg-card border border-border">
                        {submitted ? (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                                <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                                    <CheckCircle2 className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                    Thank You!
                                </h3>
                                <p className="text-xs text-muted-foreground max-w-sm">
                                    Your support ticket has been logged. Our customer care team will reply to your email shortly.
                                </p>
                                <button
                                    onClick={() => {
                                        setSubmitted(false);
                                        setName("");
                                        setEmail("");
                                        setSubject("");
                                        setMessage("");
                                    }}
                                    className="px-6 py-2.5 bg-primary/15 text-primary border border-primary/30 rounded-xl text-xs font-semibold hover:bg-primary hover:text-[#1a0e07] transition-all cursor-pointer mt-4"
                                >
                                    Send Another Message
                                </button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <h2 className="text-xl font-bold text-foreground mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                    Send a Support Message
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5 text-left">
                                        <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Your Name</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Rahim Ahmed"
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-border bg-[#170c05] text-sm text-foreground outline-none focus:border-primary transition-all font-sans"
                                        />
                                    </div>
                                    <div className="space-y-1.5 text-left">
                                        <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Email Address</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="rahim@email.com"
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-border bg-[#170c05] text-sm text-foreground outline-none focus:border-primary transition-all font-sans"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5 text-left">
                                    <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Subject</label>
                                    <input
                                        type="text"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        placeholder="Need help joining group"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-[#170c05] text-sm text-foreground outline-none focus:border-primary transition-all font-sans"
                                    />
                                </div>

                                <div className="space-y-1.5 text-left">
                                    <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Message</label>
                                    <textarea
                                        rows={4}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Describe your issue or request in detail..."
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-[#170c05] text-sm text-foreground outline-none focus:border-primary transition-all font-sans resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3.5 rounded-xl bg-primary text-[#1a0e07] font-bold text-sm hover:bg-accent transition-all cursor-pointer shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        "Sending Ticket..."
                                    ) : (
                                        <>
                                            Submit Message <Send className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Frequently Asked Questions Section */}
                <div className="pt-8 space-y-6">
                    <div className="flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-primary" />
                        <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                            Frequently Asked Questions
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {FAQS.map((faq, idx) => {
                            const isOpen = openFaq === idx;
                            return (
                                <div key={idx} className="rounded-xl border border-border bg-card overflow-hidden">
                                    <button
                                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                                        className="w-full p-4 text-left flex items-center justify-between font-semibold text-sm text-foreground hover:bg-primary/5 transition-colors cursor-pointer"
                                    >
                                        <span>{faq.q}</span>
                                        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180 text-primary" : ""}`} />
                                    </button>
                                    {isOpen && (
                                        <div className="px-4 pb-4 pt-1 text-xs text-muted-foreground leading-relaxed border-t border-border/40">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
        </div>
    );
}
