import Link from "next/link";
import Topbar from "@/components/Topbar";
import Parrot from "@/components/Parrot";
import LineChart from "@/components/LineChart";
import { clinicName, patients, weekProgress } from "@/lib/data";

const stats = [
  { label: "Pacientes ativos", value: "42", bg: "#EAF1FF", fg: "#2E5AE8", icon: "👥" },
  { label: "Tarefas pendentes", value: "18", bg: "#E7F9EE", fg: "#1FAE6A", icon: "📋" },
  { label: "Engajamento da semana", value: "94%", bg: "#FDEAF0", fg: "#E9457C", icon: "❤️" },
  { label: "Atividades concluídas", value: "320", bg: "#FFF3E0", fg: "#E88C1F", icon: "🏅" },
];

const upcoming = patients
  .filter((p) => p.nextSession)
  .map((p) => ({ ...p }));

export default function DashboardPage() {
  return (
    <div className="pb-10">
      <Topbar title="Dashboard" />

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-r from-[#EFEBFF] to-[#FDEFF5] p-8">
          <h2 className="font-[family-name:var(--font-baloo)] text-2xl font-bold text-[var(--foreground)]">
            Olá, {clinicName}! 👋
          </h2>
          <p className="mt-1 max-w-md text-sm text-[var(--muted)]">
            Aqui está o resumo da sua clínica hoje.
          </p>
          <div className="absolute -right-2 bottom-0 hidden sm:block">
            <Parrot className="h-32 w-32" />
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="card flex items-center gap-4 p-5">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl"
                style={{ background: s.bg }}
              >
                {s.icon}
              </div>
              <div>
                <p className="font-[family-name:var(--font-baloo)] text-2xl font-bold" style={{ color: s.fg }}>
                  {s.value}
                </p>
                <p className="text-xs text-[var(--muted)]">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
          <div className="card p-6">
            <h3 className="mb-4 font-[family-name:var(--font-baloo)] text-lg font-bold">
              Evolução da Semana
            </h3>
            <LineChart data={weekProgress.map((w) => ({ label: w.day, value: w.value }))} />
          </div>

          <div className="card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-[family-name:var(--font-baloo)] text-lg font-bold">
                Próximas Sessões
              </h3>
              <Link href="/sessions/new" className="text-xs font-semibold text-[var(--brand-purple)] hover:underline">
                Ver todas
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              {upcoming.map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                    style={{ background: p.avatarColor }}
                  >
                    {p.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{p.name}</p>
                    <p className="text-xs text-[var(--muted)]">{p.nextSession?.day}</p>
                  </div>
                  <p className="text-sm font-semibold text-[var(--brand-purple)]">
                    {p.nextSession?.time}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}