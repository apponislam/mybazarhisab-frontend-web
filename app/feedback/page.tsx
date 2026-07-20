"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FeedbackView } from "@/components/web/landing/FeedbackView";

export default function FeedbackPage() {
    const router = useRouter();
    return <FeedbackView onBack={() => router.push("/web")} />;
}
