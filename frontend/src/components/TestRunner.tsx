"use client";

import { useState } from "react";
import { runTests } from "@/lib/api";
import { TestRunResult } from "@/lib/types";

export default function TestRunner() {
  const [result, setResult] = useState<TestRunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOutput, setShowOutput] = useState(false);

  const handleRun = async () => {
    setRunning(true);
    setError(null);
    try {
      setResult(await runTests());
    } catch {
      setError("Couldn't reach the API. Is the FastAPI backend running?");
      setResult(null);
    } finally {
      setRunning(false);
    }
  };

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <h1 className="text-3xl text-[var(--neu-text)]">System Check</h1>
        <button
          onClick={handleRun}
          disabled={running}
          className="neu-btn neu-btn-primary px-5 py-2.5 text-sm font-medium disabled:opacity-50"
        >
          {running ? "Running…" : "Run Tests"}
        </button>
      </div>

      {error && (
        <div className="neu-pressed-sm text-[var(--neu-danger)] text-sm px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {!result && !error && !running && (
        <div className="neu-pressed p-10 text-center text-sm text-[var(--neu-text-muted)]">
          Runs the backend test suite (auth, task/purchase/calendar CRUD, the DCASE
          scraper) against an isolated database — hit &quot;Run Tests&quot; to check
          everything&apos;s working.
        </div>
      )}

      {result && (
        <div className="neu-raised-sm p-5">
          <div className="flex items-center gap-3">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{
                background: result.passed ? "var(--neu-success)" : "var(--neu-danger)",
              }}
            />
            <h2
              className="font-medium"
              style={{ color: result.passed ? "var(--neu-success)" : "var(--neu-danger)" }}
            >
              {result.passed ? "Everything's working" : "Something's broken"}
            </h2>
          </div>

          <p className="mt-2 text-sm text-[var(--neu-text-muted)]">{result.summary}</p>

          <button
            onClick={() => setShowOutput((v) => !v)}
            className="mt-4 text-xs font-medium text-[var(--neu-text-muted)] hover:text-[var(--neu-text)]"
          >
            {showOutput ? "Hide full output ▲" : "Show full output ▼"}
          </button>

          {showOutput && (
            <pre className="neu-pressed-sm mt-3 p-4 text-xs text-[var(--neu-text)] overflow-x-auto whitespace-pre-wrap max-h-96 overflow-y-auto">
              {result.output}
            </pre>
          )}
        </div>
      )}
    </section>
  );
}
