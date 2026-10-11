"use client";

import { useEffect, useRef } from "react";
import { ACHIEVEMENTS, type Achievement } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";

const ICONS: Record<Achievement["icon"], React.ReactNode> = {
  segments: <path d="M12 3v9l7.5 4.5M12 12L4.5 16.5M12 3a9 9 0 1 0 .01 0" />,
  links: <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />,
  roi: <path d="M3 20h18M5 16l4.5-4.5 3.5 3L20 7.5M15 7.5h5v5" />,
  network: <path d="M12 5a2 2 0 1 0 .01 0M5 17a2 2 0 1 0 .01 0M19 17a2 2 0 1 0 .01 0M11 6.7L6 15.3M13 6.7l5 8.6M7 17.2h10" />,
  archive: <path d="M3.5 5h17v4h-17zM5 9v10h14V9M10 13h4" />,
  search: <path d="M10.5 4a6.5 6.5 0 1 0 .01 0M15.5 15.5L20 20" />,
  dashboard: <path d="M3.5 4h17v16h-17zM3.5 9h17M9 9v11M12 16l2-3 2 1.5 2.5-3.5" />,
  grade: <path d="M12 4l9 4.5-9 4.5-9-4.5zM6.5 10.5v5c1.6 1.6 3.4 2.2 5.5 2.2s3.9-.6 5.5-2.2v-5" />,
};

function fmt(a: Achievement, v: number) {
  const n = a.decimals ? v.toFixed(a.decimals) : Math.round(v).toLocaleString("en-US");
  return `${a.prefix ?? ""}${n}${a.suffix ?? ""}`;
}

