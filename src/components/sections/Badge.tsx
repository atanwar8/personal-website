"use client";

import { useEffect, useRef, useState } from "react";
import { ID_CARD, PROFILE } from "@/lib/data";
import { isStill, prefersReducedMotion } from "@/lib/hooks";

/** Deterministic barcode widths from the name, so it never changes between renders. */
function barcode(seed: string) {
  const bars: number[] = [];
  for (let i = 0; i < 46; i++) bars.push(1 + ((seed.charCodeAt(i % seed.length) * (i + 7)) % 4));
  let x = 0;
  const stops: string[] = [];
  bars.forEach((w, i) => {
    const c = i % 2 === 0 ? "#0d0d0d" : "transparent";
    stops.push(`${c} ${x}px ${x + w}px`);
    x += w;
  });
  return { image: `linear-gradient(90deg, ${stops.join(",")})`, width: x };
}

/** Small line icons for the back of the card. */
function BackIcon({ name }: { name: "grad" | "spark" | "chef" }) {
  return (
    <svg className="idc-ico" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      {name === "grad" && (
        <>
          <path d="M2 9.5 12 5l10 4.5-10 4.5z" />
          <path d="M6 11.5v4.2c0 1.3 2.7 2.8 6 2.8s6-1.5 6-2.8v-4.2" />
          <path d="M22 9.5v5" />
        </>
      )}
      {name === "spark" && (
        <>
          <path d="M9 18h6M10 21h4" />
          <path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z" />
        </>
      )}
      {name === "chef" && (
        <>
          <path d="M7 14.5V20h10v-5.5" />
          <path d="M7 14.5a4 4 0 0 1-.6-7.9A4.5 4.5 0 0 1 12 3.5a4.5 4.5 0 0 1 5.6 3.1 4 4 0 0 1-.6 7.9z" />
          <path d="M7 17h10" />
        </>
      )}
    </svg>
  );
}

function Lanyard() {
  const swingRef = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);
  const [hovered, setHovered] = useState(false);
  const lastPointer = useRef<string>("");
  const bc = barcode(PROFILE.name);

  // Damped pendulum: pointer velocity kicks it, a spring pulls it home, a faint idle sway keeps it alive.
  useEffect(() => {
    const el = swingRef.current;
    const section = el?.closest("section");
    if (!el || !section || prefersReducedMotion()) return;
    let a = 0;
    let w = 0;
    let lastX: number | null = null;
    let lastT = 0;
    let raf = 0;
    let visible = false;
    let prev = performance.now();

    const frame = (now: number) => {
      const dt = Math.min(0.033, (now - prev) / 1000);
      prev = now;
      const acc = -38 * a - 3.2 * w;
      w += acc * dt;
      a += w * dt;
      const idle = isStill() ? 0 : Math.sin(now / 1300) * 1.6;
      el.style.transform = `rotate(${(a + idle).toFixed(3)}deg)`;
      raf = visible ? requestAnimationFrame(frame) : 0;
    };
    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      if (lastX !== null) {
        const dt = Math.max(8, now - lastT);
        const v = (e.clientX - lastX) / dt; // px per ms
        w += Math.max(-30, Math.min(30, v * 5));
      }
      lastX = e.clientX;
      lastT = now;
    };
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (visible && !raf) {
        prev = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });
    io.observe(section);
    section.addEventListener("pointermove", onMove);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      section.removeEventListener("pointermove", onMove);
    };
  }, []);

  const showBack = flipped || hovered;

  return (
    <div className="ly">
      <div className="ly-swing" ref={swingRef}>
        <div className="ly-strap" aria-hidden="true">
          <div className="ly-strap-text mono">
            {Array.from({ length: 6 }, (_, i) => (
              <span key={i}>{PROFILE.name} · MSIS · Kelley · </span>
            ))}
          </div>
        </div>
        <div className="ly-clip" aria-hidden="true">
          <i />
        </div>
        <button
          type="button"
          className={`idc${showBack ? " is-flipped" : ""}`}
          aria-pressed={showBack}
          onPointerDown={(e) => (lastPointer.current = e.pointerType)}
          onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
          onPointerLeave={(e) => e.pointerType === "mouse" && setHovered(false)}
          onClick={(e) => {
            // Mouse users flip by hovering; touch taps and keyboard (detail 0) toggle.
            if (lastPointer.current === "mouse" && e.detail > 0) return;
            setFlipped((f) => !f);
          }}
        >
          <span className="idc-inner">
            <span className="idc-face idc-front" aria-hidden={showBack}>
              <span className="idc-hole" aria-hidden="true" />
              <span className="idc-band mono">{ID_CARD.band}</span>
              <span className="idc-photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/aryan-avatar-memoji.png" alt="" width={128} height={156} loading="lazy" decoding="async" />
              </span>
              <span className="idc-name">{PROFILE.name}</span>
              <span className="idc-rows">
                {ID_CARD.rows.map(([k, v]) => (
                  <span key={k} className="idc-row">
                    <span className="mono">{k}</span>
                    <span>{v}</span>
                  </span>
                ))}
              </span>
              <span className="sr-only">ID card, press to flip.</span>
              <span className="idc-foot">
                <span
                  className="idc-barcode"
                  aria-hidden="true"
                  style={{ backgroundImage: bc.image, width: bc.width }}
                />
                <span className="idc-holo" aria-hidden="true" />
              </span>
            </span>

            <span className="idc-face idc-back" aria-hidden={!showBack}>
              <span className="idc-hole" aria-hidden="true" />
              <span className="idc-back-title mono">What I am</span>
              <span className="idc-back-list">
                {ID_CARD.back.map((l) => (
                  <span key={l.title} className="idc-stmt">
                    <BackIcon name={l.icon} />
                    <span>
                      <b>{l.title}</b> {l.text}
                    </span>
                  </span>
                ))}
              </span>
              <span className="idc-found mono">If found, say hello · {PROFILE.email}</span>
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}

