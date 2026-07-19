"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const checkScreen = () => {
      if (window.innerWidth < 768) {
        router.replace("/app");
      } else {
        router.replace("/web");
      }
    };

    checkScreen();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#1a0e07] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );
}
