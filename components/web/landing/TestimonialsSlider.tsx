import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

export const TESTIMONIALS = [
    {
        name: "Rafiqul Islam",
        role: "Family Head • Mirpur, Dhaka",
        rating: 5,
        comment: "No more confusion about who spent how much for monthly groceries. My Bazar Hisab has saved our family from endless end-of-month tally arguments!",
        avatar: "👨‍👩‍👧‍👦"
    },
    {
        name: "Tanvir Hossain",
        role: "Bachelor Flat Manager • Uttara",
        rating: 5,
        comment: "Managing 4 mess members' daily meal & bazar money used to be a headache. Now everyone logs their own receipts right from their phones in seconds.",
        avatar: "🏢"
    },
    {
        name: "Nusrat Jahan",
        role: "Homemaker • Chattogram",
        rating: 5,
        comment: "The yearly expense comparisons helped us realize how much we were overspending on groceries. Highly recommended app for budget control!",
        avatar: "🏡"
    },
    {
        name: "Sajjad Rahman",
        role: "Software Engineer • Dhanmondi",
        rating: 5,
        comment: "The UI is incredibly slick and dark-mode friendly! Split bill tracking for our shared apartment has never been this smooth and transparent.",
        avatar: "💻"
    },
    {
        name: "Farhana Akter",
        role: "University Student • Sylhet",
        rating: 5,
        comment: "Super convenient to track market items with exact units (KG, GM, Litre). It keeps our joint house budget totally organized.",
        avatar: "🎓"
    },
    {
        name: "Kazi Anisur",
        role: "Small Business Owner • Rajshahi",
        rating: 5,
        comment: "Finally a tool built specifically for Bangladeshi bazar accounting. The group ledger feature keeps everyone accountable and transparent.",
        avatar: "🛒"
    }
];

export function TestimonialsSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const total = TESTIMONIALS.length;

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % total);
    }, [total]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + total) % total);
    }, [total]);

    useEffect(() => {
        if (isHovered) return;
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, [nextSlide, isHovered]);

    // Cards visible on desktop (3 items wrapped circularly)
    const visibleCards = [
        TESTIMONIALS[currentIndex],
        TESTIMONIALS[(currentIndex + 1) % total],
        TESTIMONIALS[(currentIndex + 2) % total],
    ];

    return (
        <div
            className="w-full relative group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* 3-Card Grid Slider (Desktop: 3 cards, Mobile: 1 card) */}
            <div className="relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 25 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -25 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {visibleCards.map((rev, i) => (
                            <div
                                key={`${rev.name}-${i}`}
                                className={`p-8 rounded-3xl bg-card/40 border border-primary/10 hover:border-primary/30 hover:bg-card/70 transition-all duration-300 shadow-xl flex flex-col justify-between ${
                                    i > 0 ? "hidden md:flex" : "flex"
                                }`}
                            >
                                <div>
                                    <div className="flex items-center gap-1 mb-4">
                                        {Array.from({ length: rev.rating }).map((_, starIdx) => (
                                            <Star key={starIdx} className="w-4 h-4 text-primary fill-primary" />
                                        ))}
                                    </div>
                                    <p className="text-muted-foreground text-xs leading-relaxed italic mb-6">"{rev.comment}"</p>
                                </div>
                                <div className="flex items-center gap-3 pt-4 border-t border-[rgba(232,160,32,0.06)]">
                                    <div className="w-10 h-10 rounded-full bg-[#170c05] border border-primary/20 flex items-center justify-center text-lg">{rev.avatar}</div>
                                    <div>
                                        <h4 className="text-xs font-bold text-foreground">{rev.name}</h4>
                                        <p className="text-[10px] text-muted-foreground font-mono">{rev.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Slider Controls: Arrows & Page Indicators */}
            <div className="flex items-center justify-between mt-10 px-2 select-none">
                <button
                    onClick={prevSlide}
                    aria-label="Previous reviews"
                    className="w-11 h-11 rounded-full border border-primary/20 bg-[#170c05] text-foreground hover:bg-primary hover:text-[#1a0e07] hover:border-transparent transition-all flex items-center justify-center cursor-pointer shadow-lg active:scale-95"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Indicator Dots */}
                <div className="flex items-center gap-2">
                    {TESTIMONIALS.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            aria-label={`Go to slide ${idx + 1}`}
                            className="transition-all duration-300 rounded-full cursor-pointer"
                            style={{
                                width: idx === currentIndex ? 26 : 8,
                                height: 8,
                                backgroundColor: idx === currentIndex ? "#e8a020" : "rgba(232,160,32,0.2)"
                            }}
                        />
                    ))}
                </div>

                <button
                    onClick={nextSlide}
                    aria-label="Next reviews"
                    className="w-11 h-11 rounded-full border border-primary/20 bg-[#170c05] text-foreground hover:bg-primary hover:text-[#1a0e07] hover:border-transparent transition-all flex items-center justify-center cursor-pointer shadow-lg active:scale-95"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
