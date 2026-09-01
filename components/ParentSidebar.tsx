"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import {
  HomeIcon,
  TasksIcon,
  ProgressIcon,
  MessagesIcon,
  TrophyIcon,
  UserIcon,
  XIcon,
} from "./icons";

const NAV = [
  { href: "/parent", label: "Início", icon: HomeIcon },
  { href: "/parent/tasks", label: "Tarefas", icon: TasksIcon },
  { href: "/parent/progress", label: "Progresso", icon: ProgressIcon },
  { href: "/parent/messages", label: "Mensagens", icon: MessagesIcon },
  { href: "/parent/achievements", label: "Conquistas", icon: TrophyIcon },
  { href: "/parent/profile", label: "Perfil", icon: UserIcon },
];

type ParentSidebarProps = {
  open?: boolean;
  onClose?: () => void;
};

export default function ParentSidebar({ open = false, onClose }: ParentSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-72 max-w-[80vw] shrink-0 flex-col justify-between overflow-y-auto border-r border-[var(--panel-border)] bg-[var(--sidebar-bg)] px-4 py-6 transition-transform duration-200 ease-out lg:static lg:z-auto lg:w-64 lg:max-w-none lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="mb-8 flex items-center justify-between px-2">
            <Logo />
            <button
              onClick={onClose}
              aria-label="Fechar menu"
              className="focus-ring flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--muted)] hover:bg-[#F2F4FB] lg:hidden"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-col gap-1.5">
            {NAV.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`focus-ring flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-[15px] font-semibold transition-colors ${
                    active
                      ? "bg-[var(--wash-blue)] text-[var(--brand-blue)]"
                      : "text-[var(--muted-strong)] hover:bg-[#F2F4FB] hover:text-[var(--foreground)]"
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <Link
          href="/parent/profile"
          onClick={onClose}
          className="flex items-center gap-3 rounded-2xl px-2 py-2 hover:bg-[#F2F4FB]"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--brand-pink)] to-[var(--brand-orange)] text-sm font-bold text-white">
            J
          </div>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-bold">Juliana Silva</p>
            <p className="truncate text-xs text-[var(--muted)]">Mãe de João Pedro</p>
          </div>
        </Link>
      </aside>
    </>
  );
}
