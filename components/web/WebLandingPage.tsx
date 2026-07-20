import React, { useState } from "react";
import { WebHeader } from "./landing/WebHeader";
import { HeroSection } from "./landing/HeroSection";
import { FeaturesSection } from "./landing/FeaturesSection";
import { HowItWorksSection } from "./landing/HowItWorksSection";
import { BenefitsSection } from "./landing/BenefitsSection";
import { RatingsSection } from "./landing/RatingsSection";
import { ContactSection } from "./landing/ContactSection";
import { CtaBanner } from "./landing/CtaBanner";
import { WebFooter } from "./landing/WebFooter";
import { PrivacyPolicyView } from "./landing/PrivacyPolicyView";
import { TermsView } from "./landing/TermsView";

export function WebLandingPage({ onSignIn }: { onSignIn: () => void }) {
    const [view, setView] = useState<"home" | "privacy" | "terms">("home");

    if (view === "privacy") {
        return <PrivacyPolicyView onBack={() => setView("home")} />;
    }

    if (view === "terms") {
        return <TermsView onBack={() => setView("home")} />;
    }

    return (
        <div className="min-h-screen bg-[#130a04] text-[#f5ede2] flex flex-col font-sans overflow-x-hidden selection:bg-primary selection:text-primary-foreground relative">
            {/* ─── FLOATING AMBIENT ORBS & BACKGROUNDS ─────────────────────────────────── */}
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] pointer-events-none animate-pulse" style={{ animationDuration: "10s" }} />
            <div className="absolute top-[35%] right-[-10%] w-[700px] h-[700px] bg-accent/8 rounded-full blur-[160px] pointer-events-none animate-pulse" style={{ animationDuration: "14s" }} />
            <div className="absolute bottom-[15%] left-[-15%] w-[550px] h-[550px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Grid Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle, #e8a020 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

            {/* Modular Landing Page Sections */}
            <WebHeader onSignIn={onSignIn} />
            <HeroSection onSignIn={onSignIn} />
            <FeaturesSection />
            <HowItWorksSection />
            <BenefitsSection />
            <RatingsSection />
            <ContactSection />
            <CtaBanner onSignIn={onSignIn} />
            <WebFooter
                onSignIn={onSignIn}
                onOpenPrivacy={() => setView("privacy")}
                onOpenTerms={() => setView("terms")}
            />
        </div>
    );
}

export default WebLandingPage;
