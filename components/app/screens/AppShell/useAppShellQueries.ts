import React, { useState } from "react";
import { AppTab } from "@/types";
import { useGetAllBazarEntriesQuery } from "@/redux/features/bazar-entry/bazarEntryApi";
import { useGetAllBillsQuery } from "@/redux/features/bill/billApi";
import { useGetMeQuery } from "@/redux/features/auth/authApi";
import { useGetUserDashboardStatsQuery } from "@/redux/features/dashboard/dashboardApi";
import { useAppShellData } from "./useAppShellData";

export function useAppShellQueries(tab: AppTab) {
    const [expensePage, setExpensePage] = useState(1);
    const [billPage, setBillPage] = useState(1);
    const [expenseFilter, setExpenseFilter] = useState<"month" | "all">("month");
    const [billFilter, setBillFilter] = useState<"month" | "all">("month");

    // Dashboard stats query for Home tab
    const { data: dashboardData, isLoading: isDashboardLoading } = useGetUserDashboardStatsQuery(undefined, {
        skip: tab !== "home",
    });

    // Live RTK Query hooks matching WebAppShell exactly
    const {
        data: bazarData,
        isLoading: isBazarLoading,
        isFetching: isBazarFetching,
    } = useGetAllBazarEntriesQuery(
        {
            filter: expenseFilter === "all" ? "ALL" : undefined,
            page: expensePage,
            limit: 10,
        },
        { skip: tab !== "expenses" },
    );

    const {
        data: billData,
        isLoading: isBillLoading,
        isFetching: isBillFetching,
    } = useGetAllBillsQuery(
        {
            filter: billFilter === "all" ? "ALL" : undefined,
            page: billPage,
            limit: 10,
        },
        { skip: tab !== "bills" },
    );

    const { data: userData } = useGetMeQuery();
    const currentUser = userData?.data;

    const { entries, bills } = useAppShellData(bazarData, billData);

    return {
        expensePage,
        setExpensePage,
        billPage,
        setBillPage,
        expenseFilter,
        setExpenseFilter,
        billFilter,
        setBillFilter,
        isDashboardLoading,
        dashboardStats: dashboardData?.data,
        isBazarLoading,
        isBazarFetching,
        isBillLoading,
        isBillFetching,
        currentUser,
        entries,
        bills,
    };
}
