import React from "react";

export default function WebLayoutWrapper({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen w-full flex bg-[#1a0e07] text-[#f5ede2] overflow-hidden">
            {/* Left Side — Hero Image Panel (Desktop only) */}
            <div className="hidden md:flex md:w-[45%] lg:w-[50%] relative shrink-0 overflow-hidden select-none">
                {/* Warm overlay gradient blending into right side */}
                <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, #1a0e07 0%, transparent 25%)" }} />
                <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: "linear-gradient(to top, #1a0e07 0%, transparent 30%)" }} />

                {/* Hero image fills */}
                <img src="/assets/auth-hero.png" alt="Bazar Hisab — shared kitchen table with groceries" className="w-full h-full object-cover" />

                {/* Bottom brand tag */}
                <div className="absolute bottom-6 left-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-[#1a0e07]/70 backdrop-blur-sm">
                    <img src="/assets/logo.png" alt="Logo" className="w-5 h-5 rounded-md object-contain" />
                    <span className="text-xs font-bold text-foreground" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                        My Bazar <span className="text-primary">Hisab</span>
                    </span>
                </div>
            </div>

            {/* Right Side — Form Content centered in the middle of right 50% */}
            <div className="flex-1 flex flex-col justify-center items-center overflow-y-auto px-6 sm:px-8 md:px-12 py-8 sm:py-12 relative">
                {/* Subtle dot grid background */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle, #e8a020 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

                <div className="w-full max-w-105 relative z-10">{children}</div>
            </div>
        </div>
    );
}
