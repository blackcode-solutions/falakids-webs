"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Logo from "@/components/Logo";
import { MenuIcon } from "@/components/icons";

export default function FonoLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar open={open} onClose={() => setOpen(false)} />

      <div className="min-w-0 flex-1">
        <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-[var(--panel-border)] bg-[var(--background)]/95 px-4 py-3 backdrop-blur lg:hidden">
          <button
            onClick={() => setOpen(true)}
            aria-label="Abrir menu"
            className="focus-ring flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--foreground)] hover:bg-[#EDEFF8]"
          >
            <MenuIcon className="h-5 w-5" />
          </button>
          <Logo />
        </div>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
