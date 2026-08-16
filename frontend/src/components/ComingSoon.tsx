export default function ComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10">
      <h1 className="text-3xl mb-8">{title}</h1>
      <div className="neu-pressed p-16 text-center">
        <p className="text-[var(--neu-text)]">{description}</p>
        <p className="mt-2 text-sm text-[var(--neu-text-muted)]">Coming soon</p>
      </div>
    </div>
  );
}
