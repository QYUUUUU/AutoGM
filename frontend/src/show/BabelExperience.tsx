import React, { useEffect, useRef } from "react";
import "./BabelExperience.css";

type Point = { x: number; y: number };
type Sample = Point & { s: number; nx: number; ny: number; width: number; angle: number };

const WORLD = { width: 1400, height: 36000 };

// Extended downstream with new bends to make the river much longer.
const RIVER = [
  { p0: { x: 650, y: -200 }, p1: { x: 540, y: 420 }, p2: { x: 760, y: 980 }, p3: { x: 610, y: 1700 } },
  { p0: { x: 610, y: 1700 }, p1: { x: 430, y: 2350 }, p2: { x: 610, y: 3050 }, p3: { x: 870, y: 3600 } },
  { p0: { x: 870, y: 3600 }, p1: { x: 1030, y: 3920 }, p2: { x: 920, y: 4380 }, p3: { x: 690, y: 4920 } },
  { p0: { x: 690, y: 4920 }, p1: { x: 430, y: 5510 }, p2: { x: 390, y: 6150 }, p3: { x: 590, y: 6740 } },
  { p0: { x: 590, y: 6740 }, p1: { x: 790, y: 7270 }, p2: { x: 1080, y: 7590 }, p3: { x: 990, y: 8150 } },
  { p0: { x: 990, y: 8150 }, p1: { x: 900, y: 8680 }, p2: { x: 520, y: 9050 }, p3: { x: 410, y: 9690 } },
  { p0: { x: 410, y: 9690 }, p1: { x: 330, y: 10280 }, p2: { x: 560, y: 10720 }, p3: { x: 820, y: 11180 } },
  { p0: { x: 820, y: 11180 }, p1: { x: 1070, y: 11620 }, p2: { x: 1110, y: 12120 }, p3: { x: 850, y: 12680 } },
  { p0: { x: 850, y: 12680 }, p1: { x: 560, y: 13290 }, p2: { x: 340, y: 13820 }, p3: { x: 500, y: 14480 } },
  { p0: { x: 500, y: 14480 }, p1: { x: 650, y: 15120 }, p2: { x: 1030, y: 15540 }, p3: { x: 1110, y: 16120 } },
  { p0: { x: 1110, y: 16120 }, p1: { x: 1160, y: 16720 }, p2: { x: 850, y: 17260 }, p3: { x: 570, y: 17880 } },
  { p0: { x: 570, y: 17880 }, p1: { x: 300, y: 18480 }, p2: { x: 360, y: 19140 }, p3: { x: 680, y: 19720 } },
  { p0: { x: 680, y: 19720 }, p1: { x: 940, y: 20200 }, p2: { x: 1050, y: 20780 }, p3: { x: 790, y: 21700 } },
  // Newly added segments to prolong the journey
  { p0: { x: 790, y: 21700 }, p1: { x: 530, y: 22600 }, p2: { x: 450, y: 23200 }, p3: { x: 710, y: 24100 } },
  { p0: { x: 710, y: 24100 }, p1: { x: 970, y: 25000 }, p2: { x: 1050, y: 25800 }, p3: { x: 820, y: 26700 } },
  { p0: { x: 820, y: 26700 }, p1: { x: 590, y: 27600 }, p2: { x: 490, y: 28400 }, p3: { x: 610, y: 29500 } },
  { p0: { x: 610, y: 29500 }, p1: { x: 730, y: 30600 }, p2: { x: 950, y: 31200 }, p3: { x: 850, y: 32500 } },
  { p0: { x: 850, y: 32500 }, p1: { x: 750, y: 33800 }, p2: { x: 550, y: 34500 }, p3: { x: 650, y: 36000 } }
];

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function cubic(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
  const mt = 1 - t;
  return {
    x: mt ** 3 * p0.x + 3 * mt ** 2 * t * p1.x + 3 * mt * t ** 2 * p2.x + t ** 3 * p3.x,
    y: mt ** 3 * p0.y + 3 * mt ** 2 * t * p1.y + 3 * mt * t ** 2 * p2.y + t ** 3 * p3.y,
  };
}

