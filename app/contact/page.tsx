"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ContactView } from "@/components/web/landing/ContactView";

export default function ContactPage() {
    const router = useRouter();
    return <ContactView onBack={() => router.push("/web")} />;
}
