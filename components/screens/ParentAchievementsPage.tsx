import Parrot from "@/components/Parrot";
import { CoinIcon, GiftIcon } from "@/components/icons";
import { activePatient, gamification, achievements } from "@/lib/data";

export default function GamificationPage() {
  const xpPct = Math.round((gamification.xp / gamification.xpMax) * 100);
  const challengePct = Math.round(
    (gamification.dailyChallenge.done / gamification.dailyChallenge.total) * 100
  );

  return (
    <div className="pb-10">
      <header className="flex items-center justify-between gap-4 px-8 py-6">
        <h1 className="font-[family-name:var(--font-baloo)] text-2xl font-bold">Gamificação</h1>
        <Parrot className="h-12 w-12" />
      </header>

      <div className="grid grid-cols-1 gap-6 px-8 sm:grid-cols-2">
        <div className="card flex items-center gap-4 p-6">
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-lg font-bold"
            style={{ background: activePatient.avatarColor }}
          >
            {activePatient.initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-[family-name:var(--font-baloo)] text-lg font-bold">
              {activePatient.name}
            </p>
            <p className="text-xs text-[var(--muted)]">Nível {gamification.level}</p>
            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-[#EEF0F8]">
              <div
                className="h-full rounded-full bg-[var(--brand-purple)]"
                style={{ width: `${xpPct}%` }}
              />
            </div>
            <p className="mt-1 text-right text-xs text-[var(--muted)]">
              {gamification.xp} / {gamification.xpMax} XP
            </p>
          </div>
        </div>

        <div className="card flex items-center justify-between gap-4 p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF3E0] text-[#E88C1F]">
              <CoinIcon className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xs text-[var(--muted)]">Moedas</p>
              <p className="font-[family-name:var(--font-baloo)] text-2xl font-bold text-[#E88C1F]">
                {gamification.coins}
              </p>
            </div>
          </div>
          <button className="focus-ring rounded-full bg-[var(--brand-orange)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
            Loja
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 px-8 xl:grid-cols-[1.6fr_1fr]">
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-[family-name:var(--font-baloo)] text-lg font-bold">Conquistas</h3>
            <button className="focus-ring text-xs font-semibold text-[var(--brand-purple)] hover:underline">
              Ver todas
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-5">
            {achievements.map((a) => (
              <div
                key={a.id}
                className={`flex flex-col items-center gap-2 rounded-2xl p-3 text-center ${
                  a.earned ? "bg-[#FFF3E0]" : "bg-[#F2F4FB] opacity-50"
                }`}
              >
                <span className="text-3xl">{a.icon}</span>
                <p className="text-[11px] font-semibold leading-tight">{a.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card flex flex-col items-center gap-3 bg-gradient-to-br from-[#FDEFF5] to-[#FFF3E0] p-6 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[var(--brand-pink)]">
            <GiftIcon className="h-7 w-7" />
          </span>
          <h3 className="font-[family-name:var(--font-baloo)] text-base font-bold">Desafio do Dia</h3>
          <p className="text-xs text-[var(--muted)]">{gamification.dailyChallenge.label}</p>
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-white/70">
            <div
              className="h-full rounded-full bg-[var(--brand-pink)]"
              style={{ width: `${challengePct}%` }}
            />
          </div>
          <p className="text-xs font-semibold text-[var(--brand-pink)]">
            {gamification.dailyChallenge.done} / {gamification.dailyChallenge.total}
          </p>
        </div>
      </div>
    </div>
  );
}