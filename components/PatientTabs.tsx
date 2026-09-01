"use client";

import { useState } from "react";
import type { Patient } from "@/lib/data";
import {
  patientSessions,
  patientTasks,
  patientFiles,
  monthlyEvolution,
} from "@/lib/data";
import LineChart from "@/components/LineChart";
import { CheckIcon, ClockIcon, DownloadIcon } from "@/components/icons";

const TABS = ["Geral", "Histórico", "Sessões", "Tarefas", "Evolução", "Arquivos"] as const;
type Tab = (typeof TABS)[number];

export default function PatientTabs({ patient }: { patient: Patient }) {
  const [tab, setTab] = useState<Tab>("Geral");

  return (
    <div className="card p-4 sm:p-6">
      <div className="mb-6 flex gap-1 overflow-x-auto border-b border-[var(--panel-border)] pb-0">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`focus-ring shrink-0 rounded-t-lg px-4 py-2.5 text-sm font-bold transition-colors ${
              tab === t
                ? "border-b-[3px] border-[var(--brand-blue)] text-[var(--brand-blue)]"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Geral" && (
        <div className="flex flex-col gap-5">
          <div className="rounded-2xl border border-[var(--panel-border)] p-5">
            <h3 className="mb-4 font-[family-name:var(--font-baloo)] text-lg font-extrabold">
              Informações Gerais
            </h3>
            <dl className="flex flex-col gap-3 text-sm">
              <Field label="Data de nascimento" value={patient.birthDate} />
              <Field label="Diagnóstico" value={patient.diagnosis} />
              <Field label="Data de início" value={patient.startDate} />
              <Field label="Frequência" value={patient.frequency} />
              <Field label="Observações" value={patient.observations} />
            </dl>
          </div>
          <div className="rounded-2xl border border-[var(--panel-border)] p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-[family-name:var(--font-baloo)] text-base font-extrabold">
                Notas da Fono
              </h3>
              <button className="focus-ring badge badge-blue hover:brightness-95">
                Adicionar nota
              </button>
            </div>
            <p className="text-sm leading-relaxed text-[var(--muted-strong)]">{patient.fonoNote}</p>
          </div>
        </div>
      )}

      {tab === "Histórico" && (
        <ol className="flex flex-col gap-5">
          {patientSessions
            .filter((s) => s.status === "concluída")
            .map((s, i) => (
              <li key={s.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--wash-blue)] text-[var(--brand-blue-dark)]">
                    <CheckIcon className="h-4 w-4" />
                  </span>
                  {i < patientSessions.length - 1 && (
                    <span className="mt-1 w-px flex-1 bg-[var(--panel-border)]" />
                  )}
                </div>
                <div className="pb-2">
                  <p className="text-sm font-semibold">
                    Sessão de fonema /{s.phoneme}/ &mdash; posição {s.position.toLowerCase()}
                  </p>
                  <p className="text-xs text-[var(--muted)]">{s.date} &middot; Pontuação {s.score}%</p>
                </div>
              </li>
            ))}
        </ol>
      )}

      {tab === "Sessões" && (
        <div className="flex flex-col gap-3">
          {patientSessions.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between rounded-xl border border-[var(--panel-border)] px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full ${
                    s.status === "concluída" ? "bg-[var(--wash-green)] text-[var(--brand-green-dark)]" : "bg-[var(--wash-blue)] text-[var(--brand-blue-dark)]"
                  }`}
                >
                  <ClockIcon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-bold">Fonema /{s.phoneme}/ &middot; {s.position}</p>
                  <p className="text-xs font-medium text-[var(--muted)]">{s.date}</p>
                </div>
              </div>
              <span className={`badge ${s.status === "concluída" ? "badge-green" : "badge-blue"}`}>
                {s.status === "concluída" ? `${s.score}%` : "Agendada"}
              </span>
            </div>
          ))}
        </div>
      )}

      {tab === "Tarefas" && (
        <div className="flex flex-col gap-3">
          {patientTasks.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between rounded-xl border border-[var(--panel-border)] px-4 py-3"
            >
              <div>
                <p className="text-sm font-bold">{t.title}</p>
                <p className="text-xs font-medium text-[var(--muted)]">Enviada em {t.sentDate}</p>
              </div>
              <span className={`badge ${t.status === "concluída" ? "badge-green" : "badge-orange"}`}>
                {t.status === "concluída" ? "Concluída" : "Pendente"}
              </span>
            </div>
          ))}
        </div>
      )}

      {tab === "Evolução" && (
        <div>
          <h3 className="mb-4 font-[family-name:var(--font-baloo)] text-lg font-bold">
            Evolução do fonema {patient.observations.match(/\/(.*?)\//)?.[0] ?? ""}
          </h3>
          <LineChart data={monthlyEvolution.map((m) => ({ label: m.month, value: m.value }))} />
        </div>
      )}

      {tab === "Arquivos" && (
        <div className="flex flex-col gap-3">
          {patientFiles.map((f) => (
            <div
              key={f.id}
              className="flex items-center justify-between rounded-xl border border-[var(--panel-border)] px-4 py-3"
            >
              <div>
                <p className="text-sm font-semibold">{f.name}</p>
                <p className="text-xs text-[var(--muted)]">{f.type} &middot; {f.date}</p>
              </div>
              <button
                aria-label="Baixar arquivo"
                className="focus-ring flex h-8 w-8 items-center justify-center rounded-full text-[var(--muted)] hover:bg-[#F2F4FB]"
              >
                <DownloadIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-[var(--panel-border)] pb-3 last:border-0 last:pb-0">
      <dt className="shrink-0 text-sm font-medium text-[var(--muted)]">{label}</dt>
      <dd className="text-right text-sm font-bold text-[var(--foreground)]">{value}</dd>
    </div>
  );
}