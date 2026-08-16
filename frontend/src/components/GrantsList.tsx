"use client";

import { useEffect, useState } from "react";
import { listGrants, refreshGrants } from "@/lib/api";
import { Grant } from "@/lib/types";

export default function GrantsList() {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setError(null);
      setGrants(await listGrants());
    } catch {
      setError("Couldn't reach the API. Is the FastAPI backend running on :8000?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      setError(null);
      const res = await refreshGrants();
      setGrants(res.grants);
      setErrors(res.errors);
    } catch {
      setError("Couldn't reach the API. Is the FastAPI backend running on :8000?");
    } finally {
      setRefreshing(false);
    }
  };

  const lastChecked = grants.length
    ? new Date(
        Math.max(...grants.map((g) => new Date(g.scraped_at).getTime()))
      ).toLocaleString()
    : null;

  return (
    <section className="mt-12">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <h2 className="text-2xl text-[var(--neu-text)]">Grants — DCASE</h2>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="neu-btn neu-btn-primary px-5 py-2.5 text-sm font-medium disabled:opacity-50"
        >
          {refreshing ? "Checking DCASE…" : "Refresh from DCASE"}
        </button>
      </div>

      <p className="text-xs text-[var(--neu-text-muted)] mb-6">
        {lastChecked ? `Last checked ${lastChecked}` : "Not checked yet — hit refresh"}
      </p>

      {error && (
        <div className="neu-pressed-sm text-[var(--neu-danger)] text-sm px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {errors.length > 0 && (
        <div className="neu-pressed-sm text-[var(--neu-danger)] text-sm px-4 py-3 mb-6">
          Couldn&apos;t read {errors.length} page{errors.length > 1 ? "s" : ""}: {errors.join("; ")}
        </div>
      )}

      {loading ? (
        <p className="text-[var(--neu-text-muted)] text-sm">Loading…</p>
      ) : grants.length === 0 ? (
        <div className="neu-pressed p-10 text-center text-sm text-[var(--neu-text-muted)]">
          No grant data yet — hit &quot;Refresh from DCASE&quot; to pull the current program pages.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {grants.map((g) => (
            <div key={g.id} className="neu-raised-sm p-4">
              <h3 className="font-medium text-[var(--neu-text)]">{g.program_name}</h3>

              {g.status_text && (
                <p className="mt-2 text-sm text-[var(--neu-text)]">{g.status_text}</p>
              )}
              {g.deadline_text && (
                <p className="mt-1 text-sm text-[var(--neu-text-muted)]">
                  Deadline: {g.deadline_text}
                </p>
              )}
              {g.summary && (
                <p className="mt-2 text-sm text-[var(--neu-text-muted)] line-clamp-3">
                  {g.summary}
                </p>
              )}

              <div className="mt-3 flex flex-wrap gap-3 text-xs">
                <a
                  href={g.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neu-tag-orange px-2 py-1 font-medium"
                >
                  View program ↗
                </a>
                {g.contact_email && (
                  <a
                    href={`mailto:${g.contact_email}`}
                    className="neu-tag px-2 py-1 font-medium text-[var(--neu-text-muted)]"
                  >
                    {g.contact_email}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
