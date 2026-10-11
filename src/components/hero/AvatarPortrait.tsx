"use client";

import { useEffect, useRef, useState } from "react";
import { isStill, onStillChange, prefersReducedMotion, useReducedMotion, useStill } from "@/lib/hooks";

/*
 * The hero avatar. At rest it's the sculpted memoji; every few seconds a ripple turns it into
 * a grid of coloured blocks that come apart and fly into "YO" / "AT", then reassemble and a
 * second ripple pops the blocks like bubbles to reveal the image again.
 *  - On load the blocks drop into place, row by row, then ripple into the image.
 *  - Click / tap sends a ripple from the pointer and morphs to "YO" (or back to the avatar).
 *  - Scrolling away dissolves the blocks upward as the next card slides over.
 *  - The hero's pause button ("still") freezes the clock; reduced motion shows the plain image.
 */

const SRC = "/aryan-avatar-memoji.png";
const COLS = 72;
const INK = [25, 62, 50];
const MIST = [150, 168, 158];

export type Phase = "portrait" | "yo" | "at";
const SCHEDULE: { phase: Phase; hold: number }[] = [
  { phase: "portrait", hold: 5.2 },
  { phase: "yo", hold: 2.4 },
  { phase: "portrait", hold: 5.2 },
  { phase: "at", hold: 2.4 },
];
const WAVE = 1.15; // seconds for the image ⇄ blocks ripple to cross the figure
const GAP = 0.4; // blocks loosen / tighten
const LEAD = 0.15; // pause between the ripple and the flight
const SETTLE = 0.2; // pause between landing and the reveal ripple
const FLY = 1.05; // seconds per block flight
const SPREAD = 0.55; // seconds of stagger across the grid
const INTRO_END = 2.3;
const DUR_OUT = WAVE + LEAD + SPREAD + 0.15 + FLY;
const DUR_IN = SPREAD + 0.15 + FLY + SETTLE + WAVE + 0.05;

type Pose = { x: Float32Array; y: Float32Array; v: Float32Array; c: Float32Array; fill: string[] };

const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
const easeInOutSine = (x: number) => -(Math.cos(Math.PI * x) - 1) / 2;
const easeOutExpo = (x: number) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const rgb = (r: number, g: number, b: number) => `rgb(${r | 0},${g | 0},${b | 0})`;

function makePose(n: number): Pose {
  return {
    x: new Float32Array(n),
    y: new Float32Array(n),
    v: new Float32Array(n),
    c: new Float32Array(n * 3),
    fill: new Array(n),
  };
}

/** Area-average the avatar down to one colour + coverage per cell. */
function sampleAvatar(img: HTMLImageElement, cols: number, rows: number) {
  const S = 6;
  const c = document.createElement("canvas");
  c.width = cols * S;
  c.height = rows * S;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, c.width, c.height);
  const d = ctx.getImageData(0, 0, c.width, c.height).data;
  const n = cols * rows;
  const a = new Float32Array(n);
  const col = new Float32Array(n * 3);
  for (let row = 0; row < rows; row++) {
    for (let cx = 0; cx < cols; cx++) {
      let sa = 0, sr = 0, sg = 0, sb = 0;
      for (let y = 0; y < S; y++) {
        let p = ((row * S + y) * c.width + cx * S) * 4;
        for (let x = 0; x < S; x++, p += 4) {
          const al = d[p + 3];
          sa += al;
          sr += d[p] * al;
          sg += d[p + 1] * al;
          sb += d[p + 2] * al;
        }
      }
      const i = row * cols + cx;
      a[i] = sa / (S * S * 255);
      if (sa > 0) {
        col[i * 3] = sr / sa;
        col[i * 3 + 1] = sg / sa;
        col[i * 3 + 2] = sb / sa;
      }
    }
  }
  return { a, col };
}

