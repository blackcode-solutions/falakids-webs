"use client";

import { useState } from "react";
import Topbar from "@/components/Topbar";
import BarChart from "@/components/BarChart";
import { DownloadIcon } from "@/components/icons";
import { patients, monthlyEvolution, reportStats, overallProgress } from "@/lib/data";

export default function ReportsPage() {
  const [patientId, setPatientId] = useState(patients[0].id);
  const patient = patients.find((p) => p.id === patientId)!;

  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - overallProgress / 100);

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

      <div className="px-8">
        <div className="mb-6">
          <label className="text-xs font-semibold text-[var(--muted)]">Paciente</label>
          <select
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="focus-ring mt-1 block w-full max-w-xs rounded-xl border border-[var(--panel-border)] bg-white px-3 py-2.5 text-sm font-semibold"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
          <div className="card p-6">
            <h3 className="mb-1 font-[family-name:var(--font-baloo)] text-lg font-extrabold">
              Evolução do Fonema R
            </h3>
            <p className="mb-4 text-xs text-[var(--muted)]">(Posição inicial)</p>
            <BarChart data={monthlyEvolution.map((m) => ({ label: m.month, value: m.value }))} />
          </div>

          <div className="card flex flex-col items-center justify-center gap-3 p-6">
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
                {overallProgress}%
              </span>
            </div>
            <p className="text-sm font-bold text-[var(--muted-strong)]">Evolução Geral</p>
            <p className="text-xs text-[var(--muted)]">{patient.name}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Acertos" value={reportStats.acertos} color="#1FAE6A" bg="#E7F9EE" />
          <StatCard label="Erros" value={reportStats.erros} color="#E9457C" bg="#FDEAF0" />
          <StatCard label="Atividades" value={reportStats.atividades} color="#2E5AE8" bg="#EAF1FF" />
          <StatCard label="Tempo total" value={reportStats.tempoTotal} color="#E88C1F" bg="#FFF3E0" />
        </div>
      </div>
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
    <div className="rounded-[22px] p-5" style={{ background: bg }}>
      <p className="font-[family-name:var(--font-baloo)] text-2xl font-extrabold" style={{ color }}>
        {value}
      </p>
      <p className="mt-1 text-xs font-semibold text-[var(--muted-strong)]">{label}</p>
    </div>
  );
}