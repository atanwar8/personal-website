"use client";

import { useEffect, useRef, useState } from "react";
import { PROJECTS, type Project } from "@/lib/data";
import { useReducedMotion } from "@/lib/hooks";

/* ----------------------------- Illustrative mini-UIs (pure CSS/SVG, grayscale) ----------------------------- */

const NODES: [number, number][] = [
  [50, 50], [22, 26], [78, 22], [86, 58], [70, 84], [36, 82], [12, 60], [44, 14], [60, 34], [30, 48],
];
const EDGES: [number, number][] = [
  [0, 8], [0, 9], [0, 3], [0, 5], [8, 2], [8, 7], [9, 1], [9, 6], [3, 4], [5, 4], [5, 6], [1, 7], [2, 3], [6, 1], [4, 0], [7, 2],
];

function RippleUI() {
  return (
    <div className="mini mini-ripple">
      <svg viewBox="0 0 100 100" className="rp-svg" aria-hidden="true">
        {EDGES.map(([a, b], i) => (
          <line key={i} x1={NODES[a][0]} y1={NODES[a][1]} x2={NODES[b][0]} y2={NODES[b][1]} />
        ))}
        <circle className="rp-ring" cx="50" cy="50" r="6" />
        <circle className="rp-ring r2" cx="50" cy="50" r="6" />
        {NODES.map(([x, y], i) => {
          const d = Math.hypot(x - 50, y - 50);
          return (
            <g key={i} className="rp-node" style={{ "--d": `${d * 34}ms` } as React.CSSProperties}>
              <circle cx={x} cy={y} r={i === 0 ? 5 : 3.6} />
              <text x={x} y={y + (i === 0 ? 1.4 : 1.1)}>{String(i + 1).padStart(2, "0")}</text>
            </g>
          );
        })}
      </svg>
      <div className="rp-legend mono">
        <span><i className="k1" /> source change</span>
        <span><i className="k2" /> downstream impact</span>
      </div>
    </div>
  );
}

