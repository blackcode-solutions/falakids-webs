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
  XIcon,
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

type SidebarProps = {
  open?: boolean;
  onClose?: () => void;
};

export default function Sidebar({ open = false, onClose }: SidebarProps) {
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
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-72 max-w-[80vw] shrink-0 flex-col justify-between overflow-y-auto border-r border-[var(--panel-border)] bg-[var(--sidebar-bg)] px-4 py-6 transition-transform duration-200 ease-out lg:static lg:z-auto lg:w-60 lg:max-w-none lg:translate-x-0 ${
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
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`focus-ring flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-[var(--brand-blue)] text-white shadow-sm shadow-blue-200"
                      : "text-[var(--muted)] hover:bg-[#F2F4FB] hover:text-[var(--foreground)]"
                  }`}
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <Link
          href="/settings"
          onClick={onClose}
          className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-[#F2F4FB]"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--brand-purple)]/15 text-sm font-semibold text-[var(--brand-purple)]">
            A
          </div>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-semibold">{clinicName}</p>
            <p className="truncate text-xs text-[var(--muted)]">{clinicRole}</p>
          </div>
        </Link>
      </aside>
    </>
  );
}
