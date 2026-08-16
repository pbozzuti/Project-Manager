import Link from "next/link";
import { auth, signOut } from "@/auth";

export default async function AppHeader() {
  const session = await auth();

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 pt-6 flex flex-wrap items-center justify-between gap-3">
      <Link
        href="/home"
        className="neu-tag inline-block px-3 py-1.5 text-sm font-medium text-[var(--neu-text-muted)] hover:text-[var(--neu-text)]"
      >
        ← ATC Manager
      </Link>

      {session?.user && (
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            className="neu-tag px-3 py-1.5 text-xs font-medium text-[var(--neu-text-muted)] hover:text-[var(--neu-text)]"
          >
            {session.user.email} · Sign out
          </button>
        </form>
      )}
    </div>
  );
}
