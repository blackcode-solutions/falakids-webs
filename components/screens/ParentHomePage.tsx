import Parrot from "@/components/Parrot";
import { BellIcon, CheckIcon } from "@/components/icons";
import { activePatient, parentTasks, overallProgress } from "@/lib/data";

const parentFirstName = "Juliana";

export default function ParentHomePage() {
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - overallProgress / 100);
  const pending = parentTasks.filter((t) => t.status === "pendente");

  return (
    <div className="pb-10">
      <header className="flex flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="min-w-0">
          <h1 className="truncate font-[family-name:var(--font-baloo)] text-xl font-bold sm:text-2xl">
            Olá, {parentFirstName}! 👋
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Acompanhe o progresso do {activePatient.name.split(" ")[0]}.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <button
            aria-label="Notificações"
            className="focus-ring relative flex h-9 w-9 items-center justify-center rounded-full border border-[var(--panel-border)] bg-white text-[var(--muted)] sm:h-10 sm:w-10"
          >
            <BellIcon className="h-[18px] w-[18px]" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[var(--brand-pink)]" />
          </button>
          <Parrot className="hidden h-12 w-12 sm:block" />
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 px-4 sm:px-6 lg:px-8 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="mb-4 font-[family-name:var(--font-baloo)] text-lg font-bold">
            Tarefas Pendentes
          </h3>
          <div className="flex flex-col gap-4">
            {pending.map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-2xl bg-[#F7F8FD] p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E7F9EE] text-[#1FAE6A]">
                    <CheckIcon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{t.title}</p>
                    <p className="text-xs text-[var(--muted)]">{t.activitiesCount} atividades</p>
                  </div>
                </div>
                <button className="focus-ring rounded-full bg-[var(--brand-orange)] px-4 py-2 text-xs font-semibold text-white hover:opacity-90">
                  Começar
                </button>
              </div>
            ))}
            {pending.length === 0 && (
              <p className="py-6 text-center text-sm text-[var(--muted)]">
                Nenhuma tarefa pendente. 🎉
              </p>
            )}
          </div>
        </div>

        <div className="card flex flex-col items-center justify-center gap-3 p-6 text-center">
          <h3 className="mb-1 font-[family-name:var(--font-baloo)] text-lg font-bold">
            Progresso Geral
          </h3>
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
          <p className="text-sm font-semibold text-[var(--brand-green)]">Muito bem!</p>
          <p className="text-xs text-[var(--muted)]">
            {activePatient.name.split(" ")[0]} está evoluindo.
          </p>

          <div className="mt-4 w-full border-t border-[var(--panel-border)] pt-4 text-left text-xs">
            <p className="text-[var(--muted)]">Última atividade</p>
            <div className="mt-1 flex items-center justify-between">
              <p className="font-semibold text-[var(--foreground)]">Som R - Inicial</p>
              <span className="text-[var(--muted)]">Hoje &middot; 10:30</span>
            </div>
            <span className="mt-1 inline-block rounded-full bg-[#E7F9EE] px-2 py-0.5 text-[11px] font-semibold text-[#1FAE6A]">
              100%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}