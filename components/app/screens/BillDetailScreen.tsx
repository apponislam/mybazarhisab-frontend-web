import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Edit3, Trash2, Calendar, CreditCard, AlignLeft } from "lucide-react";
import { MockBill } from "@/types";
import { ScreenShell, Avatar, DeleteConfirm } from "@/components/app/ui/Shared";
import { fmtFull, fmtDate, BILL_META } from "@/lib/mockData";

export function BillDetailScreen({ bill, onBack, onEdit, onDelete }: { bill: MockBill; onBack: () => void; onEdit: () => void; onDelete: () => void }) {
    const meta = BILL_META[bill.category];
    const [confirmDelete, setConfirmDelete] = useState(false);

    return (
        <ScreenShell scrollable>
            <div className="flex flex-col px-6 pt-12 pb-8">
                <div className="flex items-center justify-between mb-6">
                    <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm cursor-pointer" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        <ArrowLeft className="w-4 h-4" /> Bills
                    </button>
                    <div className="flex items-center gap-2">
                        <button type="button" onClick={onEdit} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/40 text-primary text-sm font-medium hover:bg-primary/10 transition-all cursor-pointer" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                            <Edit3 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button type="button" onClick={() => setConfirmDelete(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-destructive/40 text-destructive text-sm font-medium hover:bg-destructive/10 transition-all cursor-pointer" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} className="rounded-3xl border p-6 mb-5 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${meta.color}18 0%, ${meta.color}06 100%)`, borderColor: `${meta.color}40`, boxShadow: `0 4px 24px ${meta.color}25` }}>
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 border" style={{ background: `${meta.color}25`, borderColor: `${meta.color}50`, color: meta.color }}>
                        <span className="scale-150">{meta.icon}</span>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-lg font-semibold mb-2 inline-block font-mono" style={{ background: `${meta.color}20`, color: meta.color }}>
                        {meta.label}
                    </span>
                    <h2 className="text-xl font-bold text-foreground mb-2" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                        {bill.title}
                    </h2>
                    <p className="text-4xl font-bold font-mono" style={{ color: meta.color }}>
                        {fmtFull(bill.amount)}
                    </p>
                </motion.div>

                <div className="flex flex-col gap-3">
                    {[
                        { icon: <Calendar className="w-4 h-4 text-primary" />, label: "Date", value: fmtDate(bill.date) },
                        { icon: <CreditCard className="w-4 h-4 text-primary" />, label: "Category", value: meta.label },
                    ].map((row, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.06 }} className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
                            <div className="w-8 h-8 rounded-lg bg-primary/12 border border-primary/25 flex items-center justify-center">{row.icon}</div>
                            <div>
                                <p className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                    {row.label}
                                </p>
                                <p className="text-sm font-semibold text-foreground font-mono">{row.value}</p>
                            </div>
                        </motion.div>
                    ))}

                    <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.22 }} className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
                        <Avatar user={bill.user} size={36} />
                        <div>
                            <p className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                Paid by
                            </p>
                            <p className="text-sm font-semibold text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                {bill.user.name}
                            </p>
                            <p className="text-xs text-muted-foreground font-mono">{bill.user.phone}</p>
                        </div>
                    </motion.div>

                    {bill.notes && (
                        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.28 }} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
                            <div className="w-8 h-8 rounded-lg bg-primary/12 border border-primary/25 flex items-center justify-center mt-0.5">
                                <AlignLeft className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground mb-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                    Notes
                                </p>
                                <p className="text-sm text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                    {bill.notes}
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {confirmDelete && <DeleteConfirm label="Bill" onConfirm={onDelete} onCancel={() => setConfirmDelete(false)} />}
                </div>
            </div>
        </ScreenShell>
    );
}
export default BillDetailScreen;
