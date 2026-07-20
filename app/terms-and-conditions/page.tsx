"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { TermsView } from "@/components/web/landing/TermsView";

export default function TermsAndConditionsPage() {
    const router = useRouter();
    return <TermsView onBack={() => router.push("/web")} />;
}
