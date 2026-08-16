import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="neu-raised w-full max-w-sm p-8 text-center">
        <h1 className="text-3xl mb-1">ATC Manager</h1>
        <p className="text-sm text-[var(--neu-text-muted)] mb-8">Adams Theatre Company</p>

        <Link
          href="/home"
          className="neu-btn neu-btn-primary block w-full py-3 text-sm font-medium"
        >
          Continue with Google
        </Link>

        <p className="mt-5 text-xs text-[var(--neu-text-muted)] leading-relaxed">
          Restricted to Adams Theatre Company email addresses. Sign-in isn&apos;t wired up
          yet — this just previews the look.
        </p>
      </div>
    </div>
  );
}
