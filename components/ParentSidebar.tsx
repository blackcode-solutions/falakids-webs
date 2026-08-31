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
} from "./icons";

const NAV = [
  { href: "/parent", label: "Início", icon: HomeIcon },
  { href: "/parent/tasks", label: "Tarefas", icon: TasksIcon },
  { href: "/parent/progress", label: "Progresso", icon: ProgressIcon },
  { href: "/parent/messages", label: "Mensagens", icon: MessagesIcon },
  { href: "/parent/achievements", label: "Conquistas", icon: TrophyIcon },
  { href: "/parent/profile", label: "Perfil", icon: UserIcon },
];

export default function ParentSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col justify-between border-r border-[var(--panel-border)] bg-[var(--sidebar-bg)] px-4 py-6">
      <div>
        <div className="mb-8 px-2">
          <Logo />
        </div>
        <nav className="flex flex-col gap-1.5">
          {NAV.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
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
        className="flex items-center gap-3 rounded-2xl px-2 py-2 hover:bg-[#F2F4FB]"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--brand-pink)] to-[var(--brand-orange)] text-sm font-bold text-white">
          J
        </div>
        <div className="leading-tight">
          <p className="text-sm font-bold">Juliana Silva</p>
          <p className="text-xs text-[var(--muted)]">Mãe de João Pedro</p>
        </div>
      </Link>
    </aside>
  );
}