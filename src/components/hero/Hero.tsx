"use client";

import { useEffect, useRef, useState } from "react";
import { PROFILE } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";
import { setStill, useStill } from "@/lib/hooks";
import AvatarPortrait from "./AvatarPortrait";
import { type Phase } from "./AvatarPortrait";

const BUBBLE: Record<Phase, string> = {
  portrait: `Hi, I'm ${PROFILE.firstName}.`,
  yo: `Hi, I'm ${PROFILE.firstName}.`,
  at: PROFILE.name + ".",
};

function useTyped(text: string, delay = 0) {
  const [out, setOut] = useState("");
  const prev = useRef("");
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOut(text);
      return;
    }
    let i = 0;
    let id: ReturnType<typeof setTimeout>;
    const tick = () => {
      i++;
      setOut(text.slice(0, i));
      if (i < text.length) id = setTimeout(tick, 38 + Math.random() * 40);
    };
    id = setTimeout(tick, prev.current ? 120 : delay);
    prev.current = text;
    return () => clearTimeout(id);
  }, [text, delay]);
  return out;
}

export default function Hero() {
  const [phase, setPhase] = useState<Phase>("portrait");
  const typed = useTyped(BUBBLE[phase], 1900);
  const still = useStill();

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToTarget(id);
  };

  return (
    <section id="top" data-card className="deck-card hero" aria-labelledby="hero-title">
      <p className="hero-ghost" aria-hidden="true">
        {PROFILE.firstName.toUpperCase()}
      </p>

      <div className="hero-figure">
        <AvatarPortrait onPhase={setPhase} />
        <p className="hero-bubble mono" aria-hidden="true">
          <span>{typed}</span>
          <i className="caret" />
        </p>
        <button
          type="button"
          className="hero-still"
          aria-pressed={still}
          aria-label={still ? "Play animations" : "Pause animations"}
          title={still ? "Play animations" : "Pause animations"}
          onClick={() => setStill(!still)}
        >
          {still ? (
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
              <path d="M4 2.5l9 5.5-9 5.5z" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
              <rect x="3.5" y="2.5" width="3" height="11" rx=".8" fill="currentColor" />
              <rect x="9.5" y="2.5" width="3" height="11" rx=".8" fill="currentColor" />
            </svg>
          )}
        </button>
      </div>

      <div className="hero-grid wrap">
        <div className="hero-left">
          <h1 id="hero-title" className="hero-h1">
            <span className="sr-only">{PROFILE.name}: </span>
            <span className="rv-mask" style={{ "--i": 1 } as React.CSSProperties}>
              <span>{PROFILE.headline.lead}</span>
            </span>
            <span className="rv-mask" style={{ "--i": 2 } as React.CSSProperties}>
              <span className="accent">{PROFILE.headline.accent}</span>
            </span>
          </h1>
        </div>

        <div className="hero-right">
          <p className="lede rv" style={{ "--i": 3 } as React.CSSProperties}>
            {PROFILE.intro}
          </p>
          <div className="hero-ctas rv" style={{ "--i": 4 } as React.CSSProperties}>
            <a href="#work" className="btn btn-primary" onClick={go("work")}>
              Explore work
            </a>
            <a href="#contact" className="btn btn-ghost" onClick={go("contact")}>
              Let&apos;s talk
            </a>
            <a href={PROFILE.resume} className="btn btn-ghost" download>
              Résumé <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </div>

      <style href="hero" precedence="default">{`
        .hero {
          position: relative; display: flex; flex-direction: column; justify-content: flex-end;
          isolation: isolate;
        }
        .hero-ghost {
          position: absolute; left: 50%; top: 47%; z-index: -1; margin: 0;
          transform: translate(-50%, -50%);
          font-size: clamp(7.5rem, 27vw, 27.5rem); font-weight: 800; letter-spacing: -0.065em; line-height: .8;
          color: transparent; -webkit-text-stroke: 1.5px rgba(13,13,13,.13);
          white-space: nowrap; user-select: none;
          animation: ghost-in 1.6s var(--ease) .2s both;
        }
        @keyframes ghost-in { from { opacity: 0; letter-spacing: -0.02em; } }

        .hero-figure {
          position: absolute; left: 50%; bottom: 0; z-index: 0;
          height: min(78svh, 780px); aspect-ratio: 4 / 5; transform: translateX(-50%);
        }
        .hero-bubble {
          position: absolute; left: 70%; top: 15%; margin: 0; z-index: 2;
          display: inline-flex; align-items: center; gap: 2px;
          padding: 10px 14px; border-radius: 16px 16px 16px 4px;
          background: #fff; font-size: 0.8125rem; letter-spacing: .01em; white-space: nowrap;
          box-shadow: inset 0 0 0 1px var(--line), 0 18px 40px -20px rgba(13,13,13,.35);
          min-height: 40px; animation: bubble-in .9s var(--ease) 1.7s both;
        }
        @keyframes bubble-in { from { opacity: 0; transform: translateY(10px) scale(.92); } }
        .caret { width: 7px; height: 14px; background: var(--ink); margin-left: 2px; animation: blink 1s steps(1) infinite; }
        @keyframes blink { 50% { opacity: 0; } }

        .hero-grid {
          position: relative; z-index: 1; display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); align-items: end;
          gap: 40px; padding-bottom: clamp(40px, 7vh, 72px); padding-top: 120px;
          pointer-events: none;
        }
        .hero-grid a, .hero-grid p { pointer-events: auto; }
        /* Keep the headline clear of the figure (its width is 0.8 × min(78svh, 780px)) and its pause button. */
        .hero-left { max-width: min(440px, calc(50vw - min(31.2svh, 312px) - 72px)); }
        .hero-right { justify-self: end; max-width: 360px; }
        .hero-ctas .btn { min-height: 44px; padding: 0 18px; font-size: 0.875rem; }
        .hero-h1 {
          margin: 0; font-weight: 700; letter-spacing: -0.035em; line-height: 1.1;
          font-size: clamp(2.25rem, 3.2vw, 3.25rem);
        }
        .hero-h1 .accent { font-size: 1.08em; line-height: 1.1; }
        .hero-h1 .rv-mask + .rv-mask { margin-top: .18em; }
        .hero-right .lede { font-size: 1rem; line-height: 1.65; }
        .hero-ctas { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }
        .hero-still {
          position: absolute; left: 4%; bottom: 7%; z-index: 2;
          display: grid; place-items: center; width: 46px; height: 46px; border-radius: 50%;
          background: var(--ink); color: #fff;
          box-shadow: 0 0 0 4px #fff, 0 14px 30px -12px rgba(13,13,13,.5);
          transition: transform .5s var(--ease);
          animation: bubble-in .9s var(--ease) 2.2s both;
        }
        .hero-still:hover { transform: scale(1.06); }

        @media (max-width: 1100px) {
          .hero-figure { height: min(70svh, 700px); }
          .hero-left { max-width: min(360px, calc(50vw - min(28svh, 280px) - 64px)); }
          .hero-right { max-width: 320px; }
          .hero-h1 { font-size: clamp(2rem, 3.1vw, 2.625rem); }
        }
        @media (max-width: 860px) {
          .hero { justify-content: flex-start; }
          .hero-figure {
            position: relative; left: auto; transform: none; margin: 88px auto 0;
            height: min(48svh, 460px);
          }
          .hero-ghost { top: 31%; font-size: 30vw; }
          .hero-still { left: auto; right: -4%; bottom: 4%; }
          .hero-bubble { left: 58%; top: 8%; font-size: 0.75rem; padding: 8px 12px; }
          .hero-grid { grid-template-columns: 1fr; padding-top: 32px; gap: 24px; }
          .hero-left, .hero-right { max-width: none; justify-self: stretch; }
          .hero-h1 { font-size: clamp(2rem, 8.4vw, 3rem); }
          .hero-ctas { gap: 8px; }
          .hero-ctas .btn { padding: 0 16px; }
        }
      `}</style>
    </section>
  );
}
