import React from "react";
import { Star } from "lucide-react";
import { TestimonialsSlider } from "./TestimonialsSlider";

export function RatingsSection() {
    return (
        <section id="ratings" className="relative z-10 py-24 select-none border-t border-[rgba(232,160,32,0.06)]">
            <div className="container mx-auto px-6 md:px-8">
                <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold font-mono">
                        <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                        <span>4.9 / 5.0 RATING BY HOUSEHOLDS</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        Loved by Families & Roommates
                    </h2>
                    <p className="text-muted-foreground text-sm">
                        Here is what households across Bangladesh say about managing their daily market expenses with My Bazar Hisab.
                    </p>
                </div>

                <TestimonialsSlider />
            </div>
        </section>
    );
}
