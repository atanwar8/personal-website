"use client";
import Image from "next/image";
import {useRef, useState} from "react";
import {MAP_PLACES, type MapKind, type MapPlace} from "@/lib/data";
import {useScrollProgress} from "@/lib/hooks";
import {scrollToTarget} from "@/lib/scroll";

/*
 * Experience, like the original portfolio: a sticky heading on one side and the stops listed
 * down the other in order, each with its logo. A line fills and each stop lights up as you scroll.
 * The last stop is a mini avatar: click it and a hand brings a graduation cap onto his head.
 */

type Stop = MapPlace & {when: string; avatar?: boolean};
const WHEN: Record<string, string> = {
  edelweiss: "2021–22", "kelley-bs": "2022–2025", cornell: "2022", bdo: "2023", deloitte: "2024",
  "msis-research": "2025", "kelley-msis": "M.S. 2026", toyota: "2025", allianz: "2025", coopersurgical: "2026", grainger: "2026",
};
const ORDER = ["edelweiss", "kelley-bs", "cornell", "bdo", "deloitte", "msis-research", "kelley-msis", "toyota", "allianz", "coopersurgical", "grainger"];
const GRAD: Stop = {
  id: "grad", label: "Class of 2026", when: "Dec 2026", avatar: true, place: "Graduating, class of 2026", kind: "Education", t: 2027, skills: [],
  roles: [{
    title: "M.S. Information Systems · Kelley School of Business", dates: "December 2026",
    points: [
      "Finishing my MSIS at Kelley, after a B.S. in Information Systems and Business Analytics.",
    ],
  }],
};
const STOPS: Stop[] = [...ORDER.map((id) => ({...MAP_PLACES.find((p) => p.id === id)!, when: WHEN[id]})), GRAD];
const KIND_COLOR: Record<MapKind, string> = {Internships: "#3b6fd4", Research: "#7a5cc4", Projects: "#e0763a", Education: "#2f8a5c"};

