"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { GroupStats } from "@/types";
import { SplashScreen } from "@/components/screens/SplashScreen";
import { AuthForms } from "@/components/screens/AuthForms";
import { GroupPickerScreen } from "@/components/screens/GroupPickerScreen";
import { AppShell } from "@/components/screens/AppShell";

export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [groupStats, setGroupStats] = useState<GroupStats | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onDone={() => setShowSplash(false)} />;
  }

  if (!isLoggedIn) {
    return (
      <motion.div key="auth" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }} className="size-full">
        <AuthForms onLogin={() => setIsLoggedIn(true)} />
      </motion.div>
    );
  }

  if (!groupStats) {
    return (
      <motion.div key="group" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }} className="size-full">
        <GroupPickerScreen onGroupReady={s => setGroupStats(s)} />
      </motion.div>
    );
  }

  return (
    <motion.div key="app" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="size-full">
      <AppShell stats={groupStats} />
    </motion.div>
  );
}
