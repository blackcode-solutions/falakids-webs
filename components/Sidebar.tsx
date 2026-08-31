"use client";

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import {
  DashboardIcon,
  PatientsIcon,
  LibraryIcon,
  SessionsIcon,
  TasksIcon,
  ReportsIcon,
  MessagesIcon,
  ClinicIcon,
  SettingsIcon,
} from "./icons";
import { clinicName, clinicRole } from "@/lib/data";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: DashboardIcon },
  { href: "/patients", label: "Pacientes", icon: PatientsIcon },
  { href: "/library", label: "Biblioteca", icon: LibraryIcon },
  { href: "/sessions/new", label: "Sessões", icon: SessionsIcon },
  { href: "/tasks", label: "Tarefas", icon: TasksIcon },
  { href: "/reports", label: "Relatórios", icon: ReportsIcon },
  { href: "/messages", label: "Mensagens", icon: MessagesIcon },
  { href: "/clinic", label: "Clínica", icon: ClinicIcon },
  { href: "/settings", label: "Configurações", icon: SettingsIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col justify-between border-r border-[var(--panel-border)] bg-[var(--sidebar-bg)] px-4 py-6">
      <div>
        <div className="mb-8 px-2">
          <Logo />
        </div>
        <nav className="flex flex-col gap-1">
          {NAV.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`focus-ring flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-[var(--brand-blue)] text-white shadow-sm shadow-blue-200"
                    : "text-[var(--muted)] hover:bg-[#F2F4FB] hover:text-[var(--foreground)]"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <Link
        href="/settings"
        className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-[#F2F4FB]"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand-purple)]/15 text-sm font-semibold text-[var(--brand-purple)]">
          A
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold">{clinicName}</p>
          <p className="text-xs text-[var(--muted)]">{clinicRole}</p>
        </div>
      </Link>
    </aside>
  );
}