function Mark({stop, size}: {stop: Stop; size: number}) {
  if (stop.avatar) return <Image unoptimized src="/aryan-avatar-memoji.png" width={size} height={size} alt="" className="zz-avatar-img" />;
  if (stop.logo) return <Image unoptimized src={`/organizations/${stop.logo}.png`} width={size} height={size} alt="" />;
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect x="2" y="2" width="28" height="28" rx="8" fill="#e6efe2" />
      <path d="M7 21l5-5 4 3 9-9M20 10h5v5" fill="none" stroke="#2f7a55" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const easeOutBack = (x: number) => 1 + 2.2 * Math.pow(x - 1, 3) + 1.2 * Math.pow(x - 1, 2);

/**
 * The finale: as it scrolls into view, the avatar lifts his green cap off and a graduation
 * cap drops onto his head. Fully scroll-driven, so scrolling back up reverses it.
 */
function GradAvatar() {
  const [p, setP] = useState(0);
  const ref = useScrollProgress<HTMLDivElement>((r, vh) => (vh * 0.95 - r.top) / (vh * 0.45), (v) => setP(clamp01(v)));
  const lift = easeInOut(clamp01((p - 0.08) / 0.4)); // green cap comes off
  const drop = clamp01((p - 0.5) / 0.38); // graduation cap goes on
  const land = easeOutBack(drop);
  const done = drop >= 1;
  const handIn = Math.sin(Math.PI * clamp01((p - 0.04) / 0.5));
  return (
    <div ref={ref} className={`ex-grad${done ? " is-done" : ""}`} aria-hidden="true">
      <div className="ex-grad-fig">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="ex-grad-head" src="/avatar/avatar-head.png" alt="" width={520} height={497} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="ex-grad-old" src="/avatar/avatar-cap.png" alt="" width={520} height={497}
          style={{transform: `translate(${lift * 62}%, ${-lift * 18}%) rotate(${lift * 32}deg) scale(${1 - lift * 0.12})`, opacity: 1 - clamp01((lift - 0.65) / 0.35)}} />
        <svg className="ex-grad-hand" viewBox="0 0 30 34" style={{opacity: handIn, transform: `translate(${lift * 190}%, ${-lift * 40}%) rotate(${lift * 24}deg)`}}>
          <path d="M9 32V17c0-2 3-2 3 0v-9c0-2 3-2 3 0v-2c0-2 3-2 3 0v2c0-2 3-2 3 0v3c0-2 3-2 3 0v11c0 6-3 10-9 10Z" fill="#f4c7a0" stroke="#c98a60" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M9 21c-2-2-5-1-4 2l4 6" fill="#f4c7a0" stroke="#c98a60" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
        <svg className="ex-grad-cap" viewBox="0 0 120 74"
          style={{opacity: drop > 0 ? 1 : 0, transform: `translate(-50%, ${(1 - land) * -150}%) rotate(${(1 - drop) * 18 - 5}deg) scale(${0.85 + 0.15 * land})`}}>
          <defs>
            <linearGradient id="mb-top" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#3a3a3a" /><stop offset="1" stopColor="#0d0d0d" /></linearGradient>
            <linearGradient id="mb-skull" x2="0" y2="1"><stop stopColor="#1c1c1c" /><stop offset="1" stopColor="#070707" /></linearGradient>
          </defs>
          <path d="M28 30v18c0 8 14 13 32 13s32-5 32-13V30" fill="url(#mb-skull)" />
          <path d="M60 6 116 25 60 44 4 25Z" fill="url(#mb-top)" stroke="#000" strokeWidth="1" strokeLinejoin="round" />
          <path d="M60 9 108 25" stroke="#ffffff22" strokeWidth="1.5" strokeLinecap="round" />
          <g className="ex-tassel">
            <path d="M60 25 98 33v17" fill="none" stroke="#c8102e" strokeWidth="2" strokeLinecap="round" />
            <path d="M95 50h6l-1 9h-4Z" fill="#c8102e" />
          </g>
          <circle cx="60" cy="25" r="2.6" fill="#c8102e" />
        </svg>
        <span className="ex-grad-spark" />
      </div>
    </div>
  );
}

export default function Experience() {
  const [lit, setLit] = useState(0);
  // Each stop shows its name and role; the bullet points open under it on demand to keep the scroll short.
  const [open, setOpen] = useState<Set<string>>(() => new Set());
  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const stopRefs = useRef<(HTMLLIElement | null)[]>([]);
  const fillRef = useRef<HTMLSpanElement>(null);

  const listRef = useScrollProgress<HTMLDivElement>(
    (rect, vh) => (vh * 0.62 - rect.top) / rect.height,
    (prog) => {
      if (fillRef.current) fillRef.current.style.transform = `scaleY(${Math.max(0, Math.min(1, prog))})`;
      const list = listRef.current;
      if (!list) return;
      const reach = prog * list.offsetHeight;
      let n = 0;
      stopRefs.current.forEach((el) => {
        if (el && el.offsetTop + 24 <= reach) n++;
      });
      setLit(n);
    },
  );


  return (
    <section id="experience" data-card className="deck-card tone-paper experience" aria-labelledby="exp-title">
      <div className="wrap section ex-grid">
        <div className="ex-side">
          <div className="ex-sticky">
            <h2 id="exp-title" className="h-section">Follow the <span className="accent">connections.</span></h2>
            <p className="lede">Each stop added a layer to how I think. Here they are, in the order I lived them.</p>
            <ul className="ex-legend">
              {(Object.keys(KIND_COLOR) as MapKind[]).map((k) => (
                <li key={k}><i style={{background: KIND_COLOR[k]}} aria-hidden="true" />{k}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="ex-main">
          <div ref={listRef} className="ex-track">
            <span className="ex-spine" aria-hidden="true"><span ref={fillRef} /></span>
            <ol className="ex-list">
              {STOPS.map((s, i) => {
                const isOpen = open.has(s.id);
                const folds = !s.avatar && s.roles.some((r) => r.points.length > 0);
                return (
                <li key={s.id} ref={(el) => {stopRefs.current[i] = el;}} className={`ex-stop${i < lit ? " is-lit" : ""}`}
                  style={{"--k": KIND_COLOR[s.kind]} as React.CSSProperties}>
                  {/* The kind shows as the logo's ring colour (see the legend); screen readers get it, and the dates, as text. */}
                  <p className="sr-only">{s.kind}, {s.when}</p>
                  {/* Logo, chevron and name share one row, centred on each other. */}
                  <div className="ex-head">
                    {s.avatar ? <span className="ex-dot" aria-hidden="true" /> : <span className="ex-logo" aria-hidden="true"><Mark stop={s} size={30} /></span>}
                    {folds && (
                      <button type="button" className="ex-toggle" onClick={() => toggle(s.id)} aria-expanded={isOpen}
                        aria-controls={`ex-d-${s.id}`} aria-label={`${isOpen ? "Hide" : "Show"} details for ${s.place}`}>
                        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5" /></svg>
                      </button>
                    )}
                    <h3 className="ex-title">{s.place}</h3>
                  </div>
                  {folds ? (
                    // Closed, a stop is just its name; the roles and what I did there open underneath.
                    <div id={`ex-d-${s.id}`} className={`ex-more${isOpen ? " is-open" : ""}`} inert={!isOpen}>
                      <div>
                        {s.roles.map((r, j) => (
                          <div key={r.title} className="ex-role" style={{"--k": j} as React.CSSProperties}>
                            <p className="ex-place">{r.title} <span className="mono">· {r.dates}</span></p>
                            <ul className="ex-detail">{r.points.map((d) => <li key={d}>{d}</li>)}</ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    s.roles.map((r) => (
                      <div key={r.title} className="ex-role">
                        <p className="ex-place">{r.title} <span className="mono">· {r.dates}</span></p>
                        <ul className="ex-detail">{r.points.map((d) => <li key={d}>{d}</li>)}</ul>
                      </div>
                    ))
                  )}
                  {s.avatar && <GradAvatar />}
                </li>
                );
              })}
            </ol>
          </div>
          <a href="#contact" className="ex-next" onClick={(e) => {e.preventDefault(); scrollToTarget("contact");}}>
            <span className="mono">Next</span>
            <span className="ex-next-t">Your <span className="accent">team?</span></span>
            <span className="ex-next-arr" aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      <style href="experience-list-v8" precedence="default">{`
        .ex-grid { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: clamp(32px, 5vw, 96px); }
        .ex-sticky { position: sticky; top: 120px; }
        .ex-sticky .h-section { font-size: clamp(2.5rem, 4.6vw, 4.25rem); }
        .ex-sticky .lede { margin-top: 22px; max-width: 360px; }
        .ex-legend { display: flex; flex-wrap: wrap; gap: 10px 18px; list-style: none; margin: 26px 0 0; padding: 0; font-size: 0.8125rem; color: var(--ink-2); }
        .ex-legend li { display: flex; align-items: center; gap: 8px; }
        .ex-legend i { width: 9px; height: 9px; border-radius: 50%; }

        .ex-track { position: relative; }
        .ex-list { position: relative; list-style: none; margin: 0; padding: 0 0 0 76px; }
        .ex-spine { position: absolute; left: 25px; top: 26px; bottom: 26px; width: 2px; background: rgba(13,13,13,.1); border-radius: 2px; }
        .ex-spine span { position: absolute; inset: 0; background: var(--green); transform-origin: 50% 0; transform: scaleY(0); border-radius: 2px; }
        .ex-stop { position: relative; padding: 0 0 52px; }
        .ex-stop .ex-title { color: var(--mute); transition: color .8s var(--ease); }
        .ex-stop.is-lit .ex-title { color: var(--ink); }
        .ex-logo { position: absolute; left: -76px; top: 50%; translate: 0 -50%; display: grid; place-items: center; width: 52px; height: 52px; padding: 0; border-radius: 16px; background: #fff;
          box-shadow: inset 0 0 0 1px #193e3214, 0 8px 20px -12px #193e3266; filter: grayscale(.85); opacity: .7;
          transition: filter .6s var(--ease), opacity .6s var(--ease), transform .6s cubic-bezier(.34,1.56,.64,1), box-shadow .6s var(--ease); }
        .ex-logo img { border-radius: 7px; object-fit: contain; }
        .ex-stop.is-lit .ex-logo { filter: none; opacity: 1; transform: scale(1.06); box-shadow: inset 0 0 0 1px #193e3214, 0 0 0 3px var(--k), 0 12px 24px -12px #193e3277; }
        /* Chevron first, then the name; the name wraps in its own column. */
        .ex-head { position: relative; display: flex; align-items: center; gap: 14px; min-height: 52px; }
        .ex-title { margin: 0; font-size: clamp(1.375rem, 2vw, 1.875rem); font-weight: 700; letter-spacing: -0.035em; line-height: 1.1; text-wrap: balance; }
        .ex-role { margin-top: 12px; }
        .ex-place { margin: 0; font-size: 0.875rem; color: var(--ink-2); font-weight: 600; }
        .ex-place .mono { font-weight: 400; font-size: 0.8125rem; color: var(--mute); }
        .ex-detail { list-style: none; margin: 10px 0 0; padding: 0; display: grid; gap: 8px; max-width: 620px; }
        .ex-detail li { font-size: 0.875rem; line-height: 1.55; color: var(--ink-2); padding-left: 16px; position: relative; }
        .ex-detail li::before { content: ""; position: absolute; left: 0; top: .72em; width: 7px; height: 1.5px; background: var(--mute); }

        /* Read-more chevron: turns down and fills green when open. */
        .ex-toggle {
          position: relative; flex: none; display: grid; place-items: center; width: 34px; height: 34px; padding: 0; border: 0; border-radius: 50%;
          background: #fff; color: var(--ink); cursor: pointer;
          box-shadow: inset 0 0 0 1px #193e3220, 0 6px 14px -10px #193e3266;
          transition: background-color .35s var(--ease), color .35s var(--ease), transform .35s var(--ease), box-shadow .35s var(--ease);
        }
        .ex-toggle::after { content: ""; position: absolute; inset: -6px; border-radius: 50%; }
        .ex-toggle svg { width: 14px; height: 14px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; transition: transform .45s cubic-bezier(.34,1.56,.64,1); }
        .ex-toggle:hover { transform: translateY(-2px); box-shadow: inset 0 0 0 1px #193e3233, 0 10px 18px -10px #193e3277; }
        .ex-toggle[aria-expanded="true"] { background: var(--green); color: #fff; box-shadow: 0 8px 18px -10px #2f7a55aa; }
        .ex-toggle[aria-expanded="true"] svg { transform: rotate(90deg); }
        .ex-toggle:focus-visible { outline: 2px solid var(--green); outline-offset: 3px; }

        /* The points slide open (0fr -> 1fr) and fade in one after another. */
        .ex-more { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .5s var(--ease); }
        .ex-more > div { min-height: 0; overflow: hidden; }
        .ex-more.is-open { grid-template-rows: 1fr; }
        .ex-more > div > :last-child { padding-bottom: 2px; }
        .ex-more .ex-role { opacity: 0; transform: translateY(-6px); transition: opacity .3s var(--ease), transform .4s var(--ease); }
        .ex-more.is-open .ex-role { opacity: 1; transform: none; transition-delay: calc(.1s + var(--k) * .08s); }

        /* Finale: no tile, just the avatar swapping caps as you scroll. */
        .ex-dot { position: absolute; left: -57px; top: 50%; translate: 0 -50%; width: 14px; height: 14px; border-radius: 50%; background: #fff; box-shadow: inset 0 0 0 2px #193e3240; transition: background .6s, box-shadow .6s; }
        .ex-stop.is-lit .ex-dot { background: var(--k); box-shadow: 0 0 0 5px color-mix(in srgb, var(--k) 15%, transparent); }
        .ex-grad { margin-top: 34px; display: flex; justify-content: flex-start; }
        .ex-grad-fig { position: relative; width: clamp(150px, 15vw, 200px); aspect-ratio: 520 / 497; filter: drop-shadow(0 22px 30px #193e322b); }
        .ex-grad-fig img { position: absolute; inset: 0; width: 100%; height: 100%; }
        .ex-grad-old { transform-origin: 50% 30%; will-change: transform, opacity; }
        .ex-grad-hand { position: absolute; left: 70%; top: 26%; width: 18%; will-change: transform, opacity; filter: drop-shadow(0 3px 4px #0002); }
        .ex-grad-cap { position: absolute; left: 50%; top: -9%; width: 64%; transform-origin: 50% 60%; will-change: transform, opacity; filter: drop-shadow(0 6px 6px #0003); }
        .ex-tassel { transform-origin: 60px 25px; }
        .is-done .ex-tassel { animation: tassel 1.6s cubic-bezier(.3,.6,.3,1) both; }
        @keyframes tassel { 0% { transform: rotate(0); } 25% { transform: rotate(14deg); } 50% { transform: rotate(-9deg); } 75% { transform: rotate(4deg); } 100% { transform: rotate(0); } }
        .ex-grad-spark { position: absolute; left: 50%; top: 2%; width: 8px; height: 8px; border-radius: 50%; opacity: 0; pointer-events: none;
          box-shadow: -60px -20px 0 #e8b84a, 58px -26px 0 #2f7a55, -40px -54px 0 #3b6fd4, 44px -58px 0 #e0763a, 0 -72px 0 #e8b84a, -76px 10px 0 #7a5cc4, 76px 6px 0 #e8b84a; }
        .is-done .ex-grad-spark { animation: spark 1s cubic-bezier(.2,.7,.3,1) both; }
        @keyframes spark { 0% { opacity: 0; transform: translate(-50%, 10px) scale(.3); } 30% { opacity: 1; } 100% { opacity: 0; transform: translate(-50%, -12px) scale(1.15); } }

        .ex-next {
          display: flex; align-items: center; gap: 18px; margin-left: 76px; padding: 26px 28px; border-radius: 24px;
          border: 1.5px dashed rgba(13,13,13,.3); transition: background-color .5s var(--ease), border-color .5s var(--ease), transform .5s var(--ease);
        }
        .ex-next .mono { font-size: 0.6875rem; letter-spacing: .1em; text-transform: uppercase; color: var(--mute); }
        .ex-next-t { font-size: clamp(1.625rem, 2.6vw, 2.375rem); font-weight: 700; letter-spacing: -0.04em; }
        .ex-next-arr { margin-left: auto; font-size: 1.625rem; transition: transform .6s var(--ease); }
        .ex-next:hover { background: #fff; border-color: var(--ink); transform: translateY(-2px); }
        .ex-next:hover .ex-next-arr { transform: translateX(6px); }

        @media (max-width: 900px) {
          .ex-grid { grid-template-columns: 1fr; }
          .ex-sticky { position: relative; top: 0; }
          .ex-list { padding-left: 58px; }
          .ex-spine { left: 19px; top: 20px; bottom: 20px; }
          .ex-logo { left: -58px; width: 40px; height: 40px; border-radius: 12px; }
          .ex-logo img { width: 24px; height: 24px; }
          .ex-dot { left: -45px; }
          .ex-title { font-size: 1.3rem; }
          .ex-toggle { width: 32px; height: 32px; }
          .ex-head { gap: 12px; min-height: 40px; }
          .ex-detail li { font-size: 0.8125rem; }
          .ex-place { font-size: 0.8125rem; }
          .ex-next { margin-left: 0; }
        }
        @media (prefers-reduced-motion: reduce) { .ex-more, .ex-more .ex-role, .ex-toggle, .ex-toggle svg { transition: none; } }
        @media (prefers-reduced-motion: reduce) { .is-done .ex-tassel, .is-done .ex-grad-spark { animation: none; } }
      `}</style>
    </section>
  );
}
