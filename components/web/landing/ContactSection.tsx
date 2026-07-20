import React, { useState } from "react";
import { motion } from "motion/react";
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from "lucide-react";

export function ContactSection() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 1200);
    };

    return (
        <section id="contact" className="relative z-10 py-24 select-none border-t border-[rgba(232,160,32,0.06)] bg-linear-to-b from-transparent via-[#1c0f07]/40 to-transparent">
            <div className="container mx-auto px-6 md:px-8">
                <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold font-mono">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WE WOULD LOVE TO HEAR FROM YOU</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        Contact & Support
                    </h2>
                    <p className="text-muted-foreground text-sm">
                        Have questions, feature requests, or need support for your family group account? Send us a message below.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-5xl mx-auto">
                    {/* Left 2 columns: Contact Info Cards */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="p-6 rounded-3xl bg-card/40 border border-primary/15 shadow-xl flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
                                <Mail className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-foreground mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                    Email Support
                                </h4>
                                <p className="text-xs text-muted-foreground font-mono">support@bazarhisab.com</p>
                                <p className="text-[11px] text-muted-foreground mt-1">24/7 Response for active groups</p>
                            </div>
                        </div>

                        <div className="p-6 rounded-3xl bg-card/40 border border-primary/15 shadow-xl flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
                                <Phone className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-foreground mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                    Phone & Helpline
                                </h4>
                                <p className="text-xs text-muted-foreground font-mono">+880 1700-000000</p>
                                <p className="text-[11px] text-muted-foreground mt-1">Sun - Thu: 9:00 AM - 6:00 PM</p>
                            </div>
                        </div>

                        <div className="p-6 rounded-3xl bg-card/40 border border-primary/15 shadow-xl flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
                                <MapPin className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-foreground mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                    Head Office
                                </h4>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Level 5, Mirpur Commercial Plaza, Mirpur-10, Dhaka-1216, Bangladesh.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right 3 columns: Contact Form */}
                    <div className="lg:col-span-3 p-8 rounded-3xl bg-card/60 border border-primary/20 shadow-2xl backdrop-blur-xl relative">
                        {submitted ? (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                                <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                                    <CheckCircle2 className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                    Message Sent!
                                </h3>
                                <p className="text-xs text-muted-foreground max-w-sm">
                                    Thank you for contacting My Bazar Hisab. Our support team will get back to you shortly.
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
                                <h3 className="text-xl font-bold text-foreground mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                    Send Us a Message
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5 text-left">
                                        <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Your Name</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Rahim Ahmed"
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-[#170c05] text-sm text-foreground outline-none focus:border-primary transition-all font-sans"
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
                                            className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-[#170c05] text-sm text-foreground outline-none focus:border-primary transition-all font-sans"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5 text-left">
                                    <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Subject</label>
                                    <input
                                        type="text"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        placeholder="Question about family group limits"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-[#170c05] text-sm text-foreground outline-none focus:border-primary transition-all font-sans"
                                    />
                                </div>

                                <div className="space-y-1.5 text-left">
                                    <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Your Message</label>
                                    <textarea
                                        rows={4}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Write your message or feedback here..."
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-[#170c05] text-sm text-foreground outline-none focus:border-primary transition-all font-sans resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3.5 rounded-xl bg-linear-to-r from-primary to-orange-500 hover:from-accent hover:to-orange-600 text-[#1a0e07] font-bold text-sm transition-all cursor-pointer shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        "Sending Message..."
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
            </div>
        </section>
    );
}
