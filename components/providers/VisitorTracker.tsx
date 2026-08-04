"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useTrackVisitMutation } from "@/redux/features/visitor/visitorApi";

export function VisitorTracker() {
    const pathname = usePathname();
    const [trackVisit] = useTrackVisitMutation();
    const lastTrackedPath = useRef<string | null>(null);

    useEffect(() => {
        if (!pathname) return;

        // Prevent duplicate tracking calls for exact same route on component re-renders
        if (lastTrackedPath.current === pathname) return;
        lastTrackedPath.current = pathname;

        trackVisit({
            path: pathname,
            platform: "WEB",
        }).catch(() => {
            // Telemetry error silently ignored to avoid user disruption
        });
    }, [pathname, trackVisit]);

    return null;
}