function sampleRiver(count = 2400): Sample[] {
  const raw: Point[] = [];
  for (let i = 0; i < count; i += 1) {
    const p = (i / (count - 1)) * RIVER.length;
    const seg = Math.min(RIVER.length - 1, Math.floor(p));
    raw.push(cubic(RIVER[seg].p0, RIVER[seg].p1, RIVER[seg].p2, RIVER[seg].p3, p - seg));
  }

  const cumulative: number[] = [0];
  for (let i = 1; i < raw.length; i += 1) {
    cumulative.push(cumulative[i - 1] + Math.hypot(raw[i].x - raw[i - 1].x, raw[i].y - raw[i - 1].y));
  }
  const total = cumulative[cumulative.length - 1];

  return raw.map((p, i) => {
    const prev = raw[Math.max(0, i - 2)];
    const next = raw[Math.min(raw.length - 1, i + 2)];
    const dx = next.x - prev.x;
    const dy = next.y - prev.y;
    const len = Math.hypot(dx, dy) || 1;
    const tx = dx / len;
    const ty = dy / len;
    const nx = -ty;
    const ny = tx;
    const t = cumulative[i] / total;
    const chapter = t < 0.16 ? 0.82 : t < 0.31 ? 1.12 : t < 0.47 ? 0.94 : t < 0.63 ? 1.38 : t < 0.79 ? 1.08 : 1.28;
    const broadVariation = 1 + 0.22 * Math.sin(t * Math.PI * 5.4 + 0.7) + 0.12 * Math.sin(t * Math.PI * 11.1 - 1.4);
    const localVariation = Math.sin(t * 37.0 + 0.8) * 0.055 + Math.sin(t * 71.0 + 2.1) * 0.025;
    const width = (128 + 122 * chapter) * broadVariation * (1 + localVariation);
    return { ...p, s: t, nx, ny, width, angle: Math.atan2(ty, tx) };
  });
}

const SAMPLES = sampleRiver();

function pointAt(s: number): Sample {
  const target = clamp(s) * (SAMPLES.length - 1);
  const i = Math.min(SAMPLES.length - 2, Math.floor(target));
  const t = target - i;
  const a = SAMPLES[i];
  const b = SAMPLES[i + 1];
  return {
    x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), s: lerp(a.s, b.s, t),
    nx: lerp(a.nx, b.nx, t), ny: lerp(a.ny, b.ny, t), width: lerp(a.width, b.width, t), angle: lerp(a.angle, b.angle, t),
  };
}

function visibleSampleSlice(cameraY: number, halfWorld: number) {
  const approx = clamp(cameraY / WORLD.height, 0, 1);
  const center = Math.floor(approx * (SAMPLES.length - 1));
  const padding = Math.ceil((halfWorld / WORLD.height) * SAMPLES.length * 2.8) + 18;
  const from = Math.max(0, center - padding);
  const to = Math.min(SAMPLES.length, center + padding);
  return { samples: SAMPLES.slice(from, to), from };
}

type Vegetation = { s: number; side: -1 | 1; offset: number; kind: 0 | 1 | 2; scale: number; phase: number };
type Sandbar = { s: number; side: -1 | 1; offset: number; size: number; phase: number };

const VEGETATION: Vegetation[] = (() => {
  const out: Vegetation[] = [];
  let seed = 9371;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  // Increased count for longer river
  for (let i = 0; i < 900; i += 1) {
    const s = 0.012 + rand() * 0.972;
    const sectionDensity = s < 0.20 ? 0.72 : s < 0.42 ? 1.02 : s < 0.68 ? 1.28 : s < 0.84 ? 1.12 : 0.92;
    if (rand() > sectionDensity * 0.68) continue;
    const side = rand() > 0.5 ? 1 : -1;
    const p = pointAt(s);
    const nearWater = rand() ** 1.7;
    // Guaranteed to not overlap the river width (p.width) plus maximum shrub scale radius
    const offset = p.width + 55 + (nearWater * 2.45 * p.width) + rand() * 40;
    const kind = rand() < 0.68 ? 0 : 1;
    const scale = 0.72 + rand() * 1.45;
    out.push({ s, side, offset, kind, scale, phase: rand() * Math.PI * 2 });
  }
  return out.sort((a, b) => a.s - b.s);
})();

