import React, { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, Star, Send, Sparkles, CheckCircle2, MessageSquare } from "lucide-react";

export function FeedbackView({ onBack }: { onBack?: () => void }) {
    const [fbName, setFbName] = useState("");
    const [fbEmail, setFbEmail] = useState("");
    const [fbRole, setFbRole] = useState("");
    const [fbRating, setFbRating] = useState(5);
    const [fbCategory, setFbCategory] = useState("App Review");
    const [fbMessage, setFbMessage] = useState("");
    const [fbLoading, setFbLoading] = useState(false);
    const [fbSubmitted, setFbSubmitted] = useState(false);

    const handleFeedbackSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFbLoading(true);
        setTimeout(() => {
            setFbLoading(false);
            setFbSubmitted(true);
        }, 1200);
    };

    return (
        <div className="min-h-screen w-full bg-[#130a04] text-[#f5ede2] flex flex-col font-sans">
            {/* Top Header */}
            <header className="sticky top-0 z-50 w-full bg-[#130a04]/90 border-b border-border backdrop-blur-sm select-none">
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

                    <span className="text-sm font-semibold text-muted-foreground">My Bazar Hisab Feedback</span>
                </div>
            </header>

            {/* Document Body */}
            <main className="flex-1 container mx-auto px-6 py-12 max-w-3xl space-y-10">
                {/* Title Section */}
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold font-mono">
                        <Star className="w-3.5 h-3.5 fill-primary" />
                        <span>SHARE YOUR EXPERIENCE & RATING</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        Give Feedback & Review
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Your feedback helps us improve My Bazar Hisab for thousands of households across Bangladesh.
                    </p>
                </div>

                {/* Form Card */}
                <div className="p-8 rounded-2xl bg-card border border-border">
                    {fbSubmitted ? (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="h-full flex flex-col items-center justify-center text-center py-10 space-y-4">
                            <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                                <Sparkles className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                Feedback Submitted!
                            </h3>
                            <p className="text-xs text-muted-foreground max-w-sm">
                                Thank you for rating and sharing your feedback! Your review helps us continuously upgrade the app.
                            </p>
                            <button
                                onClick={() => {
                                    setFbSubmitted(false);
                                    setFbName("");
                                    setFbEmail("");
                                    setFbMessage("");
                                    setFbRole("");
                                    setFbRating(5);
                                }}
                                className="px-6 py-2.5 bg-primary/15 text-primary border border-primary/30 rounded-xl text-xs font-semibold hover:bg-primary hover:text-[#1a0e07] transition-all cursor-pointer mt-4"
                            >
                                Submit Another Review
                            </button>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleFeedbackSubmit} className="space-y-5">
                            {/* Star Rating Picker */}
                            <div className="space-y-1.5 text-left">
                                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Your Rating</label>
                                <div className="flex items-center gap-2 p-3.5 rounded-xl border border-border bg-[#170c05]">
                                    {Array.from({ length: 5 }).map((_, i) => {
                                        const starVal = i + 1;
                                        return (
                                            <button
                                                key={starVal}
                                                type="button"
                                                onClick={() => setFbRating(starVal)}
                                                className="p-1 cursor-pointer transition-transform hover:scale-110"
                                            >
                                                <Star className={`w-7 h-7 ${starVal <= fbRating ? "text-primary fill-primary" : "text-muted-foreground/30"}`} />
                                            </button>
                                        );
                                    })}
                                    <span className="text-sm font-mono text-primary font-bold ml-2">
                                        {fbRating} / 5 Stars
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5 text-left">
                                    <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Your Name</label>
                                    <input
                                        type="text"
                                        value={fbName}
                                        onChange={(e) => setFbName(e.target.value)}
                                        placeholder="Tanvir Hossain"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-[#170c05] text-sm text-foreground outline-none focus:border-primary transition-all font-sans"
                                    />
                                </div>
                                <div className="space-y-1.5 text-left">
                                    <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Feedback Category</label>
                                    <select
                                        value={fbCategory}
                                        onChange={(e) => setFbCategory(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-[#170c05] text-sm text-foreground outline-none focus:border-primary transition-all font-sans cursor-pointer"
                                    >
                                        <option value="App Review">App Review & Rating</option>
                                        <option value="Feature Suggestion">Feature Suggestion</option>
                                        <option value="Bug Report">Bug Report</option>
                                        <option value="General Feedback">General Feedback</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5 text-left">
                                    <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Email Address</label>
                                    <input
                                        type="email"
                                        value={fbEmail}
                                        onChange={(e) => setFbEmail(e.target.value)}
                                        placeholder="tanvir@email.com"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-[#170c05] text-sm text-foreground outline-none focus:border-primary transition-all font-sans"
                                    />
                                </div>
                                <div className="space-y-1.5 text-left">
                                    <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Your Role / Location</label>
                                    <input
                                        type="text"
                                        value={fbRole}
                                        onChange={(e) => setFbRole(e.target.value)}
                                        placeholder="e.g. Family Head • Mirpur"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-[#170c05] text-sm text-foreground outline-none focus:border-primary transition-all font-sans"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5 text-left">
                                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Your Review & Comments</label>
                                <textarea
                                    rows={5}
                                    value={fbMessage}
                                    onChange={(e) => setFbMessage(e.target.value)}
                                    placeholder="Tell us what you love or how we can improve My Bazar Hisab..."
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-border bg-[#170c05] text-sm text-foreground outline-none focus:border-primary transition-all font-sans resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={fbLoading}
                                className="w-full py-3.5 rounded-xl bg-primary text-[#1a0e07] font-bold text-sm hover:bg-accent transition-all cursor-pointer shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                            >
                                {fbLoading ? (
                                    "Submitting Review..."
                                ) : (
                                    <>
                                        Submit Rating & Review <Send className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
}
