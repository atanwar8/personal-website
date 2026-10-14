"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { NAV, PROFILE } from "@/lib/data";
import { lockScroll, scrollToTarget, useDeckState } from "@/lib/scroll";

export default function Navigation() {
  const { active, progress, scrolled } = useDeckState();
  const [open, setOpen] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const [ind, setInd] = useState({ x: 0, w: 0, on: false });
  const menuBtn = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);

  const measure = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    const link = list.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!link) return setInd((s) => ({ ...s, on: false }));
    setInd({ x: link.offsetLeft, w: link.offsetWidth, on: true });
  }, [active]);

  useLayoutEffect(measure, [measure]);
  useEffect(() => {
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  useEffect(() => {
    lockScroll(open);
    if (!open) return;
    firstLink.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuBtn.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    // Release the overlay's scroll lock now, not in the effect, so the scroll isn't swallowed.
    lockScroll(false);
    requestAnimationFrame(() => scrollToTarget(id));
  };

  return (
    <>
      <div className="nav-progress" aria-hidden="true" style={{ transform: `scaleX(${progress})` }} />
      <header className={`nav${scrolled ? " is-scrolled" : ""}`}>
        <a href="#top" className="nav-brand" onClick={go("top")}>
          <span className="nav-mark mono" aria-hidden="true">
            {PROFILE.initials}
          </span>
          <span className="nav-name">{PROFILE.name}</span>
          <span className="sr-only">, back to top</span>
        </a>

        <nav className="nav-pill" aria-label="Sections">
          <div className="nav-track" ref={listRef}>
          <span
            className="nav-ind"
            aria-hidden="true"
            style={{ transform: `translateX(${ind.x}px)`, width: ind.w, opacity: ind.on ? 1 : 0 }}
          />
          <ul>
            {NAV.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  data-id={n.id}
                  onClick={go(n.id)}
                  className={active === n.id ? "is-active" : undefined}
                  aria-current={active === n.id ? "true" : undefined}
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          </div>
        </nav>

        <button
          ref={menuBtn}
          className="nav-menu"
          aria-expanded={open}
          aria-controls="menu-overlay"
          onClick={() => setOpen((o) => !o)}
        >
          <span>{open ? "Close" : "Menu"}</span>
          <span className={`nav-burger${open ? " is-x" : ""}`} aria-hidden="true">
            <i />
            <i />
          </span>
        </button>
      </header>

      <div
        id="menu-overlay"
        className={`menu${open ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        inert={!open}
      >
        <ol>
          {NAV.map((n, i) => (
            <li key={n.id} style={{ "--i": i } as React.CSSProperties}>
              <a href={`#${n.id}`} onClick={go(n.id)} ref={i === 0 ? firstLink : undefined}>
                <span className="mono menu-idx">{String(i + 1).padStart(2, "0")}</span>
                {n.label}
              </a>
            </li>
          ))}
        </ol>
      </div>

      <style href="nav-v3" precedence="default">{`
        .nav-progress {
          position: fixed; inset: 0 0 auto 0; height: 2px; z-index: 60;
          background: var(--ink); transform-origin: 0 50%; pointer-events: none;
        }
        .nav {
          position: fixed; z-index: 50; top: 14px; left: 0; right: 0;
          display: flex; align-items: center; justify-content: space-between; gap: 16px;
          padding-inline: calc(var(--deck-inset) + clamp(12px, 2vw, 28px));
          pointer-events: none;
        }
        .nav > * { pointer-events: auto; }
        .nav-brand { display: inline-flex; align-items: center; gap: 12px; border-radius: 999px; }
        .nav-mark {
          display: grid; place-items: center; width: 46px; height: 46px; border-radius: 50%;
          font-size: 0.8125rem; font-weight: 600; letter-spacing: 0.02em;
          box-shadow: inset 0 0 0 1.5px var(--ink); background: rgba(255,255,255,.6);
          transition: background-color .5s var(--ease), color .5s var(--ease), transform .9s var(--ease);
        }
        .nav-brand:hover .nav-mark { transform: rotate(360deg); }
        .is-scrolled .nav-mark { background: var(--ink); color: #fff; box-shadow: inset 0 0 0 1.5px var(--ink), 0 0 0 1px rgba(255,255,255,.35); }
        .nav-name {
          font-weight: 600; letter-spacing: -0.02em; font-size: 1rem;
          transition: opacity .5s var(--ease), transform .6s var(--ease);
        }
        .is-scrolled .nav-name { opacity: 0; transform: translateX(-8px); pointer-events: none; }

        .nav-pill {
          border-radius: 999px; padding: 5px;
          transition: background-color .5s var(--ease), box-shadow .5s var(--ease), backdrop-filter .5s;
        }
        .is-scrolled .nav-pill {
          background: rgba(255,255,255,.86);
          -webkit-backdrop-filter: blur(12px) saturate(1.4); backdrop-filter: blur(12px) saturate(1.4);
          box-shadow: inset 0 0 0 1px var(--line), 0 10px 30px -18px rgba(13,13,13,.35);
        }
        .nav-track { position: relative; }
        .nav-pill ul { display: flex; gap: 2px; list-style: none; margin: 0; padding: 0; }
        .nav-ind {
          position: absolute; left: 0; top: 0; bottom: 0; border-radius: 999px; background: var(--ink);
          transition: transform .6s var(--ease), width .6s var(--ease), opacity .4s var(--ease);
        }
        .nav-pill a {
          position: relative; display: inline-flex; align-items: center; height: 38px; padding: 0 16px;
          border-radius: 999px; font-size: 0.875rem; font-weight: 500; color: var(--ink-2);
          transition: color .4s var(--ease);
        }
        .nav-pill a:hover { color: var(--ink); }
        .nav-pill a.is-active { color: #fff; }

        .nav-menu {
          display: none; align-items: center; gap: 10px; height: 44px; padding: 0 8px 0 18px;
          border-radius: 999px; background: rgba(255,255,255,.75); font-weight: 600; font-size: 0.875rem;
          -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
          box-shadow: inset 0 0 0 1px var(--line);
        }
        .nav-burger { position: relative; width: 30px; height: 30px; border-radius: 50%; background: var(--ink); }
        .nav-burger i {
          position: absolute; left: 9px; right: 9px; height: 1.5px; background: #fff; border-radius: 2px;
          transition: transform .5s var(--ease), top .5s var(--ease);
        }
        .nav-burger i:first-child { top: 12px; }
        .nav-burger i:last-child { top: 17px; }
        .nav-burger.is-x i:first-child { top: 14.25px; transform: rotate(45deg); }
        .nav-burger.is-x i:last-child { top: 14.25px; transform: rotate(-45deg); }

        .menu {
          position: fixed; inset: 0; z-index: 45; background: var(--paper);
          display: flex; flex-direction: column; justify-content: center;
          padding: 96px var(--gutter) 40px;
          clip-path: circle(0% at calc(100% - 44px) 36px);
          visibility: hidden;
          transition: clip-path .8s var(--ease), visibility 0s linear .8s;
        }
        .menu.is-open {
          clip-path: circle(150% at calc(100% - 44px) 36px);
          visibility: visible; transition: clip-path .8s var(--ease), visibility 0s;
        }
        .menu ol { list-style: none; margin: 0; padding: 0; }
        .menu li { overflow: clip; }
        .menu li a {
          display: flex; align-items: baseline; gap: 16px; padding: 6px 0;
          font-size: clamp(2.5rem, 11vw, 4rem); font-weight: 700; letter-spacing: -0.045em; line-height: 1.05;
          transform: translateY(110%); transition: transform .8s var(--ease);
          transition-delay: calc(120ms + var(--i) * 60ms);
        }
        .menu.is-open li a { transform: none; }
        .menu-idx { font-size: 1.0625rem; letter-spacing: .04em; color: var(--mute); font-weight: 500; }

        /* Desktop: same gap from the card's top edge as from its sides, so the bar sits evenly inside the first card. */
        @media (min-width: 901px) {
          .nav { top: calc(var(--deck-inset) + 24px); padding-inline: calc(var(--deck-inset) + 24px); }
        }
        @media (max-width: 900px) {
          .nav-pill { display: none; }
          .nav-menu { display: inline-flex; }
        }
      `}</style>
    </>
  );
}
