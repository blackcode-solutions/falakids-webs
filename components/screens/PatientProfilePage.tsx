import { notFound } from "next/navigation";
import Topbar from "@/components/Topbar";
import { patients } from "@/lib/data";
import PatientTabs from "@/components/PatientTabs";

export default async function PatientProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const patient = patients.find((p) => p.id === id);
  if (!patient) notFound();

  return (
    <div className="pb-10">
      <Topbar title="Perfil do Paciente" backHref="/patients" />

      <div className="grid grid-cols-1 gap-6 px-8 lg:grid-cols-[280px_1fr]">
        <div className="card flex flex-col items-center p-6 text-center">
          <div
            className="flex h-24 w-24 items-center justify-center rounded-full text-2xl font-bold"
            style={{ background: patient.avatarColor }}
          >
            {patient.initials}
          </div>
          <h2 className="mt-4 font-[family-name:var(--font-baloo)] text-lg font-bold">
            {patient.name}
          </h2>
          <p className="text-xs text-[var(--muted)]">{patient.age} anos</p>
          <span className="mt-2 rounded-full bg-[#E7F9EE] px-3 py-1 text-xs font-semibold text-[#1FAE6A]">
            ● Ativo
          </span>
          <p className="mt-1 text-xs text-[var(--muted)]">{patient.diagnosis}</p>

          <div className="mt-6 w-full border-t border-[var(--panel-border)] pt-4 text-left">
            <p className="text-xs font-semibold text-[var(--muted)]">Responsável</p>
            <p className="text-sm font-medium">{patient.responsible}</p>

            <p className="mt-3 text-xs font-semibold text-[var(--muted)]">Telefone</p>
            <p className="text-sm font-medium">{patient.phone}</p>

            <p className="mt-3 text-xs font-semibold text-[var(--muted)]">E-mail</p>
            <p className="break-words text-sm font-medium">{patient.email}</p>
          </div>

          <button className="focus-ring mt-6 w-full rounded-xl border border-[var(--panel-border)] py-2 text-sm font-semibold hover:bg-[#F7F8FD]">
            Editar informações
          </button>
        </div>

        <PatientTabs patient={patient} />
      </div>
    </div>
  );
}