export default function Badge() { return <>      <style href="about" precedence="default">{`
        .about-grid {
          display: grid; grid-template-columns: minmax(0,1fr) 320px minmax(0,1fr);
          gap: clamp(24px, 3.4vw, 56px); align-items: stretch;
        }
        .about-left .h-section { font-size: clamp(2.75rem, 5.4vw, 5rem); }
        .about-left .lede { margin-top: 26px; font-size: 1.0625rem; }
        .about-int { margin-top: 14px !important; }
        .about-int .accent { font-size: 1.2em; color: var(--ink); }
        .about-ctas { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 30px; }
        .about-right { display: flex; flex-direction: column; padding-top: 6px; }
        .facts { margin: 22px 0 0; }
        .fact { display: grid; grid-template-columns: 96px 1fr; gap: 12px; padding: 16px 0; border-top: 1px solid var(--line); }
        .fact:last-child { border-bottom: 1px solid var(--line); }
        .fact dt { font-size: 0.6875rem; letter-spacing: .08em; text-transform: uppercase; color: var(--mute); padding-top: 3px; }
        .fact dd { margin: 0; font-size: 0.9375rem; font-weight: 500; line-height: 1.4; }
        .ul { background: linear-gradient(currentColor, currentColor) 0 100% / 100% 1px no-repeat; transition: background-size .5s var(--ease); }
        .ul:hover { background-size: 0 1px; background-position: 100% 100%; }
        .about-quote {
          margin: auto 0 0; padding-top: 32px; font-family: var(--font-instrument-serif), serif; font-style: italic;
          font-size: clamp(1.625rem, 2.2vw, 2.125rem); line-height: 1.15; letter-spacing: -0.01em; color: var(--ink-2);
          text-wrap: balance;
        }

        /* Lanyard */
        .about-center { position: relative; min-height: 560px; }
        .ly { position: absolute; left: 50%; top: calc(var(--section-pad) * -1 - 2px); transform: translateX(-50%); }
        .ly-swing { display: flex; flex-direction: column; align-items: center; transform-origin: 50% 0; will-change: transform; }
        .ly-strap {
          width: 30px; height: calc(var(--section-pad) + 56px); overflow: hidden; position: relative;
          background: var(--ink); color: #fff; border-radius: 0 0 4px 4px;
          box-shadow: inset 2px 0 0 rgba(255,255,255,.08), inset -2px 0 0 rgba(0,0,0,.3);
        }
        .ly-strap-text {
          position: absolute; left: 50%; top: 0; writing-mode: vertical-rl; transform: translateX(-50%);
          font-size: 0.5938rem; letter-spacing: .22em; text-transform: uppercase; white-space: nowrap;
          animation: strap 26s linear infinite;
        }
        @keyframes strap { to { transform: translate(-50%, -50%); } }
        .ly-clip { position: relative; width: 38px; height: 34px; margin-top: -4px; }
        .ly-clip::before {
          content: ""; position: absolute; inset: 0 4px 10px; border-radius: 6px 6px 10px 10px;
          background: linear-gradient(90deg, #8d8b86, #e9e7e2 35%, #b9b6b0 55%, #6f6d68);
          box-shadow: 0 2px 4px rgba(0,0,0,.25);
        }
        .ly-clip i {
          position: absolute; left: 50%; bottom: 0; width: 14px; height: 18px; transform: translateX(-50%);
          border: 3px solid #a3a09a; border-top: 0; border-radius: 0 0 8px 8px;
        }

        .idc { display: block; width: 300px; height: 404px; margin-top: -6px; perspective: 1200px; border-radius: 20px; text-align: left; }
        .idc-inner { position: relative; display: block; width: 100%; height: 100%; transform-style: preserve-3d; transition: transform 1s var(--ease); }
        .idc.is-flipped .idc-inner { transform: rotateY(180deg); }
        .idc-face {
          position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center;
          border-radius: 20px; background: #fff; overflow: hidden;
          -webkit-backface-visibility: hidden; backface-visibility: hidden;
          box-shadow: inset 0 0 0 1px var(--line), 0 30px 60px -28px rgba(13,13,13,.45), 0 8px 18px -10px rgba(13,13,13,.2);
        }
        .idc-back { transform: rotateY(180deg); align-items: stretch; padding: 34px 26px 22px; }
        .idc-hole { position: absolute; top: 9px; left: 50%; width: 46px; height: 8px; transform: translateX(-50%); border-radius: 8px; background: var(--paper); box-shadow: inset 0 1px 2px rgba(0,0,0,.25); z-index: 2; }
        .idc-band {
          align-self: stretch; padding: 26px 0 10px; text-align: center; background: var(--ink); color: #fff;
          font-size: 0.6875rem; letter-spacing: .32em;
        }
        .idc-photo {
          position: relative; margin-top: 18px; width: 128px; height: 156px; border-radius: 14px; overflow: hidden;
          background: var(--soft);
          box-shadow: 0 0 0 3px #fff, 0 0 0 5px #cfccc6, 0 0 0 6px #fff, 0 18px 36px -12px rgba(13,13,13,.35);
        }
        .idc-photo::after { content: ""; position: absolute; inset: 0; background: radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,.35), transparent 60%); }
        .idc-photo img { width: 100%; height: 100%; object-fit: cover;  transition: transform .9s var(--ease); }
        .idc:hover .idc-photo img { transform: scale(1.06); }
        .idc-name { margin-top: 18px; font-size: 1.75rem; font-weight: 700; letter-spacing: -0.035em; line-height: 1.1; }
        .idc-rows { display: grid; gap: 4px; align-self: stretch; margin: 16px 22px 0; }
        .idc-row { display: flex; justify-content: space-between; font-size: 0.7812rem; padding: 4px 0; border-top: 1px dashed var(--line); }
        .idc-row .mono { font-size: 0.6875rem; letter-spacing: .08em; text-transform: uppercase; color: var(--mute); padding-top: 2px; }
        .idc-row span:last-child { font-weight: 600; }
        .idc-foot { display: flex; align-items: center; justify-content: space-between; align-self: stretch; margin: auto 22px 18px; }
        .idc-barcode { display: block; height: 30px; background-repeat: no-repeat; opacity: .9; }
        .idc-holo {
          width: 38px; height: 38px; border-radius: 50%;
          background: conic-gradient(from 0deg, #f2f2f2, #9a9a9a, #ffffff, #6d6d6d, #e2e2e2, #8f8f8f, #f2f2f2);
          box-shadow: inset 0 0 0 1px rgba(0,0,0,.08), inset 0 0 8px rgba(255,255,255,.8);
          animation: holo 6s linear infinite;
        }
        @keyframes holo { to { transform: rotate(360deg); } }
        .idc-back-title { font-size: 0.6875rem; letter-spacing: .24em; text-transform: uppercase; color: var(--mute); }
        .idc-back-list { display: grid; gap: 16px; margin-top: 18px; }
        .idc-stmt { display: grid; grid-template-columns: 22px 1fr; gap: 10px; align-items: start; font-size: 0.9375rem; line-height: 1.4; color: var(--ink-2); }
        .idc-stmt b { color: var(--ink); font-weight: 700; letter-spacing: -0.01em; }
        .idc-ico { margin-top: 1px; fill: none; stroke: var(--ink); stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
        .idc-found { margin-top: auto; font-size: 0.6875rem; color: var(--ink-2); }

        @media (max-width: 1100px) {
          .about-grid { grid-template-columns: minmax(0,1fr) 320px; }
          .about-right { grid-column: 1 / -1; }
          .about-quote { margin-top: 24px; }
        }
        @media (max-width: 760px) {
          .about-grid { grid-template-columns: 1fr; }
          .about-center { order: -1; min-height: 520px; }
          .ly { top: calc(var(--section-pad) * -1 - 2px); }
        }
      `}</style><Lanyard /></>; }