export default function Impact() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current!;
    const track = trackRef.current!;
    const cards = Array.from(track.querySelectorAll<HTMLElement>(".im-card"));
    const reduce = prefersReducedMotion();
    let travel = 0;
    let raf = 0;
    let near = -1;
    // Card centres in track coordinates, measured once per layout (not every frame).
    let centres: number[] = [];
    let trackLeft = 0;

    const layout = () => {
      travel = Math.max(0, track.scrollWidth - window.innerWidth);
      section.style.height = `calc(100svh + ${travel}px)`;
      centres = cards.map((c) => c.offsetLeft + c.offsetWidth / 2);
      trackLeft = track.getBoundingClientRect().left - currentX;
      update();
    };
    let currentX = 0;
    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const span = section.offsetHeight - window.innerHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 0;
      currentX = -p * travel;
      track.style.transform = `translate3d(${currentX}px,0,0)`;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      // Lift the card nearest the viewport centre (pure maths, no layout reads).
      const cx = window.innerWidth / 2 - trackLeft - currentX;
      let best = 0;
      for (let i = 1; i < centres.length; i++) if (Math.abs(centres[i] - cx) < Math.abs(centres[best] - cx)) best = i;
      if (best !== near) {
        cards[near]?.classList.remove("is-near");
        cards[best]?.classList.add("is-near");
        near = best;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    // Count up once, the first time each card is seen.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          io.unobserve(e.target);
          const el = e.target.querySelector<HTMLElement>(".im-num")!;
          const a = ACHIEVEMENTS[Number((e.target as HTMLElement).dataset.i)];
          if (reduce) {
            el.textContent = fmt(a, a.value);
            continue;
          }
          const t0 = performance.now();
          const step = (now: number) => {
            const x = Math.min(1, (now - t0) / 1400);
            const eased = 1 - Math.pow(1 - x, 4);
            el.textContent = fmt(a, a.value * eased);
            if (x < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 },
    );
    cards.forEach((c) => io.observe(c));

    layout();
    window.addEventListener("resize", layout);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", layout);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);


  return (
    <section
      ref={sectionRef}
      id="impact"
      data-card
      className="deck-card tone-ink impact"
      aria-labelledby="impact-title"
    >
      <div className="im-stage">
        <div className="wrap im-head">
          <div>
            <h2 id="impact-title" className="h-section">
              <span className="rv-mask">
                <span>
                  By the <span className="accent">numbers.</span>
                </span>
              </span>
            </h2>
          </div>
          <div className="im-progress" aria-hidden="true">
            <span ref={barRef} />
          </div>
        </div>

        <div className="im-viewport">
          <div ref={trackRef} className="im-track">
            {ACHIEVEMENTS.map((a, i) => (
              <article key={a.label} className="im-card" data-i={i} aria-label={`${fmt(a, a.value)} ${a.label}`}>
                <div className="im-top">
                  <span className="im-ico" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="30" height="30">
                      <g fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                        {ICONS[a.icon]}
                      </g>
                    </svg>
                  </span>
                </div>
                <div className="im-bottom">
                  <p className="im-num" aria-hidden="true">
                    {fmt(a, 0)}
                  </p>
                  <h3 className="im-label">{a.label}</h3>
                  <p className="im-cap">{a.caption}</p>
                  <p className="im-src">{a.source}</p>
                </div>
              </article>
            ))}
            <p className="im-end">
              and counting <span aria-hidden="true">→</span>
            </p>
          </div>
        </div>
      </div>

      <style href="impact" precedence="default">{`
        .impact { min-height: 100svh; }
        .im-stage { position: sticky; top: 0; height: 100svh; display: flex; flex-direction: column; justify-content: center; gap: clamp(28px, 5vh, 56px); overflow: clip; }
        .im-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; }
        .impact .h-section { font-size: clamp(2.5rem, 5.6vw, 5.25rem); }
        .impact .accent { color: #a9a6a0; }
        .im-progress { width: min(240px, 30vw); height: 2px; background: rgba(255,255,255,.16); border-radius: 2px; overflow: hidden; margin-bottom: 14px; }
        .im-progress span { display: block; height: 100%; background: #fff; transform-origin: 0 50%; transform: scaleX(0); }
        .im-viewport { padding-block: 16px; }
        .im-track { display: flex; align-items: center; gap: 18px; width: max-content; padding-inline: max(var(--gutter), calc((100vw - 1320px) / 2 + var(--gutter))); will-change: transform; }
        .im-card {
          position: relative; display: flex; flex-direction: column; justify-content: space-between; gap: 18px;
          width: clamp(300px, 34vw, 460px); height: clamp(340px, 48vh, 420px); padding: 26px 28px 26px;
          border-radius: 28px; background: #fff; color: var(--ink);
          box-shadow: 0 10px 30px -18px rgba(0,0,0,.6);
          --mute: #6b6963; --line: rgba(13,13,13,.1);
          transition: transform .8s var(--ease);
        }
        /* The lifted card's big shadow lives on its own layer and fades in, so it never repaints the card. */
        .im-card::before { content: ""; position: absolute; inset: 0; z-index: -1; border-radius: inherit; pointer-events: none;
          box-shadow: 0 40px 70px -30px rgba(0,0,0,.85), 0 0 0 1px rgba(255,255,255,.4); opacity: 0; transition: opacity .8s var(--ease); }
        .im-card.is-near { transform: translateY(-12px); }
        .im-card.is-near::before { opacity: 1; }
        .im-top { display: flex; justify-content: space-between; align-items: flex-start; }
        .im-ico {
          display: grid; place-items: center; width: 64px; height: 64px; border-radius: 18px; background: var(--paper);
          box-shadow: inset 0 0 0 1px var(--line); transition: box-shadow .8s var(--ease), background-color .8s var(--ease), color .8s var(--ease);
        }
        .im-card.is-near .im-ico { background: var(--ink); color: #fff; box-shadow: 0 12px 30px -10px rgba(13,13,13,.5); }
        .im-bottom { display: flex; flex-direction: column; min-width: 0; }
        .im-num { margin: 0; font-size: clamp(3rem, 4.6vw, 4.75rem); font-weight: 700; letter-spacing: -0.055em; line-height: .95; font-variant-numeric: tabular-nums; white-space: nowrap; }
        .im-label { margin: 14px 0 0; font-size: clamp(1.25rem, 1.6vw, 1.5rem); font-weight: 700; letter-spacing: -0.025em; line-height: 1.15; }
        .im-cap { margin: 8px 0 0; font-size: clamp(0.9375rem, 1.1vw, 1.0625rem); line-height: 1.45; color: #3a3a3a; text-wrap: pretty; }
        .im-src { margin: 12px 0 0; font-family: var(--font-instrument-serif), Georgia, serif; font-style: italic; font-size: 0.9375rem; letter-spacing: 0; color: var(--mute); }
        .im-end { background: var(--ink); margin: 0 0 0 24px; font-family: var(--font-instrument-serif), serif; font-style: italic; font-size: clamp(2.25rem, 4vw, 3.75rem); color: #a9a6a0; white-space: nowrap; padding-right: 8vw; }
        @media (max-width: 640px) {
          .im-card { width: 84vw; height: auto; min-height: 330px; padding: 22px; }
          .im-ico { width: 54px; height: 54px; border-radius: 15px; }
          .im-num { font-size: 3.25rem; }
          .im-label { font-size: 1.25rem; }
          .im-cap { font-size: 0.9375rem; }
        }
      `}</style>
    </section>
  );
}
