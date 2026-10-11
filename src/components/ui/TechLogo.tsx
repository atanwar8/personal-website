import { BRAND_PATHS } from "./brandPaths";

/*
 * Brand marks (official colours, from simple-icons, CC0; trademarks belong to their owners)
 * and thin line icons for concept skills or tools whose marks aren't redistributable.
 */

export const BRAND = BRAND_PATHS;

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

/** Thin line icons keyed by skill family, drawn on a 24×24 grid. */
export const CONCEPT: Record<string, React.ReactNode> = {
  Strategy: (
    <g {...stroke}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="0.8" fill="currentColor" />
      <path d="M12 3.5V1.5M20.5 12h2M12 20.5v2M3.5 12h-2" />
    </g>
  ),
  Analytics: (
    <g {...stroke}>
      <path d="M3 20.5h18" />
      <path d="M6 17v-5M10.5 17V8M15 17v-7M19.5 17V4.5" />
      <path d="M5 9.5l5-4.5 4.5 3 5-5" />
    </g>
  ),
  "Data & Cloud": (
    <g {...stroke}>
      <ellipse cx="12" cy="5.5" rx="7.5" ry="2.8" />
      <path d="M4.5 5.5v6.5c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8V5.5" />
      <path d="M4.5 12v6.5c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8V12" />
    </g>
  ),
  "AI & Automation": (
    <g {...stroke}>
      <rect x="6" y="6" width="12" height="12" rx="2.5" />
      <path d="M9.5 2.5V6M14.5 2.5V6M9.5 18v3.5M14.5 18v3.5M2.5 9.5H6M2.5 14.5H6M18 9.5h3.5M18 14.5h3.5" />
      <path d="M10 14.5l2-5 2 5M10.7 12.8h2.6" />
    </g>
  ),
  Commercial: (
    <g {...stroke}>
      <circle cx="8" cy="8" r="3.2" />
      <path d="M2.5 19.5c.6-3.4 2.8-5.3 5.5-5.3s4.9 1.9 5.5 5.3" />
      <circle cx="17" cy="9.5" r="2.5" />
      <path d="M15.2 14.6c.6-.2 1.2-.3 1.8-.3 2.2 0 3.9 1.6 4.5 4.4" />
    </g>
  ),
  Finance: (
    <g {...stroke}>
      <path d="M3 20.5h18M4.5 20.5V10M9.5 20.5V10M14.5 20.5V10M19.5 20.5V10" />
      <path d="M2.5 8L12 3l9.5 5z" />
    </g>
  ),
};

export function isBrand(key?: string): key is keyof typeof BRAND {
  return !!key && key in BRAND;
}

export default function TechLogo({
  logo,
  family,
  size = 24,
  className,
}: {
  logo?: string;
  family: string;
  size?: number;
  className?: string;
}) {
  if (isBrand(logo)) {
    const b = BRAND[logo];
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path d={b.path} fill={b.hex} />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      {CONCEPT[family] ?? CONCEPT.Strategy}
    </svg>
  );
}
