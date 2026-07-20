"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { PrivacyPolicyView } from "@/components/web/landing/PrivacyPolicyView";

export default function PrivacyPolicyPage() {
    const router = useRouter();
    return <PrivacyPolicyView onBack={() => router.push("/web")} />;
}
