export default function Parrot({ className = "w-24 h-24" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <ellipse cx="60" cy="108" rx="22" ry="5" fill="#00000010" />
      <path d="M70 30c14-10 30-6 34 6-6-2-12-2-17 1 8 3 13 10 12 18-6-6-13-8-19-6 5 6 6 14 2 21-8-14-22-18-22-18Z" fill="#FF4B4B" />
      <path d="M38 34C24 26 18 34 20 44c5-3 10-4 15-2-6 4-9 10-7 17 5-5 11-6 16-4-3 6-2 13 3 18-2-15 9-28 9-28Z" fill="#3AA0FF" />
      <ellipse cx="60" cy="58" rx="26" ry="30" fill="#FF4B4B" />
      <ellipse cx="60" cy="70" rx="18" ry="22" fill="#FFC93C" />
      <circle cx="52" cy="46" r="8" fill="#fff" />
      <circle cx="53.5" cy="46" r="4.2" fill="#1E2140" />
      <path d="M56 54c4 4 4 10-2 13-7 3-12-3-10-8Z" fill="#FF9F1C" />
      <path d="M42 96c-4 6-4 12 2 14 4-6 4-6 8-14Z" fill="#FFC93C" />
      <path d="M78 96c4 6 4 12-2 14-4-6-4-6-8-14Z" fill="#FFC93C" />
      <path d="M34 62c-10 2-16 10-14 18 6-4 11-5 16-4-4 5-4 11 0 15 3-8 10-13 10-13Z" fill="#3AA0FF" />
    </svg>
  );
}