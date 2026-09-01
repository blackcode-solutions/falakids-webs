"use client";

import { useMemo, useState } from "react";
import Topbar from "@/components/Topbar";
import { FilterIcon, SearchIcon, StarIcon } from "@/components/icons";
import {
  activities,
  phonemeFilters,
  positionFilters,
  structureFilters,
} from "@/lib/data";

export default function LibraryPage() {
  const [query, setQuery] = useState("");
  const [phoneme, setPhoneme] = useState<string | null>(null);
  const [position, setPosition] = useState<string | null>(null);
  const [structure, setStructure] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return activities.filter((a) => {
      if (query && !a.name.toLowerCase().includes(query.toLowerCase())) return false;
      if (phoneme && phoneme !== "Outros" && a.phoneme !== phoneme) return false;
      if (position && a.position.toLowerCase() !== position.toLowerCase()) return false;
      return true;
    });
  }, [query, phoneme, position]);

  return (
    <div className="pb-10">
      <Topbar
        title="Biblioteca de Atividades"
        actions={
          <button className="focus-ring flex items-center gap-2 rounded-full border border-[var(--panel-border)] bg-white px-4 py-2.5 text-sm font-bold text-[var(--brand-blue)] shadow-sm">
            <FilterIcon className="h-4 w-4" />
            Filtros
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-6 px-4 sm:px-6 lg:px-8 lg:grid-cols-[240px_1fr]">
        <aside className="card h-fit p-5">
          <div className="mb-5 flex items-center gap-2 text-sm font-extrabold">
            <FilterIcon className="h-4 w-4 text-[var(--muted)]" />
            Filtros
          </div>

          <FilterGroup title="Fonemas">
            {phonemeFilters.map((f) => (
              <Checkbox
                key={f}
                label={f}
                checked={phoneme === f}
                onChange={() => setPhoneme(phoneme === f ? null : f)}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Posição do Som">
            {positionFilters.map((f) => (
              <Checkbox
                key={f}
                label={f}
                checked={position === f}
                onChange={() => setPosition(position === f ? null : f)}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Estrutura Silábica">
            {structureFilters.map((f) => (
              <Checkbox
                key={f}
                label={f}
                checked={structure === f}
                onChange={() => setStructure(structure === f ? null : f)}
              />
            ))}
          </FilterGroup>
        </aside>

        <div>
          <div className="mb-5 flex items-center gap-2 rounded-full border border-[var(--panel-border)] bg-white px-4 py-2.5 text-sm text-[var(--muted)] shadow-sm">
            <SearchIcon className="h-4 w-4" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar atividades..."
              className="focus-ring w-full bg-transparent outline-none placeholder:text-[var(--muted)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
            {filtered.map((a) => (
              <div
                key={a.id}
                className="card focus-ring group relative flex flex-col items-center gap-3 p-4 text-center transition-transform hover:-translate-y-0.5 hover:shadow-md"
              >
                <button
                  aria-label="Favoritar"
                  className="absolute right-3 top-3 text-[var(--muted)] transition-colors hover:text-[var(--brand-orange)]"
                >
                  <StarIcon className="h-4 w-4" />
                </button>
                <div
                  className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl text-4xl"
                  style={{ background: a.bg }}
                >
                  {a.emoji}
                </div>
                <div>
                  <p className="text-sm font-bold">{a.name}</p>
                  <p className="text-xs font-medium text-[var(--muted)]">
                    Som /{a.phoneme}/ &middot; {a.position}
                  </p>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="col-span-full py-10 text-center text-sm text-[var(--muted)]">
                Nenhuma atividade encontrada para esse filtro.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5 border-b border-[var(--panel-border)] pb-5 last:mb-0 last:border-0 last:pb-0">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">{title}</p>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--foreground)]">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-[var(--panel-border)] accent-[var(--brand-blue)]"
      />
      {label}
    </label>
  );
}