"use client";

import { useEffect, useRef } from "react";
import { isStill, onStillChange, prefersReducedMotion } from "@/lib/hooks";

/*
 * The hero portrait, drawn as a grid of ink blocks (a halftone made of squares).
 *  - On load the blocks drop into place, row by row.
 *  - It breathes with a slow diagonal wave, and morphs portrait → "HI" → portrait → "AT".
 *  - Click / tap sends a ripple through the blocks.
 *  - Scrolling away dissolves the blocks upward as the next card slides over.
 *  - The hero's pause button ("still" mode) freezes the clock; scroll dissolve still follows the page.
 * Source map: public/portrait/mosaic.png (60×75 grayscale), built by scripts/build-portrait.py.
 */

const COLS = 60;
const ROWS = 75;
const N = COLS * ROWS;

export type Phase = "portrait" | "hi" | "at";
const SCHEDULE: { phase: Phase; hold: number }[] = [
  { phase: "portrait", hold: 5.6 },
  { phase: "hi", hold: 2.2 },
  { phase: "portrait", hold: 5.6 },
  { phase: "at", hold: 2.2 },
];
const MORPH = 0.75; // seconds per block
const SPREAD = 0.55; // seconds of stagger across the grid

function sampleImage(img: CanvasImageSource): Float32Array {
  const c = document.createElement("canvas");
  c.width = COLS;
  c.height = ROWS;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, COLS, ROWS);
  ctx.drawImage(img, 0, 0, COLS, ROWS);
  const d = ctx.getImageData(0, 0, COLS, ROWS).data;
  const out = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const lum = (d[i * 4] * 0.299 + d[i * 4 + 1] * 0.587 + d[i * 4 + 2] * 0.114) / 255;
    const v = 1 - lum;
    out[i] = v < 0.05 ? 0 : v;
  }
  return out;
}

function sampleText(text: string, family: string): Float32Array {
  const c = document.createElement("canvas");
  c.width = COLS;
  c.height = ROWS;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, COLS, ROWS);
  ctx.fillStyle = "#000";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  let size = 44;
  ctx.font = `800 ${size}px ${family}`;
  const w = ctx.measureText(text).width;
  if (w > COLS - 6) size = Math.floor((size * (COLS - 6)) / w);
  ctx.font = `800 ${size}px ${family}`;
  ctx.fillText(text, COLS / 2, ROWS * 0.47);
  const d = ctx.getImageData(0, 0, COLS, ROWS).data;
  const out = new Float32Array(N);
  for (let i = 0; i < N; i++) out[i] = 1 - d[i * 4] / 255;
  return out;
}

const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const easeOutExpo = (x: number) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

