"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GroupStats } from "@/types";

// Import original mobile-only screens
import { SplashScreen } from "@/components/screens/SplashScreen";
import { AuthForms } from "@/components/screens/AuthForms";
import { GroupPickerScreen } from "@/components/screens/GroupPickerScreen";
import { AppShell } from "@/components/screens/AppShell";

// Import new dedicated web/desktop components
import { WebAuthForms } from "@/components/web/WebAuthForms";
import { WebGroupPicker } from "@/components/web/WebGroupPicker";
import { WebAppShell } from "@/components/web/WebAppShell";

export default function WebPage() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  // Core Authentication & Data States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [groupStats, setGroupStats] = useState<GroupStats | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  // Handle responsiveness dynamically without routing redirects
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Loading state while checking browser window width
  if (isMobile === null) {
    return (
      <div className="min-h-screen bg-[#1a0e07] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  // 1. Splash loading screen (Unified animation)
  if (showSplash) {
    return <SplashScreen onDone={() => setShowSplash(false)} />;
  }

  // 2. Unauthenticated Login/Register Screen
  if (!isLoggedIn) {
    return (
      <AnimatePresence mode="wait">
        {isMobile ? (
          <motion.div key="auth-mobile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="size-full">
            <AuthForms onLogin={() => setIsLoggedIn(true)} />
          </motion.div>
        ) : (
          <motion.div key="auth-desktop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="size-full">
            <WebAuthForms onLogin={() => setIsLoggedIn(true)} />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // 3. Group Picker Screen (Join/Create)
  if (!groupStats) {
    return (
      <AnimatePresence mode="wait">
        {isMobile ? (
          <motion.div key="group-mobile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="size-full">
            <GroupPickerScreen onGroupReady={s => setGroupStats(s)} />
          </motion.div>
        ) : (
          <motion.div key="group-desktop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="size-full">
            <WebGroupPicker onGroupReady={s => setGroupStats(s)} />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // 4. Authenticated Main Shell Routing (Responsive Dashboard vs Tab Shell)
  return (
    <AnimatePresence mode="wait">
      {isMobile ? (
        <motion.div key="app-mobile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="size-full">
          <AppShell stats={groupStats} />
        </motion.div>
      ) : (
        <motion.div key="app-desktop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="size-full">
          <WebAppShell 
            stats={groupStats} 
            onLogout={() => {
              setIsLoggedIn(false);
              setGroupStats(null);
            }} 
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
