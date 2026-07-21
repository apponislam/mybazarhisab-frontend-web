import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/providers/Providers";

export const metadata: Metadata = {
    title: "My Bazar Hisab — Your Market Account Book",
    description: "Track your market expenses, manage bazar accounts, and split bills with your group. Your complete market hisab companion.",
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
