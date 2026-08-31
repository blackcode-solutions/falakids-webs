"use client";

import { useState } from "react";
import Topbar from "@/components/Topbar";
import { SearchIcon, SendIcon, HeartIcon } from "@/components/icons";
import KidAvatar from "@/components/KidAvatar";
import { messages, patients } from "@/lib/data";

type ChatMessage = { id: string; from: "them" | "me"; text: string; time: string };

const THREADS: Record<string, ChatMessage[]> = {
  "1": [
    { id: "a", from: "them", text: "Boa tarde! Percebi que ele está pronunciando melhor o R!", time: "10:20" },
    { id: "b", from: "me", text: "Que ótima notícia! Continue praticando as atividades enviadas.", time: "10:25" },
    { id: "c", from: "them", text: "Percebi que ele está pronunciando melhor o R nas atividades dessa semana.", time: "10:30" },
  ],
  "2": [
    { id: "a", from: "me", text: "Segue o feedback da última sessão da Maria Clara.", time: "Ontem" },
    { id: "b", from: "them", text: "Obrigado pelo feedback!", time: "Ontem" },
  ],
  "3": [
    { id: "a", from: "them", text: "Tudo certo, até amanhã!", time: "10:15" },
  ],
  "4": [
    { id: "a", from: "them", text: "Ela está pronunciando melhor o som R.", time: "Seg" },
    { id: "b", from: "me", text: "Excelente! Vamos manter o ritmo.", time: "Seg" },
  ],
};

export default function MessagesPage() {
  const [activeId, setActiveId] = useState(messages[0].id);
  const [draft, setDraft] = useState("");
  const active = messages.find((m) => m.id === activeId)!;
  const patient = patients.find((p) => p.id === active.relation);
  const thread = THREADS[activeId] ?? [];

  return (
    <div className="pb-10">
      <Topbar title="Mensagens" />

      <div className="grid grid-cols-1 gap-0 overflow-hidden rounded-3xl border border-[var(--panel-border)] bg-white mx-8 lg:grid-cols-[300px_1fr]" style={{ height: "calc(100vh - 160px)" }}>
        <aside className="flex flex-col border-r border-[var(--panel-border)]">
          <div className="p-4">
            <div className="flex items-center gap-2 rounded-full border border-[var(--panel-border)] bg-[#F7F8FD] px-4 py-2 text-sm text-[var(--muted)]">
              <SearchIcon className="h-4 w-4" />
              <input
                placeholder="Buscar conversa..."
                className="focus-ring w-full bg-transparent outline-none placeholder:text-[var(--muted)]"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {messages.map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveId(m.id)}
                className={`focus-ring flex w-full items-start gap-3 px-4 py-3 text-left transition-colors ${
                  activeId === m.id ? "bg-[var(--wash-blue)]" : "hover:bg-[#F7F8FD]"
                }`}
              >
<KidAvatar seed={m.id} className="h-11 w-11" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-bold">{m.name}</p>
                    <span className="shrink-0 text-[11px] text-[var(--muted)]">{m.time}</span>
                  </div>
                  <p className="truncate text-xs font-medium text-[var(--muted)]">{m.preview}</p>
                </div>
                {m.unread && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--brand-pink)]" />}
              </button>
            ))}
          </div>
        </aside>

        <section className="flex flex-col">
          <div className="flex items-center justify-between border-b border-[var(--panel-border)] px-6 py-4">
            <div>
              <p className="text-sm font-bold">{active.name}</p>
              <p className="text-xs text-[var(--muted)]">{patient ? `Responsável de ${patient.name}` : ""}</p>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-6 py-4">
            {thread.map((msg) => (
              <div key={msg.id} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-sm rounded-2xl px-4 py-2.5 text-sm ${
                    msg.from === "me"
                      ? "rounded-br-sm bg-[var(--brand-blue)] text-white"
                      : "rounded-bl-sm bg-[#F2F4FB] text-[var(--foreground)]"
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className={`mt-1 text-[10px] ${msg.from === "me" ? "text-white/70" : "text-[var(--muted)]"}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
            {thread.length > 0 && (
              <div className="flex justify-start">
                <div className="badge badge-pink">
                  <HeartIcon className="h-3 w-3" /> Excelente feedback!
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setDraft("");
            }}
            className="flex items-center gap-3 border-t border-[var(--panel-border)] px-6 py-4"
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="focus-ring flex-1 rounded-full border border-[var(--panel-border)] bg-[#F7F8FD] px-4 py-2.5 text-sm outline-none placeholder:text-[var(--muted)]"
            />
            <button
              type="submit"
              aria-label="Enviar"
              className="focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--brand-blue)] text-white shadow-sm hover:brightness-105"
            >
              <SendIcon className="h-4 w-4" />
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}