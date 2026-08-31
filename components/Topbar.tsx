import Link from "next/link";
import { BellIcon, ChevronLeftIcon, SearchIcon } from "./icons";

type TopbarProps = {
  title: string;
  backHref?: string;
  search?: { placeholder: string };
  actions?: React.ReactNode;
};

export default function Topbar({ title, backHref, search, actions }: TopbarProps) {
  return (
    <header className="flex items-center justify-between gap-4 px-8 py-6">
      <div className="flex min-w-0 items-center gap-3">
        {backHref && (
          <Link
            href={backHref}
            className="focus-ring flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--muted)] hover:bg-[#F2F4FB]"
            aria-label="Voltar"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </Link>
        )}
        <h1 className="truncate font-[family-name:var(--font-baloo)] text-2xl font-bold text-[var(--foreground)]">
          {title}
        </h1>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {search && (
          <div className="hidden items-center gap-2 rounded-full border border-[var(--panel-border)] bg-white px-4 py-2 text-sm text-[var(--muted)] md:flex">
            <SearchIcon className="h-4 w-4" />
            <input
              placeholder={search.placeholder}
              className="focus-ring w-48 bg-transparent outline-none placeholder:text-[var(--muted)]"
            />
          </div>
        )}
        {actions}
        <button
          aria-label="Notificações"
          className="focus-ring relative flex h-10 w-10 items-center justify-center rounded-full border border-[var(--panel-border)] bg-white text-[var(--muted)]"
        >
          <BellIcon className="h-[18px] w-[18px]" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[var(--brand-pink)]" />
        </button>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--brand-purple)] to-[var(--brand-pink)] text-sm font-semibold text-white">
          A
        </div>
      </div>
    </header>
  );
}