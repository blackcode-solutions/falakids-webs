"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Topbar from "@/components/Topbar";
import Parrot from "@/components/Parrot";
import LineChart from "@/components/LineChart";
import { useClinicMe } from "@/lib/useClinicMe";
import { ApiError, getDashboardStats, type DashboardStats, type RecentSessionSummary } from "@/lib/api";

const STAT_CARDS: {
  key: keyof Pick<DashboardStats, "activePatients" | "pendingTasks" | "weeklyEngagement" | "completedActivities">;
  label: string;
  bg: string;
  fg: string;
  icon: string;
  suffix?: string;
}[] = [
  { key: "activePatients", label: "Pacientes ativos", bg: "#EAF1FF", fg: "#2E5AE8", icon: "👥" },
  { key: "pendingTasks", label: "Tarefas pendentes", bg: "#E7F9EE", fg: "#1FAE6A", icon: "📋" },
  { key: "weeklyEngagement", label: "Engajamento da semana", bg: "#FDEAF0", fg: "#E9457C", icon: "❤️", suffix: "%" },
  { key: "completedActivities", label: "Atividades concluídas", bg: "#FFF3E0", fg: "#E88C1F", icon: "🏅" },
];

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 60) return `há ${Math.max(mins, 1)} min`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `há ${hours}h`;
  const days = Math.round(hours / 24);
  return `há ${days}d`;
}

export default function DashboardPage() {
  const me = useClinicMe();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentSessions, setRecentSessions] = useState<RecentSessionSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboardStats()
      .then((data) => {
        setStats(data.stats);
        setRecentSessions(data.recentSessions);
      })
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : "Não foi possível carregar o dashboard.");
      });
  }, []);

  const clinicName = me.status === "ready" ? me.therapist.clinicName : "";

  return (
    <div className="pb-10">
      <Topbar title="Dashboard" />

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-r from-[#EFEBFF] to-[#FDEFF5] p-8">
          <h2 className="font-[family-name:var(--font-baloo)] text-2xl font-bold text-[var(--foreground)]">
            Olá{clinicName ? `, ${clinicName}` : ""}! 👋
          </h2>
          <p className="mt-1 max-w-md text-sm text-[var(--muted)]">
            Aqui está o resumo da sua clínica hoje.
          </p>
          <div className="absolute -right-2 bottom-0 hidden sm:block">
            <Parrot className="h-32 w-32" />
          </div>
        </div>

        {error && (
          <p className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>
        )}

        {!stats && !error && (
          <p className="mb-5 text-sm text-[var(--muted)]">Carregando estatísticas...</p>
        )}

        {stats && (
          <>
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {STAT_CARDS.map((s) => (
                <div key={s.key} className="card flex items-center gap-4 p-5">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl"
                    style={{ background: s.bg }}
                  >
                    {s.icon}
                  </div>
                  <div>
                    <p className="font-[family-name:var(--font-baloo)] text-2xl font-bold" style={{ color: s.fg }}>
                      {stats[s.key]}
                      {s.suffix ?? ""}
                    </p>
                    <p className="text-xs text-[var(--muted)]">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
              <div className="card p-6">
                <h3 className="mb-4 font-[family-name:var(--font-baloo)] text-lg font-bold">
                  Evolução da Semana
                </h3>
                <LineChart data={stats.weekProgress.map((w) => ({ label: w.day, value: w.value }))} />
              </div>

              <div className="card p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-[family-name:var(--font-baloo)] text-lg font-bold">
                    Últimas Sessões
                  </h3>
                  <Link href="/sessions/new" className="text-xs font-semibold text-[var(--brand-purple)] hover:underline">
                    Nova sessão
                  </Link>
                </div>
                <div className="flex flex-col gap-4">
                  {(recentSessions ?? []).map((s) => (
                    <div key={s.id} className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F2F4FB] text-sm font-semibold">
                        {s.childName.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{s.childName}</p>
                        <p className="text-xs text-[var(--muted)]">{timeAgo(s.finishedAt)}</p>
                      </div>
                      <p className="text-sm font-semibold text-[var(--brand-purple)]">
                        {s.wordsCompleted}/{s.wordsAttempted}
                      </p>
                    </div>
                  ))}
                  {recentSessions && recentSessions.length === 0 && (
                    <p className="py-4 text-center text-xs text-[var(--muted)]">
                      Nenhuma sessão praticada ainda pelos pacientes.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
