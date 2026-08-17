import { LINE_COLORS } from "@/data/hospitals";

export function LineBullet({ line }: { line: string }) {
  const c = LINE_COLORS[line] ?? { bg: "#333", fg: "#fff" };
  return (
    <span
      className="line-bullet"
      style={{ backgroundColor: c.bg, color: c.fg }}
      aria-label={`${line} train`}
    >
      {line}
    </span>
  );
}

export function LineBullets({ lines }: { lines: string[] }) {
  return (
    <span className="inline-flex items-center gap-1">
      {lines.map((l) => (
        <LineBullet key={l} line={l} />
      ))}
    </span>
  );
}
