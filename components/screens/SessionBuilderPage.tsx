"use client";

import { useState } from "react";
import Link from "next/link";
import Topbar from "@/components/Topbar";
import Parrot from "@/components/Parrot";
import KidAvatar from "@/components/KidAvatar";
import { patients, sessionBuilderActivities, activities } from "@/lib/data";
import { PlusIcon, XIcon, SearchIcon } from "@/components/icons";

type Chosen = { id: string; name: string; emoji: string };

export default function SessionBuilderPage() {
  const [patientId, setPatientId] = useState(patients[0].id);
  const [phoneme, setPhoneme] = useState("R");
  const [position, setPosition] = useState("Inicial");
  const [query, setQuery] = useState("");
  const [chosen, setChosen] = useState<Chosen[]>(
    sessionBuilderActivities.map((a) => ({ id: a.id, name: a.name, emoji: a.emoji }))
  );
  const [completed, setCompleted] = useState(false);
  const [taskSent, setTaskSent] = useState<null | boolean>(null);

  const patient = patients.find((p) => p.id === patientId)!;
  const available = activities.filter(
    (a) => a.name.toLowerCase().includes(query.toLowerCase()) && !chosen.some((c) => c.id === a.id)
  );

  function addActivity(id: string) {
    const a = activities.find((x) => x.id === id);
    if (!a) return;
    setChosen((c) => [...c, { id: a.id, name: a.name, emoji: a.emoji }]);
  }

  function removeActivity(id: string) {
    setChosen((c) => c.filter((x) => x.id !== id));
  }

  if (completed) {
    return (
      <div className="pb-10">
        <Topbar title="Tarefas" backHref="/sessions/new" />
        <div className="mx-auto max-w-xl px-8 pt-6 text-center">
          <div className="card p-10">
            <div className="mx-auto mb-2 flex h-24 w-24 items-center justify-center">
              <Parrot className="h-24 w-24" />
            </div>
            <h2 className="font-[family-name:var(--font-baloo)] text-2xl font-extrabold">
              Sessão concluída!
            </h2>
            <p className="mt-2 text-sm font-medium text-[var(--muted-strong)]">
              Deseja transformar esta sessão em tarefa para casa?
            </p>

            <div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl bg-[#F7F8FD] p-4 text-left text-sm">
              <div>
                <p className="text-xs font-semibold text-[var(--muted)]">Paciente</p>
                <p className="font-bold">{patient.name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-[var(--muted)]">Sessão</p>
                <p className="font-bold">
                  Fonema {phoneme} - {position}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-[var(--muted)]">Atividades</p>
                <p className="font-bold">{chosen.length} atividades</p>
              </div>
            </div>

            {taskSent === null ? (
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <button
                  onClick={() => setTaskSent(true)}
                  className="focus-ring rounded-2xl border-2 border-[var(--brand-blue)] bg-[var(--wash-blue)] p-5 text-center transition-colors hover:brightness-95"
                >
                  <p className="font-bold text-[var(--brand-blue-dark)]">Sim, enviar tarefa</p>
                  <p className="mt-1 text-xs font-medium text-[var(--muted)]">
                    Os responsáveis receberão no app do FalaKids
                  </p>
                  <span className="focus-ring btn-primary mt-4 w-full">
                    Enviar tarefa
                  </span>
                </button>
                <button
                  onClick={() => setTaskSent(false)}
                  className="focus-ring rounded-2xl border border-[var(--panel-border)] p-5 text-center hover:bg-[#F7F8FD]"
                >
                  <p className="font-bold">Não enviar agora</p>
                  <p className="mt-1 text-xs font-medium text-[var(--muted)]">Posso enviar depois</p>
                  <span className="focus-ring btn-outline mt-4 w-full">
                    Agora não
                  </span>
                </button>
              </div>
            ) : (
              <div className="mt-8 flex flex-col items-center gap-4">
                <p className="text-sm font-bold text-[var(--brand-green-dark)]">
                  {taskSent ? "Tarefa enviada com sucesso! 🎉" : "Tudo bem, você pode enviar depois."}
                </p>
                <Link href="/dashboard" className="focus-ring btn-primary">
                  Voltar ao Dashboard
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <Topbar
        title="Criador de Sessão"
        actions={
          <button className="focus-ring text-sm font-bold text-[var(--brand-blue)] hover:underline">
            Salvar como rascunho
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-6 px-8 lg:grid-cols-3">
        <section className="card p-5">
          <StepHeader n={1} title="Selecionar Paciente" />
          <select
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="focus-ring mt-3 w-full rounded-xl border border-[var(--panel-border)] bg-white px-3 py-2.5 text-sm"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <div className="mt-4 flex items-center gap-3 rounded-xl bg-[#F7F8FD] p-3">
            <KidAvatar seed={patient.id} className="h-10 w-10" />
            <div>
              <p className="text-sm font-bold">{patient.name}</p>
              <p className="text-xs font-medium text-[var(--muted)]">{patient.age} anos &middot; {patient.condition}</p>
            </div>
          </div>
        </section>

        <section className="card p-5">
          <StepHeader n={2} title="Definir Objetivo" />
          <div className="mt-3 grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5 text-xs font-semibold text-[var(--muted)]">
              Fonema
              <select
                value={phoneme}
                onChange={(e) => setPhoneme(e.target.value)}
                className="focus-ring rounded-xl border border-[var(--panel-border)] bg-white px-3 py-2.5 text-sm text-[var(--foreground)]"
              >
                {["R", "S", "L", "T"].map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5 text-xs font-semibold text-[var(--muted)]">
              Posição
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="focus-ring rounded-xl border border-[var(--panel-border)] bg-white px-3 py-2.5 text-sm text-[var(--foreground)]"
              >
                {["Inicial", "Medial", "Final"].map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </label>
          </div>

          <p className="mt-5 mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            Biblioteca
          </p>
          <div className="mb-3 flex items-center gap-2 rounded-full border border-[var(--panel-border)] bg-white px-3 py-2 text-sm text-[var(--muted)]">
            <SearchIcon className="h-4 w-4" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar atividades..."
              className="focus-ring w-full bg-transparent outline-none placeholder:text-[var(--muted)]"
            />
          </div>
          <div className="flex max-h-56 flex-col gap-2 overflow-y-auto pr-1">
            {available.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between rounded-xl border border-[var(--panel-border)] px-3 py-2"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-base"
                    style={{ background: a.bg }}
                  >
                    {a.emoji}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{a.name}</p>
                    <p className="text-xs text-[var(--muted)]">/{a.phoneme}/ inicial</p>
                  </div>
                </div>
                <button
                  onClick={() => addActivity(a.id)}
                  aria-label={`Adicionar ${a.name}`}
                  className="focus-ring flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-blue)] text-white shadow-sm hover:brightness-105"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
            {available.length === 0 && (
              <p className="py-4 text-center text-xs text-[var(--muted)]">Nenhum resultado.</p>
            )}
          </div>
        </section>

        <section className="card flex flex-col p-5">
          <StepHeader n={3} title="Minha Sessão" />
          <p className="mt-1 text-xs text-[var(--muted)]">Arraste para reordenar</p>

          <div className="mt-3 flex flex-1 flex-col gap-2">
            {chosen.map((c, i) => (
              <div
                key={c.id}
                className="flex items-center gap-3 rounded-xl border border-[var(--panel-border)] px-3 py-2.5"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--brand-blue)] text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F2F4FB] text-lg">{c.emoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{c.name}</p>
                  <p className="text-xs font-medium text-[var(--muted)]">/{phoneme}/ {position.toLowerCase()}</p>
                </div>
                <button
                  onClick={() => removeActivity(c.id)}
                  aria-label={`Remover ${c.name}`}
                  className="focus-ring flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[var(--brand-orange)]/40 text-[var(--brand-orange-dark)] hover:bg-[var(--wash-orange)]"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
            {chosen.length === 0 && (
              <p className="flex flex-1 items-center justify-center text-center text-xs text-[var(--muted)]">
                Adicione atividades da biblioteca para montar a sessão.
              </p>
            )}
          </div>

          <div className="mt-5 flex gap-3">
            <button className="focus-ring btn-outline flex-1">
              Cancelar
            </button>
            <button
              onClick={() => setCompleted(true)}
              disabled={chosen.length === 0}
              className="focus-ring btn-accent flex-1 disabled:opacity-50"
            >
              Salvar Sessão
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function StepHeader({ n, title }: { n: number; title: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--brand-blue)] text-xs font-bold text-white">
        {n}
      </span>
      <h3 className="font-[family-name:var(--font-baloo)] text-base font-extrabold">{title}</h3>
    </div>
  );
}