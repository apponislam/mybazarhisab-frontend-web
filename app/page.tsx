"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootRedirector() {
  const router = useRouter();

  useEffect(() => {
    const handleRedirect = () => {
      if (window.innerWidth < 768) {
        router.replace("/web");
      } else {
        router.replace("/app");
      }
    };

    // Run on mount
    handleRedirect();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#1a0e07] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-muted-foreground text-sm font-medium font-sans animate-pulse">Loading Bazar Hisab...</p>
      </div>
    </div>
  );
}
