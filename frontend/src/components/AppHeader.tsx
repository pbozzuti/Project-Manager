import Link from "next/link";

export default function AppHeader() {
  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 pt-6">
      <Link
        href="/home"
        className="neu-tag inline-block px-3 py-1.5 text-sm font-medium text-[var(--neu-text-muted)] hover:text-[var(--neu-text)]"
      >
        ← ATC Manager
      </Link>
    </div>
  );
}
