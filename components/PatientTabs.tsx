"use client";

import { useState } from "react";
import {
  ApiError,
  createAssignment,
  deleteAssignment,
  type ClinicPatient,
  type PatientAssignment,
  type PatientSessionSummary,
} from "@/lib/api";
import { ClockIcon } from "@/components/icons";

const TABS = ["Geral", "Sessões", "Tarefas"] as const;
type Tab = (typeof TABS)[number];

export default function PatientTabs({
  patient,
  assignments,
  sessions,
  onAssignmentsChanged,
}: {
  patient: ClinicPatient;
  assignments: PatientAssignment[];
  sessions: PatientSessionSummary[];
  onAssignmentsChanged: () => void;
}) {
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
            {t === "Tarefas" && assignments.some((a) => a.status === "PENDING") && (
              <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--brand-orange)] px-1 text-[10px] text-white">
                {assignments.filter((a) => a.status === "PENDING").length}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === "Geral" && (
        <div className="flex flex-col gap-5">
          <div className="rounded-2xl border border-[var(--panel-border)] p-5">
            <h3 className="mb-4 font-[family-name:var(--font-baloo)] text-lg font-extrabold">Informações Gerais</h3>
            <dl className="flex flex-col gap-3 text-sm">
              <Field label="Data de nascimento" value={formatDate(patient.birthDate)} />
              <Field label="Diagnóstico" value={patient.diagnosis || "—"} />
              <Field label="Data de início" value={patient.startDate ? formatDate(patient.startDate) : "—"} />
              <Field label="Frequência" value={patient.frequency || "—"} />
              <Field label="Objetivo principal" value={patient.mainGoal || "—"} />
              <Field label="Observações" value={patient.observations || "—"} />
            </dl>
          </div>
        </div>
      )}

      {tab === "Sessões" && (
        <div className="flex flex-col gap-3">
          {sessions.length === 0 && (
            <p className="text-sm text-[var(--muted)]">
              Nenhuma sessão registrada no app ainda{!patient.isClaimed ? " — o responsável precisa vincular o app primeiro." : "."}
            </p>
          )}
          {sessions.map((s) => (
            <div key={s.id} className="flex items-center justify-between rounded-xl border border-[var(--panel-border)] px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--wash-blue)] text-[var(--brand-blue-dark)]">
                  <ClockIcon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-bold">{s.wordsCompleted}/{s.wordsAttempted} palavras concluídas</p>
                  <p className="text-xs font-medium text-[var(--muted)]">{formatDateTime(s.startedAt)}</p>
                </div>
              </div>
              <span className="badge badge-green">
                {s.wordsAttempted > 0 ? `${Math.round((s.wordsCompleted / s.wordsAttempted) * 100)}%` : "—"}
              </span>
            </div>
          ))}
        </div>
      )}

      {tab === "Tarefas" && (
        <TasksTab patientId={patient.id} assignments={assignments} onChanged={onAssignmentsChanged} />
      )}
    </div>
  );
}

function TasksTab({
  patientId,
  assignments,
  onChanged,
}: {
  patientId: string;
  assignments: PatientAssignment[];
  onChanged: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!title.trim()) {
      setError("Dê um título para a atividade.");
      return;
    }
    setSaving(true);
    try {
      await createAssignment(patientId, { title, notes: notes || undefined, dueDate: dueDate || undefined });
      setTitle("");
      setNotes("");
      setDueDate("");
      setShowForm(false);
      onChanged();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível enviar a atividade.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(assignmentId: string) {
    try {
      await deleteAssignment(patientId, assignmentId);
      onChanged();
    } catch {
      // Silent: the list will simply keep showing it, no destructive state lost.
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--muted)]">Atividades enviadas para praticar em casa.</p>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="focus-ring rounded-full bg-[var(--brand-blue)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          {showForm ? "Cancelar" : "+ Enviar atividade"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSend} className="flex flex-col gap-3 rounded-2xl border border-[var(--panel-border)] p-4">
          <div>
            <label className="text-sm font-semibold">Título</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Praticar fonema /r/ — 10 palavras"
              className="input mt-1.5"
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Instruções (opcional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Praticar 10 minutos por dia, de preferência após o jantar."
              className="input mt-1.5 min-h-20"
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Prazo (opcional)</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="input mt-1.5" />
          </div>
          {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className="self-end rounded-xl bg-[var(--brand-blue)] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Enviando..." : "Enviar para o paciente"}
          </button>
          <style jsx global>{`
            .input {
              width: 100%;
              border: 1px solid var(--panel-border);
              border-radius: 12px;
              background: #fff;
              padding: 10px 14px;
              font-size: 14px;
              outline: none;
            }
            .input:focus {
              border-color: var(--brand-blue);
              box-shadow: 0 0 0 3px #4f6ef71a;
            }
          `}</style>
        </form>
      )}

      <div className="flex flex-col gap-3">
        {assignments.length === 0 && <p className="text-sm text-[var(--muted)]">Nenhuma atividade enviada ainda.</p>}
        {assignments.map((t) => (
          <div key={t.id} className="flex items-center justify-between gap-3 rounded-xl border border-[var(--panel-border)] px-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{t.title}</p>
              <p className="text-xs font-medium text-[var(--muted)]">
                Enviada em {formatDate(t.createdAt)}
                {t.dueDate ? ` · Prazo ${formatDate(t.dueDate)}` : ""}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className={`badge ${t.status === "COMPLETED" ? "badge-green" : "badge-orange"}`}>
                {t.status === "COMPLETED" ? "Concluída" : "Pendente"}
              </span>
              <button
                onClick={() => handleDelete(t.id)}
                aria-label="Remover atividade"
                className="focus-ring text-xs font-semibold text-[var(--muted)] hover:text-red-600"
              >
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>
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

function formatDate(iso: string): string {
  const [year, month, day] = iso.slice(0, 10).split("-");
  if (!year || !month || !day) return iso;
  return `${day}/${month}/${year}`;
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
