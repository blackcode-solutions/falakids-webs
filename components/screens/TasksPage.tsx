import Topbar from "@/components/Topbar";
import { patients, patientTasks } from "@/lib/data";

export default function TasksPage() {
  return (
    <div className="pb-10">
      <Topbar title="Tarefas" />
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="card flex flex-col divide-y divide-[var(--panel-border)] overflow-hidden">
          {patientTasks.map((t) => (
            <div key={t.id} className="flex items-center justify-between gap-3 px-4 py-4 sm:px-5">
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                  style={{ background: patients[0].avatarColor }}
                >
                  {patients[0].initials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{t.title}</p>
                  <p className="truncate text-xs text-[var(--muted)]">
                    {patients[0].name} &middot; Enviada em {t.sentDate}
                  </p>
                </div>
              </div>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                  t.status === "concluída"
                    ? "bg-[#E7F9EE] text-[#1FAE6A]"
                    : "bg-[#FFF3E0] text-[#E88C1F]"
                }`}
              >
                {t.status === "concluída" ? "Concluída" : "Pendente"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}