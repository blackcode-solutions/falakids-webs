export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--brand-purple)] to-[var(--brand-pink)] text-sm">
        🦜
      </div>
      <span className="font-[family-name:var(--font-baloo)] text-xl font-bold tracking-tight">
        <span className="text-[var(--brand-purple)]">fala</span>
        <span className="text-[var(--brand-pink)]">kids</span>
      </span>
    </div>
  );
}