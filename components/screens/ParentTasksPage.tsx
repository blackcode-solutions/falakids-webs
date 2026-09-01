"use client";
import { useState } from "react";
import { parentTasks } from "@/lib/data";

export default function ParentTasksPage() {
  const [tasks, setTasks] = useState(parentTasks);
  const pending = tasks.filter(t => t.status === "pendente");
  const done = tasks.filter(t => t.status === "concluida");
  return <div className="min-h-screen p-4 sm:p-5 lg:p-8">
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm text-[var(--muted)]">João Pedro</p><h1 className="font-[family-name:var(--font-baloo)] text-2xl font-bold sm:text-3xl">Tarefas para casa</h1><p className="mt-1 text-sm text-[var(--muted)]">Ajude o João a praticar um pouquinho todos os dias. 💙</p></div><div className="self-start rounded-2xl bg-[#FFF2DD] px-5 py-3 text-center sm:self-auto"><p className="text-xs text-[var(--muted)]">Esta semana</p><p className="font-[family-name:var(--font-baloo)] text-xl font-bold">2/5</p></div></div>
    <div className="mb-6 grid gap-4 md:grid-cols-3"><Stat label="Pendentes" value={pending.length} tone="orange"/><Stat label="Concluídas" value={done.length} tone="green"/><Stat label="Progresso" value="67%" tone="purple"/></div>
    <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
      <section className="card p-6"><h2 className="font-[family-name:var(--font-baloo)] text-xl font-bold">Para fazer</h2><div className="mt-4 space-y-3">{pending.map(task => <TaskCard key={task.id} title={task.title} count={task.activitiesCount} onDone={() => setTasks(tasks.map(t => t.id === task.id ? {...t,status:"concluida"} : t))}/>)}</div></section>
      <section className="card p-6"><h2 className="font-[family-name:var(--font-baloo)] text-xl font-bold">Como está indo?</h2><div className="mt-5 flex items-center gap-5"><div className="relative flex h-28 w-28 items-center justify-center rounded-full border-[10px] border-[#DFF5E9]"><span className="font-[family-name:var(--font-baloo)] text-2xl font-bold text-[var(--brand-green)]">67%</span></div><div><p className="font-semibold">Muito bem!</p><p className="mt-1 text-sm text-[var(--muted)]">Continue praticando para manter a evolução.</p></div></div><div className="mt-6 border-t border-[var(--panel-border)] pt-5"><p className="text-sm font-semibold">Concluídas recentemente</p>{done.map(t=><div key={t.id} className="mt-3 flex items-center justify-between text-sm"><span>{t.title}</span><span className="font-semibold text-[var(--brand-green)]">100%</span></div>)}</div></section>
    </div>
  </div>;
}
function Stat({label,value,tone}:{label:string;value:string|number;tone:string}) { const bg=tone==="orange"?"#FFF2DD":tone==="green"?"#E6F8EF":"#EEE9FF"; return <div className="card p-5" style={{background:bg}}><p className="text-sm text-[var(--muted)]">{label}</p><p className="mt-1 font-[family-name:var(--font-baloo)] text-3xl font-bold">{value}</p></div> }
function TaskCard({title,count,onDone}:{title:string;count:number;onDone:()=>void}) { return <div className="rounded-2xl border border-[var(--panel-border)] p-4 sm:p-5"><div className="flex flex-col items-start justify-between gap-4 sm:flex-row"><div className="min-w-0"><div className="flex items-center gap-2"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EEF2FF]">🎯</span><h3 className="font-semibold">{title}</h3></div><p className="mt-3 text-sm text-[var(--muted)]">{count} atividades · Enviado pela Dra. Amanda</p></div><button onClick={onDone} className="w-full shrink-0 rounded-xl bg-[var(--brand-orange)] px-4 py-2 text-sm font-semibold text-white sm:w-auto">Começar</button></div></div> }
