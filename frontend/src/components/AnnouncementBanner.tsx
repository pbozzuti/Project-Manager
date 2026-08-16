"use client";

import { useEffect, useState } from "react";
import { clearAnnouncement, getAnnouncement, setAnnouncement } from "@/lib/api";
import { Announcement } from "@/lib/types";

export default function AnnouncementBanner() {
  const [announcement, setAnnouncementState] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAnnouncement()
      .then(setAnnouncementState)
      .finally(() => setLoading(false));
  }, []);

  const startEdit = () => {
    setDraft(announcement?.message ?? "");
    setEditing(true);
  };

  const handleSave = async () => {
    if (!draft.trim()) return;
    setSaving(true);
    try {
      setAnnouncementState(await setAnnouncement(draft.trim()));
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    setAnnouncementState(null);
    await clearAnnouncement();
  };

  if (loading) return null;

  if (editing) {
    return (
      <div className="glass-panel p-5 mb-6">
        <div className="relative z-10">
          <textarea
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Pin an announcement for the team…"
            rows={2}
            className="w-full bg-transparent outline-none text-[var(--neu-text)] placeholder:text-[var(--neu-text-muted)] resize-none"
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => setEditing(false)}
              className="px-3 py-1.5 text-xs font-medium text-[var(--neu-text-muted)] hover:text-[var(--neu-text)]"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !draft.trim()}
              className="neu-btn neu-btn-primary px-4 py-1.5 text-xs font-medium disabled:opacity-50"
            >
              {saving ? "Saving…" : "Pin"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!announcement) {
    return (
      <button
        onClick={startEdit}
        className="glass-ghost w-full mb-6 px-5 py-3 text-left text-sm text-[var(--neu-text-muted)]"
      >
        + Pin an announcement
      </button>
    );
  }

  return (
    <div className="glass-panel group p-5 mb-6">
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[var(--neu-text)] leading-relaxed">{announcement.message}</p>
        </div>
        <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={startEdit}
            className="text-[var(--neu-text-muted)] hover:text-[var(--neu-text)] text-sm"
            aria-label="Edit announcement"
          >
            ✎
          </button>
          <button
            onClick={handleRemove}
            className="text-[var(--neu-text-muted)] hover:text-[var(--neu-danger)] text-sm"
            aria-label="Remove announcement"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
