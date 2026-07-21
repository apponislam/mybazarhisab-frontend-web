"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { GroupStats } from "@/types";
import { useAppSelector } from "@/redux/hooks";
import { currentUser, currentToken } from "@/redux/features/auth/authSlice";
import { makeMockStats } from "@/lib/mockData";

// Import original mobile-only screens
import { SplashScreen } from "@/components/app/screens/SplashScreen";
import { AuthForms } from "@/components/app/screens/AuthForms";
import { GroupPickerScreen } from "@/components/app/screens/GroupPickerScreen";
import { AppShell } from "@/components/app/screens/AppShell";

export default function AppPage() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  // Redux Authentication State
  const user = useAppSelector(currentUser);
  const token = useAppSelector(currentToken);
  const isLoggedIn = Boolean(user && token);

  const [groupStats, setGroupStats] = useState<GroupStats | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  // If user already has a groupId, initialize default group stats
  useEffect(() => {
    if (user?.groupId && !groupStats) {
      setGroupStats(makeMockStats("My Bazar Group"));
    }
  }, [user, groupStats]);

  // Handle responsiveness dynamically with routing redirects
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        router.replace("/web");
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

  // If desktop, show a loading screen during the redirection transition
  if (!isMobile) {
    return (
      <div className="min-h-screen bg-[#1a0e07] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  // 1. Splash loading screen (Mobile only)
  if (showSplash) {
    return <SplashScreen onDone={() => setShowSplash(false)} />;
  }

  // 2. Unauthenticated Login/Register Screen
  if (!isLoggedIn) {
    return (
      <AnimatePresence mode="wait">
        <motion.div key="auth-mobile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="size-full">
          <AuthForms onLogin={() => {}} />
        </motion.div>
      </AnimatePresence>
    );
  }

  // 3. Group Picker Screen (Join/Create)
  if (!groupStats) {
    return (
      <AnimatePresence mode="wait">
        <motion.div key="group-mobile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="size-full">
          <GroupPickerScreen 
            onGroupReady={s => setGroupStats(s)} 
            onLogout={() => {
              setGroupStats(null);
            }} 
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  // 4. Authenticated Main Shell Routing
  return (
    <AnimatePresence mode="wait">
      <motion.div key="app-mobile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="size-full">
        <AppShell stats={groupStats} />
      </motion.div>
    </AnimatePresence>
  );
}
