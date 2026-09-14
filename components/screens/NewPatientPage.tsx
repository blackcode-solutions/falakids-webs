"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeftIcon, PatientsIcon } from "@/components/icons";
import { ApiError, createPatient, createPatientInvite, type CreatePatientInput } from "@/lib/api";

function toIsoDate(brDate: string): string | undefined {
  // Accepts "dd/mm/aaaa" (as typed by the therapist) and converts to the
  // ISO format the API expects. Also passes through values already in ISO.
  if (/^\d{4}-\d{2}-\d{2}$/.test(brDate)) return brDate;
  const match = brDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return undefined;
  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
}

const EMPTY: Record<string, string> = {
  name: "",
  birthDate: "",
  diagnosis: "",
  startDate: "",
  observations: "",
  responsibleName: "",
  responsibleRelation: "",
  responsiblePhone: "",
  responsibleEmail: "",
  frequency: "",
  mainGoal: "",
};

export default function NewPatientPage() {
  const [fields, setFields] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ patientName: string; inviteCode?: string } | null>(null);

  function set(key: string, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const birthDate = toIsoDate(fields.birthDate);
    if (!fields.name.trim()) {
      setError("Informe o nome da criança.");
      return;
    }
    if (!birthDate) {
      setError("Data de nascimento inválida. Use o formato dd/mm/aaaa.");
      return;
    }

    const startDate = fields.startDate ? toIsoDate(fields.startDate) : undefined;
    const payload: CreatePatientInput = {
      name: fields.name,
      birthDate,
      diagnosis: fields.diagnosis || undefined,
      startDate,
      observations: fields.observations || undefined,
      responsibleName: fields.responsibleName || undefined,
      responsibleRelation: fields.responsibleRelation || undefined,
      responsiblePhone: fields.responsiblePhone || undefined,
      responsibleEmail: fields.responsibleEmail || undefined,
      frequency: fields.frequency || undefined,
      mainGoal: fields.mainGoal || undefined,
    };

    setSaving(true);
    try {
      const { patient } = await createPatient(payload);
      let inviteCode: string | undefined;
      try {
        const { invite } = await createPatientInvite(patient.id);
        inviteCode = invite.code;
      } catch {
        // Non-fatal: the patient record was created either way, the
        // therapist can generate an invite later from the patient's profile.
      }
      setResult({ patientName: patient.name, inviteCode });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível cadastrar o paciente.");
    } finally {
      setSaving(false);
    }
  }

  if (result) {
    return (
      <div className="min-h-screen p-4 sm:p-8">
        <div className="mx-auto mt-8 max-w-xl card p-6 text-center sm:mt-16 sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-3xl">✓</div>
          <h1 className="mt-5 font-[family-name:var(--font-baloo)] text-2xl font-bold sm:text-3xl">Paciente cadastrado!</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            O perfil de {result.patientName} foi criado e já está disponível na lista de pacientes.
          </p>

          {result.inviteCode && (
            <div className="mt-6 rounded-2xl border border-dashed border-[var(--brand-blue)] bg-[#F5F9FF] p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-blue)]">
                Código para o app do responsável
              </p>
              <p className="mt-2 font-mono text-3xl font-extrabold tracking-widest text-[var(--brand-blue)]">
                {result.inviteCode}
              </p>
              <p className="mt-2 text-xs text-[var(--muted)]">
                Compartilhe esse código com a família. No app FalaKids, em &quot;Vincular clínica&quot;, é só digitar
                o código para começar a receber as atividades enviadas por você. Válido por 72 horas.
              </p>
            </div>
          )}

          <Link href="/patients" className="mt-7 inline-block rounded-xl bg-[var(--brand-blue)] px-6 py-3 text-sm font-semibold text-white">
            Voltar para pacientes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-5 lg:p-8">
      <Link href="/patients" className="mb-5 inline-flex items-center gap-1 text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)]">
        <ChevronLeftIcon className="h-4 w-4" />
        Voltar
      </Link>
      <div className="mb-7">
        <h1 className="font-[family-name:var(--font-baloo)] text-2xl font-bold sm:text-3xl">Novo paciente</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">Cadastre os dados da criança e do responsável.</p>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto max-w-5xl space-y-6">
        <Section title="Dados da criança" icon={<PatientsIcon className="h-5 w-5" />}>
          <Grid
            fields={[
              ["name", "Nome completo", "João Pedro", true],
              ["birthDate", "Data de nascimento", "dd/mm/aaaa", true],
              ["diagnosis", "Diagnóstico", "Dislalia"],
              ["startDate", "Data de início", "dd/mm/aaaa"],
            ]}
            values={fields}
            onChange={set}
          />
          <div className="mt-5">
            <label>Observações</label>
            <textarea
              value={fields.observations}
              onChange={(e) => set("observations", e.target.value)}
              className="input mt-2 min-h-24"
              placeholder="Descreva informações importantes para o atendimento..."
            />
          </div>
        </Section>

        <Section title="Responsável" icon={<span className="text-lg">👨‍👩‍👦</span>}>
          <Grid
            fields={[
              ["responsibleName", "Nome do responsável", "Juliana Silva"],
              ["responsibleRelation", "Parentesco", "Mãe"],
              ["responsiblePhone", "Telefone", "(98) 98765-4321"],
              ["responsibleEmail", "E-mail", "juliana@email.com"],
            ]}
            values={fields}
            onChange={set}
          />
        </Section>

        <Section title="Plano terapêutico" icon={<span className="text-lg">🎯</span>}>
          <Grid
            fields={[
              ["frequency", "Frequência", "2x por semana"],
              ["mainGoal", "Objetivo principal", "Trabalhar fonema /r/"],
            ]}
            values={fields}
            onChange={set}
          />
        </Section>

        {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>}

        <div className="flex flex-col-reverse gap-3 pb-5 sm:flex-row sm:justify-end">
          <Link href="/patients" className="rounded-xl border border-[var(--panel-border)] bg-white px-5 py-3 text-center text-sm font-semibold">
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-[var(--brand-blue)] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:brightness-95 disabled:opacity-60"
          >
            {saving ? "Cadastrando..." : "Cadastrar paciente"}
          </button>
        </div>
      </form>
      <style jsx global>{`
        label {
          display: block;
          font-size: 14px;
          font-weight: 600;
        }
        .input {
          width: 100%;
          border: 1px solid var(--panel-border);
          border-radius: 12px;
          background: #fff;
          padding: 12px 14px;
          font-size: 14px;
          outline: none;
        }
        .input:focus {
          border-color: var(--brand-blue);
          box-shadow: 0 0 0 3px #4f6ef71a;
        }
      `}</style>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="card p-4 sm:p-6 lg:p-7">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF2FF] text-[var(--brand-blue)]">{icon}</div>
        <div>
          <h2 className="font-[family-name:var(--font-baloo)] text-xl font-bold">{title}</h2>
          <p className="text-xs text-[var(--muted)]">Preencha as informações abaixo</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function Grid({
  fields,
  values,
  onChange,
}: {
  fields: [string, string, string, boolean?][];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
}) {
  return (
    <div className="mt-6 grid gap-5 md:grid-cols-2">
      {fields.map(([key, label, placeholder, required]) => (
        <div key={key}>
          <label>{label}</label>
          <input
            className="input mt-2"
            value={values[key]}
            onChange={(e) => onChange(key, e.target.value)}
            placeholder={placeholder}
            required={required}
          />
        </div>
      ))}
    </div>
  );
}
