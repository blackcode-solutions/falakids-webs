"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ApiError, getClinicMe, signIn } from "@/lib/api";

type Role = "fono" | "responsavel";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("fono");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (role === "responsavel") {
      // Responsáveis acompanham o progresso pelo app FalaKids (mobile).
      // Este site é o painel da clínica, então evitamos fingir um login
      // que não existe aqui.
      setError("Responsáveis acompanham o progresso pelo app FalaKids, disponível para iOS e Android.");
      return;
    }

    setLoading(true);
    try {
      console.log({ email, password })
      await signIn({ email, password });

      try {
        await getClinicMe();
        router.push("/dashboard");
      } catch (err) {
        if (err instanceof ApiError && err.code === "THERAPIST_ACCOUNT_REQUIRED") {
          router.push("/clinic/onboarding");
        } else {
          throw err;
        }
      }
    } catch (err) {
      console.log(err)
      if (err instanceof ApiError) {
        if (err.code === "EMAIL_NOT_VERIFIED") {
          setError("Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.");
        } else if (err.status === 401) {
          setError("E-mail ou senha incorretos.");
        } else {
          setError(err.message);
        }
      } else {
        setError("Não foi possível entrar. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2 bg-white">
      <div className="flex flex-col justify-center px-6 py-10 sm:px-16 lg:px-20 bg-white">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 flex justify-center lg:justify-start">
            <Image
              src="/logo-falakids.png"
              alt="FalaKids"
              width={220}
              height={120}
              priority
              className="object-contain"
            />
          </div>

          <h1 className="font-[family-name:var(--font-baloo)] text-3xl font-extrabold text-[#0476D9] text-center sm:text-4xl lg:text-left">
            Que bom te ver! 👋
          </h1>
          <p className="mt-3 text-base text-gray-500 text-center lg:text-left">
            Entre para acompanhar o progresso das crianças.
          </p>

          <div className="mt-8 flex rounded-full bg-[#F2F4F8] p-1.5 border border-gray-200">
            <button
              type="button"
              onClick={() => setRole("fono")}
              className={`flex-1 rounded-full py-2.5 text-sm font-bold transition-all duration-300 ${
                role === "fono"
                  ? "bg-[#7155D9] text-white shadow-lg shadow-purple-200"
                  : "text-[#64748B] hover:text-[#7155D9]"
              }`}
            >
               Sou Fono
            </button>
            <button
              type="button"
              onClick={() => setRole("responsavel")}
              className={`flex-1 rounded-full py-2.5 text-sm font-bold transition-all duration-300 ${
                role === "responsavel"
                  ? "bg-[#0476D9] text-white shadow-lg shadow-blue-200"
                  : "text-[#64748B] hover:text-[#0476D9]"
              }`}
            >
               Sou Responsável
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            <label className="flex flex-col gap-2 text-sm font-semibold text-[#0476D9]">
              E-mail
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-2xl border-2 border-gray-200 bg-white px-5 py-3.5 text-sm outline-none transition-all focus:border-[#0476D9] focus:ring-4 focus:ring-blue-50"
                placeholder="seu@email.com"
                required
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-semibold text-[#0476D9]">
              Senha
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-2xl border-2 border-gray-200 bg-white px-5 py-3.5 text-sm outline-none transition-all focus:border-[#0476D9] focus:ring-4 focus:ring-blue-50"
                placeholder="Digite sua senha"
                required
              />
            </label>

            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <label className="flex items-center gap-2 text-gray-500">
                <input type="checkbox" defaultChecked className="h-5 w-5 rounded-md border-gray-300 accent-[#7155D9]" />
                Manter conectado
              </label>
              <a href="#" className="font-semibold text-[#7155D9] hover:underline">
                Esqueci a senha
              </a>
            </div>

            {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 rounded-2xl bg-gradient-to-r from-[#0476D9] to-[#7155D9] py-4 text-base font-bold text-white shadow-xl shadow-blue-100 transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? "Entrando..." : "Entrar "}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Ainda não tem conta?{" "}
            <Link href="/signup" className="font-bold text-[#F24F13] hover:underline">
              Cadastre sua clínica
            </Link>
          </p>
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#0476D9] via-[#7155D9] to-[#F24F13] lg:flex lg:flex-col lg:items-center lg:justify-center">
        <div className="absolute top-10 left-10 h-28 w-28 rounded-full bg-[#F2A516]/40 animate-pulse" />
        <div className="absolute bottom-20 right-10 h-36 w-36 rounded-full bg-[#69A62D]/40 animate-bounce" />
        <div className="absolute top-1/3 right-0 h-20 w-20 rounded-full bg-[#F24F13]/40" />
        <div className="absolute bottom-10 left-10 h-16 w-16 rounded-full bg-[#0476D9]/40" />

        <div className="relative z-10 flex flex-col items-center px-10 text-center text-white">
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full scale-110" />
            <Image
              src="/papagaio-3d.png"
              alt="Papagaio FalaKids"
              width={300}
              height={300}
              priority
              className="relative drop-shadow-2xl mix-blend-multiply"
            />
          </div>

          <h2 className="font-[family-name:var(--font-baloo)] text-4xl font-extrabold text-white drop-shadow-md">
            Terapia de fala que vira brincadeira
          </h2>
          <p className="mt-4 max-w-md text-base text-white/90">
            Acompanhe sessões, envie tarefas para casa e celebre cada conquista das crianças com o FalaKids.
          </p>
        </div>
      </div>
    </div>
  );
}
