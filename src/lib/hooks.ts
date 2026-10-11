"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function subscribeReducedMotion(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribeReducedMotion, prefersReducedMotion, () => false);
}

/** True while the element is at least `threshold` visible. With `once`, latches on. */
export function useInView<T extends Element>(
  { threshold = 0, rootMargin = "0px", once = false }: { threshold?: number; rootMargin?: string; once?: boolean } = {},
) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && once) io.disconnect();
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin, once]);
  return [ref, inView] as const;
}

/**
 * Scroll progress (0..1) of an element through a range, reported to a callback
 * every frame the page scrolls. `compute` gets the element's rect and the viewport height.
 */
export function useScrollProgress<T extends Element>(
  compute: (rect: DOMRect, vh: number) => number,
  onProgress: (p: number) => void,
) {
  const ref = useRef<T>(null);
  const computeRef = useRef(compute);
  const cbRef = useRef(onProgress);
  computeRef.current = compute;
  cbRef.current = onProgress;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const tick = () => {
      raf = 0;
      const p = computeRef.current(el.getBoundingClientRect(), window.innerHeight);
      cbRef.current(Math.min(1, Math.max(0, p)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return ref;
}

/* ---------- "Still" mode: one switch that pauses every looping animation on the page ---------- */

let still = false;
const stillListeners = new Set<() => void>();

export function isStill() {
  return still;
}

export function setStill(v: boolean) {
  still = v;
  document.documentElement.classList.toggle("is-still", v);
  try {
    localStorage.setItem("motion-still", v ? "1" : "0");
  } catch {}
  stillListeners.forEach((l) => l());
}

export function restoreStill() {
  try {
    if (localStorage.getItem("motion-still") === "1") setStill(true);
  } catch {}
}

export function onStillChange(cb: () => void) {
  stillListeners.add(cb);
  return () => {
    stillListeners.delete(cb);
  };
}

export function useStill(): boolean {
  return useSyncExternalStore(onStillChange, isStill, () => false);
}
