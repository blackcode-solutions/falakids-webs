"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Topbar from "@/components/Topbar";
import { ApiError, listAllAssignments, type GlobalAssignment } from "@/lib/api";

const AVATAR_COLORS = ["#DCEEFF", "#E7DEFC", "#FDE8D8", "#DFF5E6", "#FDE1E1"];

function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function colorFor(id: string): string {
  let hash = 0;
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[hash];
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR");
}

const FILTERS = [
  { key: "ALL", label: "Todas" },
  { key: "PENDING", label: "Pendentes" },
  { key: "COMPLETED", label: "Concluídas" },
] as const;

export default function TasksPage() {
  const [assignments, setAssignments] = useState<GlobalAssignment[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("ALL");
  const [query, setQuery] = useState("");

  useEffect(() => {
    listAllAssignments()
      .then(({ assignments }) => setAssignments(assignments))
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : "Não foi possível carregar as tarefas.");
      });
  }, []);

  const filtered = (assignments ?? [])
    .filter((t) => filter === "ALL" || t.status === filter)
    .filter((t) => (t.title + " " + t.patientName).toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <div className="pb-10">
      <Topbar
        title="Tarefas"
        search={{ placeholder: "Buscar por tarefa ou paciente...", value: query, onChange: setQuery }}
        actions={
          <Link
            href="/sessions/new"
            className="focus-ring flex items-center gap-1.5 rounded-full bg-[var(--brand-purple)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            <span className="text-base leading-none">+</span> Nova Tarefa
          </Link>
        }
      />

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`focus-ring rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                filter === f.key
                  ? "bg-[var(--brand-purple)] text-white"
                  : "bg-[#F2F4FB] text-[var(--muted-strong)] hover:bg-[#E7EAF6]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {error && (
          <p className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>
        )}

        {!assignments && !error && (
          <p className="text-sm text-[var(--muted)]">Carregando tarefas...</p>
        )}

        {assignments && filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[var(--panel-border)] p-8 text-center">
            <p className="text-sm font-semibold">Nenhuma tarefa encontrada.</p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Crie uma sessão e envie como tarefa para casa a partir do perfil do paciente.
            </p>
          </div>
        )}

        {assignments && filtered.length > 0 && (
          <div className="card flex flex-col divide-y divide-[var(--panel-border)] overflow-hidden">
            {filtered.map((t) => (
              <Link
                key={t.id}
                href={`/patients/${t.childId}`}
                className="flex items-center justify-between gap-3 px-4 py-4 hover:bg-[#F7F8FD] sm:px-5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                    style={{ background: colorFor(t.childId) }}
                  >
                    {initialsOf(t.patientName)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{t.title}</p>
                    <p className="truncate text-xs text-[var(--muted)]">
                      {t.patientName} &middot; Enviada em {formatDate(t.createdAt)}
                    </p>
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                    t.status === "COMPLETED"
                      ? "bg-[#E7F9EE] text-[#1FAE6A]"
                      : "bg-[#FFF3E0] text-[#E88C1F]"
                  }`}
                >
                  {t.status === "COMPLETED" ? "Concluída" : "Pendente"}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
