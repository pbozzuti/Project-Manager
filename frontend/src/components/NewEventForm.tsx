"use client";

import { useState } from "react";
import { CalendarEventInput } from "@/lib/types";

const emptyForm = { title: "", date: "", description: "" };

export default function NewEventForm({
  onCreate,
  onClose,
}: {
  onCreate: (event: CalendarEventInput) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const update =
    (field: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.date) return;
    setSubmitting(true);
    try {
      await onCreate({ title: form.title, date: form.date, description: form.description || undefined });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-start justify-center pt-24 z-50">
      <form onSubmit={handleSubmit} className="neu-raised w-full max-w-md p-6 space-y-3.5">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl text-[var(--neu-text)]">New Event</h2>
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
          placeholder="Title"
          value={form.title}
          onChange={update("title")}
          className="neu-pressed-sm w-full px-3 py-2.5 text-sm outline-none placeholder:text-[var(--neu-text-muted)]"
        />
        <input
          required
          type="date"
          value={form.date}
          onChange={update("date")}
          className="neu-pressed-sm w-full px-3 py-2.5 text-sm outline-none text-[var(--neu-text)]"
        />
        <textarea
          placeholder="Description (optional)"
          value={form.description}
          onChange={update("description")}
          rows={2}
          className="neu-pressed-sm w-full px-3 py-2.5 text-sm outline-none placeholder:text-[var(--neu-text-muted)]"
        />

        <button
          type="submit"
          disabled={submitting}
          className="neu-btn neu-btn-primary w-full py-2.5 text-sm font-medium disabled:opacity-50"
        >
          {submitting ? "Adding…" : "Add Event"}
        </button>
      </form>
    </div>
  );
}
