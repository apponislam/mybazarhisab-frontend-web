import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "@/components/providers/Providers";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mybazarhisab.apponislam.top";

export const viewport: Viewport = {
    themeColor: "#ea580c",
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
};

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: "My Bazar Hisab — Your Family & Group Market Expense Tracker",
        template: "%s | My Bazar Hisab",
    },
    description: "Track daily bazar expenses, manage family monthly budgets, calculate fixed utility bills, and view real-time expense calendars for your household or group.",
    keywords: ["Bazar Hisab", "Market Expense Tracker", "Daily Bazar Account", "Family Budget Planner", "Group Expense Splitter", "Mess Hisab", "Grocery Budget Manager", "Bangladesh Bazar Manager"],
    authors: [{ name: "Appon Islam" }],
    creator: "My Bazar Hisab",
    publisher: "My Bazar Hisab",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    icons: {
        icon: "/assets/logo.png",
        shortcut: "/assets/logo.png",
        apple: "/assets/logo.png",
    },
    openGraph: {
        title: "My Bazar Hisab — Your Family & Group Market Expense Tracker",
        description: "Track daily bazar expenses, manage family monthly budgets, calculate fixed utility bills, and view real-time expense calendars for your household or group.",
        url: siteUrl,
        siteName: "My Bazar Hisab",
        images: [
            {
                url: "/assets/logo.png",
                width: 512,
                height: 512,
                alt: "My Bazar Hisab Logo",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "My Bazar Hisab — Market Expense & Group Hisab Tracker",
        description: "Effortlessly manage daily grocery purchases, fixed bills, and group budgets with real-time analytics.",
        creator: "@mybazarhisab",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="h-full antialiased" suppressHydrationWarning={true}>
            <body className="h-full" suppressHydrationWarning={true}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
