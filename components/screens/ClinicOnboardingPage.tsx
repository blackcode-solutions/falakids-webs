"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError, getMe, registerClinic } from "@/lib/api";

export default function ClinicOnboardingPage() {
  const router = useRouter();
  const [clinicName, setClinicName] = useState("");
  const [specialty, setSpecialty] = useState("Fonoaudiologia");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMe()
      .then(({ user }) => {
        if (typeof window === "undefined") return;
        const saved = window.localStorage.getItem(`falakids:pending-clinic:${user.email.toLowerCase()}`);
        if (saved) {
          try {
            const parsed = JSON.parse(saved) as { clinicName?: string; specialty?: string; phone?: string };
            setClinicName(parsed.clinicName ?? "");
            setSpecialty(parsed.specialty ?? "Fonoaudiologia");
            setPhone(parsed.phone ?? "");
          } catch {
            // ignore malformed local cache
          }
        }
      })
      .catch(() => router.replace("/login"))
      .finally(() => setChecking(false));
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!clinicName.trim()) {
      setError("Informe o nome da clínica ou do consultório.");
      return;
    }

    setLoading(true);
    try {
      await registerClinic({ clinicName, specialty: specialty || undefined, phone: phone || undefined });
      if (typeof window !== "undefined") {
        const { user } = await getMe();
        window.localStorage.removeItem(`falakids:pending-clinic:${user.email.toLowerCase()}`);
      }
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ApiError && err.code === "EMAIL_NOT_VERIFIED") {
        setError("Confirme seu e-mail antes de continuar. Verifique sua caixa de entrada.");
      } else if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Não foi possível concluir o cadastro. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-[var(--muted)]">Carregando...</div>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 py-10">
      <div className="mx-auto w-full max-w-lg">
        <h1 className="font-[family-name:var(--font-baloo)] text-2xl font-bold text-[#0476D9] sm:text-3xl">
          Finalize o cadastro da sua clínica
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Só mais um passo: conte um pouco sobre sua clínica ou consultório para liberar o painel.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          <label className="flex flex-col gap-2 text-sm font-semibold text-[#0476D9]">
            Nome da clínica / consultório
            <input
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              placeholder="Clínica FalaBem"
              required
              className="rounded-2xl border-2 border-gray-200 bg-white px-5 py-3.5 text-sm font-normal text-[var(--foreground)] outline-none focus:border-[#0476D9] focus:ring-4 focus:ring-blue-50"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-[#0476D9]">
            Especialidade
            <input
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              placeholder="Fonoaudiologia"
              className="rounded-2xl border-2 border-gray-200 bg-white px-5 py-3.5 text-sm font-normal text-[var(--foreground)] outline-none focus:border-[#0476D9] focus:ring-4 focus:ring-blue-50"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-[#0476D9]">
            Telefone
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(11) 98765-4321"
              className="rounded-2xl border-2 border-gray-200 bg-white px-5 py-3.5 text-sm font-normal text-[var(--foreground)] outline-none focus:border-[#0476D9] focus:ring-4 focus:ring-blue-50"
            />
          </label>

          {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-2xl bg-gradient-to-r from-[#0476D9] to-[#7155D9] py-4 text-base font-bold text-white shadow-xl shadow-blue-100 disabled:opacity-60"
          >
            {loading ? "Concluindo..." : "Concluir cadastro"}
          </button>
        </form>
      </div>
    </div>
  );
}
