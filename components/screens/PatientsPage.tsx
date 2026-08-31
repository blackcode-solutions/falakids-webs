import Link from "next/link";
import Topbar from "@/components/Topbar";
import { patients } from "@/lib/data";

export default function PatientsPage() {
  return (
    <div className="pb-10">
      <Topbar
        title="Pacientes"
        search={{ placeholder: "Buscar paciente..." }}
        actions={
          <>
            <select className="focus-ring hidden rounded-full border border-[var(--panel-border)] bg-white px-4 py-2 text-sm text-[var(--muted)] sm:block">
              <option>Todos os pacientes</option>
              <option>Ativos</option>
              <option>Inativos</option>
            </select>
            <button className="focus-ring flex items-center gap-1.5 rounded-full bg-[var(--brand-purple)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
              <span className="text-base leading-none">+</span> Novo Paciente
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-5 px-8 sm:grid-cols-2 xl:grid-cols-3">
        {patients.map((p) => (
          <div key={p.id} className="card flex flex-col gap-4 p-5">
            <div className="flex items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full text-base font-semibold"
                style={{ background: p.avatarColor }}
              >
                {p.initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{p.name}</p>
                <p className="text-xs text-[var(--muted)]">{p.age} anos</p>
                <p className="text-xs text-[var(--muted)]">{p.condition}</p>
              </div>
            </div>

            <div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[#EEF0F8]">
                <div
                  className="h-full rounded-full bg-[var(--brand-green)]"
                  style={{ width: `${p.progress}%` }}
                />
              </div>
              <p className="mt-1 text-right text-xs font-semibold text-[var(--brand-green)]">
                {p.progress}%
              </p>
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