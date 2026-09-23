"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Topbar from "@/components/Topbar";
import Parrot from "@/components/Parrot";
import KidAvatar from "@/components/KidAvatar";
import AudioButton from "@/components/AudioButton";
import { PlusIcon, XIcon, SearchIcon } from "@/components/icons";
import {
  ApiError,
  listPatients,
  listContent,
  createAssignment,
  type ClinicPatient,
  type ContentItem,
  type ExerciseType,
} from "@/lib/api";
import { CATEGORY_EMOJI, CATEGORY_LABELS_PT, EXERCISE_TYPE_DESCRIPTIONS_PT, EXERCISE_TYPE_LABELS_PT } from "@/lib/content";

type Chosen = { id: string; name: string; category: ContentItem["category"]; exerciseType: ExerciseType };

export default function SessionBuilderPage() {
  const [patients, setPatients] = useState<ClinicPatient[] | null>(null);
  const [content, setContent] = useState<ContentItem[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [patientId, setPatientId] = useState<string | null>(null);
  const [phoneme, setPhoneme] = useState("R");
  const [position, setPosition] = useState("Inicial");
  const [libraryTab, setLibraryTab] = useState<ExerciseType>("REPETITION");
  const [query, setQuery] = useState("");
  const [chosen, setChosen] = useState<Chosen[]>([]);
  const [completed, setCompleted] = useState(false);
  const [taskSent, setTaskSent] = useState<null | boolean>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    Promise.all([listPatients(), listContent()])
      .then(([patientsRes, contentRes]) => {
        setPatients(patientsRes.patients);
        setContent(contentRes.contents);
        setPatientId((current) => current ?? patientsRes.patients[0]?.id ?? null);
      })
      .catch((err) => {
        setLoadError(err instanceof ApiError ? err.message : "Não foi possível carregar pacientes e atividades.");
      });
  }, []);

  const patient = patients?.find((p) => p.id === patientId) ?? null;
  const available = useMemo(
    () =>
      (content ?? []).filter(
        (a) =>
          a.labelPT.toLowerCase().includes(query.toLowerCase()) &&
          // The same content item can be added once per exercise type
          // (e.g. "Rato" for repetição AND "Rato" for nomeação), just not
          // twice under the same one.
          !chosen.some((c) => c.id === a.id && c.exerciseType === libraryTab),
      ),
    [content, query, chosen, libraryTab],
  );

  function addActivity(id: string) {
    const a = content?.find((x) => x.id === id);
    if (!a) return;
    setChosen((c) => [...c, { id: a.id, name: a.labelPT, category: a.category, exerciseType: libraryTab }]);
  }

  function removeActivity(id: string, exerciseType: ExerciseType) {
    setChosen((c) => c.filter((x) => !(x.id === id && x.exerciseType === exerciseType)));
  }

  const repetitionCount = chosen.filter((c) => c.exerciseType === "REPETITION").length;
  const namingCount = chosen.filter((c) => c.exerciseType === "NAMING").length;

  async function handleSendTask() {
    if (!patientId) return;
    setSending(true);
    setSendError(null);
    try {
      await createAssignment(patientId, {
        title: `Fonema ${phoneme} - ${position}`,
        notes: `Sessão montada no Criador de Sessão (${chosen.length} atividade(s): ${repetitionCount} repetição, ${namingCount} nomeação).`,
        items: chosen.map((c) => ({ contentItemId: c.id, exerciseType: c.exerciseType })),
      });
      setTaskSent(true);
    } catch (err) {
      setSendError(err instanceof ApiError ? err.message : "Não foi possível enviar a tarefa. Tente novamente.");
    } finally {
      setSending(false);
    }
  }

  if (loadError) {
    return (
      <div className="pb-10">
        <Topbar title="Criador de Sessão" />
        <p className="mx-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 sm:mx-6 lg:mx-8">
          {loadError}
        </p>
      </div>
    );
  }

  if (!patients || !content || !patientId) {
    return (
      <div className="pb-10">
        <Topbar title="Criador de Sessão" />
        <p className="px-4 text-sm text-[var(--muted)] sm:px-6 lg:px-8">Carregando...</p>
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="pb-10">
        <Topbar title="Criador de Sessão" />
        <div className="mx-4 rounded-2xl border border-dashed border-[var(--panel-border)] p-8 text-center sm:mx-6 lg:mx-8">
          <p className="text-sm font-semibold">Você ainda não tem pacientes cadastrados.</p>
          <Link href="/patients/new" className="mt-4 inline-block rounded-xl bg-[var(--brand-blue)] px-5 py-2.5 text-sm font-semibold text-white">
            + Novo Paciente
          </Link>
        </div>
      </div>
    );
  }

  if (completed && patient) {
    return (
      <div className="pb-10">
        <Topbar title="Tarefas" backHref="/sessions/new" />
        <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8 pt-6 text-center">
          <div className="card p-6 sm:p-10">
            <div className="mx-auto mb-2 flex h-24 w-24 items-center justify-center">
              <Parrot className="h-24 w-24" />
            </div>
            <h2 className="font-[family-name:var(--font-baloo)] text-2xl font-extrabold">
              Sessão concluída!
            </h2>
            <p className="mt-2 text-sm font-medium text-[var(--muted-strong)]">
              Deseja transformar esta sessão em tarefa para casa?
            </p>

            <div className="mt-6 grid grid-cols-1 gap-3 rounded-2xl bg-[#F7F8FD] p-4 text-left text-sm sm:grid-cols-4">
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
                <p className="text-xs font-semibold text-[var(--muted)]">Repetição</p>
                <p className="font-bold">{repetitionCount} atividade(s)</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-[var(--muted)]">Nomeação</p>
                <p className="font-bold">{namingCount} atividade(s)</p>
              </div>
            </div>

            {sendError && (
              <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{sendError}</p>
            )}

            {taskSent === null ? (
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <button
                  onClick={handleSendTask}
                  disabled={sending}
                  className="focus-ring rounded-2xl border-2 border-[var(--brand-blue)] bg-[var(--wash-blue)] p-5 text-center transition-colors hover:brightness-95 disabled:opacity-60"
                >
                  <p className="font-bold text-[var(--brand-blue-dark)]">Sim, enviar tarefa</p>
                  <p className="mt-1 text-xs font-medium text-[var(--muted)]">
                    Os responsáveis receberão no app do FalaKids
                  </p>
                  <span className="focus-ring btn-primary mt-4 w-full">
                    {sending ? "Enviando..." : "Enviar tarefa"}
                  </span>
                </button>
                <button
                  onClick={() => setTaskSent(false)}
                  disabled={sending}
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
      <Topbar title="Criador de Sessão" />

      <div className="grid grid-cols-1 gap-6 px-4 sm:px-6 lg:px-8 lg:grid-cols-3">
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

          {patient && (
            <div className="mt-4 flex items-center gap-3 rounded-xl bg-[#F7F8FD] p-3">
              <KidAvatar seed={patient.id} className="h-10 w-10" />
              <div>
                <p className="text-sm font-bold">{patient.name}</p>
                <p className="text-xs font-medium text-[var(--muted)]">
                  {patient.age} anos {patient.diagnosis ? `· ${patient.diagnosis}` : ""}
                </p>
              </div>
            </div>
          )}

          <div className="mt-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
              Objetivo (rótulo da sessão)
            </p>
            <div className="grid grid-cols-2 gap-3">
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
            <p className="mt-2 text-[11px] leading-snug text-[var(--muted)]">
              Usado só como título da tarefa (ex.: &quot;Fonema {phoneme} - {position}&quot;). A biblioteca ao lado é
              organizada por categoria, não por fonema — escolha as atividades nas abas Repetição/Nomeação.
            </p>
          </div>
        </section>

        <section className="card p-5">
          <StepHeader n={2} title="Escolher Atividades" />

          {/* This is the actual exercise-type separation the therapist
              asked for: repetição and nomeação are two distinct tabs, each
              pulling from the real category-based content library. */}
          <div className="mt-3 inline-flex w-full rounded-full border border-[var(--panel-border)] bg-white p-1 text-sm">
            {(["REPETITION", "NAMING"] as ExerciseType[]).map((t) => (
              <button
                key={t}
                onClick={() => setLibraryTab(t)}
                className={`focus-ring flex-1 rounded-full px-3 py-2 font-bold transition-colors ${
                  libraryTab === t ? "bg-[var(--brand-blue)] text-white" : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {EXERCISE_TYPE_LABELS_PT[t]}
              </button>
            ))}
          </div>
          <p className="mb-3 mt-1.5 text-[11px] text-[var(--muted)]">{EXERCISE_TYPE_DESCRIPTIONS_PT[libraryTab]}</p>

          <div className="mb-3 flex items-center gap-2 rounded-full border border-[var(--panel-border)] bg-white px-3 py-2 text-sm text-[var(--muted)]">
            <SearchIcon className="h-4 w-4" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar atividades..."
              className="focus-ring w-full bg-transparent outline-none placeholder:text-[var(--muted)]"
            />
          </div>
          <div className="flex max-h-72 flex-col gap-2 overflow-y-auto pr-1">
            {available.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between rounded-xl border border-[var(--panel-border)] px-3 py-2"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F2F4FB] text-base">
                    {CATEGORY_EMOJI[a.category] ?? "🗣️"}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{a.labelPT}</p>
                    <p className="text-xs text-[var(--muted)]">{CATEGORY_LABELS_PT[a.category]}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <AudioButton size="sm" fallbackText={a.soundPT || a.labelPT} label={`Ouvir "${a.labelPT}"`} />
                  <button
                    onClick={() => addActivity(a.id)}
                    aria-label={`Adicionar ${a.labelPT} (${EXERCISE_TYPE_LABELS_PT[libraryTab]})`}
                    className="focus-ring flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--brand-blue)] text-white shadow-sm hover:brightness-105"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            {available.length === 0 && (
              <p className="py-4 text-center text-xs text-[var(--muted)]">
                {query ? "Nenhum resultado." : "Todas as atividades desse tipo já foram adicionadas."}
              </p>
            )}
          </div>
        </section>

        <section className="card flex flex-col p-5">
          <StepHeader n={3} title="Minha Sessão" />
          <p className="mt-1 text-xs text-[var(--muted)]">
            {chosen.length} atividade(s) · {repetitionCount} repetição · {namingCount} nomeação
          </p>

          <div className="mt-3 flex flex-1 flex-col gap-2">
            {chosen.map((c, i) => (
              <div
                key={`${c.id}-${c.exerciseType}`}
                className="flex items-center gap-3 rounded-xl border border-[var(--panel-border)] px-3 py-2.5"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--brand-blue)] text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F2F4FB] text-lg">
                  {CATEGORY_EMOJI[c.category] ?? "🗣️"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{c.name}</p>
                  <span className={`badge mt-0.5 ${c.exerciseType === "REPETITION" ? "badge-blue" : "badge-purple"}`}>
                    {EXERCISE_TYPE_LABELS_PT[c.exerciseType]}
                  </span>
                </div>
                <button
                  onClick={() => removeActivity(c.id, c.exerciseType)}
                  aria-label={`Remover ${c.name}`}
                  className="focus-ring flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[var(--brand-orange)]/40 text-[var(--brand-orange-dark)] hover:bg-[var(--wash-orange)]"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
            {chosen.length === 0 && (
              <p className="flex flex-1 items-center justify-center text-center text-xs text-[var(--muted)]">
                Adicione atividades das abas Repetição/Nomeação para montar a sessão.
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
