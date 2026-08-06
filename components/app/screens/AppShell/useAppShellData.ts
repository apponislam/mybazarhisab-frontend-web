import React from "react";
import { MockBazarEntry, MockBill } from "@/types";

export function useAppShellData(bazarData: any, billData: any) {
    const entries: MockBazarEntry[] = React.useMemo(() => {
        if (!bazarData?.data || !Array.isArray(bazarData.data)) {
            return [];
        }
        return bazarData.data.map((item: any) => ({
            id: item._id,
            product: {
                id: item.product?._id || item._id,
                name: item.name || item.product?.name || "Bazar Item",
                emoji: item.product?.emoji || "🛒",
            },
            price: item.price,
            totalPrice: item.totalPrice ?? (item.price ? item.price * item.quantity : undefined),
            quantity: item.quantity,
            unit: item.unit || "KG",
            date: new Date(item.date || Date.now()),
            notes: item.notes,
            user: {
                id: item.user?._id || item.user || "u1",
                name: item.user?.name || "User",
                email: item.user?.email || "",
                profileImage: item.user?.profileImage,
            },
        }));
    }, [bazarData]);

    const bills: MockBill[] = React.useMemo(() => {
        if (!billData?.data || !Array.isArray(billData.data)) {
            return [];
        }
        return billData.data.map((item: any) => ({
            id: item._id,
            category: item.category || "RENT",
            title: item.title || "Bill Item",
            amount: item.amount || 0,
            date: new Date(item.date || Date.now()),
            notes: item.notes,
            user: {
                id: item.user?._id || item.user || "u1",
                name: item.user?.name || "User",
                email: item.user?.email || "",
                profileImage: item.user?.profileImage,
            },
        }));
    }, [billData]);

    return { entries, bills };
}
