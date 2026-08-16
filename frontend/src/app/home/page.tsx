import Link from "next/link";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import CalendarAgenda from "@/components/CalendarAgenda";
import { auth, signOut } from "@/auth";

const TILES = [
  {
    href: "/tasks",
    title: "Task Board",
    description: "Assign tasks, track progress, and sort by person, project, or deadline.",
    ready: true,
  },
  {
    href: "/finance",
    title: "Finance",
    description: "Purchase tracking and a DCASE grant scraper.",
    ready: true,
  },
  {
    href: "/events",
    title: "Events",
    description: "Chicago performance venues & prices.",
    ready: false,
  },
  {
    href: "/analytics",
    title: "Analytics",
    description: "Social, web, and software analytics.",
    ready: false,
  },
  {
    href: "/internal",
    title: "Software Management",
    description: "tests",
    ready: true,
  },
  
];

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10">
      <div className="mb-10 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-4xl mb-2">Adams Theatre Company</h1>
          <p className="text-[var(--neu-text-muted)]">Manager hub</p>
        </div>

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

      <AnnouncementBanner />

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
          {TILES.map((tile) => (
            <Link key={tile.href} href={tile.href} className="neu-btn p-6 flex flex-col gap-2">
              <h2 className="text-xl">{tile.title}</h2>
              <p className="text-sm text-[var(--neu-text-muted)]">{tile.description}</p>
              {!tile.ready && (
                <span className="neu-tag self-start px-2 py-0.5 text-xs mt-2 font-medium text-[var(--neu-accent)]">
                  Coming soon
                </span>
              )}
            </Link>
          ))}
        </div>

        <div className="lg:w-80 shrink-0">
          <div className="lg:sticky lg:top-10">
            <CalendarAgenda />
          </div>
        </div>
      </div>
    </div>
  );
}
