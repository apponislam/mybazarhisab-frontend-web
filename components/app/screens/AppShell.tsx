import React, { useState } from "react";
import { GroupStats, AppTab, AppSubScreen, MockBazarEntry, MockBill } from "@/types";
import { ScreenShell } from "@/components/app/ui/Shared";
import { HomeTab } from "@/components/app/tabs/HomeTab";
import { ExpensesTab } from "@/components/app/tabs/ExpensesTab";
import { BillsTab } from "@/components/app/tabs/BillsTab";
import { ProfileTab } from "@/components/app/tabs/ProfileTab";

import { AppBottomNav } from "@/components/app/screens/AppShell/AppBottomNav";
import { AppAddPicker } from "@/components/app/screens/AppShell/AppAddPicker";
import { AppSubScreenRenderer } from "@/components/app/screens/AppShell/AppSubScreenRenderer";
import { useAppShellQueries } from "@/components/app/screens/AppShell/useAppShellQueries";

// ─── App Shell ────────────────────────────────────────────────────────────────

export function AppShell({ stats }: { stats: GroupStats }) {
    const [tab, setTab] = useState<AppTab>("home");
    const [subScreen, setSubScreen] = useState<AppSubScreen>(null);

    // Custom Hook encapsulating RTK Query endpoints & data transformers
    const { isBazarLoading, isBillLoading, currentUser, entries, bills, expenseFilter, setExpenseFilter, billFilter, setBillFilter } = useAppShellQueries(tab);

    const [selectedEntry, setSelectedEntry] = useState<MockBazarEntry | null>(null);
    const [selectedBill, setSelectedBill] = useState<MockBill | null>(null);

    const showNav = subScreen === null || subScreen === "add-picker";

    const computedStats = React.useMemo(() => {
        const myUserId = currentUser?._id;
        const myEntries = entries.filter((e) => e.user.id === myUserId || !myUserId);

        const totalBazar = entries.reduce((sum, e) => sum + e.price * e.quantity, 0);
        const totalBill = bills.reduce((sum, b) => sum + b.amount, 0);

        return {
            groupName: stats?.groupName || "My Bazar Group",
            totalMembers: stats?.totalMembers || 1,
            totalGroupBazarEntries: entries.length,
            totalMyBazarEntries: myEntries.length,
            totalProductsCreatedByMe: new Set(myEntries.map((e) => e.product.name)).size,
            thisMonthBazarExpense: totalBazar,
            prevMonthBazarExpense: 0,
            thisYearBazarExpense: totalBazar,
            prevYearBazarExpense: 0,
            thisMonthBillExpense: totalBill,
            prevMonthBillExpense: 0,
            thisYearBillExpense: totalBill,
            prevYearBillExpense: 0,
            thisMonthTotalExpense: totalBazar + totalBill,
            prevMonthTotalExpense: 0,
            thisYearTotalExpense: totalBazar + totalBill,
            prevYearTotalExpense: 0,
        };
    }, [entries, bills, stats, currentUser]);

    // Subscreen overlay rendering
    if (subScreen && subScreen !== "add-picker") {
        return (
            <AppSubScreenRenderer
                subScreen={subScreen}
                setSubScreen={setSubScreen}
                selectedEntry={selectedEntry}
                setSelectedEntry={setSelectedEntry}
                selectedBill={selectedBill}
                setSelectedBill={setSelectedBill}
                setTab={setTab}
            />
        );
    }

    return (
        <ScreenShell>
            <div className="flex flex-col flex-1 min-h-0 relative">
                <div className="flex-1 min-h-0 relative flex flex-col">
                    {tab === "home" && <HomeTab stats={computedStats} />}
                    {tab === "expenses" && (
                        <ExpensesTab
                            entries={entries}
                            isLoading={isBazarLoading}
                            filter={expenseFilter}
                            setFilter={setExpenseFilter}
                            onDetail={(e) => {
                                setSelectedEntry(e);
                                setSubScreen("expense-detail");
                            }}
                        />
                    )}
                    {tab === "bills" && (
                        <BillsTab
                            bills={bills}
                            isLoading={isBillLoading}
                            filter={billFilter}
                            setFilter={setBillFilter}
                            onDetail={(b) => {
                                setSelectedBill(b);
                                setSubScreen("bill-detail");
                            }}
                        />
                    )}
                    {tab === "profile" && <ProfileTab onEditProfile={() => setSubScreen("profile-edit")} onChangePassword={() => setSubScreen("profile-change-password")} />}
                    {subScreen === "add-picker" && <AppAddPicker onExpense={() => setSubScreen("add-expense")} onBill={() => setSubScreen("add-bill")} onClose={() => setSubScreen(null)} />}
                </div>
                {showNav && (
                    <AppBottomNav
                        tab={tab}
                        onTab={(t) => {
                            setTab(t);
                            setSubScreen(null);
                        }}
                        onAdd={() => setSubScreen("add-picker")}
                    />
                )}
            </div>
        </ScreenShell>
    );
}
export default AppShell;
