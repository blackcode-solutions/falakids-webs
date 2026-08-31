"use client";

import { useState } from "react";
import { BellIcon, SettingsIcon, UserIcon } from "@/components/icons";

const sections = ["Perfil", "Clínica", "Notificações", "Preferências", "Segurança"];

export default function SettingsPage() {
  const [active, setActive] = useState("Perfil");
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [reminders, setReminders] = useState(true);

  return (
    <div className="min-h-screen p-5 lg:p-8">
      <header className="mb-7 flex items-center justify-between">
        <div>
          <p className="text-sm text-[var(--muted)]">Configurações</p>
          <h1 className="mt-1 font-[family-name:var(--font-baloo)] text-3xl font-bold">Configurações</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">Personalize sua conta e as preferências da clínica.</p>
        </div>
        <button onClick={() => setSaved(true)} className="rounded-xl bg-[var(--brand-blue)] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:brightness-95">Salvar alterações</button>
      </header>

      {saved && <div className="mb-5 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">Alterações salvas com sucesso.</div>}

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="card h-fit p-3">
          {sections.map((item, i) => (
            <button key={item} onClick={() => setActive(item)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium ${active === item ? "bg-[#EEF2FF] text-[var(--brand-blue)]" : "text-[var(--muted)] hover:bg-[#F7F8FC]"}`}>
              {i === 0 ? <UserIcon className="h-5 w-5" /> : i === 2 ? <BellIcon className="h-5 w-5" /> : <SettingsIcon className="h-5 w-5" />}
              {item}
            </button>
          ))}
        </aside>

        <section className="card p-6 lg:p-8">
          {active === "Perfil" && <>
            <h2 className="font-[family-name:var(--font-baloo)] text-xl font-bold">Meu perfil</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">Informações exibidas para os responsáveis.</p>
            <div className="mt-7 flex items-center gap-5 border-b border-[var(--panel-border)] pb-7">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#EEE8FF] text-2xl font-bold text-[var(--brand-purple)]">A</div>
              <div><p className="font-semibold">Dra. Amanda</p><p className="text-sm text-[var(--muted)]">Fonoaudióloga</p><button className="mt-2 text-sm font-semibold text-[var(--brand-blue)]">Alterar foto</button></div>
            </div>
            <FormGrid fields={[["Nome completo", "Dra. Amanda Silva"], ["E-mail", "amanda@falakids.com"], ["Telefone", "(98) 99999-0000"], ["CRFa", "12345-MA"]]} />
          </>}
          {active === "Clínica" && <>
            <h2 className="font-[family-name:var(--font-baloo)] text-xl font-bold">Dados da clínica</h2><p className="mt-1 text-sm text-[var(--muted)]">Informações básicas do seu espaço de atendimento.</p>
            <FormGrid fields={[["Nome da clínica", "FalaKids Clínica Infantil"], ["CNPJ", "12.345.678/0001-90"], ["Telefone", "(98) 3333-4444"], ["Cidade", "São Luís - MA"]]} />
            <div className="mt-6"><label className="text-sm font-semibold">Endereço</label><input className="input mt-2" defaultValue="Av. Principal, 1200 - Cohama" /></div>
          </>}
          {active === "Notificações" && <>
            <h2 className="font-[family-name:var(--font-baloo)] text-xl font-bold">Notificações</h2><p className="mt-1 text-sm text-[var(--muted)]">Escolha quais avisos você deseja receber.</p>
            <ToggleRow title="Notificações gerais" description="Novas mensagens, tarefas e atualizações" value={notifications} onChange={setNotifications} />
            <ToggleRow title="Lembretes de sessão" description="Receba lembretes antes dos atendimentos" value={reminders} onChange={setReminders} />
            <ToggleRow title="Resumo semanal" description="Receba um resumo da evolução dos pacientes" value={true} onChange={() => {}} />
          </>}
          {active === "Preferências" && <>
            <h2 className="font-[family-name:var(--font-baloo)] text-xl font-bold">Preferências</h2><p className="mt-1 text-sm text-[var(--muted)]">Ajuste a experiência de uso.</p>
            <FormGrid fields={[["Idioma", "Português (Brasil)"], ["Fuso horário", "Brasília (GMT-3)"], ["Primeiro dia da semana", "Segunda-feira"], ["Formato de data", "DD/MM/AAAA"]]} />
          </>}
          {active === "Segurança" && <>
            <h2 className="font-[family-name:var(--font-baloo)] text-xl font-bold">Segurança</h2><p className="mt-1 text-sm text-[var(--muted)]">Mantenha sua conta protegida.</p>
            <div className="mt-6 rounded-2xl border border-[var(--panel-border)] p-5"><p className="font-semibold">Senha</p><p className="mt-1 text-sm text-[var(--muted)]">Sua senha foi atualizada há 42 dias.</p><button className="mt-4 rounded-xl border border-[var(--panel-border)] px-4 py-2 text-sm font-semibold">Alterar senha</button></div>
            <div className="mt-4 rounded-2xl border border-[var(--panel-border)] p-5"><p className="font-semibold">Sessões ativas</p><p className="mt-1 text-sm text-[var(--muted)]">Chrome · Windows · Este dispositivo</p></div>
          </>}
        </section>
      </div>
      <style jsx global>{`.input{width:100%;border:1px solid var(--panel-border);border-radius:12px;background:#fff;padding:12px 14px;font-size:14px;outline:none}.input:focus{border-color:var(--brand-blue);box-shadow:0 0 0 3px #4f6ef71a}`}</style>
    </div>
  );
}

function FormGrid({ fields }: { fields: string[][] }) { return <div className="mt-7 grid gap-5 md:grid-cols-2">{fields.map(([label, value]) => <div key={label}><label className="text-sm font-semibold">{label}</label><input className="input mt-2" defaultValue={value} /></div>)}</div>; }
function ToggleRow({ title, description, value, onChange }: { title: string; description: string; value: boolean; onChange: (v: boolean) => void }) { return <div className="mt-5 flex items-center justify-between rounded-2xl border border-[var(--panel-border)] p-5"><div><p className="font-semibold">{title}</p><p className="mt-1 text-sm text-[var(--muted)]">{description}</p></div><button onClick={() => onChange(!value)} className={`relative h-7 w-12 rounded-full transition ${value ? "bg-[var(--brand-green)]" : "bg-[#D9DEEA]"}`}><span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${value ? "left-6" : "left-1"}`} /></button></div>; }