function LakehouseUI() {
  const sources = ["SAP ECC", "JDE", "Legacy SQL"];
  const layers = [
    ["Bronze", "raw"],
    ["Silver", "governed"],
    ["Gold", "analytics-ready"],
  ];
  return (
    <div className="mini mini-lake">
      <div className="lk-body">
        <div className="lk-sources">
          {sources.map((s, i) => (
            <span key={s} className="lk-src mono" style={{ "--i": i } as React.CSSProperties}>
              {s}
            </span>
          ))}
        </div>
        <div className="lk-flow" aria-hidden="true">
          {sources.map((s, i) => (
            <span key={s} className="lk-line" style={{ "--i": i } as React.CSSProperties}>
              <i />
            </span>
          ))}
        </div>
        <div className="lk-layers">
          {layers.map(([name, sub], i) => (
            <div key={name} className="lk-layer" style={{ "--i": i } as React.CSSProperties}>
              <span className="lk-name">{name}</span>
              <span className="lk-sub mono">{sub}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="lk-foot mono">
        <span>Snowflake</span>
        <span>month-end close: −20–40% (projected)</span>
      </div>
    </div>
  );
}

const ROI = 68;

function RoiUI({ active }: { active: boolean }) {
  // On open: the bars pop up, then the gauge sweeps to 68% while the number counts up with it.
  const reduced = useReducedMotion();
  const [pct, setPct] = useState(0);
  useEffect(() => {
    if (!active || reduced) return;
    let raf = 0;
    const start = performance.now() + 750;
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / 1300));
      setPct(Math.round(ROI * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      setPct(0); // start from 0% again the next time the card opens
    };
  }, [active, reduced]);
  const shown = !active ? 0 : reduced ? ROI : pct;
  const bars = [
    { k: "Investment", v: 11, label: "$11M", neg: true },
    { k: "Net benefits", v: 18.77, label: "$18.77M" },
    { k: "NPV", v: 6.45, label: "$6.45M" },
  ];
  return (
    <div className="mini mini-roi">
      <div className="roi-chart">
        {bars.map((b, i) => (
          <div key={b.k} className="roi-col" style={{ "--i": i } as React.CSSProperties}>
            <span className="roi-val mono">{b.label}</span>
            <span className={`roi-bar${b.neg ? " is-neg" : ""}`} style={{ "--h": `${(b.v / 18.77) * 100}%` } as React.CSSProperties} />
            <span className="roi-k mono">{b.k}</span>
          </div>
        ))}
        <div className="roi-gauge" aria-hidden="true">
          {/* The number is drawn inside the arc so it scales with it and never touches the stroke. */}
          <svg viewBox="0 0 120 68">
            <path d="M8 62a52 52 0 0 1 104 0" className="g-track" />
            <path d="M8 62a52 52 0 0 1 104 0" className="g-fill" pathLength={100} style={{ strokeDashoffset: 100 - shown }} />
            <text x="60" y="60" textAnchor="middle" className="roi-pct">{shown}%</text>
          </svg>
          <span className="roi-k mono">ROI</span>
        </div>
      </div>
    </div>
  );
}

// Illustrative prices and calls for the Smart Stock animation (not real forecasts).
// Market prices moving up and down (illustrative).
const TICKER: [string, string, "up" | "down"][] = [
  ["Tomatoes", "$2.04", "down"],
  ["Lettuce", "$1.68", "up"],
  ["Onions", "$1.12", "down"],
  ["Peppers", "$1.35", "up"],
];
const CALLS = [
  { item: "Tomatoes", tag: "Hold", tone: "down", text: "Prices ease over the next 30 days. Order lean this week." },
  { item: "Lettuce", tag: "Buy now", tone: "up", text: "A price climb is coming. Stock up within cold-storage limits." },
  { item: "Onions", tag: "Steady", tone: "flat", text: "Flat outlook. Reorder on your usual schedule." },
];

function StockUI({ active }: { active: boolean }) {
  const [k, setK] = useState(0);
  useEffect(() => {
    if (!active || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setK((x) => (x + 1) % CALLS.length), 3000);
    return () => clearInterval(id);
  }, [active]);
  const call = CALLS[k];
  return (
    <div className="mini mini-stock">
      <div className="st-flow">
        <div className="st-card st-prices" aria-hidden="true">
          <div>
            {[...TICKER, ...TICKER, ...TICKER].map(([n, v, dir], i) => (
              <span key={i} className={`is-${dir}`}>
                <b>{n}</b>
                <em className="mono">{v} {dir === "up" ? "▲" : "▼"}</em>
              </span>
            ))}
          </div>
        </div>
        <span className="st-wire" aria-hidden="true"><i /><i /></span>
        <div className="st-card st-model">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle className="st-orbit" cx="12" cy="12" r="10" /><circle className="st-core" cx="12" cy="12" r="4" /></svg>
          <span>TimesFM</span>
        </div>
        <span className="st-wire" aria-hidden="true"><i /><i /></span>
        <div className="st-card st-out"><span>Forecasting</span></div>
      </div>
      <svg className="st-chart" viewBox="0 0 360 232" aria-hidden="true">
        <defs>
          <linearGradient id="st-band" x2="0" y2="1"><stop stopColor="#4f8a6a" stopOpacity=".32" /><stop offset="1" stopColor="#4f8a6a" stopOpacity=".06" /></linearGradient>
          <mask id="st-reveal"><rect className="st-wipe" x="218" y="0" width="142" height="232" fill="#fff" /></mask>
        </defs>
        <path className="st-grid" d="M10 48H350M10 112H350M10 176H350" />
        <path className="st-hist" pathLength={1} d="M10 147L30 128 50 138 70 102 90 115 110 80 130 93 150 70 170 99 190 112 210 106 220 118" />
        <g mask="url(#st-reveal)">
          <path d="M220 118C260 99 300 102 350 109L350 221C300 205 260 166 220 118Z" fill="url(#st-band)" />
          <path className="st-fc" d="M220 118C258 134 300 154 350 166" />
          <circle className="st-tick" cx="254" cy="136" r="3.4" />
          <circle className="st-tick" cx="350" cy="166" r="3.4" />
          <text x="254" y="157" className="st-tick-t">7d</text>
          <text x="338" y="190" className="st-tick-t">30d</text>
        </g>
        <line className="st-today" x1="220" y1="26" x2="220" y2="224" />
        <text x="214" y="20" className="st-tick-t" textAnchor="end">today</text>
      </svg>
      <div className={`st-call is-${call.tone}`} key={call.item}>
        <span className="st-chip">{call.tag}</span>
        <p><b>{call.item}.</b> {call.text}</p>
      </div>
    </div>
  );
}

const VISUAL: Record<Project["visual"], (p: { active: boolean }) => React.ReactElement> = {
  ripple: RippleUI,
  lakehouse: LakehouseUI,
  roi: RoiUI,
  stock: StockUI,
};


export default function Work() {
  const [open, setOpen] = useState(0);
  const rail = useRef<HTMLDivElement>(null);

  return (
    <section id="work" data-card className="deck-card work" aria-labelledby="work-title">
      <div className="wrap section">
        <div className="wk-head">
          <h2 id="work-title" className="h-section">
            <span className="rv-mask">
              <span>
                Things I&apos;ve <span className="accent">built.</span>
              </span>
            </span>
          </h2>
        </div>

        <div className="wk-rail rv" ref={rail}>
          {PROJECTS.map((p, i) => {
            const Visual = VISUAL[p.visual];
            const isOpen = open === i;
            return (
              <article
                key={p.id}
                className={`wk-panel${isOpen ? " is-open" : ""}`}
                aria-labelledby={`wk-t-${p.id}`}
                // Like the original portfolio: hovering a project opens it (mouse only; touch and keyboard use the button).
                onPointerEnter={(e) => { if (e.pointerType === "mouse") setOpen(i); }}
              >
                <button
                  type="button"
                  className="wk-spine"
                  aria-expanded={isOpen}
                  aria-controls={`wk-c-${p.id}`}
                  onClick={() => setOpen(i)}
                  onFocus={() => setOpen(i)}
                >
                  <span className="wk-num mono">{p.index}</span>
                  <span className="wk-vt" id={`wk-t-${p.id}`}>
                    {p.client}
                  </span>
                  <span className="wk-plus" aria-hidden="true">
                    {/* Drawn rather than typed: a "+" character sits off-centre, which shows once it turns into an ×. */}
                    <svg viewBox="0 0 16 16"><path d="M8 2.5v11M2.5 8h11" /></svg>
                  </span>
                </button>

                <div className="wk-content" id={`wk-c-${p.id}`} inert={!isOpen}>
                  <div className="wk-text">
                    <p className="wk-client">{p.client}</p>
                    <h3 className="wk-title">{p.title}</h3>
                    <p className="wk-desc">{p.description}</p>
                    <ul className="wk-feats">
                      {p.features.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                    {p.github?.startsWith("https://") && (
                      <p className="wk-links">
                        <a href={p.github} target="_blank" rel="noopener noreferrer">Explore the code ↗</a>
                      </p>
                    )}
                  </div>
                  <figure className="wk-visual">
                    <Visual active={isOpen} />
                    <figcaption className="mono">Not a product screenshot</figcaption>
                  </figure>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <style href="work-v7" precedence="default">{`
        .wk-rail { display: flex; gap: 10px; margin-top: 48px; height: min(78svh, 600px); }
        .wk-panel {
          position: relative; flex: 1 1 0; min-width: 76px; display: flex; border-radius: 26px; overflow: hidden;
          background: var(--paper); box-shadow: inset 0 0 0 1px var(--line);
          transition: flex-grow .9s var(--ease), background-color .6s var(--ease), box-shadow .6s var(--ease);
        }
        .wk-panel.is-open { flex-grow: 8; background: #fff; box-shadow: inset 0 0 0 1px var(--line), 0 30px 60px -36px rgba(13,13,13,.45); }
        .wk-spine {
          position: relative; flex: 0 0 76px; display: flex; flex-direction: column; align-items: center; justify-content: space-between;
          padding: 22px 0; border-radius: 26px 0 0 26px;
        }
        .wk-num { font-size: 0.75rem; color: var(--mute); }
        .wk-vt {
          writing-mode: vertical-rl; transform: rotate(180deg); font-size: 1.125rem; font-weight: 600; letter-spacing: -0.02em;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-height: 70%;
        }
        .wk-plus {
          display: grid; place-items: center; width: 38px; height: 38px; border-radius: 50%;
          box-shadow: inset 0 0 0 1px rgba(13,13,13,.2); transition: transform .6s var(--ease), background-color .4s, color .4s;
        }
        .wk-plus svg { width: 15px; height: 15px; fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; }
        .wk-spine:hover .wk-plus { transform: rotate(90deg); background: var(--ink); color: #fff; }
        .is-open .wk-plus { transform: rotate(45deg); background: var(--ink); color: #fff; }

        .wk-content {
          flex: 1 1 auto; min-width: 0; display: grid; grid-template-columns: minmax(240px, 0.9fr) minmax(0, 1.1fr); gap: 28px;
          padding: 30px 30px 26px 38px; opacity: 0; transition: opacity .4s var(--ease);
          visibility: hidden;
        }
        .is-open .wk-content { opacity: 1; visibility: visible; transition: opacity .7s var(--ease) .25s; }
        .wk-text { display: flex; flex-direction: column; min-width: 0; overflow: auto; scrollbar-width: none; }
        .wk-kicker { margin: 0; font-size: 0.6875rem; letter-spacing: .06em; text-transform: uppercase; color: var(--mute); }
                .wk-client { margin: 18px 0 0; font-size: 0.875rem; font-weight: 600; color: var(--ink-2); }
        .wk-title { margin: 6px 0 0; font-size: clamp(1.5rem, 2.2vw, 2.125rem); font-weight: 700; letter-spacing: -0.04em; line-height: 1.02; text-wrap: balance; }
        .wk-desc { margin: 14px 0 0; font-size: 0.9375rem; line-height: 1.5; color: var(--ink-2); }
        .wk-feats { display: grid; grid-template-columns: 1fr; gap: 9px; list-style: none; margin: 20px 0 0; padding: 0; }
        .wk-feats li { position: relative; padding-left: 16px; font-size: 0.875rem; line-height: 1.45; }
        .wk-feats li::before { content: ""; position: absolute; left: 0; top: .5em; width: 7px; height: 7px; border-radius: 2px; background: var(--ink); }

        .wk-visual { position: relative; margin: 0; min-width: 0; display: flex; flex-direction: column; }
        .wk-visual figcaption { margin-top: 10px; font-size: 0.6875rem; letter-spacing: .06em; text-transform: uppercase; color: var(--mute); }
        .mini {
          position: relative; flex: 1; display: flex; flex-direction: column; border-radius: 18px; background: var(--paper);
          box-shadow: inset 0 0 0 1px var(--line); overflow: hidden;
          clip-path: inset(0 100% 0 0 round 18px); transition: clip-path 1.1s var(--ease);
        }
        .is-open .mini { clip-path: inset(0 0 0 0 round 18px); transition-delay: .3s; }

        .wk-links { display: flex; flex-wrap: wrap; gap: 8px 22px; margin: 22px 0 0; font-size: 14px; }
        .wk-links a { text-decoration: underline; text-underline-offset: 5px; }
        .wk-links a:hover { color: var(--green); }
        .wk-spine { background: #dce6d0; }
        .wk-panel.is-open .wk-spine { background: #c4d7b5; }
        .wk-panel.is-open { background: #fffdf7; }
        .wk-content { column-gap: 30px; }
        /* smart stock: USDA prices stream into TimesFM, the forecast draws in, and the call of the day cycles. */
        .mini-stock { background: #edf1e4; justify-content: space-between; gap: 4px; padding: 6px 0; }
        .st-flow { display: flex; align-items: center; padding: 18px 16px 4px; }
        .st-card { flex: none; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; height: 74px; padding: 8px 12px; border-radius: 14px; background: #fffdf7; box-shadow: inset 0 0 0 1px var(--line), 0 6px 14px -10px #285a4560; font-size: 12px; font-weight: 600; }
        .st-prices { width: 132px; padding: 6px 10px; overflow: hidden; mask-image: linear-gradient(transparent, #000 22%, #000 78%, transparent); }
        .st-prices > div { display: flex; flex-direction: column; width: 100%; will-change: transform; }
        .is-open .st-prices > div { animation: st-tick 6s linear infinite; }
        .st-prices span { flex: none; padding: 1.5px 0; display: flex; justify-content: space-between; align-items: baseline; gap: 6px; white-space: nowrap; font-size: 11px; font-weight: 500; }
        .st-prices em { font-style: normal; font-size: 10px; white-space: nowrap; }
        .st-prices .is-up em { color: #d4631c; } .st-prices .is-down em { color: #2f7a55; }
        /* Three equal copies with no gaps: moving up exactly one copy loops seamlessly. */
        @keyframes st-tick { to { transform: translateY(-33.3333%); } }
        .st-out { color: var(--green); }
        .st-wire { position: relative; flex: 1; min-width: 14px; height: 2px; margin: 0 6px; background: repeating-linear-gradient(90deg, #285a4555 0 3px, transparent 3px 7px); }
        .st-wire i { position: absolute; top: -2.5px; left: 0; width: 7px; height: 7px; border-radius: 50%; background: #2f7a55; box-shadow: 0 0 7px #3f9a6d; opacity: 0; }
        .is-open .st-wire i { animation: st-packet 1.8s cubic-bezier(.5,0,.5,1) infinite; }
        .is-open .st-wire i:nth-child(2) { animation-delay: .9s; }
        @keyframes st-packet { 0% { left: 0; opacity: 0; } 15%, 85% { opacity: 1; } 100% { left: calc(100% - 7px); opacity: 0; } }
        .st-model { background: #1f4a37; color: #fff; box-shadow: 0 6px 16px -8px #1f4a37aa; }
        .st-model svg { width: 24px; height: 24px; }
        .st-orbit { fill: none; stroke: #9fd3b2; stroke-width: 1.6; stroke-dasharray: 2.5 3.5; transform-origin: 12px 12px; }
        .is-open .st-orbit { animation: st-spin 4s linear infinite; }
        .st-core { fill: #f2a35e; transform-origin: 12px 12px; }
        .is-open .st-core { animation: st-pulse 1.8s ease-in-out infinite; }
        @keyframes st-spin { to { transform: rotate(360deg); } }
        @keyframes st-pulse { 50% { transform: scale(1.3); fill: #ffbd7f; } }
        .st-chart { width: 100%; flex: 1 1 auto; min-height: 0; max-height: 320px; padding: 8px 18px 0; overflow: visible; }
        .st-grid { stroke: #285a4514; stroke-width: 1; }
        .st-hist { fill: none; stroke: #285a45; stroke-width: 2.6; stroke-linejoin: round; stroke-dasharray: 1; stroke-dashoffset: 1; }
        .is-open .st-hist { animation: st-draw 1.3s var(--ease) .5s forwards; }
        @keyframes st-draw { to { stroke-dashoffset: 0; } }
        .st-fc { fill: none; stroke: #2f7a55; stroke-width: 2.6; stroke-dasharray: 6 5; stroke-linecap: round; }
        .st-wipe { transform: scaleX(0); transform-box: fill-box; transform-origin: left; }
        .is-open .st-wipe { animation: st-wipe 1.2s var(--ease) 1.6s forwards; }
        @keyframes st-wipe { to { transform: scaleX(1); } }
        .st-tick { fill: #fffdf7; stroke: #2f7a55; stroke-width: 2; }
        .st-tick-t { font: 600 9px var(--font-jetbrains-mono), monospace; fill: #52634b; }
        .st-today { stroke: #f2701f; stroke-width: 1.4; stroke-dasharray: 3 3; }
        .is-open .st-today { animation: st-blink 1.6s ease-in-out infinite; }
        @keyframes st-blink { 50% { opacity: .35; } }
        .st-call { display: flex; align-items: center; gap: 12px; margin: 8px 18px 18px; padding: 12px 14px; border-radius: 14px; background: #fffdf7; box-shadow: inset 0 0 0 1px var(--line); animation: st-call-in .5s cubic-bezier(.34,1.4,.6,1); }
        .st-call p { margin: 0; font-size: 12.5px; line-height: 1.45; color: var(--ink-2); }
        .st-call b { color: var(--ink); }
        .st-chip { flex: none; padding: 5px 10px; border-radius: 999px; font-size: 11px; font-weight: 650; color: #fff; background: #2f7a55; }
        .st-call.is-up .st-chip { background: #d4631c; } .st-call.is-flat .st-chip { background: #6b7a63; }
        @keyframes st-call-in { from { opacity: 0; transform: translateY(8px) scale(.97); } }
        @media (max-width: 520px) { .st-flow { padding: 14px 10px 4px; } .st-card { padding: 6px 8px; font-size: 11px; } .st-prices { width: 118px; } .st-wire { margin: 0 3px; } }
        @media (prefers-reduced-motion: reduce) { .is-open .st-prices > div, .is-open .st-wire i, .is-open .st-orbit, .is-open .st-core, .is-open .st-today, .st-call { animation: none; } .st-hist { stroke-dashoffset: 0; } .st-wipe { transform: none; } }
        @media(max-width:1100px){.wk-content{grid-template-rows:auto minmax(330px,1fr)}.wk-rail{min-height:700px}.wk-text{overflow:visible}}
        @media(max-width:860px){.wk-rail{min-height:0}.is-open .wk-content{grid-template-rows:auto minmax(370px,auto)}}
        .wk-panel:not(.is-open) .wk-content { display:none; }
        .wk-panel:not(.is-open) .wk-spine { flex:1; border-radius:26px; }
        @media(min-width:861px) and (max-width:1100px) { .wk-rail { height:780px; min-height:0; } .wk-content { overflow:auto; } }
        /* ripple */
        .rp-svg { flex: 1; width: 100%; min-height: 0; padding: 10px; }
        .rp-svg line { stroke: rgba(13,13,13,.18); stroke-width: .35; }
        .rp-node circle { fill: #fff; stroke: var(--ink); stroke-width: .5; }
        .rp-node text { font: 500 2.6px var(--font-jetbrains-mono), monospace; text-anchor: middle; fill: var(--ink); }
        .is-open .rp-node circle { animation: node 3.2s var(--ease) infinite; animation-delay: var(--d); }
        .rp-node:first-of-type circle, .is-open .rp-node:first-of-type circle { fill: var(--ink); animation: none; }
        .rp-node:first-of-type text { fill: #fff; }
        @keyframes node { 0%, 100% { fill: #fff; } 12%, 30% { fill: #b4b1ab; } }
        .rp-ring { fill: none; stroke: var(--ink); stroke-width: .4; opacity: 0; transform-origin: 50px 50px; }
        .is-open .rp-ring { animation: ring 3.2s cubic-bezier(.2,.7,.3,1) infinite; }
        .is-open .rp-ring.r2 { animation-delay: .5s; }
        @keyframes ring { 0% { opacity: .7; transform: scale(1); } 80%, 100% { opacity: 0; transform: scale(8); } }
        .rp-legend { display: flex; gap: 16px; padding: 10px 14px; font-size: 0.6875rem; color: var(--ink-2); border-top: 1px solid var(--line); }
        .rp-legend i { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 6px; vertical-align: -1px; }
        .rp-legend .k1 { background: var(--ink); }
        .rp-legend .k2 { background: #b4b1ab; box-shadow: inset 0 0 0 1px var(--ink); }

        /* lakehouse */
        .lk-body { flex: 1; display: grid; grid-template-columns: auto 1fr 1.2fr; align-items: center; gap: 0; padding: 18px; min-height: 0; }
        .lk-sources { display: grid; gap: 14px; }
        .lk-src { padding: 9px 12px; border-radius: 10px; background: #fff; font-size: 0.6875rem; box-shadow: inset 0 0 0 1px var(--line); white-space: nowrap; }
        .lk-flow { display: grid; gap: 14px; height: 100%; align-content: center; }
        .lk-line { position: relative; height: 34px; }
        .lk-line::before { content: ""; position: absolute; left: 0; right: 0; top: 50%; border-top: 1px dashed rgba(13,13,13,.25); }
        .lk-line i { position: absolute; top: calc(50% - 3px); left: 0; width: 6px; height: 6px; border-radius: 50%; background: var(--ink); opacity: 0; }
        .is-open .lk-line i { animation: flow 2.4s linear infinite; animation-delay: calc(var(--i) * .5s); }
        @keyframes flow { 0% { left: 0; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { left: calc(100% - 6px); opacity: 0; } }
        .lk-layers { display: grid; gap: 8px; }
        .lk-layer {
          display: flex; justify-content: space-between; align-items: baseline; gap: 12px; padding: 14px 16px; border-radius: 12px;
          transform: translateX(14px); opacity: 0; transition: transform .8s var(--ease), opacity .8s var(--ease);
          transition-delay: calc(.5s + var(--i) * .12s);
        }
        .is-open .lk-layer { transform: none; opacity: 1; }
        .lk-layer:nth-child(1) { background: #dcd9d3; }
        .lk-layer:nth-child(2) { background: #b4b1ab; }
        .lk-layer:nth-child(3) { background: var(--ink); color: #fff; }
        .lk-name { font-weight: 700; letter-spacing: -0.02em; }
        .lk-sub { font-size: 0.6875rem; opacity: .8; }
        .lk-foot { display: flex; justify-content: space-between; gap: 12px; padding: 10px 14px; font-size: 0.6875rem; color: var(--ink-2); border-top: 1px solid var(--line); }

        /* roi */
        /* The 68% gauge leads on its own row; the three bars sit underneath it. */
        .roi-chart { flex: 1; display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: auto minmax(0, 1fr); align-items: end; gap: 22px 14px; padding: 24px 20px 16px; min-height: 0; }
        .roi-col { display: flex; flex-direction: column; align-items: center; height: 100%; justify-content: flex-end; gap: 8px; }
        .roi-val { font-size: 0.75rem; font-weight: 600; opacity: 0; transform: translateY(6px); transition: opacity .4s var(--ease), transform .5s var(--ease); }
        .is-open .roi-val { opacity: 1; transform: none; transition-delay: calc(.75s + var(--i) * .12s); }
        /* Bars pop up with a little overshoot, one after another. */
        .roi-bar {
          width: 100%; max-width: 58px; height: calc(var(--h) * .72); border-radius: 10px 10px 4px 4px; background: var(--ink);
          transform-origin: 50% 100%; transform: scaleY(0); transition: transform .9s cubic-bezier(.34,1.45,.64,1); transition-delay: calc(.35s + var(--i) * .12s);
        }
        .roi-bar.is-neg { background: repeating-linear-gradient(-45deg, #b4b1ab 0 5px, #dcd9d3 5px 10px); }
        .is-open .roi-bar { transform: none; }
        .roi-k { font-size: 0.6875rem; letter-spacing: .06em; text-transform: uppercase; color: var(--mute); text-align: center; }
        .roi-gauge { grid-column: 1 / -1; order: -1; position: relative; display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .roi-gauge svg { width: 100%; max-width: 170px; }
        .g-track, .g-fill { fill: none; stroke-width: 7; stroke-linecap: round; }
        .g-track { stroke: #dcd9d3; }
        .g-fill { stroke: var(--ink); stroke-dasharray: 100; }
        .roi-pct { fill: var(--ink); font-size: 26px; font-weight: 700; letter-spacing: -0.04em; font-variant-numeric: tabular-nums; }

        @media (max-width: 1100px) {
          .wk-content { grid-template-columns: 1fr; grid-template-rows: auto minmax(220px, 1fr); overflow: auto; }
          .wk-rail { height: auto; min-height: 640px; }
        }
        @media (max-width: 860px) {
          .wk-rail { flex-direction: column; height: auto; min-height: 0; }
          .wk-panel { flex-direction: column; flex: none; min-width: 0; }
          .wk-spine { flex: none; flex-direction: row; gap: 14px; padding: 18px 18px; border-radius: 26px; justify-content: flex-start; }
          .wk-vt { writing-mode: horizontal-tb; transform: none; font-size: 1.0625rem; max-height: none; text-align: left; flex: 1; white-space: normal; }
          .wk-content { display: none; padding: 0 18px 20px; grid-template-rows: auto 280px; }
          .is-open .wk-content { display: grid; }
          .wk-feats { grid-template-columns: 1fr; }
          /* Lakehouse: same sources -> flow -> layers animation, with smaller text so it fits. */
          .lk-body { grid-template-columns: auto minmax(24px, 1fr) minmax(max-content, 1.25fr); padding: 14px 12px; }
          .lk-sources, .lk-flow { gap: 10px; }
          .lk-src { padding: 6px 8px; border-radius: 8px; font-size: 10px; line-height: 16px; }
          .lk-line { height: 28px; margin: 0 4px; }
          .lk-layers { gap: 6px; }
          .lk-layer { flex-direction: column; align-items: flex-start; gap: 1px; padding: 8px 11px; border-radius: 10px; }
          .lk-name { font-size: 14px; }
          .lk-sub { font-size: 9.5px; white-space: nowrap; }
          .lk-foot { flex-wrap: wrap; gap: 2px 12px; padding: 8px 12px; font-size: 10px; }
          .roi-chart { grid-template-rows: auto 190px; row-gap: 18px; padding: 18px 16px 14px; }
          .roi-k { font-size: 10px; letter-spacing: .03em; white-space: nowrap; }
          .roi-gauge svg { max-width: 150px; }
                  }
        @media(min-width:861px) and (max-width:1100px) {
          .wk-rail { height:780px; min-height:0; }
          .wk-content { grid-template-rows:auto minmax(320px,1fr); overflow:auto; }
        }
        @media(max-width:860px) { .is-open .wk-content { grid-template-rows:auto minmax(370px,auto); } }
      `}</style>
    </section>
  );
}
