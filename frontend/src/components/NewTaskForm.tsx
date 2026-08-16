"use client";

import { useState } from "react";
import { TaskInput } from "@/lib/types";

const emptyForm: TaskInput = {
  title: "",
  description: "",
  assignee: "",
  project: "",
  deadline: "",
};

export default function NewTaskForm({
  onCreate,
  onClose,
}: {
  onCreate: (task: TaskInput) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<TaskInput>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const update = (field: keyof TaskInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.assignee || !form.project) return;
    setSubmitting(true);
    try {
      await onCreate({ ...form, deadline: form.deadline || undefined });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-start justify-center pt-24 z-50">
      <form
        onSubmit={handleSubmit}
        className="neu-raised w-full max-w-md p-6 space-y-3.5"
      >
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl text-[var(--neu-text)]">New Task</h2>
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
        <textarea
          placeholder="Description (optional)"
          value={form.description}
          onChange={update("description")}
          className="neu-pressed-sm w-full px-3 py-2.5 text-sm outline-none placeholder:text-[var(--neu-text-muted)]"
          rows={2}
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            required
            placeholder="Assignee"
            value={form.assignee}
            onChange={update("assignee")}
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
          type="date"
          value={form.deadline}
          onChange={update("deadline")}
          className="neu-pressed-sm w-full px-3 py-2.5 text-sm outline-none text-[var(--neu-text)]"
        />

        <button
          type="submit"
          disabled={submitting}
          className="neu-btn neu-btn-primary w-full py-2.5 text-sm font-medium disabled:opacity-50"
        >
          {submitting ? "Creating…" : "Create Task"}
        </button>
      </form>
    </div>
  );
}
