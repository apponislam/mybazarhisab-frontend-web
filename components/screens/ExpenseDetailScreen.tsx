import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Edit3, Trash2, Weight, Hash, Calendar, AlignLeft } from "lucide-react";
import { MockBazarEntry } from "@/types";
import { ScreenShell, Avatar, DeleteConfirm } from "@/components/ui/Shared";
import { fmtFull, fmtDate } from "@/lib/mockData";

export function ExpenseDetailScreen({ entry, onBack, onEdit, onDelete }: {
  entry: MockBazarEntry; onBack: () => void; onEdit: () => void; onDelete: () => void;
}) {
  const total = entry.price * entry.quantity;
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <ScreenShell scrollable>
      <div className="flex flex-col px-6 pt-12 pb-8">
        <div className="flex items-center justify-between mb-6">
          <button type="button" onClick={onBack}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm cursor-pointer"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <ArrowLeft className="w-4 h-4" /> Expenses
          </button>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/40 text-primary text-sm font-medium hover:bg-primary/10 transition-all cursor-pointer"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
            <button type="button" onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-destructive/40 text-destructive text-sm font-medium hover:bg-destructive/10 transition-all cursor-pointer"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-primary/40 p-6 mb-5 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(232,160,32,0.14) 0%, rgba(192,96,16,0.06) 100%)", boxShadow: "0 4px 24px rgba(232,160,32,0.15)" }}>
          <div className="text-5xl mb-3">{entry.product.emoji}</div>
          <h2 className="text-2xl font-bold text-foreground mb-1" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>{entry.product.name}</h2>
          <p className="text-4xl font-bold text-primary font-mono">{fmtFull(total)}</p>
          <p className="text-xs text-muted-foreground mt-1 font-mono">৳{entry.price} × {entry.quantity} {entry.unit}</p>
        </motion.div>

        <div className="flex flex-col gap-3">
          {[
            { icon: <Weight className="w-4 h-4 text-primary" />, label: "Quantity", value: `${entry.quantity} ${entry.unit}` },
            { icon: <Hash className="w-4 h-4 text-primary" />, label: "Unit Price", value: `৳${entry.price} / ${entry.unit}` },
            { icon: <Calendar className="w-4 h-4 text-primary" />, label: "Date", value: fmtDate(entry.date) },
          ].map((row, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.06 }}
              className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
              <div className="w-8 h-8 rounded-lg bg-primary/12 border border-primary/25 flex items-center justify-center">{row.icon}</div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>{row.label}</p>
                <p className="text-sm font-semibold text-foreground font-mono">{row.value}</p>
              </div>
            </motion.div>
          ))}

          <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.28 }}
            className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
            <Avatar user={entry.user} size={36} />
            <div>
              <p className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>Added by</p>
              <p className="text-sm font-semibold text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>{entry.user.name}</p>
              <p className="text-xs text-muted-foreground font-mono">{entry.user.phone}</p>
            </div>
          </motion.div>

          {entry.notes && (
            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.34 }}
              className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
              <div className="w-8 h-8 rounded-lg bg-primary/12 border border-primary/25 flex items-center justify-center mt-0.5"><AlignLeft className="w-4 h-4 text-primary" /></div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>Notes</p>
                <p className="text-sm text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>{entry.notes}</p>
              </div>
            </motion.div>
          )}

          {confirmDelete && (
            <DeleteConfirm label="Expense" onConfirm={onDelete} onCancel={() => setConfirmDelete(false)} />
          )}
        </div>
      </div>
    </ScreenShell>
  );
}
export default ExpenseDetailScreen;
