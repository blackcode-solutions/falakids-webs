"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronLeftIcon, PatientsIcon } from "@/components/icons";

export default function NewPatientPage() {
  const [saved, setSaved] = useState(false);
  if (saved) return <div className="min-h-screen p-4 sm:p-8"><div className="mx-auto mt-8 max-w-xl card p-6 text-center sm:mt-16 sm:p-10"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-3xl">✓</div><h1 className="mt-5 font-[family-name:var(--font-baloo)] text-2xl font-bold sm:text-3xl">Paciente cadastrado!</h1><p className="mt-2 text-sm text-[var(--muted)]">O perfil de João Pedro foi criado e já está disponível na lista de pacientes.</p><Link href="/patients" className="mt-7 inline-block rounded-xl bg-[var(--brand-blue)] px-6 py-3 text-sm font-semibold text-white">Voltar para pacientes</Link></div></div>;
  return <div className="min-h-screen p-4 sm:p-5 lg:p-8">
    <Link href="/patients" className="mb-5 inline-flex items-center gap-1 text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)]"><ChevronLeftIcon className="h-4 w-4"/>Voltar</Link>
    <div className="mb-7"><h1 className="font-[family-name:var(--font-baloo)] text-2xl font-bold sm:text-3xl">Novo paciente</h1><p className="mt-1 text-sm text-[var(--muted)]">Cadastre os dados da criança e do responsável.</p></div>
    <form onSubmit={(e) => { e.preventDefault(); setSaved(true); }} className="mx-auto max-w-5xl space-y-6">
      <Section title="Dados da criança" icon={<PatientsIcon className="h-5 w-5" />}><Grid fields={[["Nome completo", "João Pedro"],["Data de nascimento", "12/03/2019"],["Diagnóstico", "Dislalia"],["Data de início", "31/08/2026"]]} /><div className="mt-5"><label>Observações</label><textarea className="input mt-2 min-h-24" placeholder="Descreva informações importantes para o atendimento..." /></div></Section>
      <Section title="Responsável" icon={<span className="text-lg">👨‍👩‍👦</span>}><Grid fields={[["Nome do responsável", "Juliana Silva"],["Parentesco", "Mãe"],["Telefone", "(98) 98765-4321"],["E-mail", "juliana@email.com"]]} /></Section>
      <Section title="Plano terapêutico" icon={<span className="text-lg">🎯</span>}><Grid fields={[["Frequência", "2x por semana"],["Objetivo principal", "Trabalhar fonema /r/"],["Fonoaudióloga", "Dra. Amanda"],["Duração prevista", "45 minutos"]]} /></Section>
      <div className="flex flex-col-reverse gap-3 pb-5 sm:flex-row sm:justify-end"><Link href="/patients" className="rounded-xl border border-[var(--panel-border)] bg-white px-5 py-3 text-center text-sm font-semibold">Cancelar</Link><button className="rounded-xl bg-[var(--brand-blue)] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:brightness-95">Cadastrar paciente</button></div>
    </form>
    <style jsx global>{`label{display:block;font-size:14px;font-weight:600}.input{width:100%;border:1px solid var(--panel-border);border-radius:12px;background:#fff;padding:12px 14px;font-size:14px;outline:none}.input:focus{border-color:var(--brand-blue);box-shadow:0 0 0 3px #4f6ef71a}`}</style>
  </div>;
}
function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) { return <section className="card p-4 sm:p-6 lg:p-7"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF2FF] text-[var(--brand-blue)]">{icon}</div><div><h2 className="font-[family-name:var(--font-baloo)] text-xl font-bold">{title}</h2><p className="text-xs text-[var(--muted)]">Preencha as informações abaixo</p></div></div>{children}</section>; }
function Grid({ fields }: { fields: string[][] }) { return <div className="mt-6 grid gap-5 md:grid-cols-2">{fields.map(([label, value]) => <div key={label}><label>{label}</label><input className="input mt-2" defaultValue={value} /></div>)}</div>; }
