import Topbar from "@/components/Topbar";
import { clinicName, clinicRole } from "@/lib/data";

export default function ClinicPage() {
  return (
    <div className="pb-10">
      <Topbar title="Clínica" />
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="card p-4 sm:p-6">
          <h3 className="mb-4 font-[family-name:var(--font-baloo)] text-lg font-extrabold">
            Dados da clínica
          </h3>
          <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold text-[var(--muted)]">Responsável</dt>
              <dd className="mt-0.5 font-medium">{clinicName} &middot; {clinicRole}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-[var(--muted)]">Endereço</dt>
              <dd className="mt-0.5 font-medium">Av. Paulista, 1000 &middot; São Paulo, SP</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-[var(--muted)]">Telefone</dt>
              <dd className="mt-0.5 font-medium">(11) 3456-7890</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-[var(--muted)]">Horário de atendimento</dt>
              <dd className="mt-0.5 font-medium">Seg a Sex, 8h às 18h</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}