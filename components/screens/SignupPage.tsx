"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ApiError, signUp } from "@/lib/api";

type FormState = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  clinicName: string;
  specialty: string;
  phone: string;
};

const INITIAL_STATE: FormState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  clinicName: "",
  specialty: "Fonoaudiologia",
  phone: "",
};

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (form.password.length < 8) {
      setError("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    if (!form.clinicName.trim()) {
      setError("Informe o nome da clínica ou do consultório.");
      return;
    }

    setLoading(true);
    try {
      await signUp({ name: form.name, email: form.email, password: form.password });

      // The account is created, but Better Auth requires e-mail
      // verification before a session becomes usable, so the clinic
      // profile (POST /api/clinic/register) is only created after the
      // therapist verifies and logs in — see /clinic/onboarding. We stash
      // the clinic fields locally so that step can be pre-filled instead of
      // asked twice.
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          `falakids:pending-clinic:${form.email.toLowerCase()}`,
          JSON.stringify({ clinicName: form.clinicName, specialty: form.specialty, phone: form.phone }),
        );
      }

      setDone(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(
          err.code === "USER_ALREADY_EXISTS"
            ? "Já existe uma conta com esse e-mail. Tente entrar."
            : err.message,
        );
      } else {
        setError("Não foi possível criar a conta. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6">
        <div className="mx-auto w-full max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-3xl">
            ✓
          </div>
          <h1 className="mt-5 font-[family-name:var(--font-baloo)] text-2xl font-bold text-[#0476D9] sm:text-3xl">
            Quase lá!
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            Enviamos um e-mail de confirmação para <strong>{form.email}</strong>. Confirme seu e-mail e depois
            entre com sua senha para concluir o cadastro da clínica.
          </p>
          <Link
            href="/login"
            className="mt-7 inline-block rounded-2xl bg-gradient-to-r from-[#0476D9] to-[#7155D9] px-6 py-3 text-sm font-bold text-white shadow-lg"
          >
            Ir para o login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2 bg-white">
      <div className="flex flex-col justify-center px-6 py-10 sm:px-16 lg:px-20">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 flex justify-center lg:justify-start">
            <Image src="/logo-falakids.png" alt="FalaKids" width={200} height={110} priority className="object-contain" />
          </div>

          <h1 className="font-[family-name:var(--font-baloo)] text-3xl font-extrabold text-[#0476D9] text-center sm:text-4xl lg:text-left">
            Cadastre sua clínica 🩺
          </h1>
          <p className="mt-3 text-base text-gray-500 text-center lg:text-left">
            Crie uma conta para acompanhar pacientes e enviar atividades pelo FalaKids.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            <Section title="Seus dados">
              <Field label="Seu nome" value={form.name} onChange={(v) => update("name", v)} placeholder="Dra. Amanda Souza" required />
              <Field label="E-mail" type="email" value={form.email} onChange={(v) => update("email", v)} placeholder="amanda@suaclinica.com" required />
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Senha" type="password" value={form.password} onChange={(v) => update("password", v)} placeholder="Mínimo 8 caracteres" required />
                <Field label="Confirmar senha" type="password" value={form.confirmPassword} onChange={(v) => update("confirmPassword", v)} placeholder="Repita a senha" required />
              </div>
            </Section>

            <Section title="Sua clínica">
              <Field label="Nome da clínica / consultório" value={form.clinicName} onChange={(v) => update("clinicName", v)} placeholder="Clínica FalaBem" required />
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Especialidade" value={form.specialty} onChange={(v) => update("specialty", v)} placeholder="Fonoaudiologia" />
                <Field label="Telefone" value={form.phone} onChange={(v) => update("phone", v)} placeholder="(11) 98765-4321" />
              </div>
            </Section>

            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-2xl bg-gradient-to-r from-[#0476D9] to-[#7155D9] py-4 text-base font-bold text-white shadow-xl shadow-blue-100 transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? "Criando conta..." : "Criar conta da clínica"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Já tem uma conta?{" "}
            <Link href="/login" className="font-bold text-[#7155D9] hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#0476D9] via-[#7155D9] to-[#F24F13] lg:flex lg:flex-col lg:items-center lg:justify-center">
        <div className="absolute top-10 left-10 h-28 w-28 rounded-full bg-[#F2A516]/40 animate-pulse" />
        <div className="absolute bottom-20 right-10 h-36 w-36 rounded-full bg-[#69A62D]/40 animate-bounce" />
        <div className="relative z-10 flex flex-col items-center px-10 text-center text-white">
          <h2 className="font-[family-name:var(--font-baloo)] text-4xl font-extrabold text-white drop-shadow-md">
            Leve o FalaKids para os seus pacientes
          </h2>
          <p className="mt-4 max-w-md text-base text-white/90">
            Cadastre pacientes, envie atividades personalizadas para praticar em casa e acompanhe a evolução de
            cada criança direto pelo painel da clínica.
          </p>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-5 border-t border-gray-100 pt-5 first:border-0 first:pt-0">
      <legend className="mb-1 text-xs font-bold uppercase tracking-wide text-[#7155D9]">{title}</legend>
      {children}
    </fieldset>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm font-semibold text-[#0476D9]">
      {label}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="rounded-2xl border-2 border-gray-200 bg-white px-5 py-3.5 text-sm font-normal text-[var(--foreground)] outline-none transition-all focus:border-[#0476D9] focus:ring-4 focus:ring-blue-50"
      />
    </label>
  );
}
