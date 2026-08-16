"use client";

import { useEffect, useMemo, useState } from "react";
import { createPurchase, deletePurchase, listPurchases } from "@/lib/api";
import { Purchase, PurchaseInput } from "@/lib/types";
import NewPurchaseForm from "./NewPurchaseForm";

type SortBy = "date" | "amount" | "purchaser" | "project" | "created_at";

const currency = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export default function PurchaseLog() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [projectFilter, setProjectFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    try {
      setError(null);
      setPurchases(await listPurchases(sortBy));
    } catch {
      setError("Couldn't reach the API. Is the FastAPI backend running on :8000?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  const projects = useMemo(
    () => Array.from(new Set(purchases.map((p) => p.project))).sort(),
    [purchases]
  );

  const filtered = purchases.filter((p) => !projectFilter || p.project === projectFilter);
  const total = filtered.reduce((sum, p) => sum + p.amount, 0);

  const handleCreate = async (purchase: PurchaseInput) => {
    await createPurchase(purchase);
    await refresh();
  };

  const handleDelete = async (id: string) => {
    setPurchases((prev) => prev.filter((p) => p.id !== id));
    await deletePurchase(id);
  };

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-2xl text-[var(--neu-text)]">Purchases</h2>
        <button
          onClick={() => setShowForm(true)}
          className="neu-btn neu-btn-primary px-5 py-2.5 text-sm font-medium"
        >
          + New Purchase
        </button>
      </div>

      <div className="neu-pressed-sm flex flex-wrap items-center gap-4 mb-6 text-sm px-4 py-3">
        <label className="flex items-center gap-2">
          Sort by
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="neu-pressed-sm px-2 py-1 text-[var(--neu-text)] outline-none"
          >
            <option value="date">Date</option>
            <option value="amount">Amount</option>
            <option value="purchaser">Purchaser</option>
            <option value="project">Project</option>
          </select>
        </label>

        <label className="flex items-center gap-2">
          Project
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="neu-pressed-sm px-2 py-1 text-[var(--neu-text)] outline-none"
          >
            <option value="">All</option>
            {projects.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>

        <span className="ml-auto font-medium text-[var(--neu-text)]">
          Total: {currency(total)}
        </span>
      </div>

      {error && (
        <div className="neu-pressed-sm text-[var(--neu-danger)] text-sm px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-[var(--neu-text-muted)] text-sm">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="neu-pressed p-10 text-center text-sm text-[var(--neu-text-muted)]">
          No purchases logged yet.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => (
            <div key={p.id} className="neu-raised-sm p-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-medium text-[var(--neu-text)]">{p.item}</h3>
                <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                  <span className="neu-tag-navy px-2 py-0.5 font-medium">{p.purchaser}</span>
                  <span className="neu-tag-orange px-2 py-0.5 font-medium">{p.project}</span>
                  {p.category && (
                    <span className="neu-tag px-2 py-0.5 font-medium text-[var(--neu-text-muted)]">
                      {p.category}
                    </span>
                  )}
                  <span className="neu-tag px-2 py-0.5 font-medium text-[var(--neu-text-muted)]">
                    {p.date}
                  </span>
                </div>
                {p.notes && (
                  <p className="mt-2 text-sm text-[var(--neu-text-muted)]">{p.notes}</p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className="font-semibold text-[var(--neu-text)]">{currency(p.amount)}</span>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-[var(--neu-text-muted)] hover:text-[var(--neu-danger)] text-sm leading-none"
                  aria-label="Delete purchase"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && <NewPurchaseForm onCreate={handleCreate} onClose={() => setShowForm(false)} />}
    </section>
  );
}
