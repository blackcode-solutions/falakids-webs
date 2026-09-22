"use client";

import { useEffect, useRef, useState } from "react";
import Topbar from "@/components/Topbar";
import { SearchIcon, SendIcon, ChevronLeftIcon } from "@/components/icons";
import KidAvatar from "@/components/KidAvatar";
import {
  ApiError,
  getConversations,
  getPatientMessages,
  sendPatientMessage,
  markPatientMessagesRead,
  type Conversation,
  type Message,
} from "@/lib/api";

const CONVERSATIONS_POLL_MS = 10_000;
const THREAD_POLL_MS = 4_000;

function formatTime(iso: string): string {
  const date = new Date(iso);
  const isToday = date.toDateString() === new Date().toDateString();
  if (isToday) return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Ontem";
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeChildId, setActiveChildId] = useState<string | null>(null);
  const [thread, setThread] = useState<Message[] | null>(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [query, setQuery] = useState("");
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load & poll the conversation list.
  useEffect(() => {
    let cancelled = false;
    function load() {
      getConversations()
        .then(({ conversations }) => {
          if (cancelled) return;
          setConversations(conversations);
          setActiveChildId((current) => current ?? conversations[0]?.childId ?? null);
        })
        .catch((err) => {
          if (!cancelled) setError(err instanceof ApiError ? err.message : "Não foi possível carregar as conversas.");
        });
    }
    load();
    const interval = setInterval(load, CONVERSATIONS_POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  // Load & poll the active thread; mark it read when opened.
  useEffect(() => {
    if (!activeChildId) return;
    let cancelled = false;
    function load() {
      getPatientMessages(activeChildId!)
        .then(({ messages }) => {
          if (!cancelled) setThread(messages);
        })
        .catch(() => {
          /* keep showing the last known thread on a transient poll failure */
        });
    }
    setThread(null);
    load();
    markPatientMessagesRead(activeChildId).catch(() => {});
    const interval = setInterval(load, THREAD_POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [activeChildId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [thread]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!activeChildId || !draft.trim() || sending) return;
    setSending(true);
    const body = draft.trim();
    setDraft("");
    try {
      const { message } = await sendPatientMessage(activeChildId, body);
      setThread((prev) => [...(prev ?? []), message]);
      setConversations((prev) =>
        prev?.map((c) => (c.childId === activeChildId ? { ...c, lastMessage: message } : c)) ?? prev,
      );
    } catch {
      setDraft(body); // put it back so the therapist doesn't lose the message
    } finally {
      setSending(false);
    }
  }

  const active = conversations?.find((c) => c.childId === activeChildId) ?? null;
  const filtered = (conversations ?? []).filter((c) => c.childName.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <div className="pb-10">
      <Topbar title="Mensagens" />

      {error && (
        <p className="mx-4 mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 sm:mx-6 lg:mx-8">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-0 overflow-hidden rounded-3xl border border-[var(--panel-border)] bg-white mx-4 h-[75vh] sm:mx-6 lg:mx-8 lg:h-[calc(100vh-160px)] lg:grid-cols-[300px_1fr]">
        <aside className={`flex-col border-r border-[var(--panel-border)] ${mobileView === "list" ? "flex" : "hidden"} lg:flex`}>
          <div className="p-4">
            <div className="flex items-center gap-2 rounded-full border border-[var(--panel-border)] bg-[#F7F8FD] px-4 py-2 text-sm text-[var(--muted)]">
              <SearchIcon className="h-4 w-4" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar conversa..."
                className="focus-ring w-full bg-transparent outline-none placeholder:text-[var(--muted)]"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {!conversations && !error && (
              <p className="px-4 py-3 text-sm text-[var(--muted)]">Carregando conversas...</p>
            )}
            {conversations && filtered.length === 0 && (
              <p className="px-4 py-3 text-sm text-[var(--muted)]">
                Nenhuma conversa ainda. Elas aparecem assim que um paciente tiver o app vinculado.
              </p>
            )}
            {filtered.map((c) => (
              <button
                key={c.patientLinkId}
                onClick={() => {
                  setActiveChildId(c.childId);
                  setMobileView("chat");
                }}
                className={`focus-ring flex w-full items-start gap-3 px-4 py-3 text-left transition-colors ${
                  activeChildId === c.childId ? "bg-[var(--wash-blue)]" : "hover:bg-[#F7F8FD]"
                }`}
              >
                <KidAvatar seed={c.childId} className="h-11 w-11 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-bold">{c.childName}</p>
                    {c.lastMessage && (
                      <span className="shrink-0 text-[11px] text-[var(--muted)]">{formatTime(c.lastMessage.createdAt)}</span>
                    )}
                  </div>
                  <p className="truncate text-xs font-medium text-[var(--muted)]">
                    {c.lastMessage ? c.lastMessage.body : "Sem mensagens ainda"}
                  </p>
                </div>
                {c.unreadCount > 0 && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--brand-pink)]" />}
              </button>
            ))}
          </div>
        </aside>

        <section className={`flex-col ${mobileView === "chat" ? "flex" : "hidden"} lg:flex`}>
          {!active && (
            <div className="flex flex-1 items-center justify-center px-6 text-center text-sm text-[var(--muted)]">
              {conversations ? "Selecione uma conversa." : ""}
            </div>
          )}

          {active && (
            <>
              <div className="flex items-center gap-2 border-b border-[var(--panel-border)] px-3 py-3 sm:px-6 sm:py-4">
                <button
                  onClick={() => setMobileView("list")}
                  aria-label="Voltar para conversas"
                  className="focus-ring flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--muted)] hover:bg-[#F2F4FB] lg:hidden"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{active.childName}</p>
                  <p className="truncate text-xs text-[var(--muted)]">Responsável</p>
                </div>
              </div>

              <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-3 py-4 sm:px-6">
                {thread === null && <p className="text-center text-xs text-[var(--muted)]">Carregando mensagens...</p>}
                {thread?.length === 0 && (
                  <p className="text-center text-xs text-[var(--muted)]">
                    Nenhuma mensagem ainda. Envie a primeira mensagem para o responsável.
                  </p>
                )}
                {thread?.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.senderRole === "THERAPIST" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm sm:max-w-sm ${
                        msg.senderRole === "THERAPIST"
                          ? "rounded-br-sm bg-[var(--brand-blue)] text-white"
                          : "rounded-bl-sm bg-[#F2F4FB] text-[var(--foreground)]"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{msg.body}</p>
                      <p className={`mt-1 text-[10px] ${msg.senderRole === "THERAPIST" ? "text-white/70" : "text-[var(--muted)]"}`}>
                        {formatTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-[var(--panel-border)] px-3 py-3 sm:gap-3 sm:px-6 sm:py-4">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="focus-ring min-w-0 flex-1 rounded-full border border-[var(--panel-border)] bg-[#F7F8FD] px-4 py-2.5 text-sm outline-none placeholder:text-[var(--muted)]"
                />
                <button
                  type="submit"
                  disabled={!draft.trim() || sending}
                  aria-label="Enviar"
                  className="focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--brand-blue)] text-white shadow-sm hover:brightness-105 disabled:opacity-50"
                >
                  <SendIcon className="h-4 w-4" />
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
