"use client";

import Lenis from "lenis";
import { useEffect, useSyncExternalStore } from "react";
import { prefersReducedMotion, isStill } from "./hooks";

/*
 * Scroll plumbing shared by the whole page:
 *  - Lenis smooth scrolling (off under prefers-reduced-motion)
 *  - the "deck": every top-level section is a sticky card. When the next card slides
 *    over it, the covered card tilts back and recedes, like a stack of panels.
 *  - a tiny store with the active section and overall progress, for the navigation.
 */

let lenis: Lenis | null = null;

type DeckState = { active: string; progress: number; scrolled: boolean };
let state: DeckState = { active: "top", progress: 0, scrolled: false };
const listeners = new Set<() => void>();

function setState(next: DeckState) {
  if (next.active === state.active && next.progress === state.progress && next.scrolled === state.scrolled) return;
  state = next;
  listeners.forEach((l) => l());
}

export function useDeckState(): DeckState {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
    () => state,
  );
}

/** Natural (un-stuck) document offsets for every card, keyed by id. */
const naturalTop = new Map<string, number>();

/** Smooth-scroll to an absolute page offset (used by in-section stops like the experience path). */
export function scrollToY(top: number) {
  if (lenis) lenis.scrollTo(top, { duration: 0.9, force: true });
  else window.scrollTo({ top, behavior: "smooth" });
}

export function scrollToTarget(id: string) {
  const top = id === "top" ? 0 : naturalTop.get(id);
  if (top === undefined) return;
  if (lenis) lenis.scrollTo(top, { duration: 1.4, force: true });
  else window.scrollTo({ top, behavior: "auto" });
  const el = document.getElementById(id);
  // Move focus for keyboard and screen-reader users without a second scroll jump.
  if (el) {
    el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  }
}

export function useDeck() {
  useEffect(() => {
    const reduce = prefersReducedMotion();
    if (!reduce) {
      lenis = new Lenis({ autoRaf: true, lerp: 0.1, wheelMultiplier: 1 });
    }

    const deck = document.querySelector<HTMLElement>("[data-deck]");
    if (!deck) return;
    const cards = Array.from(deck.querySelectorAll<HTMLElement>(":scope > [data-card]"));
    // One overlay per card that dims it as the next card covers it. Its opacity is set directly,
    // so no style change ever cascades into the card's (large) content while scrolling.
    const shades = cards.map((card) => {
      let el = card.querySelector<HTMLElement>(":scope > .deck-shade");
      if (!el) {
        el = document.createElement("span");
        el.className = "deck-shade";
        el.setAttribute("aria-hidden", "true");
        card.appendChild(el);
      }
      return el;
    });
    let tops: number[] = [];
    let vh = window.innerHeight;
    let raf = 0;

    const layout = () => {
      vh = window.innerHeight;
      let y = deck.offsetTop;
      tops = cards.map((card, i) => {
        const h = card.offsetHeight;
        // Stick once the card's bottom meets the viewport bottom, so tall cards scroll fully first.
        // Exception: Chrome shifts the first card up by a negative sticky top at scroll 0, so a hero
        // taller than the viewport (small phones) just scrolls normally instead of sticking.
        const tall = h > vh;
        card.style.position = i === 0 && tall ? "relative" : "";
        card.style.top = i === 0 && tall ? "" : `${Math.min(0, vh - h)}px`;
        // Cards are separated by a top margin: scroll targets land the card one inset below the top.
        const m = parseFloat(getComputedStyle(card).marginTop) || 0;
        naturalTop.set(card.id, y);
        const t = y + m;
        y = t + h;
        return t;
      });
      update();
    };

    const update = () => {
      raf = 0;
      const sy = window.scrollY;
      const max = document.documentElement.scrollHeight - vh;
      let active = cards[0]?.id ?? "top";
      for (let i = 0; i < cards.length; i++) {
        if (tops[i] - sy <= vh * 0.5) active = cards[i].id;
        const next = tops[i + 1];
        let p = 0;
        if (next !== undefined) p = Math.min(1, Math.max(0, (vh - (next - sy)) / vh));
        const card = cards[i];
        if (reduce || isStill() || p === 0) {
          if (card.dataset.p !== "0") {
            card.style.transform = "";
            shades[i].style.opacity = "0";
            card.dataset.p = "0";
          }
          continue;
        }
        // Ease so the tilt builds quickly, then settles.
        const e = 1 - Math.pow(1 - p, 2);
        card.style.transform = `perspective(1800px) rotateX(${(e * 10).toFixed(3)}deg) scale(${(1 - e * 0.1).toFixed(4)})`;
        shades[i].style.opacity = (e * 0.55).toFixed(3);
        card.dataset.p = "1";
      }
      setState({ active, progress: max > 0 ? sy / max : 0, scrolled: sy > 40 });
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    layout();
    const ro = new ResizeObserver(() => layout());
    cards.forEach((c) => ro.observe(c));
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", layout);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", layout);
      lenis?.destroy();
      lenis = null;
    };
  }, []);
}

export function lockScroll(locked: boolean) {
  if (locked) lenis?.stop();
  else lenis?.start();
  document.documentElement.style.overflow = locked ? "hidden" : "";
}
