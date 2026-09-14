"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Topbar from "@/components/Topbar";
import { ApiError, listPatients, type ClinicPatient } from "@/lib/api";

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

export default function PatientsPage() {
  const [patients, setPatients] = useState<ClinicPatient[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    listPatients()
      .then(({ patients }) => setPatients(patients))
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : "Não foi possível carregar os pacientes.");
      });
  }, []);

  const filtered = (patients ?? []).filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <div className="pb-10">
      <Topbar
        title="Pacientes"
        search={{ placeholder: "Buscar paciente...", value: query, onChange: setQuery }}
        actions={
          <Link
            href="/patients/new"
            className="focus-ring flex items-center gap-1.5 rounded-full bg-[var(--brand-purple)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            <span className="text-base leading-none">+</span> Novo Paciente
          </Link>
        }
      />

      {error && (
        <p className="mx-4 mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 sm:mx-6 lg:mx-8">
          {error}
        </p>
      )}

      {!patients && !error && (
        <p className="px-4 text-sm text-[var(--muted)] sm:px-6 lg:px-8">Carregando pacientes...</p>
      )}

      {patients && patients.length === 0 && (
        <div className="mx-4 rounded-2xl border border-dashed border-[var(--panel-border)] p-8 text-center sm:mx-6 lg:mx-8">
          <p className="text-sm font-semibold">Você ainda não tem pacientes cadastrados.</p>
          <p className="mt-1 text-sm text-[var(--muted)]">Cadastre o primeiro paciente para começar a enviar atividades.</p>
          <Link
            href="/patients/new"
            className="mt-4 inline-block rounded-xl bg-[var(--brand-blue)] px-5 py-2.5 text-sm font-semibold text-white"
          >
            + Novo Paciente
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 px-4 sm:px-6 lg:px-8 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((p) => (
          <div key={p.id} className="card flex flex-col gap-4 p-5">
            <div className="flex items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full text-base font-semibold"
                style={{ background: colorFor(p.id) }}
              >
                {initialsOf(p.name)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{p.name}</p>
                <p className="text-xs text-[var(--muted)]">{p.age} anos</p>
                <p className="truncate text-xs text-[var(--muted)]">{p.diagnosis || "Sem diagnóstico registrado"}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              {!p.isClaimed && (
                <span className="badge badge-orange">Aguardando responsável vincular o app</span>
              )}
              {p.pendingAssignments > 0 && (
                <span className="badge badge-blue">{p.pendingAssignments} atividade(s) pendente(s)</span>
              )}
            </div>

            <Link
              href={`/patients/${p.id}`}
              className="focus-ring rounded-xl border border-[var(--panel-border)] py-2 text-center text-sm font-semibold text-[var(--foreground)] hover:bg-[#F7F8FD]"
            >
              Ver perfil
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
