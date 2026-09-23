"use client";

import { useEffect, useRef, useState } from "react";
import { PauseIcon, PlayIcon } from "@/components/icons";
import { speak, stopSpeaking } from "@/lib/content";

/**
 * Plays a recorded audio file when `src` is given; otherwise falls back to
 * speech synthesis reading `fallbackText` out loud, mirroring the mobile
 * app's "no recorded audio yet → text-to-speech" behavior (see the API's
 * `naming_prompt_audio` comment). Used anywhere a fono wants to preview
 * content — the library and the session builder.
 */
export default function AudioButton({
  src,
  fallbackText,
  label,
  size = "md",
  className = "",
}: {
  src?: string;
  fallbackText?: string;
  label?: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      stopSpeaking();
    };
  }, []);

  const disabled = !src && !fallbackText;
  const dim = size === "sm" ? "h-7 w-7" : "h-9 w-9";
  const iconDim = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  function handleClick() {
    if (disabled) return;

    if (src) {
      if (!audioRef.current) {
        audioRef.current = new Audio(src);
        audioRef.current.addEventListener("ended", () => setPlaying(false));
        audioRef.current.addEventListener("pause", () => setPlaying(false));
      }
      if (playing) {
        audioRef.current.pause();
      } else {
        stopSpeaking();
        audioRef.current.currentTime = 0;
        void audioRef.current.play();
        setPlaying(true);
      }
      return;
    }

    if (fallbackText) {
      if (playing) {
        stopSpeaking();
        setPlaying(false);
        return;
      }
      const started = speak(fallbackText);
      if (started) {
        setPlaying(true);
        // speechSynthesis has no reliable single "ended" callback across
        // browsers for this simple case, so just flip back after a beat
        // proportional to text length rather than tracking utterance state.
        const ms = Math.max(900, fallbackText.length * 90);
        window.setTimeout(() => setPlaying(false), ms);
      }
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-label={label ?? (playing ? "Pausar áudio" : "Ouvir áudio")}
      title={disabled ? "Sem áudio disponível" : label ?? (src ? "Áudio gravado" : "Ouvir (texto-pra-voz)")}
      className={`focus-ring flex ${dim} shrink-0 items-center justify-center rounded-full border transition-colors ${
        disabled
          ? "cursor-not-allowed border-[var(--panel-border)] text-[var(--muted)] opacity-40"
          : playing
            ? "border-[var(--brand-blue)] bg-[var(--brand-blue)] text-white"
            : "border-[var(--panel-border)] bg-white text-[var(--brand-blue)] hover:bg-[var(--wash-blue)]"
      } ${className}`}
    >
      {playing ? <PauseIcon className={iconDim} /> : <PlayIcon className={iconDim} />}
    </button>
  );
}
