"use client";

import { use, useCallback, useEffect, useState } from "react";
import Topbar from "@/components/Topbar";
import PatientTabs from "@/components/PatientTabs";
import { ApiError, getPatient, type ClinicPatient, type PatientAssignment, type PatientSessionSummary } from "@/lib/api";

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

export default function PatientProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [patient, setPatient] = useState<ClinicPatient | null>(null);
  const [assignments, setAssignments] = useState<PatientAssignment[]>([]);
  const [sessions, setSessions] = useState<PatientSessionSummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(() => {
    getPatient(id)
      .then((data) => {
        setPatient(data.patient);
        setAssignments(data.assignments);
        setSessions(data.recentSessions);
      })
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : "Não foi possível carregar o paciente.");
      });
  }, [id]);

  useEffect(() => {
    reload();
  }, [reload]);

  if (error) {
    return (
      <div className="pb-10">
        <Topbar title="Perfil do Paciente" backHref="/patients" />
        <p className="mx-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 sm:mx-6 lg:mx-8">{error}</p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="pb-10">
        <Topbar title="Perfil do Paciente" backHref="/patients" />
        <p className="px-4 text-sm text-[var(--muted)] sm:px-6 lg:px-8">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <Topbar title="Perfil do Paciente" backHref="/patients" />

      <div className="grid grid-cols-1 gap-6 px-4 sm:px-6 lg:px-8 lg:grid-cols-[280px_1fr]">
        <div className="card flex flex-col items-center p-6 text-center">
          <div
            className="flex h-24 w-24 items-center justify-center rounded-full text-2xl font-bold"
            style={{ background: colorFor(patient.id) }}
          >
            {initialsOf(patient.name)}
          </div>
          <h2 className="mt-4 font-[family-name:var(--font-baloo)] text-lg font-bold">{patient.name}</h2>
          <p className="text-xs text-[var(--muted)]">{patient.age} anos</p>
          <span className="mt-2 rounded-full bg-[#E7F9EE] px-3 py-1 text-xs font-semibold text-[#1FAE6A]">● Ativo</span>
          <p className="mt-1 text-xs text-[var(--muted)]">{patient.diagnosis || "Sem diagnóstico registrado"}</p>

          {!patient.isClaimed && (
            <p className="mt-3 rounded-xl bg-orange-50 px-3 py-2 text-xs font-medium text-orange-600">
              A família ainda não vinculou o app FalaKids a este paciente.
            </p>
          )}

          <div className="mt-6 w-full border-t border-[var(--panel-border)] pt-4 text-left">
            <p className="text-xs font-semibold text-[var(--muted)]">Responsável</p>
            <p className="text-sm font-medium">{patient.responsibleName || "—"}</p>

            <p className="mt-3 text-xs font-semibold text-[var(--muted)]">Telefone</p>
            <p className="text-sm font-medium">{patient.responsiblePhone || "—"}</p>

            <p className="mt-3 text-xs font-semibold text-[var(--muted)]">E-mail</p>
            <p className="break-words text-sm font-medium">{patient.responsibleEmail || "—"}</p>
          </div>
        </div>

        <PatientTabs patient={patient} assignments={assignments} sessions={sessions} onAssignmentsChanged={reload} />
      </div>
    </div>
  );
}
