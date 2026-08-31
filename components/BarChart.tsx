type Point = { label: string; value: number };

export default function BarChart({
  data,
  color = "var(--brand-blue)",
}: {
  data: Point[];
  color?: string;
}) {
  const width = 400;
  const height = 200;
  const padX = 20;
  const padY = 20;
  const max = 100;
  const gap = 18;
  const barWidth = (width - padX * 2 - gap * (data.length - 1)) / data.length;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="none">
        {[0, 25, 50, 75, 100].map((g) => {
          const y = padY + (height - padY * 2) * (1 - g / 100);
          return (
            <line key={g} x1={padX} x2={width - padX} y1={y} y2={y} stroke="#EEF0F8" strokeWidth="1" />
          );
        })}
        {data.map((d, i) => {
          const barHeight = (height - padY * 2) * (d.value / max);
          const x = padX + i * (barWidth + gap);
          const y = height - padY - barHeight;
          return (
            <g key={d.label}>
              <rect x={x} y={y} width={barWidth} height={barHeight} rx="7" fill={color} opacity={0.85} />
              <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" fontSize="11" fill="#8A8FA8">
                {d.value}%
              </text>
            </g>
          );
        })}
      </svg>
      <div className="mt-1 flex justify-between text-xs text-[var(--muted)]" style={{ paddingLeft: 8, paddingRight: 8 }}>
        {data.map((d) => (
          <span key={d.label}>{d.label}</span>
        ))}
      </div>
    </div>
  );
}