export default function BlockPortrait({
  src,
  label,
  onPhase,
}: {
  src: string;
  label: string;
  onPhase?: (p: Phase) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseCb = useRef(onPhase);
  phaseCb.current = onPhase;

  useEffect(() => {
    const wrap = wrapRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = prefersReducedMotion();

    let fields: Record<Phase, Float32Array> | null = null;
    const cur = new Float32Array(N);
    const from = new Float32Array(N);
    let to: Float32Array | null = null;
    const r1 = new Float32Array(N);
    const r2 = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      r1[i] = Math.random();
      r2[i] = Math.random();
    }

    let cssW = 0;
    let cssH = 0;
    let cell = 0;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    let clock = 0; // animation seconds; only advances while motion is allowed
    let last = 0;
    let morphStart = -1e9;
    let morphKind: Phase = "portrait";
    let step = 0;
    let nextSwitch = 0;
    const ripples: { x: number; y: number; t0: number }[] = [];

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      cssW = r.width;
      cssH = r.height;
      cell = Math.min(cssW / COLS, cssH / ROWS);
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      if (reduce || !raf) draw();
    };

    const draw = () => {
      if (!fields) return;
      const t = clock;
      const sy = window.scrollY;
      const vh = window.innerHeight;
      const dis = reduce ? 0 : clamp01(sy / (vh * 0.85));

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssW, cssH);
      if (dis >= 1) return;

      // Morph schedule (portrait ↔ text).
      if (!reduce && to === null && t > nextSwitch) {
        step = (step + 1) % SCHEDULE.length;
        const next = SCHEDULE[step];
        from.set(cur);
        to = fields[next.phase];
        morphKind = next.phase;
        morphStart = t;
        nextSwitch = t + SPREAD + MORPH + next.hold;
        phaseCb.current?.(next.phase);
      }

      const gw = cell * COLS;
      const gh = cell * ROWS;
      const ox0 = (cssW - gw) / 2;
      const oy0 = cssH - gh; // stand the figure on the bottom edge
      const morphing = to !== null;
      let morphDone = morphing;

      for (let pass = 0; pass < 2; pass++) {
        ctx.fillStyle = pass === 0 ? "#9b9891" : "#0d0d0d";
        for (let row = 0; row < ROWS; row++) {
          for (let col = 0; col < COLS; col++) {
            const i = row * COLS + col;
            let v = cur[i];
            if (morphing && pass === 0) {
              // Text sweeps in left→right; portrait returns from the centre out.
              const order =
                morphKind === "portrait"
                  ? Math.hypot(col / COLS - 0.5, row / ROWS - 0.45) * 1.4
                  : col / COLS;
              const local = clamp01((t - morphStart - order * SPREAD - r1[i] * 0.15) / MORPH);
              if (local < 1) morphDone = false;
              v = from[i] + (to![i] - from[i]) * easeInOut(local);
              cur[i] = v;
            }
            if (v <= 0.02) continue;
            const dark = v > 0.42;
            if ((pass === 1) !== dark) continue;

            let k = 1;
            let x = ox0 + col * cell + cell / 2;
            let y = oy0 + row * cell + cell / 2;

            if (!reduce) {
              // Intro: drop in, top rows first.
              const ie = easeOutExpo(clamp01((t - (row / ROWS) * 0.8 - r1[i] * 0.45) / 0.9));
              if (ie < 1) {
                y -= (1 - ie) * (50 + r2[i] * 90);
                k *= ie;
              }
              // Breathing wave.
              k *= 1 + 0.07 * Math.sin(t * 1.5 - (col + row) * 0.17);
              // Ripples.
              for (const rp of ripples) {
                const age = t - rp.t0;
                const dx = x - rp.x;
                const dy = y - rp.y;
                const d = Math.hypot(dx, dy) || 1;
                const front = age * 520;
                const amp = Math.exp(-((d - front) ** 2) / 1800) * Math.max(0, 1 - age / 1.5);
                if (amp > 0.01) {
                  k *= 1 + amp * 0.9;
                  x += (dx / d) * amp * 7;
                  y += (dy / d) * amp * 7;
                }
              }
              // Dissolve upward on scroll.
              if (dis > 0) {
                const e = dis * dis;
                y -= e * (120 + r2[i] * 420);
                x += (r1[i] - 0.5) * e * 180;
                k *= 1 - dis * 0.9;
              }
            }

            const side = cell * 0.92 * Math.pow(v, 0.62) * k;
            if (side < 0.45) continue;
            ctx.fillRect(x - side / 2, y - side / 2, side, side);
          }
        }
      }

      if (morphing && morphDone) to = null;
      for (let j = ripples.length - 1; j >= 0; j--) if (t - ripples[j].t0 > 1.6) ripples.splice(j, 1);
    };

    const loop = (now: number) => {
      raf = 0;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      if (!isStill()) clock += dt;
      draw();
      const settledAway = window.scrollY >= window.innerHeight * 0.85;
      // In still mode, draw once per wake-up (e.g. a scroll) instead of looping.
      if (visible && !settledAway && !document.hidden && !isStill()) raf = requestAnimationFrame(loop);
      else last = 0;
    };
    const wake = () => {
      if (!reduce && !raf && visible && !document.hidden) raf = requestAnimationFrame(loop);
    };
    const offStill = onStillChange(wake);

    const onDown = (e: PointerEvent) => {
      if (reduce) return;
      const r = canvas.getBoundingClientRect();
      if (isStill()) return;
      ripples.push({ x: e.clientX - r.left, y: e.clientY - r.top, t0: clock });
      if (ripples.length > 4) ripples.shift();
      wake();
    };

    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      wake();
    });
    io.observe(wrap);
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    window.addEventListener("scroll", wake, { passive: true });
    document.addEventListener("visibilitychange", wake);
    canvas.addEventListener("pointerdown", onDown);

    const family =
      getComputedStyle(document.documentElement).getPropertyValue("--font-inter-tight").trim() || "sans-serif";
    const img = new Image();
    img.decoding = "async";
    img.src = src;
    let cancelled = false;
    Promise.all([img.decode(), document.fonts?.ready]).then(() => {
      if (cancelled) return;
      fields = {
        portrait: sampleImage(img),
        hi: sampleText("HI", family),
        at: sampleText("AT", family),
      };
      cur.set(fields.portrait);
      nextSwitch = SCHEDULE[0].hold + 1.6; // let the intro finish first
      // Reduced motion or still mode on arrival: skip the intro and show the finished portrait.
      if (reduce || isStill()) clock = 3;
      resize();
      if (reduce) draw();
      else wake();
    });

    return () => {
      cancelled = true;
      offStill();
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("scroll", wake);
      document.removeEventListener("visibilitychange", wake);
      canvas.removeEventListener("pointerdown", onDown);
    };
  }, [src]);

  return (
    <div ref={wrapRef} className="bp">
      <canvas ref={canvasRef} role="img" aria-label={label} />
      <style href="block-portrait" precedence="default">{`
        .bp { position: absolute; inset: 0; }
        .bp canvas { display: block; width: 100%; height: 100%; touch-action: pan-y; cursor: crosshair; }
      `}</style>
    </div>
  );
}
