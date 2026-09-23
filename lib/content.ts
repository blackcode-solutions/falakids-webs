import type { ContentCategory, ExerciseType } from "@/lib/api";

// The real content library is organized by theme (animals, colors...), not
// by phoneme — see the API's schema.ts comment on `contentItem` — so these
// are purely client-side display labels, shared by every screen that lists
// content (session builder, library) so they don't drift independently.
export const CATEGORY_LABELS_PT: Record<ContentCategory, string> = {
  ANIMALS: "Animais",
  COLORS: "Cores",
  FRUITS: "Frutas",
  FAMILY: "Família",
  HOUSE: "Casa",
  NUMBERS: "Números",
  BODY: "Corpo",
  VEHICLES: "Veículos",
  NATURE: "Natureza",
  EMOTIONS: "Emoções",
  TRANSPORTS: "Transportes",
  FOOD: "Comida",
  ALFABET: "Alfabeto",
};

export const CATEGORY_EMOJI: Record<ContentCategory, string> = {
  ANIMALS: "🐶",
  COLORS: "🎨",
  FRUITS: "🍎",
  FAMILY: "👪",
  HOUSE: "🏠",
  NUMBERS: "🔢",
  BODY: "🧑",
  VEHICLES: "🚗",
  NATURE: "🌳",
  EMOTIONS: "😊",
  TRANSPORTS: "🚌",
  FOOD: "🍽️",
  ALFABET: "🔤",
};

export const DIFFICULTY_LABELS_PT: Record<string, string> = {
  BEGINNER: "Iniciante",
  INTERMEDIATE: "Intermediário",
  ADVANCED: "Avançado",
};

// The two practice modes a content item can be worked in. Kept here (not
// just inline strings) so the session builder, the library and assignment
// forms all render the same label/description for the same value.
export const EXERCISE_TYPE_LABELS_PT: Record<ExerciseType, string> = {
  REPETITION: "Repetição",
  NAMING: "Nomeação",
};

export const EXERCISE_TYPE_DESCRIPTIONS_PT: Record<ExerciseType, string> = {
  REPETITION: "A criança ouve/lê a palavra e repete.",
  NAMING: "A criança vê só a imagem e nomeia.",
};

/**
 * Speaks `text` out loud via the browser's speech synthesis, in Portuguese.
 * This is the same "no recorded audio yet" fallback the mobile app uses
 * (see the API's naming_prompt_audio comment) — the clinic site has no
 * per-word recorded audio for REPETITION content, only `mouthVideoUrl`
 * (video, not audio) and category-level NAMING prompt audio, so
 * text-to-speech is the only way for a fono to "hear" most words here.
 */
export function speak(text: string): boolean {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "pt-BR";
  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