const SANDBARS: Sandbar[] = (() => {
  const out: Sandbar[] = [];
  let seed = 4451;
  const rand = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  for (let i = 0; i < 45; i += 1) {
    const s = 0.02 + rand() * 0.96;
    const p = pointAt(s);
    const side = rand() > 0.5 ? 1 : -1;
    // Kept inside the river footprint
    const offset = rand() * p.width * 0.55; 
    const size = 0.5 + rand() * 1.2;
    out.push({ s, side, offset, size, phase: rand() * Math.PI * 2 });
  }
  return out.sort((a, b) => a.s - b.s);
})();

function visibleVegetation(cameraY: number, viewHalfWorld: number) {
  return VEGETATION.filter((v) => Math.abs(pointAt(v.s).y - cameraY) < viewHalfWorld * 1.35);
}

function visibleSandbars(cameraY: number, viewHalfWorld: number) {
  return SANDBARS.filter((b) => Math.abs(pointAt(b.s).y - cameraY) < viewHalfWorld * 1.35);
}

function drawShrub(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, phase: number, riverWidth: number) {
  ctx.save();
  ctx.translate(x, y);
  const size = Math.max(0.65, riverWidth / 150) * scale;
  ctx.scale(size, size * (0.72 + 0.18 * Math.sin(phase)));
  ctx.globalAlpha = 0.64;
  ctx.fillStyle = '#566447';
  ctx.beginPath();
  ctx.ellipse(-26, 4, 30, 15, phase * 0.6, 0, Math.PI * 2);
  ctx.ellipse(2, -4, 34, 18, -phase * 0.35, 0, Math.PI * 2);
  ctx.ellipse(29, 5, 27, 14, phase * 0.42, 0, Math.PI * 2);
  ctx.ellipse(0, -15, 25, 17, phase * 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 0.40;
  ctx.fillStyle = '#83915d';
  ctx.beginPath();
  ctx.ellipse(-6, -14, 22, 7, phase, 0, Math.PI * 2);
  ctx.ellipse(25, 0, 14, 5, -phase, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawReeds(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, phase: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.strokeStyle = '#708257';
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.58;
  for (let i = -3; i <= 3; i += 1) {
    ctx.beginPath();
    ctx.moveTo(i * 3, 7);
    ctx.quadraticCurveTo(i * 2 + Math.sin(phase + i) * 3, -2, i * 2.2 + Math.sin(phase + i) * 4, -13 - (i % 2) * 4);
    ctx.stroke();
  }
  ctx.restore();
}

function polygonPath(ctx: CanvasRenderingContext2D, points: Point[]) {
  if (!points.length) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i].x, points[i].y);
  ctx.closePath();
}

function smoothPath(ctx: CanvasRenderingContext2D, points: Point[]) {
  if (points.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length - 1; i += 1) {
    const midX = (points[i].x + points[i + 1].x) / 2;
    const midY = (points[i].y + points[i + 1].y) / 2;
    ctx.quadraticCurveTo(points[i].x, points[i].y, midX, midY);
  }
  const last = points[points.length - 1];
  ctx.lineTo(last.x, last.y);
}

function drawBrushStroke(ctx: CanvasRenderingContext2D, sampleIndex: number, offset: number, length: number, width: number, alpha: number, color: string, phase: number) {
  const points: Point[] = [];
  const step = Math.max(2, Math.floor(length / 14));
  for (let d = 0; d <= length; d += step) {
    const idx = Math.max(0, Math.min(SAMPLES.length - 1, sampleIndex + (d / length) * 28));
    const a = SAMPLES[Math.floor(idx)];
    const b = SAMPLES[Math.min(SAMPLES.length - 1, Math.floor(idx) + 1)];
    const f = idx - Math.floor(idx);
    const x = lerp(a.x, b.x, f);
    const y = lerp(a.y, b.y, f);
    const nX = lerp(a.nx, b.nx, f);
    const nY = lerp(a.ny, b.ny, f);
    const wobble = Math.sin(d * 0.025 + phase) * 2.4 + Math.sin(d * 0.061 + phase * 1.7) * 1.2;
    points.push({ x: x + nX * (offset + wobble), y: y + nY * (offset + wobble) });
  }
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  smoothPath(ctx, points);
  ctx.stroke();
  ctx.restore();
}

function drawWaterRibbon(ctx: CanvasRenderingContext2D, samples: Sample[], side: number, inner: number, outer: number, color: string, alpha: number, phase: number) {
  const a: Point[] = [];
  const b: Point[] = [];
  for (let i = 0; i < samples.length; i += 1) {
    const s = samples[i];
    const wave = Math.sin(i * 0.037 + phase) * 0.035 + Math.sin(i * 0.083 + phase * 1.7) * 0.018;
    const innerW = s.width * (inner + wave);
    const outerW = s.width * (outer + wave * 0.7);
    a.push({ x: s.x + s.nx * side * innerW, y: s.y + s.ny * side * innerW });
    b.push({ x: s.x + s.nx * side * outerW, y: s.y + s.ny * side * outerW });
  }
  polygonPath(ctx, [...a, ...b.reverse()]);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.fill();
}

function RiverCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef({ progress: 0, target: 0, camera: pointAt(0.03), time: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let raf = 0;
    let reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const readScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      stateRef.current.target = clamp(window.scrollY / max);
    };
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMedia = () => { reduced = media.matches; };
    const onResize = () => { resize(); };

    function resize() {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(timeMs: number) {
      const state = stateRef.current;
      state.time = timeMs * 0.001;
      state.progress += (state.target - state.progress) * (reduced ? 0.16 : 0.075);
      const target = pointAt(0.035 + state.progress * 0.91);
      state.camera.x += (target.x - state.camera.x) * 0.075;
      state.camera.y += (target.y + 22 - state.camera.y) * 0.075;

      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const scale = Math.min(w / 1000, h / 700);
      const time = state.time;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = "#151512";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(scale, 0, 0, scale, w / 2, h / 2);

      const look = pointAt(clamp(0.035 + state.progress * 0.91 + 0.012));
      const angle = Math.atan2(look.y - state.camera.y, look.x - state.camera.x);
      const cinematicRotation = clamp(angle + Math.PI / 2, -0.22, 0.22) * 0.18;
      ctx.rotate(-cinematicRotation);
      ctx.translate(-state.camera.x, -state.camera.y);

      const visible = visibleSampleSlice(state.camera.y, (h / Math.max(0.001, scale)) * 0.5);
      const localSamples = visible.samples;

      // Painted desert ground base layer
      ctx.fillStyle = "#171713";
      ctx.fillRect(-300, -400, WORLD.width + 600, WORLD.height + 800);
      
      const desertMasses = [
        [180, 700, 520, 900, "#27251d", 0.56], [1150, 1700, 500, 1100, "#24221b", 0.44],
        [170, 3900, 560, 1050, "#29271f", 0.48], [1170, 6100, 500, 1200, "#24221b", 0.42],
        [170, 8600, 600, 1250, "#2a281f", 0.46], [1190, 11200, 520, 1350, "#25231c", 0.48],
        [150, 13700, 580, 1200, "#29271f", 0.44], [1200, 16000, 540, 1400, "#24221b", 0.45],
        [170, 18800, 600, 1250, "#2a281f", 0.46], [1180, 21000, 520, 1100, "#25231c", 0.43],
        // Additional dunes for longer journey
        [200, 24000, 580, 1150, "#26241c", 0.47], [1150, 27500, 520, 1300, "#23211a", 0.42],
        [150, 30500, 600, 1400, "#2a281f", 0.46], [1200, 33500, 550, 1200, "#26241d", 0.44],
      ] as const;
      for (const [x, y, rx, ry, color, alpha] of desertMasses) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(rx, ry);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(0, 0, 1, 1, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      const leftOuter: Point[] = [];
      const rightOuter: Point[] = [];
      const leftFertile: Point[] = [];
      const rightFertile: Point[] = [];
      const leftInner: Point[] = [];
      const rightInner: Point[] = [];
      for (let i = 0; i < localSamples.length; i += 1) {
        const s = localSamples[i];
        const organic = Math.sin(i * 0.021 + 1.2) * 9 + Math.sin(i * 0.057) * 4;
        const bankW = s.width * 1.28 + 26 + organic;
        const fertileW = s.width * (2.15 + 0.20 * Math.sin(i * 0.018)) + 105 + organic * 0.7;
        const innerW = s.width + 4 + Math.sin(i * 0.043) * 2.5;
        leftOuter.push({ x: s.x + s.nx * bankW, y: s.y + s.ny * bankW });
        rightOuter.push({ x: s.x - s.nx * bankW, y: s.y - s.ny * bankW });
        leftFertile.push({ x: s.x + s.nx * fertileW, y: s.y + s.ny * fertileW });
        rightFertile.push({ x: s.x - s.nx * fertileW, y: s.y - s.ny * fertileW });
        leftInner.push({ x: s.x + s.nx * innerW, y: s.y + s.ny * innerW });
        rightInner.push({ x: s.x - s.nx * innerW, y: s.y - s.ny * innerW });
      }

      // Wet earth
      polygonPath(ctx, [...leftOuter, ...rightOuter.slice().reverse()]);
      ctx.fillStyle = "#312f26";
      ctx.globalAlpha = 0.92;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Fertile paint corridor
      polygonPath(ctx, [...leftFertile, ...leftOuter.slice().reverse()]);
      ctx.fillStyle = "#596747";
      ctx.globalAlpha = 0.56;
      ctx.fill();
      polygonPath(ctx, [...rightFertile, ...rightOuter.slice().reverse()]);
      ctx.fillStyle = "#69704b";
      ctx.globalAlpha = 0.28;
      ctx.fill();
      ctx.globalAlpha = 1;

      // NEW: Greener, procedural painterly patches overlaying the wet earth (not everywhere)
      for (let i = 0; i < localSamples.length; i += 5) {
        const s = localSamples[i];
        // Create noise to restrict where the greener sections appear
        const greenFactor = Math.sin(s.s * 170) + Math.cos(s.s * 432); 
        if (greenFactor > 0.6) {
          const bankW = s.width * 1.2 + 40;
          ctx.save();
          ctx.translate(s.x, s.y);
          ctx.rotate(s.angle);
          ctx.fillStyle = "#4f633d"; // brighter/greener
          ctx.globalAlpha = 0.25 * (greenFactor - 0.6);
          ctx.beginPath();
          ctx.ellipse(0, bankW, 90, 45, 0, 0, Math.PI * 2);
          ctx.ellipse(0, -bankW, 90, 45, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // Soft dry-vegetation masses feather the fertile corridor into desert
      for (let i = 0; i < 28; i += 1) { // Increased iterations
        const s = 0.015 + i * 0.035;
        const p = pointAt(s);
        for (const side of [-1, 1] as const) {
          ctx.save();
          ctx.translate(p.x - p.nx * side * (p.width * 2.8 + 150), p.y - p.ny * side * (p.width * 2.8 + 150));
          ctx.rotate(p.angle);
          ctx.scale(2.3, 0.65);
          ctx.globalAlpha = 0.07;
          ctx.fillStyle = "#716b48";
          ctx.beginPath();
          ctx.ellipse(0, 0, 120, 34, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // Water body contour
      const waterLeft: Point[] = [];
      const waterRight: Point[] = [];
      for (let i = 0; i < localSamples.length; i += 1) {
        const s = localSamples[i];
        const edgeWobble = Math.sin(i * 0.11) * 3.5 + Math.sin(i * 0.031 + 2.4) * 4.2;
        const wl = s.width + edgeWobble;
        waterLeft.push({ x: s.x + s.nx * wl, y: s.y + s.ny * wl });
        waterRight.push({ x: s.x - s.nx * (wl + 1.8 * Math.sin(i * 0.047)), y: s.y - s.ny * (wl + 1.8 * Math.sin(i * 0.047)) });
      }
      polygonPath(ctx, [...waterLeft, ...waterRight.reverse()]);
      const waterGrad = ctx.createLinearGradient(0, -120, 0, 180);
      waterGrad.addColorStop(0, "#425c61");
      waterGrad.addColorStop(0.38, "#354e54");
      waterGrad.addColorStop(0.72, "#2d444a");
      waterGrad.addColorStop(1, "#263c42");
      ctx.fillStyle = waterGrad;
      ctx.fill();

      // Shallow water painted inside the edge
      ctx.save();
      polygonPath(ctx, [...waterLeft, ...waterRight.slice().reverse()]);
      ctx.clip();
      for (const side of [-1, 1] as const) {
        const shallow: Point[] = [];
        const inner: Point[] = [];
        for (let i = 0; i < localSamples.length; i += 1) {
          const s = localSamples[i];
          const amount = s.width * (0.72 + 0.05 * Math.sin(i * 0.031));
          shallow.push({ x: s.x + s.nx * side * amount, y: s.y + s.ny * side * amount });
          inner.push({ x: s.x + s.nx * side * (s.width * 0.34), y: s.y + s.ny * side * (s.width * 0.34) });
        }
        polygonPath(ctx, [...shallow, ...inner.reverse()]);
        ctx.fillStyle = side === 1 ? "#657267" : "#596a66";
        ctx.globalAlpha = 0.12;
        ctx.fill();
      }
      ctx.restore();

      // Broad painted water washes
      ctx.save();
      polygonPath(ctx, [...waterLeft, ...waterRight.slice().reverse()]);
      ctx.clip();
      drawWaterRibbon(ctx, localSamples, 1, 0.08, 0.62, '#5e7473', 0.14, 0.8);
      drawWaterRibbon(ctx, localSamples, -1, 0.18, 0.78, '#617a79', 0.09, 2.6);
      drawWaterRibbon(ctx, localSamples, 1, -0.18, 0.30, '#8a9990', 0.075, 4.1);
      drawWaterRibbon(ctx, localSamples, -1, -0.34, 0.08, '#b0b5a6', 0.045, 5.7);

      // Deep painted masses
      for (let i = 0; i < 14; i += 1) {
        const s = pointAt(0.04 + i * 0.08);
        const radius = 130 + 50 * Math.sin(i * 2.2);
        ctx.save();
        ctx.translate(s.x + s.nx * Math.sin(i) * 24, s.y + s.ny * Math.cos(i) * 18);
        ctx.rotate(s.angle);
        ctx.scale(1.7, 0.7);
        ctx.globalAlpha = 0.12 + (i % 3) * 0.025;
        ctx.fillStyle = i % 2 ? "#172a31" : "#42575a";
        ctx.beginPath();
        ctx.ellipse(0, 0, radius, radius * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.restore(); // Exit water clip for sandbars to potentially break surface visually slightly

      // NEW: Draw occasional sandbars inside the water stream
      const viewHalfWorld = (h / Math.max(0.001, scale)) * 0.5;
      for (const b of visibleSandbars(state.camera.y, viewHalfWorld)) {
        const p = pointAt(b.s);
        ctx.save();
        ctx.translate(p.x + p.nx * b.side * b.offset, p.y + p.ny * b.side * b.offset);
        ctx.rotate(p.angle);
        ctx.scale(b.size * 1.5, b.size * 0.65);
        ctx.globalAlpha = 0.95;
        
        // Base sand color
        ctx.fillStyle = "#585240";
        ctx.beginPath();
        ctx.ellipse(0, 0, 24, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        // Highlight/texture mark
        ctx.fillStyle = "#69634e";
        ctx.beginPath();
        ctx.ellipse(3, -2, 16, 9, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Restore clipping to draw animated strokes cleanly inside water
      ctx.save();
      polygonPath(ctx, [...waterLeft, ...waterRight.slice().reverse()]);
      ctx.clip();
      
      // Slow broad washes breathing downstream
      for (let i = 0; i < 5; i += 1) {
        const base = (i * 0.19 + time * (0.003 + i * 0.0005)) % 0.86 + 0.04;
        const p = pointAt(base);
        const drift = Math.sin(time * 0.13 + i * 2.3) * 18;
        ctx.save();
        ctx.translate(p.x + p.nx * drift, p.y + p.ny * drift);
        ctx.rotate(p.angle);
        ctx.scale(1.9, 0.55);
        ctx.globalAlpha = 0.045 + 0.012 * Math.sin(time * 0.18 + i);
        const g = ctx.createLinearGradient(-180, 0, 180, 0);
        g.addColorStop(0, "rgba(103,121,119,0)");
        g.addColorStop(0.45, "rgba(103,121,119,.55)");
        g.addColorStop(1, "rgba(103,121,119,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(0, 0, 180, 52, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Irregular brush marks
      const mobile = w < 700;
      const count = mobile ? 13 : 22;
      for (let i = 0; i < count; i += 1) {
        const speed = 0.0022 + (i % 5) * 0.00065;
        const s = (i / count * 0.93 + time * speed) % 0.92 + 0.035;
        const p = pointAt(s);
        const side = Math.sin(i * 7.31) * p.width * 0.58;
        const len = 48 + (i % 6) * 22;
        const width = 1.8 + (i % 4) * 0.8;
        drawBrushStroke(ctx, Math.floor(s * (SAMPLES.length - 30)), side, len, width, 0.10 + (i % 3) * 0.025, i % 3 ? "#839391" : "#5e7373", i * 1.7);
      }

      // Secondary hand-painted flow
      const broadCount = mobile ? 6 : 10;
      for (let i = 0; i < broadCount; i += 1) {
        const speed = 0.0010 + (i % 4) * 0.00033;
        const s = (0.09 + i / broadCount * 0.82 + time * speed) % 0.90 + 0.045;
        const p = pointAt(s);
        const side = Math.sin(i * 4.7 + 0.6) * p.width * 0.42;
        drawBrushStroke(ctx, Math.floor(s * (SAMPLES.length - 30)), side, 105 + (i % 3) * 42, 4.5 + (i % 3) * 1.2, 0.055 + (i % 2) * 0.018, i % 2 ? '#78908d' : '#91a29b', i * 2.8 + 0.5);
      }
      ctx.restore();

      // Small authored vocabulary of reeds, shrubs, strictly avoiding water overlap
      for (const v of visibleVegetation(state.camera.y, viewHalfWorld)) {
        const p = pointAt(v.s);
        const ecological = clamp(1.35 - v.offset / Math.max(1, p.width * 3.3), 0, 1);
        const x = p.x - p.nx * v.side * v.offset;
        const y = p.y - p.ny * v.side * v.offset;
        if (v.kind === 1 && ecological > 0.12) drawReeds(ctx, x, y, v.scale * (0.72 + ecological * 0.55), v.phase);
        else if (ecological > 0.035) drawShrub(ctx, x, y, v.scale * (0.72 + ecological * 0.72), v.phase, p.width);
      }

      // Soft bank edge highlights
      ctx.save();
      ctx.globalAlpha = 0.11;
      ctx.strokeStyle = "#8a8e79";
      ctx.lineWidth = 2.4;
      smoothPath(ctx, leftInner);
      ctx.stroke();
      ctx.globalAlpha = 0.10;
      smoothPath(ctx, rightInner);
      ctx.stroke();
      ctx.restore();

      // Atmospheric falloff
      const vignette = ctx.createRadialGradient(500, 350, 150, 500, 350, 700);
      vignette.addColorStop(0, "rgba(10,11,10,0)");
      vignette.addColorStop(0.72, "rgba(10,11,10,0.04)");
      vignette.addColorStop(1, "rgba(5,6,5,0.42)");
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);

      raf = requestAnimationFrame(draw);
    }

    readScroll();
    resize();
    window.addEventListener("scroll", readScroll, { passive: true });
    window.addEventListener("resize", onResize);
    media.addEventListener?.("change", onMedia);
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", readScroll);
      window.removeEventListener("resize", onResize);
      media.removeEventListener?.("change", onMedia);
    };
  }, []);

  return <canvas ref={canvasRef} className="siirh-canvas" aria-hidden="true" />;
}

export default function BabelExperience() {
  return (
    <main className="babel-experience" aria-label="Babel — Le Siirh">
      <div className="babel-stage">
        <RiverCanvas />
      </div>
      <div className="babel-scroll-space" aria-hidden="true" />
    </main>
  );
}