import store from "../redux/store";
import { toast } from "sonner";

export async function fetchAndDownloadStatement({
    startDate,
    endDate,
    format,
}: {
    startDate: string;
    endDate: string;
    format: "html" | "pdf";
}) {
    const token = store.getState().auth?.token;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://mybazarhisab-backend.vercel.app";
    const url = `${baseUrl}/api/v1/dashboard/statement?startDate=${startDate}&endDate=${endDate}&format=${format}`;

    const headers: Record<string, string> = {};
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(url, {
        method: "GET",
        headers,
        credentials: "include",
    });

    if (!res.ok) {
        const errorJson = await res.json().catch(() => null);
        throw new Error(errorJson?.message || `Failed to download statement (${res.status})`);
    }

    if (format === "pdf") {
        const blob = await res.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.setAttribute("download", `bazar_hisab_statement_${startDate}_to_${endDate}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
        toast.success("Statement PDF downloaded successfully!");
    } else {
        const htmlText = await res.text();
        const blob = new Blob([htmlText], { type: "text/html" });
        const blobUrl = window.URL.createObjectURL(blob);
        const newWindow = window.open(blobUrl, "_blank");
        if (!newWindow) {
            toast.error("Pop-up blocked! Please allow pop-ups for this site.");
        } else {
            toast.success("Statement opened in new tab!");
        }
    }
}
