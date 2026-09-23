"use client";

import { useEffect, useMemo, useState } from "react";
import Topbar from "@/components/Topbar";
import AudioButton from "@/components/AudioButton";
import { FilterIcon, ImageIcon, SearchIcon, VideoIcon } from "@/components/icons";
import {
  ApiError,
  listContent,
  listNamingPrompts,
  type ContentCategory,
  type ContentItem,
  type ExerciseType,
  type NamingPromptAudio,
} from "@/lib/api";
import { CATEGORY_EMOJI, CATEGORY_LABELS_PT, DIFFICULTY_LABELS_PT, EXERCISE_TYPE_DESCRIPTIONS_PT, EXERCISE_TYPE_LABELS_PT } from "@/lib/content";

const CATEGORIES = Object.keys(CATEGORY_LABELS_PT) as ContentCategory[];
const DIFFICULTIES = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;

export default function LibraryPage() {
  const [exerciseType, setExerciseType] = useState<ExerciseType>("REPETITION");
  const [content, setContent] = useState<ContentItem[] | null>(null);
  const [prompts, setPrompts] = useState<NamingPromptAudio[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ContentCategory | null>(null);
  const [difficulty, setDifficulty] = useState<(typeof DIFFICULTIES)[number] | null>(null);

  useEffect(() => {
    Promise.all([listContent(), listNamingPrompts()])
      .then(([contentRes, promptsRes]) => {
        setContent(contentRes.contents);
        setPrompts(promptsRes.prompts);
      })
      .catch((err) => {
        setLoadError(err instanceof ApiError ? err.message : "Não foi possível carregar a biblioteca.");
      });
  }, []);

  const filtered = useMemo(() => {
    return (content ?? []).filter((a) => {
      if (query && !a.labelPT.toLowerCase().includes(query.toLowerCase())) return false;
      if (category && a.category !== category) return false;
      if (difficulty && a.difficultyLevel !== difficulty) return false;
      return true;
    });
  }, [content, query, category, difficulty]);

  const byCategory = useMemo(() => {
    const groups = new Map<ContentCategory, ContentItem[]>();
    for (const item of filtered) {
      const list = groups.get(item.category) ?? [];
      list.push(item);
      groups.set(item.category, list);
    }
    return Array.from(groups.entries());
  }, [filtered]);

  const promptByCategory = useMemo(() => {
    const map = new Map<ContentCategory, NamingPromptAudio>();
    for (const p of prompts ?? []) map.set(p.category, p);
    return map;
  }, [prompts]);

  if (loadError) {
    return (
      <div className="pb-10">
        <Topbar title="Biblioteca de Atividades" />
        <p className="mx-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 sm:mx-6 lg:mx-8">
          {loadError}
        </p>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <Topbar title="Biblioteca de Atividades" />

      {/* Exercise-type separation: repetição vs nomeação are different
          practice modes over the same content, not different content, so
          this is a mode switch rather than a category filter. */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-5 inline-flex rounded-full border border-[var(--panel-border)] bg-white p-1 text-sm shadow-sm">
          {(["REPETITION", "NAMING"] as ExerciseType[]).map((t) => (
            <button
              key={t}
              onClick={() => setExerciseType(t)}
              className={`focus-ring rounded-full px-4 py-2 font-bold transition-colors ${
                exerciseType === t ? "bg-[var(--brand-blue)] text-white" : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {EXERCISE_TYPE_LABELS_PT[t]}
            </button>
          ))}
        </div>
        <p className="-mt-3 mb-5 text-xs text-[var(--muted)]">{EXERCISE_TYPE_DESCRIPTIONS_PT[exerciseType]}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 px-4 sm:px-6 lg:px-8 lg:grid-cols-[240px_1fr]">
        <aside className="card h-fit p-5">
          <div className="mb-5 flex items-center gap-2 text-sm font-extrabold">
            <FilterIcon className="h-4 w-4 text-[var(--muted)]" />
            Filtros
          </div>

          <FilterGroup title="Categoria">
            {CATEGORIES.map((c) => (
              <Checkbox
                key={c}
                label={`${CATEGORY_EMOJI[c]} ${CATEGORY_LABELS_PT[c]}`}
                checked={category === c}
                onChange={() => setCategory(category === c ? null : c)}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Nível">
            {DIFFICULTIES.map((d) => (
              <Checkbox
                key={d}
                label={DIFFICULTY_LABELS_PT[d]}
                checked={difficulty === d}
                onChange={() => setDifficulty(difficulty === d ? null : d)}
              />
            ))}
          </FilterGroup>
        </aside>

        <div>
          <div className="mb-5 flex items-center gap-2 rounded-full border border-[var(--panel-border)] bg-white px-4 py-2.5 text-sm text-[var(--muted)] shadow-sm">
            <SearchIcon className="h-4 w-4" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar atividades..."
              className="focus-ring w-full bg-transparent outline-none placeholder:text-[var(--muted)]"
            />
          </div>

          {!content && <p className="py-10 text-center text-sm text-[var(--muted)]">Carregando biblioteca...</p>}

          {content && filtered.length === 0 && (
            <p className="py-10 text-center text-sm text-[var(--muted)]">Nenhuma atividade encontrada para esse filtro.</p>
          )}

          {content && filtered.length > 0 && exerciseType === "REPETITION" && (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
              {filtered.map((a) => (
                <RepetitionCard key={a.id} item={a} />
              ))}
            </div>
          )}

          {content && filtered.length > 0 && exerciseType === "NAMING" && (
            <div className="flex flex-col gap-8">
              {byCategory.map(([cat, items]) => (
                <NamingCategorySection key={cat} category={cat} items={items} prompt={promptByCategory.get(cat)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RepetitionCard({ item }: { item: ContentItem }) {
  return (
    <div className="card focus-ring group relative flex flex-col items-center gap-3 p-4 text-center transition-transform hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-[#F2F4FB]">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.imageUrl} alt={item.labelPT} className="h-full w-full object-cover" />
        ) : (
          <span className="text-3xl">{CATEGORY_EMOJI[item.category] ?? "🗣️"}</span>
        )}
      </div>
      <div>
        <p className="text-sm font-bold">{item.labelPT}</p>
        <p className="text-xs font-medium text-[var(--muted)]">{CATEGORY_LABELS_PT[item.category]}</p>
      </div>
      <div className="flex items-center gap-2">
        <AudioButton size="sm" fallbackText={item.soundPT || item.labelPT} label={`Ouvir "${item.labelPT}"`} />
        {item.mouthVideoUrl && (
          <a
            href={item.mouthVideoUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`Ver vídeo de articulação de ${item.labelPT}`}
            title="Ver vídeo de articulação"
            className="focus-ring flex h-7 w-7 items-center justify-center rounded-full border border-[var(--panel-border)] bg-white text-[var(--brand-purple)] hover:bg-[#F5F1FF]"
          >
            <VideoIcon className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}

function NamingCategorySection({
  category,
  items,
  prompt,
}: {
  category: ContentCategory;
  items: ContentItem[];
  prompt?: NamingPromptAudio;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F2F4FB] text-lg">
          {CATEGORY_EMOJI[category]}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-[family-name:var(--font-baloo)] text-base font-extrabold">{CATEGORY_LABELS_PT[category]}</h3>
          <p className="text-xs text-[var(--muted)]">Pergunta de nomeação da categoria</p>
        </div>
        <AudioButton
          src={prompt?.audioUrl}
          fallbackText={`Que ${CATEGORY_LABELS_PT[category].toLowerCase()} é esse?`}
          label={`Ouvir pergunta de nomeação — ${CATEGORY_LABELS_PT[category]}`}
        />
      </div>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <div key={item.id} className="card flex flex-col items-center gap-2 p-4 text-center">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-[#F2F4FB]">
              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <ImageIcon className="h-8 w-8 text-[var(--muted)]" />
              )}
            </div>
            <p className="text-xs font-medium text-[var(--muted)]">
              {item.labelPT} <span className="italic">(oculto p/ a criança)</span>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5 border-b border-[var(--panel-border)] pb-5 last:mb-0 last:border-0 last:pb-0">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">{title}</p>
      <div className="flex max-h-56 flex-col gap-2 overflow-y-auto pr-1">{children}</div>
    </div>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--foreground)]">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-[var(--panel-border)] accent-[var(--brand-blue)]"
      />
      {label}
    </label>
  );
}
