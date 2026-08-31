type Point = { label: string; value: number };

export default function LineChart({
  data,
  color = "var(--brand-blue)",
}: {
  data: Point[];
  color?: string;
}) {
  const width = 560;
  const height = 200;
  const padX = 24;
  const padY = 20;
  const max = 100;

  const stepX = (width - padX * 2) / (data.length - 1);
  const points = data.map((d, i) => {
    const x = padX + i * stepX;
    const y = padY + (height - padY * 2) * (1 - d.value / max);
    return { x, y, ...d };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padY} L ${points[0].x} ${height - padY} Z`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 25, 50, 75, 100].map((g) => {
          const y = padY + (height - padY * 2) * (1 - g / 100);
          return (
            <line
              key={g}
              x1={padX}
              x2={width - padX}
              y1={y}
              y2={y}
              stroke="#EEF0F8"
              strokeWidth="1"
            />
          );
        })}
        <path d={areaPath} fill="url(#lineFill)" />
        <path d={linePath} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p) => (
          <circle key={p.label} cx={p.x} cy={p.y} r="4" fill="white" stroke={color} strokeWidth="2.5" />
        ))}
      </svg>
      <div className="mt-1 flex justify-between text-xs text-[var(--muted)]">
        {data.map((d) => (
          <span key={d.label}>{d.label}</span>
        ))}
      </div>
    </div>
  );
}