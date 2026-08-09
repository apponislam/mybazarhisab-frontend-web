import React from "react";
import { AppSubScreen, MockBazarEntry, MockBill } from "@/types";
import { AddExpenseScreen } from "@/components/app/screens/AddExpenseScreen";
import { AddMultipleExpenseScreen } from "@/components/app/screens/AddMultipleExpenseScreen";
import { AddBillScreen } from "@/components/app/screens/AddBillScreen";
import { AddMultipleBillScreen } from "@/components/app/screens/AddMultipleBillScreen";
import { ExpenseDetailScreen } from "@/components/app/screens/ExpenseDetailScreen";
import { ExpenseEditScreen } from "@/components/app/screens/ExpenseEditScreen";
import { BillDetailScreen } from "@/components/app/screens/BillDetailScreen";
import { BillEditScreen } from "@/components/app/screens/BillEditScreen";
import { EditProfileScreen } from "@/components/app/screens/EditProfileScreen";
import { ChangePasswordScreen } from "@/components/app/screens/ChangePasswordScreen";
import { GroupScreen } from "@/components/app/screens/GroupScreen";
import { NotificationsScreen } from "@/components/app/screens/NotificationsScreen";
import { CalendarScreen } from "@/components/app/screens/CalendarScreen";

export function AppSubScreenRenderer({
    subScreen,
    setSubScreen,
    selectedEntry,
    setSelectedEntry,
    selectedBill,
    setSelectedBill,
    setTab,
}: {
    subScreen: AppSubScreen;
    setSubScreen: (s: AppSubScreen) => void;
    selectedEntry: MockBazarEntry | null;
    setSelectedEntry: (e: MockBazarEntry | null) => void;
    selectedBill: MockBill | null;
    setSelectedBill: (b: MockBill | null) => void;
    setTab: (t: any) => void;
}) {
    if (subScreen === "expense-detail" && selectedEntry) {
        return (
            <ExpenseDetailScreen
                entry={selectedEntry}
                onBack={() => setSubScreen(null)}
                onEdit={() => setSubScreen("expense-edit")}
                onDelete={() => {
                    setSelectedEntry(null);
                    setSubScreen(null);
                }}
            />
        );
    }
    if (subScreen === "expense-edit" && selectedEntry) {
        return (
            <ExpenseEditScreen
                entry={selectedEntry}
                onBack={() => setSubScreen("expense-detail")}
                onSave={(updated) => {
                    setSelectedEntry(updated);
                    setSubScreen("expense-detail");
                }}
            />
        );
    }
    if (subScreen === "bill-detail" && selectedBill) {
        return (
            <BillDetailScreen
                bill={selectedBill}
                onBack={() => setSubScreen(null)}
                onEdit={() => setSubScreen("bill-edit")}
                onDelete={() => {
                    setSelectedBill(null);
                    setSubScreen(null);
                }}
            />
        );
    }
    if (subScreen === "bill-edit" && selectedBill) {
        return (
            <BillEditScreen
                bill={selectedBill}
                onBack={() => setSubScreen("bill-detail")}
                onSave={(updated) => {
                    setSelectedBill(updated);
                    setSubScreen("bill-detail");
                }}
            />
        );
    }
    if (subScreen === "add-expense")
        return (
            <AddExpenseScreen
                onBack={() => setSubScreen("add-picker")}
                onAddMultiple={() => setSubScreen("add-multiple-expense")}
                onDone={() => {
                    setSubScreen(null);
                    setTab("expenses");
                }}
            />
        );
    if (subScreen === "add-multiple-expense")
        return (
            <AddMultipleExpenseScreen
                onBack={() => setSubScreen("add-expense")}
                onDone={() => {
                    setSubScreen(null);
                    setTab("expenses");
                }}
            />
        );
    if (subScreen === "add-bill")
        return (
            <AddBillScreen
                onBack={() => setSubScreen("add-picker")}
                onAddMultiple={() => setSubScreen("add-multiple-bill")}
                onDone={() => {
                    setSubScreen(null);
                    setTab("bills");
                }}
            />
        );
    if (subScreen === "add-multiple-bill")
        return (
            <AddMultipleBillScreen
                onBack={() => setSubScreen("add-bill")}
                onDone={() => {
                    setSubScreen(null);
                    setTab("bills");
                }}
            />
        );
    if (subScreen === "profile-edit") return <EditProfileScreen onBack={() => setSubScreen(null)} />;
    if (subScreen === "profile-change-password") return <ChangePasswordScreen onBack={() => setSubScreen(null)} />;
    if (subScreen === "profile-group") return <GroupScreen onBack={() => setSubScreen(null)} />;
    if (subScreen === "profile-notifications") return <NotificationsScreen onBack={() => setSubScreen(null)} />;
    if (subScreen === "profile-calendar") return <CalendarScreen onBack={() => setSubScreen(null)} />;

    return null;
}
