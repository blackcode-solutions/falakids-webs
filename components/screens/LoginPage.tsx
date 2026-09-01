"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

type Role = "fono" | "responsavel";

const MOCK_PASSWORD = "12345678";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("fono");
  const [email, setEmail] = useState(
    role === "fono" ? "amanda@falakids.com" : "juliana.silva@email.com"
  );
  const [password, setPassword] = useState(MOCK_PASSWORD);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleRoleChange(next: Role) {
    setRole(next);
    setEmail(next === "fono" ? "amanda@falakids.com" : "juliana.silva@email.com");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push(role === "fono" ? "/dashboard" : "/parent");
    }, 500);
  }

  return (
    <div className="grid h-dvh max-h-dvh grid-cols-1 overflow-hidden bg-white lg:grid-cols-[2fr_3fr]">
      {/* Left: form */}
      <div className="flex h-full flex-col justify-center overflow-hidden bg-white px-6 py-6 sm:px-10 lg:px-12">
        <div className="mx-auto w-full max-w-sm">
          {/* Logo */}
          <div className="mb-5 flex justify-center lg:justify-start">
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
            Que bom te ver! 
          </h1>
          <p className="mt-3 text-base text-gray-500 text-center lg:text-left">
            Entre para acompanhar o progresso das crianças.
          </p>

          {/* Toggle de Perfil - Cores da paleta */}
          <div className="mt-6 flex rounded-full bg-[#F2F4F8] p-1.5 border border-gray-200">
            <button
              type="button"
              onClick={() => handleRoleChange("fono")}
              className={`flex-1 rounded-full py-2.5 text-sm font-bold transition-all duration-300 ${
                role === "fono"
                  ? "bg-[#0476D9] text-white shadow-lg shadow-blue-200"
                  : "text-[#64748B] hover:text-[#0476D9]"
              }`}
            >
               Sou Fono
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange("responsavel")}
              className={`flex-1 rounded-full py-2.5 text-sm font-bold transition-all duration-300 ${
                role === "responsavel"
                  ? "bg-[#0476D9] text-white shadow-lg shadow-blue-200"
                  : "text-[#64748B] hover:text-[#0476D9]"
              }`}
            >
               Sou Responsável
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-2 text-sm font-semibold text-[#0476D9]">
              E-mail
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-2xl border-2 border-gray-200 bg-white px-5 py-3.5 text-sm outline-none transition-all focus:border-[#0476D9] focus:ring-4 focus:ring-blue-50"
                placeholder="seu@email.com"
              />
            </label>

            <div className="flex flex-col gap-2 text-sm font-semibold text-[#0476D9]">
              <label htmlFor="password">Senha</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border-2 border-gray-200 bg-white px-5 py-3.5 pr-12 text-sm outline-none transition-all focus:border-[#0476D9] focus:ring-4 focus:ring-blue-50"
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-[#0476D9]"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <label className="flex items-center gap-2 text-gray-500">
                <input 
                  type="checkbox" 
                  defaultChecked 
                  className="h-5 w-5 rounded-md border-gray-300 accent-[#7155D9]" 
                />
                Manter conectado
              </label>
              <a href="#" className="font-semibold text-[#7155D9] hover:underline">
                Esqueci a senha
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-2xl bg-[#0476D9] py-3.5 text-base font-bold text-white shadow-lg shadow-blue-200 transition-colors hover:bg-[#0368c4] active:bg-[#025eb3] disabled:opacity-60"
            >
              {loading ? "Entrando..." : "Entrar "}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            Ainda não tem conta?{" "}
            <a href="#" className="font-bold text-[#F24F13] hover:underline">
              Fale com a gente
            </a>
          </p>
        </div>
      </div>

      {/* Right: logo e mensagem de boas-vindas */}
      <div className="relative hidden h-full overflow-hidden bg-[#F2F4F8] lg:flex lg:flex-col lg:items-center lg:justify-center">
        <div className="relative z-10 flex w-full max-w-2xl flex-col items-center px-12 text-center xl:px-16">
          <div className="mb-8 w-full">
            <Image
              src="/logo-fala-kids-hero.png"
              alt="FalaKids"
              width={520}
              height={260}
              priority
              className="relative mx-auto h-auto w-full max-w-[520px] object-contain drop-shadow-lg"
            />
          </div>

          <h2 className="font-[family-name:var(--font-baloo)] text-4xl font-extrabold text-[#0476D9]">
            Terapia da fala 
          </h2>
          <p className="mt-4 max-w-md text-base text-gray-500">
            Acompanhe sessões, envie tarefas para casa e celebre cada
            conquista das crianças com o FalaKids.
          </p>

          {/* Cards de estatísticas com as cores da paleta */}
          {/* <div className="mt-12 grid w-full max-w-md grid-cols-3 gap-4 text-left">
            <div className="rounded-3xl bg-white/15 backdrop-blur-md p-5 shadow-lg border-2 border-white/20">
              <p className="text-2xl font-extrabold text-[#F2A516]">320+</p>
              <p className="text-xs text-white/80">Atividades</p>
            </div>
            <div className="rounded-3xl bg-white/15 backdrop-blur-md p-5 shadow-lg border-2 border-white/20">
              <p className="text-2xl font-extrabold text-[#69A62D]">92%</p>
              <p className="text-xs text-white/80">Engajamento</p>
            </div>
            <div className="rounded-3xl bg-white/15 backdrop-blur-md p-5 shadow-lg border-2 border-white/20">
              <p className="text-2xl font-extrabold text-[#F24F13]">1.2k</p>
              <p className="text-xs text-white/80">Famílias</p>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}