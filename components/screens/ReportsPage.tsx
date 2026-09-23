"use client";

import { useEffect, useState } from "react";
import Topbar from "@/components/Topbar";
import BarChart from "@/components/BarChart";
import { BuildingIcon, DownloadIcon, UserIcon } from "@/components/icons";
import {
  ApiError,
  getClinicReport,
  getPatientReport,
  listPatients,
  type ClinicPatient,
  type ClinicReport,
  type PatientReport,
} from "@/lib/api";

type View = "CLINIC" | "PATIENT";

function formatDuration(totalSecs: number): string {
  const mins = Math.round(totalSecs / 60);
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

function formatDate(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export default function ReportsPage() {
  const [view, setView] = useState<View>("CLINIC");
  const [patients, setPatients] = useState<ClinicPatient[] | null>(null);
  const [patientId, setPatientId] = useState<string | null>(null);

  const [clinicReport, setClinicReport] = useState<ClinicReport | null>(null);
  const [patientReport, setPatientReport] = useState<PatientReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listPatients()
      .then((res) => {
        setPatients(res.patients);
        setPatientId((current) => current ?? res.patients[0]?.id ?? null);
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : "Não foi possível carregar os pacientes."));
  }, []);

  useEffect(() => {
    if (view !== "CLINIC") return;
    setClinicReport(null);
    getClinicReport(6)
      .then((res) => setClinicReport(res.report))
      .catch((err) => setError(err instanceof ApiError ? err.message : "Não foi possível carregar o relatório da clínica."));
  }, [view]);

  useEffect(() => {
    if (view !== "PATIENT" || !patientId) return;
    setPatientReport(null);
    getPatientReport(patientId, 6)
      .then((res) => setPatientReport(res.report))
      .catch((err) => setError(err instanceof ApiError ? err.message : "Não foi possível carregar o relatório do paciente."));
  }, [view, patientId]);

  const patient = patients?.find((p) => p.id === patientId) ?? null;

  return (
    <div className="pb-10">
      <Topbar
        title="Evolução e Relatórios"
        actions={
          <button className="focus-ring btn-outline">
            <DownloadIcon className="h-4 w-4" /> Exportar PDF
          </button>
        }
      />

      <div className="px-4 sm:px-6 lg:px-8">
        {/* The report split the fono asked for: the clinic as a whole, or
            one patient at a time — same shape of numbers either way. */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-full border border-[var(--panel-border)] bg-white p-1 text-sm shadow-sm">
            <button
              onClick={() => setView("CLINIC")}
              className={`focus-ring flex items-center gap-1.5 rounded-full px-4 py-2 font-bold transition-colors ${
                view === "CLINIC" ? "bg-[var(--brand-blue)] text-white" : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              <BuildingIcon className="h-4 w-4" /> Clínica
            </button>
            <button
              onClick={() => setView("PATIENT")}
              className={`focus-ring flex items-center gap-1.5 rounded-full px-4 py-2 font-bold transition-colors ${
                view === "PATIENT" ? "bg-[var(--brand-blue)] text-white" : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              <UserIcon className="h-4 w-4" /> Por paciente
            </button>
          </div>

          {view === "PATIENT" && patients && patients.length > 0 && (
            <select
              value={patientId ?? ""}
              onChange={(e) => setPatientId(e.target.value)}
              className="focus-ring rounded-xl border border-[var(--panel-border)] bg-white px-3 py-2.5 text-sm font-semibold"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {error && (
          <p className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>
        )}

        {view === "PATIENT" && patients && patients.length === 0 && !error && (
          <p className="py-10 text-center text-sm text-[var(--muted)]">
            Você ainda não tem pacientes cadastrados.
          </p>
        )}

        {view === "CLINIC" && (!clinicReport ? (
          <p className="py-10 text-center text-sm text-[var(--muted)]">Carregando relatório da clínica...</p>
        ) : (
          <ClinicView report={clinicReport} />
        ))}

        {view === "PATIENT" && patientId && (!patientReport ? (
          <p className="py-10 text-center text-sm text-[var(--muted)]">Carregando relatório do paciente...</p>
        ) : (
          <PatientView report={patientReport} patientName={patient?.name ?? ""} />
        ))}
      </div>
    </div>
  );
}

function ClinicView({ report }: { report: ClinicReport }) {
  return (
    <>
      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="card p-4 sm:p-6">
          <h3 className="mb-1 font-[family-name:var(--font-baloo)] text-lg font-extrabold">
            Evolução da clínica
          </h3>
          <p className="mb-4 text-xs text-[var(--muted)]">% de acerto médio por mês, todos os pacientes</p>
          <BarChart data={report.monthlyEvolution.map((m) => ({ label: m.month, value: m.value }))} />
        </div>

        <AccuracyDial accuracyPct={report.accuracyPct} label="Acerto Geral da Clínica" sublabel={`${report.activePatients} paciente(s) ativos`} />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Pacientes ativos" value={report.activePatients} color="#2E5AE8" bg="#EAF1FF" />
        <StatCard label="Sessões concluídas" value={report.totalSessions} color="#1FAE6A" bg="#E7F9EE" />
        <StatCard label="Palavras praticadas" value={report.totalWordsAttempted} color="#E88C1F" bg="#FFF3E0" />
        <StatCard label="Tempo total" value={formatDuration(report.totalDurationSecs)} color="#9B5DE5" bg="#F5EEFF" />
      </div>

      <div className="card mt-6 overflow-x-auto p-4 sm:p-6">
        <h3 className="mb-4 font-[family-name:var(--font-baloo)] text-lg font-extrabold">Por paciente</h3>
        {report.perPatient.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">Nenhum paciente com sessões concluídas ainda.</p>
        ) : (
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                <th className="pb-2">Paciente</th>
                <th className="pb-2">Sessões</th>
                <th className="pb-2">Acerto</th>
                <th className="pb-2">Tempo total</th>
                <th className="pb-2">Última sessão</th>
              </tr>
            </thead>
            <tbody>
              {report.perPatient.map((p) => (
                <tr key={p.childId} className="border-t border-[var(--panel-border)]">
                  <td className="py-2.5 font-semibold">{p.name}</td>
                  <td className="py-2.5">{p.totalSessions}</td>
                  <td className="py-2.5">
                    <span
                      className={`badge ${p.accuracyPct >= 70 ? "badge-green" : p.accuracyPct >= 40 ? "badge-orange" : "badge-blue"}`}
                    >
                      {p.accuracyPct}%
                    </span>
                  </td>
                  <td className="py-2.5">{formatDuration(p.totalDurationSecs)}</td>
                  <td className="py-2.5 text-[var(--muted)]">{formatDate(p.lastSessionAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

function PatientView({ report, patientName }: { report: PatientReport; patientName: string }) {
  return (
    <>
      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="card p-4 sm:p-6">
          <h3 className="mb-1 font-[family-name:var(--font-baloo)] text-lg font-extrabold">Evolução</h3>
          <p className="mb-4 text-xs text-[var(--muted)]">% de acerto médio por mês</p>
          <BarChart data={report.monthlyEvolution.map((m) => ({ label: m.month, value: m.value }))} />
        </div>

        <AccuracyDial accuracyPct={report.accuracyPct} label="Evolução Geral" sublabel={patientName} />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Sessões concluídas" value={report.totalSessions} color="#2E5AE8" bg="#EAF1FF" />
        <StatCard label="Palavras corretas" value={report.totalWordsCompleted} color="#1FAE6A" bg="#E7F9EE" />
        <StatCard label="Palavras praticadas" value={report.totalWordsAttempted} color="#E88C1F" bg="#FFF3E0" />
        <StatCard label="Tempo total" value={formatDuration(report.totalDurationSecs)} color="#9B5DE5" bg="#F5EEFF" />
      </div>
    </>
  );
}

function AccuracyDial({ accuracyPct, label, sublabel }: { accuracyPct: number; label: string; sublabel: string }) {
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - accuracyPct / 100);

  return (
    <div className="card flex flex-col items-center justify-center gap-3 p-4 sm:p-6">
      <div className="relative flex h-32 w-32 items-center justify-center">
        <svg viewBox="0 0 110 110" className="h-32 w-32 -rotate-90">
          <circle cx="55" cy="55" r={radius} fill="none" stroke="#EEF0F8" strokeWidth="10" />
          <circle
            cx="55"
            cy="55"
            r={radius}
            fill="none"
            stroke="var(--brand-green)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <span className="absolute font-[family-name:var(--font-baloo)] text-2xl font-bold text-[var(--brand-green)]">
          {accuracyPct}%
        </span>
      </div>
      <p className="text-sm font-bold text-[var(--muted-strong)]">{label}</p>
      <p className="text-xs text-[var(--muted)]">{sublabel}</p>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
  bg,
}: {
  label: string;
  value: string | number;
  color: string;
  bg: string;
}) {
  return (
    <div className="rounded-[22px] p-4 sm:p-5" style={{ background: bg }}>
      <p className="font-[family-name:var(--font-baloo)] text-lg font-extrabold sm:text-2xl" style={{ color }}>
        {value}
      </p>
      <p className="mt-1 text-xs font-semibold text-[var(--muted-strong)]">{label}</p>
    </div>
  );
}
