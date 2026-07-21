"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { GroupStats } from "@/types";

// Import new dedicated web/desktop components
import { WebLandingPage } from "@/components/web/WebLandingPage";
import { WebAuthForms } from "@/components/web/WebAuthForms";
import { WebGroupPicker } from "@/components/web/WebGroupPicker";
import { WebAppShell } from "@/components/web/WebAppShell";

export default function WebPage() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  // Core Authentication & Data States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [groupStats, setGroupStats] = useState<GroupStats | null>(null);
  const [showLanding, setShowLanding] = useState(true);

  // Handle responsiveness dynamically with routing redirects
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        router.replace("/app");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [router]);

  // Loading state while checking browser window width
  if (isMobile === null) {
    return (
      <div className="min-h-screen bg-[#1a0e07] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  // If mobile, show a loading screen during the redirection transition
  if (isMobile) {
    return (
      <div className="min-h-screen bg-[#1a0e07] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  // 1. Unauthenticated Login/Register/Landing Screen
  if (!isLoggedIn) {
    if (showLanding) {
      return (
        <AnimatePresence mode="wait">
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="size-full">
            <WebLandingPage onSignIn={() => setShowLanding(false)} />
          </motion.div>
        </AnimatePresence>
      );
    }

    return (
      <AnimatePresence mode="wait">
        <motion.div key="auth-desktop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="size-full">
          <WebAuthForms 
            onLogin={() => setIsLoggedIn(true)} 
            onBack={() => setShowLanding(true)}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  // 2. Group Picker Screen (Join/Create)
  if (!groupStats) {
    return (
      <AnimatePresence mode="wait">
        <motion.div key="group-desktop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="size-full">
          <WebGroupPicker 
            onGroupReady={s => setGroupStats(s)} 
            onLogout={() => {
              setIsLoggedIn(false);
              setShowLanding(true);
            }} 
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  // 3. Authenticated Main Shell Routing (Responsive Dashboard vs Tab Shell)
  return (
    <AnimatePresence mode="wait">
      <motion.div key="app-desktop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="size-full">
        <WebAppShell 
          stats={groupStats} 
          onLogout={() => {
            setIsLoggedIn(false);
            setGroupStats(null);
            setShowLanding(true); // Return to landing page on logout
          }} 
        />
      </motion.div>
    </AnimatePresence>
  );
}
