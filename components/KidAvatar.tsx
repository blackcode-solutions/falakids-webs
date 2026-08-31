"use client";

/**
 * KidAvatar
 * Avatar ilustrado e determinístico de criança, gerado 100% em SVG a partir de um `seed`.
 * O mesmo seed sempre produz a mesma carinha (útil para manter o avatar de um
 * paciente consistente em toda a aplicação sem precisar guardar uma imagem).
 *
 * Uso:
 *   <KidAvatar seed={patient.id} className="h-11 w-11" />
 */

type KidAvatarProps = {
  seed: string;
  className?: string;
};

// ---- PRNG determinístico (mulberry32) a partir de uma string ----
function hashString(str: string) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
}

function makeRng(seed: string) {
  const seeder = hashString(seed);
  let a = seeder();
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length) % arr.length];
}

// ---- Paletas ----
const BG_COLORS = ["#FFE4E1", "#DCEBFF", "#FFF4CC", "#E1F5E4", "#F1E4FF", "#FFE8D6"];
const SKIN_TONES = ["#FFE0BD", "#F4C48C", "#D9A066", "#A9673F", "#8D5524"];
const HAIR_COLORS = ["#2B2118", "#5C3A21", "#8C5A2B", "#C6862B", "#1A1A1A", "#B5651D"];
const CHEEK_COLOR = "#FF9AA2";

type HairStyle = "short" | "curly" | "pigtails" | "bowlcut" | "bun" | "bald" | "headband";
const HAIR_STYLES: HairStyle[] = ["short", "curly", "pigtails", "bowlcut", "bun", "bald", "headband"];

const EYE_STYLES: Array<"dot" | "happy" | "wink"> = ["dot", "happy", "wink"];
const MOUTH_STYLES: Array<"smile" | "grin" | "small"> = ["smile", "grin", "small"];

function Hair({
  style,
  color,
}: {
  style: HairStyle;
  color: string;
}) {
  switch (style) {
    case "curly":
      return (
        <g fill={color}>
          <circle cx="20" cy="26" r="9" />
          <circle cx="32" cy="18" r="10" />
          <circle cx="46" cy="14" r="10" />
          <circle cx="60" cy="18" r="10" />
          <circle cx="72" cy="26" r="9" />
          <circle cx="50" cy="24" r="14" />
        </g>
      );
    case "pigtails":
      return (
        <g fill={color}>
          <path d="M22 40 Q14 26 32 18 Q50 8 68 18 Q86 26 78 40 Q78 20 50 18 Q22 20 22 40 Z" />
          <circle cx="16" cy="46" r="7" />
          <circle cx="84" cy="46" r="7" />
        </g>
      );
    case "bowlcut":
      return (
        <g fill={color}>
          <path d="M20 42 Q18 10 50 10 Q82 10 80 42 Q80 26 50 26 Q20 26 20 42 Z" />
        </g>
      );
    case "bun":
      return (
        <g fill={color}>
          <path d="M22 40 Q18 14 50 14 Q82 14 78 40 Q78 24 50 22 Q22 24 22 40 Z" />
          <circle cx="50" cy="8" r="8" />
        </g>
      );
    case "headband":
      return (
        <g>
          <path d="M20 40 Q18 8 50 8 Q82 8 80 40 Q80 22 50 20 Q20 22 20 40 Z" fill={color} />
          <rect x="18" y="30" width="64" height="8" rx="4" fill="#FF6B6B" />
        </g>
      );
    case "bald":
      return null;
    case "short":
    default:
      return (
        <g fill={color}>
          <path d="M20 38 Q16 8 50 8 Q84 8 80 38 Q80 20 50 18 Q20 20 20 38 Z" />
        </g>
      );
  }
}

function Eyes({ style }: { style: "dot" | "happy" | "wink" }) {
  if (style === "happy") {
    return (
      <g stroke="#2B2118" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M36 52 Q40 46 44 52" />
        <path d="M56 52 Q60 46 64 52" />
      </g>
    );
  }
  if (style === "wink") {
    return (
      <g fill="#2B2118">
        <circle cx="40" cy="50" r="3.2" />
        <path d="M56 50 Q60 46 64 50" stroke="#2B2118" strokeWidth="3" strokeLinecap="round" fill="none" />
      </g>
    );
  }
  return (
    <g fill="#2B2118">
      <circle cx="40" cy="50" r="3.2" />
      <circle cx="60" cy="50" r="3.2" />
    </g>
  );
}

function Mouth({ style }: { style: "smile" | "grin" | "small" }) {
  if (style === "grin") {
    return <path d="M38 62 Q50 74 62 62 Q50 68 38 62 Z" fill="#B5453D" />;
  }
  if (style === "small") {
    return <path d="M44 63 Q50 67 56 63" stroke="#B5453D" strokeWidth="3" strokeLinecap="round" fill="none" />;
  }
  return <path d="M38 61 Q50 72 62 61" stroke="#B5453D" strokeWidth="3.2" strokeLinecap="round" fill="none" />;
}

export default function KidAvatar({ seed, className = "h-11 w-11" }: KidAvatarProps) {
  const rng = makeRng(seed || "kid");

  const bg = pick(rng, BG_COLORS);
  const skin = pick(rng, SKIN_TONES);
  const hairColor = pick(rng, HAIR_COLORS);
  const hairStyle = pick(rng, HAIR_STYLES);
  const eyeStyle = pick(rng, EYE_STYLES);
  const mouthStyle = pick(rng, MOUTH_STYLES);
  const uid = seed.replace(/[^a-zA-Z0-9]/g, "");

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label="Avatar da criança"
    >
      <defs>
        <clipPath id={`clip-${uid}`}>
          <circle cx="50" cy="50" r="50" />
        </clipPath>
      </defs>

      <g clipPath={`url(#clip-${uid})`}>
        <rect width="100" height="100" fill={bg} />

        {/* rosto */}
        <circle cx="50" cy="54" r="30" fill={skin} />

        {/* bochechas */}
        <circle cx="32" cy="58" r="5" fill={CHEEK_COLOR} opacity="0.55" />
        <circle cx="68" cy="58" r="5" fill={CHEEK_COLOR} opacity="0.55" />

        <Eyes style={eyeStyle} />
        <Mouth style={mouthStyle} />

        {/* cabelo por cima */}
        <Hair style={hairStyle} color={hairColor} />
      </g>

      {/* contorno sutil */}
      <circle cx="50" cy="50" r="49" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="2" />
    </svg>
  );
}