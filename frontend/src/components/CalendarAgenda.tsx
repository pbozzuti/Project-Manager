"use client";

import { useEffect, useState } from "react";
import { createCalendarEvent, deleteCalendarEvent, listCalendarEvents } from "@/lib/api";
import { CalendarEvent, CalendarEventInput } from "@/lib/types";
import NewEventForm from "./NewEventForm";

function formatDateHeading(dateStr: string) {
  // Parse as local date, not UTC, so "2026-08-20" doesn't shift a day.
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function CalendarAgenda() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    try {
      setError(null);
      setEvents(await listCalendarEvents());
    } catch {
      setError("Couldn't reach the API. Is the FastAPI backend running on :8000?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleCreate = async (event: CalendarEventInput) => {
    await createCalendarEvent(event);
    await refresh();
  };

  const handleDelete = async (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    await deleteCalendarEvent(id);
  };

  const todayStr = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD, local time

  const upcoming = events
    .filter((e) => e.date >= todayStr)
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

  const groups: { date: string; items: CalendarEvent[] }[] = [];
  for (const item of upcoming) {
    const group = groups[groups.length - 1];
    if (group && group.date === item.date) {
      group.items.push(item);
    } else {
      groups.push({ date: item.date, items: [item] });
    }
  }

  return (
    <section className="neu-pressed p-4 flex flex-col max-h-[calc(100vh-5rem)]">
      <div className="flex items-center justify-between gap-2 mb-4 shrink-0">
        <h2 className="text-xl text-[var(--neu-text)]">Calendar</h2>
        <button
          onClick={() => setShowForm(true)}
          className="neu-btn neu-btn-primary px-3 py-1.5 text-xs font-medium shrink-0"
        >
          + Event
        </button>
      </div>

      <div className="overflow-y-auto overflow-x-hidden p-3 -m-3">
        {error && (
          <div className="neu-pressed-sm text-[var(--neu-danger)] text-xs px-3 py-2.5 mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-[var(--neu-text-muted)] text-sm">Loading…</p>
        ) : groups.length === 0 ? (
          <div className="text-sm text-[var(--neu-text-muted)] py-4">
            Nothing upcoming — add an event.
          </div>
        ) : (
          <div className="space-y-6">
            {groups.map((group) => (
              <div key={group.date}>
                <h3 className="text-xs font-semibold text-[var(--neu-text-muted)] mb-2 uppercase tracking-wide">
                  {formatDateHeading(group.date)}
                </h3>
                <div className="space-y-2">
                  {group.items.map((item) => (
                    <div
                      key={item.id}
                      className="neu-raised-sm p-3 flex items-start justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <h4 className="font-medium text-sm text-[var(--neu-text)] truncate">
                          {item.title}
                        </h4>
                        {item.description && (
                          <p className="mt-1 text-xs text-[var(--neu-text-muted)] line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-[var(--neu-text-muted)] hover:text-[var(--neu-danger)] text-sm leading-none shrink-0"
                        aria-label="Delete event"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && <NewEventForm onCreate={handleCreate} onClose={() => setShowForm(false)} />}
    </section>
  );
}
