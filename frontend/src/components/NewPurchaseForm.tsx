"use client";

import { useState } from "react";
import { PurchaseInput } from "@/lib/types";

const emptyForm = {
  item: "",
  amount: "",
  purchaser: "",
  project: "",
  category: "",
  date: "",
  notes: "",
};

export default function NewPurchaseForm({
  onCreate,
  onClose,
}: {
  onCreate: (purchase: PurchaseInput) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const update =
    (field: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.item || !form.amount || !form.purchaser || !form.project || !form.date) return;
    setSubmitting(true);
    try {
      await onCreate({
        item: form.item,
        amount: parseFloat(form.amount),
        purchaser: form.purchaser,
        project: form.project,
        category: form.category || undefined,
        date: form.date,
        notes: form.notes || undefined,
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-start justify-center pt-24 z-50">
      <form onSubmit={handleSubmit} className="neu-raised w-full max-w-md p-6 space-y-3.5">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl text-[var(--neu-text)]">New Purchase</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-[var(--neu-text-muted)] hover:text-[var(--neu-text)]"
          >
            ✕
          </button>
        </div>

        <input
          required
          placeholder="Item"
          value={form.item}
          onChange={update("item")}
          className="neu-pressed-sm w-full px-3 py-2.5 text-sm outline-none placeholder:text-[var(--neu-text-muted)]"
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            required
            type="number"
            step="0.01"
            min="0"
            placeholder="Amount ($)"
            value={form.amount}
            onChange={update("amount")}
            className="neu-pressed-sm w-full px-3 py-2.5 text-sm outline-none placeholder:text-[var(--neu-text-muted)]"
          />
          <input
            required
            type="date"
            value={form.date}
            onChange={update("date")}
            className="neu-pressed-sm w-full px-3 py-2.5 text-sm outline-none text-[var(--neu-text)]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input
            required
            placeholder="Purchaser"
            value={form.purchaser}
            onChange={update("purchaser")}
            className="neu-pressed-sm w-full px-3 py-2.5 text-sm outline-none placeholder:text-[var(--neu-text-muted)]"
          />
          <input
            required
            placeholder="Project"
            value={form.project}
            onChange={update("project")}
            className="neu-pressed-sm w-full px-3 py-2.5 text-sm outline-none placeholder:text-[var(--neu-text-muted)]"
          />
        </div>

        <input
          placeholder="Category (optional)"
          value={form.category}
          onChange={update("category")}
          className="neu-pressed-sm w-full px-3 py-2.5 text-sm outline-none placeholder:text-[var(--neu-text-muted)]"
        />

        <textarea
          placeholder="Notes (optional)"
          value={form.notes}
          onChange={update("notes")}
          rows={2}
          className="neu-pressed-sm w-full px-3 py-2.5 text-sm outline-none placeholder:text-[var(--neu-text-muted)]"
        />

        <button
          type="submit"
          disabled={submitting}
          className="neu-btn neu-btn-primary w-full py-2.5 text-sm font-medium disabled:opacity-50"
        >
          {submitting ? "Adding…" : "Add Purchase"}
        </button>
      </form>
    </div>
  );
}