function sampleText(text: string, family: string, cols: number, rows: number): Float32Array {
  const c = document.createElement("canvas");
  c.width = cols;
  c.height = rows;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, cols, rows);
  ctx.fillStyle = "#000";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  let size = 50;
  ctx.font = `800 ${size}px ${family}`;
  const w = ctx.measureText(text).width;
  if (w > cols - 8) size = Math.floor((size * (cols - 8)) / w);
  ctx.font = `800 ${size}px ${family}`;
  ctx.fillText(text, cols / 2, rows * 0.5);
  const d = ctx.getImageData(0, 0, cols, rows).data;
  const out = new Float32Array(cols * rows);
  for (let i = 0; i < out.length; i++) out[i] = 1 - d[i * 4] / 255;
  return out;
}

export default function AvatarPortrait({ onPhase }: { onPhase: (p: Phase) => void }) {
  const [hello, setHello] = useState(false);
  const reduced = useReducedMotion();
  const still = useStill();
  const quiet = reduced || still;
  const btnRef = useRef<HTMLButtonElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseCb = useRef(onPhase);
  phaseCb.current = onPhase;
  const poke = useRef<(at: { x: number; y: number } | null) => boolean>(() => false);

  useEffect(() => {
    const wrap = btnRef.current!;
    const canvas = canvasRef.current!;
    const photo = imgRef.current!;
    const ctx = canvas.getContext("2d")!;
    let photoOp = -1;
    let photoMask = "";
    const setPhoto = (o: number, mask = "none") => {
      if (o !== photoOp) {
        photoOp = o;
        photo.style.opacity = String(o);
      }
      if (mask !== photoMask) {
        photoMask = mask;
        photo.style.setProperty("mask-image", mask);
        photo.style.setProperty("-webkit-mask-image", mask);
      }
    };
    if (prefersReducedMotion()) {
      setPhoto(1);
      return;
    }

    let rows = 0;
    let P = 0;
    let poses: Record<Phase, Pose> | null = null;
    let r1 = new Float32Array(0);
    let r2 = new Float32Array(0);
    let arc = new Float32Array(0);

    let restPhase: Phase = "portrait";
    // gx/gy: where the image ⇄ blocks ripple starts, in grid cells.
    // reach: distance (cells) from there to the farthest avatar block.
    let trans: {
      from: Pose;
      to: Pose;
      kind: "in" | "out";
      T: number;
      phase: Phase;
      gx: number;
      gy: number;
      reach: number;
    } | null = null;
    let solid = 0; // how many avatar blocks are real (the rest are invisible spares)
    let step = 0;
    let nextSwitch = 1e9;
    const ripples: { x: number; y: number; t0: number }[] = [];

    let cssW = 0;
    let cssH = 0;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    let clock = 0;
    let last = 0;

    // The canvas overhangs the figure (see CSS) so flying blocks aren't clipped.
    const geom = () => {
      const W = cssW / 1.5;
      const cell = W / COLS;
      return { W, cell, ox: (cssW - W) / 2, oy: cssH - rows * cell, fy: cssH - cssH / 1.2 };
    };

    const reachFrom = (gx: number, gy: number) => {
      const a = poses!.portrait;
      let r = 0;
      for (let j = 0; j < solid; j++) r = Math.max(r, Math.hypot(a.x[j] - gx, a.y[j] - gy));
      return r;
    };

    const start = (phase: Phase, t: number, at: { gx: number; gy: number } | null = null) => {
      const kind = phase === "portrait" ? "in" : "out";
      const g = at ?? { gx: COLS / 2, gy: rows * 0.55 };
      trans = { from: poses![restPhase], to: poses![phase], kind, T: t, phase, ...g, reach: reachFrom(g.gx, g.gy) };
      nextSwitch = t + (kind === "out" ? DUR_OUT : DUR_IN) + SCHEDULE[step].hold;
      phaseCb.current(phase);
    };

    const resize = () => {
      cssW = canvas.clientWidth;
      cssH = canvas.clientHeight;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      if (!raf) draw();
    };

    const draw = () => {
      if (!poses) return;
      const t = clock;
      const dis = clamp01(window.scrollY / (window.innerHeight * 0.85));

      if (!trans && t > nextSwitch) {
        step = (step + 1) % SCHEDULE.length;
        start(SCHEDULE[step].phase, t);
      }

      const { cell, ox, oy, fy } = geom();
      const band = cell * 7; // width of the ripple's soft edge
      const sig = cell * 2.4; // width of the bubble swell
      const tr = trans;

      // Work out where the ripple is, how loose the blocks are, and how much photo shows.
      let gap = 0;
      let blocks = false;
      let photoVis = 1;
      let wave: { R: number; cx: number; cy: number; out: boolean } | null = null;
      if (tr) {
        blocks = true;
        const cx = ox + tr.gx * cell;
        const cy = oy + tr.gy * cell;
        const rmax = tr.reach * cell + band;
        if (tr.kind === "out") {
          const a = (t - tr.T) / WAVE;
          if (a < 1) wave = { R: easeInOutSine(clamp01(a)) * rmax, cx, cy, out: true };
          else photoVis = 0;
          gap = clamp01((t - tr.T - WAVE * 0.75) / GAP);
        } else {
          const end = tr.T + SPREAD + 0.15 + FLY;
          gap = 1 - clamp01((t - end) / GAP);
          const a = (t - end - SETTLE) / WAVE;
          if (a > 0) wave = { R: easeInOutSine(clamp01(a)) * rmax, cx, cy, out: false };
          else photoVis = 0;
        }
      } else if (restPhase !== "portrait") {
        blocks = true;
        gap = 1;
        photoVis = 0;
      }
      const ms = clamp01(dis * 6);
      if (ms > 0) {
        blocks = true;
        gap = Math.max(gap, ms);
      }
      if (ms >= 1) photoVis = 0;

      // The photo is revealed (or hidden) by the same circle the blocks pop along.
      let mask = "none";
      if (wave && photoVis > 0) {
        const mx = (wave.cx - ox).toFixed(1);
        const my = (wave.cy - fy).toFixed(1);
        const a = Math.max(0, wave.R - band).toFixed(1);
        const b = Math.max(0.1, wave.R).toFixed(1);
        mask = wave.out
          ? `radial-gradient(circle at ${mx}px ${my}px, transparent ${a}px, #000 ${b}px)`
          : `radial-gradient(circle at ${mx}px ${my}px, #000 ${a}px, transparent ${b}px)`;
      }
      setPhoto(photoVis, mask);

      if (tr && t > tr.T + (tr.kind === "out" ? DUR_OUT : DUR_IN)) {
        restPhase = tr.phase;
        trans = null;
      }
      for (let j = ripples.length - 1; j >= 0; j--) if (t - ripples[j].t0 > 1.6) ripples.splice(j, 1);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssW, cssH);
      if (!blocks || dis >= 1) return;

      // Scrolling away from the resting photo: fade the blocks in over it.
      ctx.globalAlpha = !tr && restPhase === "portrait" ? ms : 1;
      const rest = poses[restPhase];

      for (let j = 0; j < P; j++) {
        let px: number;
        let py: number;
        let v: number;
        let fill: string;
        if (tr) {
          const f = tr.from;
          const to = tr.to;
          // Out: sweep left→right. Back: from the centre out.
          const order =
            tr.kind === "out" ? f.x[j] / COLS : Math.hypot(to.x[j] / COLS - 0.5, to.y[j] / rows - 0.45) * 1.4;
          const local = clamp01(
            (t - tr.T - (tr.kind === "out" ? WAVE + LEAD : 0) - order * SPREAD - r1[j] * 0.15) / FLY,
          );
          const e = easeInOut(local);
          const dx = to.x[j] - f.x[j];
          const dy = to.y[j] - f.y[j];
          const len = Math.hypot(dx, dy) || 1;
          const bow = Math.sin(Math.PI * e) * arc[j] * Math.min(1, len / 10);
          px = f.x[j] + dx * e - (dy / len) * bow;
          py = f.y[j] + dy * e + (dx / len) * bow;
          v = f.v[j] + (to.v[j] - f.v[j]) * e;
          if (e <= 0) fill = f.fill[j];
          else if (e >= 1) fill = to.fill[j];
          else {
            const k = j * 3;
            fill = rgb(
              f.c[k] + (to.c[k] - f.c[k]) * e,
              f.c[k + 1] + (to.c[k + 1] - f.c[k + 1]) * e,
              f.c[k + 2] + (to.c[k + 2] - f.c[k + 2]) * e,
            );
          }
        } else {
          px = rest.x[j];
          py = rest.y[j];
          v = rest.v[j];
          fill = rest.fill[j];
        }
        if (v <= 0.02) continue;

        let x = ox + px * cell;
        let y = oy + py * cell;
        let k = 1;
        let round = 0;

        // Image ⇄ blocks ripple: blocks swell like bubbles at the front, then pop (or settle).
        if (wave) {
          const dx = x - wave.cx;
          const dy = y - wave.cy;
          const d = Math.hypot(dx, dy) || 1;
          const behind = clamp01((wave.R - d) / band);
          let vis = wave.out ? easeOutCubic(behind) : 1 - easeInOut(behind);
          if (ms > vis) vis = ms;
          const sw = Math.exp(-((d - wave.R + band * 0.12) ** 2) / (2 * sig * sig));
          k *= vis * (1 + 1.1 * sw);
          x += (dx / d) * sw * cell * 1.2;
          y += (dy / d) * sw * cell * 1.2;
          round = sw;
        }
        // Click ripples.
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
        // Intro: drop in, top rows first.
        if (t < INTRO_END) {
          const ie = easeOutExpo(clamp01((t - (py / rows) * 0.8 - r1[j] * 0.45) / 0.9));
          if (ie < 1) {
            y -= (1 - ie) * (50 + r2[j] * 90);
            k *= ie;
          }
        }
        // Breathing wave, only once the blocks have loosened.
        k *= 1 + 0.07 * gap * Math.sin(t * 1.5 - (px + py) * 0.17);
        // Dissolve upward on scroll.
        if (dis > 0) {
          const e = dis * dis;
          y -= e * (120 + r2[j] * 420);
          x += (r1[j] - 0.5) * e * 180;
          k *= 1 - dis * 0.9;
        }

        const side = cell * (1.04 - 0.2 * gap) * Math.pow(v, 0.62) * k;
        if (side < 0.45) continue;
        ctx.fillStyle = fill;
        if (round > 0.15) {
          // Blocks riding the ripple round off into bubbles.
          ctx.beginPath();
          ctx.roundRect(x - side / 2, y - side / 2, side, side, (side / 2) * Math.min(1, round * 1.3));
          ctx.fill();
        } else ctx.fillRect(x - side / 2, y - side / 2, side, side);
      }
      ctx.globalAlpha = 1;
    };

    const loop = (now: number) => {
      raf = 0;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      if (!isStill()) clock += dt;
      draw();
      const settledAway = window.scrollY >= window.innerHeight * 0.85;
      if (visible && !settledAway && !document.hidden && !isStill()) raf = requestAnimationFrame(loop);
      else last = 0;
    };
    const wake = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(loop);
    };
    const offStill = onStillChange(wake);

    // Click: a ripple from the pointer, and (if idle) a morph that starts from there too.
    poke.current = (at) => {
      if (!poses || isStill()) return false;
      const { cell, ox, oy } = geom();
      let g: { gx: number; gy: number } | null = null;
      if (at) {
        const r = canvas.getBoundingClientRect();
        const x = ((at.x - r.left) * cssW) / r.width;
        const y = ((at.y - r.top) * cssH) / r.height;
        ripples.push({ x, y, t0: clock });
        if (ripples.length > 4) ripples.shift();
        g = { gx: (x - ox) / cell, gy: (y - oy) / cell };
      }
      if (!trans) {
        step = restPhase === "portrait" ? SCHEDULE.findIndex((s) => s.phase === "yo") : (step + 1) % SCHEDULE.length;
        start(SCHEDULE[step].phase, clock, g);
      }
      wake();
      return true;
    };

    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      wake();
    });
    io.observe(wrap);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener("scroll", wake, { passive: true });
    document.addEventListener("visibilitychange", wake);

    const family =
      getComputedStyle(document.documentElement).getPropertyValue("--font-inter-tight").trim() || "sans-serif";
    const img = new Image();
    img.decoding = "async";
    img.src = SRC;
    let cancelled = false;
    Promise.all([img.decode(), document.fonts?.ready])
      .then(() => {
        if (cancelled) return;
        rows = Math.round((COLS * img.naturalHeight) / img.naturalWidth);
        const n = COLS * rows;
        const av = sampleAvatar(img, COLS, rows);
        const cells: number[] = [];
        for (let i = 0; i < n; i++) if (av.a[i] > 0.12) cells.push(i);
        const texts = {
          yo: sampleText("YO", family, COLS, rows),
          at: sampleText("AT", family, COLS, rows),
        };
        const tcells = {
          yo: [] as number[],
          at: [] as number[],
        };
        for (const key of ["yo", "at"] as const) for (let i = 0; i < n; i++) if (texts[key][i] > 0.02) tcells[key].push(i);

        P = Math.max(cells.length, tcells.yo.length, tcells.at.length);
        r1 = new Float32Array(P);
        r2 = new Float32Array(P);
        arc = new Float32Array(P);
        for (let j = 0; j < P; j++) {
          r1[j] = Math.random();
          r2[j] = Math.random();
          arc[j] = (Math.random() < 0.5 ? -1 : 1) * (1.5 + Math.random() * 6);
        }

        // Avatar pose: one block per covered cell (spares sit invisibly on top of real ones).
        const avatar = makePose(P);
        for (let j = 0; j < P; j++) {
          const i = cells[j % cells.length];
          avatar.x[j] = (i % COLS) + 0.5;
          avatar.y[j] = Math.floor(i / COLS) + 0.5;
          avatar.v[j] = j < cells.length ? Math.min(1, av.a[i] * 1.15) : 0;
          avatar.c.set(av.col.subarray(i * 3, i * 3 + 3), j * 3);
          avatar.fill[j] = rgb(av.col[i * 3], av.col[i * 3 + 1], av.col[i * 3 + 2]);
        }

        // Text poses: blocks keep their left→right order on the way to the letters;
        // blocks the letters don't need burst outward and fade.
        const key = (x: number, y: number, r: number) => x + y * 0.15 + r * 2;
        const byKey = Array.from({ length: P }, (_, j) => j).sort(
          (a, b) => key(avatar.x[a], avatar.y[a], r1[a]) - key(avatar.x[b], avatar.y[b], r1[b]),
        );
        const cx = COLS / 2;
        const cy = rows * 0.5;
        const buildText = (field: Float32Array, list: number[]) => {
          const pose = makePose(P);
          const used = new Uint8Array(P);
          const sorted = list
            .map((i) => ({ i, k: key(i % COLS, Math.floor(i / COLS), Math.random()) }))
            .sort((a, b) => a.k - b.k);
          sorted.forEach(({ i }, k) => {
            const j = byKey[Math.floor((k * P) / sorted.length)];
            used[j] = 1;
            const v = field[i];
            const c = v > 0.42 ? INK : MIST;
            pose.x[j] = (i % COLS) + 0.5;
            pose.y[j] = Math.floor(i / COLS) + 0.5;
            pose.v[j] = v;
            pose.c.set(c, j * 3);
            pose.fill[j] = rgb(c[0], c[1], c[2]);
          });
          for (let j = 0; j < P; j++) {
            if (used[j]) continue;
            const dx = avatar.x[j] - cx;
            const dy = avatar.y[j] - cy;
            const d = Math.hypot(dx, dy) || 1;
            const dist = 6 + r2[j] * 16;
            pose.x[j] = avatar.x[j] + (dx / d) * dist + (r1[j] - 0.5) * 4;
            pose.y[j] = avatar.y[j] + (dy / d) * dist - r2[j] * 6;
            pose.v[j] = 0;
            pose.c.set(avatar.c.subarray(j * 3, j * 3 + 3), j * 3);
            pose.fill[j] = avatar.fill[j];
          }
          return pose;
        };
        poses = {
          portrait: avatar,
          yo: buildText(texts.yo, tcells.yo),
          at: buildText(texts.at, tcells.at),
        };

        // Intro: blocks drop in, then resolve into the photo.
        solid = cells.length;
        trans = {
          from: avatar,
          to: avatar,
          kind: "in",
          T: INTRO_END - SETTLE - (SPREAD + 0.15 + FLY),
          phase: "portrait",
          gx: COLS / 2,
          gy: rows * 0.55,
          reach: reachFrom(COLS / 2, rows * 0.55),
        };
        nextSwitch = trans.T + DUR_IN + SCHEDULE[0].hold;
        if (isStill()) clock = 3;
        resize();
        wake();
      })
      .catch(() => setPhoto(1));

    return () => {
      cancelled = true;
      poke.current = () => false;
      offStill();
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("scroll", wake);
      document.removeEventListener("visibilitychange", wake);
    };
  }, []);

  return <>
    <button ref={btnRef} className={`avatar-button${hello ? ' says-hello' : ''}`} aria-label="Say hello to Aryan" aria-pressed={hello}
      onClick={e=>{if(!quiet&&poke.current(e.detail?{x:e.clientX,y:e.clientY}:null))return;setHello(!hello);onPhase(hello?'portrait':'yo');}}
      onPointerMove={e=>{if(quiet)return;const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--turn',`${((e.clientX-r.left)/r.width-.5)*10}deg`);}}
      onPointerLeave={e=>e.currentTarget.style.setProperty('--turn','0deg')}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={imgRef} src={SRC} alt="Aryan smiling, wearing sunglasses and a green cap, as a sculpted avatar" width="1184" height="1344" fetchPriority="high" />
      <canvas ref={canvasRef} className="avatar-blocks" aria-hidden="true" />
      <span className="avatar-wave" aria-hidden="true">✦</span>
    </button>
    <style href="avatar" precedence="default">{`
      .avatar-button{position:absolute;inset:0;width:100%;height:100%;transform:perspective(1000px) rotateY(var(--turn,0deg));transition:transform .6s var(--ease);border-radius:40%;}
      .avatar-button img{width:100%;height:100%;object-fit:contain;object-position:bottom;filter:drop-shadow(0 25px 30px #193e3218);opacity:0;}
      .avatar-blocks{position:absolute;left:-25%;right:-25%;top:-20%;bottom:0;width:150%;height:120%;pointer-events:none;}
      .avatar-button.says-hello img{animation:avatar-hello .8s var(--ease) both;}
      .avatar-wave{position:absolute;top:20%;left:12%;font-size:70px;color:var(--green);opacity:0;transform:scale(.1) rotate(-60deg);transition:all .7s var(--ease);}
      .says-hello .avatar-wave{opacity:1;transform:scale(1) rotate(10deg);}
      @keyframes avatar-hello{0%,100%{transform:rotate(0)}35%{transform:rotate(-5deg) translateY(-15px)}65%{transform:rotate(3deg)}}
    `}</style>
  </>;
}
