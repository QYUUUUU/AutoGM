import React, { useEffect, useRef } from "react";
import "./BabelExperience.css";

type Point = { x: number; y: number };
type Sample = Point & { s: number; nx: number; ny: number; width: number; angle: number };

const WORLD = { width: 1400, height: 40000 };

// Extended and dramatically widened river coordinates to ensure much more
// side-to-side movement while traveling top-to-bottom.
const RIVER = [
  { p0: { x: 650, y: -200 }, p1: { x: 400, y: 800 }, p2: { x: 1500, y: 1200 }, p3: { x: 1300, y: 2200 } },
  { p0: { x: 1300, y: 2200 }, p1: { x: 1100, y: 3200 }, p2: { x: -400, y: 3800 }, p3: { x: -100, y: 4800 } },
  { p0: { x: -100, y: 4800 }, p1: { x: 200, y: 5800 }, p2: { x: 1800, y: 6200 }, p3: { x: 1600, y: 7200 } },
  { p0: { x: 1600, y: 7200 }, p1: { x: 1400, y: 8200 }, p2: { x: -200, y: 8800 }, p3: { x: 200, y: 9800 } },
  { p0: { x: 200, y: 9800 }, p1: { x: 600, y: 10800 }, p2: { x: 2400, y: 11200 }, p3: { x: 2000, y: 12200 } },
  { p0: { x: 2000, y: 12200 }, p1: { x: 1600, y: 13200 }, p2: { x: -800, y: 13800 }, p3: { x: -300, y: 14800 } },
  { p0: { x: -300, y: 14800 }, p1: { x: 200, y: 15800 }, p2: { x: 1600, y: 16200 }, p3: { x: 1900, y: 17200 } },
  { p0: { x: 1900, y: 17200 }, p1: { x: 2200, y: 18200 }, p2: { x: 500, y: 18800 }, p3: { x: 800, y: 19800 } },
  { p0: { x: 800, y: 19800 }, p1: { x: 1100, y: 20800 }, p2: { x: 2500, y: 21200 }, p3: { x: 2100, y: 22200 } },
  { p0: { x: 2100, y: 22200 }, p1: { x: 1700, y: 23200 }, p2: { x: -600, y: 23800 }, p3: { x: -100, y: 24800 } },
  { p0: { x: -100, y: 24800 }, p1: { x: 400, y: 25800 }, p2: { x: 1800, y: 26200 }, p3: { x: 1500, y: 27200 } },
  { p0: { x: 1500, y: 27200 }, p1: { x: 1200, y: 28200 }, p2: { x: -400, y: 28800 }, p3: { x: 200, y: 29800 } },
  { p0: { x: 200, y: 29800 }, p1: { x: 800, y: 30800 }, p2: { x: 2200, y: 31200 }, p3: { x: 1800, y: 32200 } },
  { p0: { x: 1800, y: 32200 }, p1: { x: 1400, y: 33200 }, p2: { x: 100, y: 33800 }, p3: { x: 600, y: 34800 } },
  { p0: { x: 600, y: 34800 }, p1: { x: 1100, y: 35800 }, p2: { x: 2400, y: 36200 }, p3: { x: 2000, y: 37200 } },
  { p0: { x: 2000, y: 37200 }, p1: { x: 1600, y: 38200 }, p2: { x: 300, y: 38800 }, p3: { x: 650, y: 39800 } }
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

function sampleRiver(count = 3500): Sample[] {
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

// Improved to dynamically find the correct samples based purely on camera Y
function visibleSampleSlice(cameraY: number, halfWorld: number) {
  let centerIdx = 0;
  let minDiff = Infinity;
  // Jump search to find closest Y
  for (let i = 0; i < SAMPLES.length; i += 20) {
    const diff = Math.abs(SAMPLES[i].y - cameraY);
    if (diff < minDiff) { minDiff = diff; centerIdx = i; }
  }
  
  let from = centerIdx;
  while (from > 0 && Math.abs(SAMPLES[from].y - cameraY) < halfWorld * 1.5) from--;
  
  let to = centerIdx;
  while (to < SAMPLES.length - 1 && Math.abs(SAMPLES[to].y - cameraY) < halfWorld * 1.5) to++;
  
  return { samples: SAMPLES.slice(from, to + 1), from };
}

// Generate thousands of lightweight procedural strokes to give it a rich painterly feel
type Stroke = { sBase: number, sideRel: number, len: number, width: number, alpha: number, color: string, speed: number };

const WATER_STROKES: Stroke[] = Array.from({ length: 6200 }).map(() => ({
  sBase: Math.random(), sideRel: (Math.random() - 0.5) * 1.92, len: 22 + Math.random() ** 0.65 * 150,
  width: 1.2 + Math.random() ** 1.7 * 10, alpha: 0.08 + Math.random() * 0.28,
  color: ['#d8f3dc','#b7e4c7','#74c69d','#52b69a','#168aad','#1a759f','#184e77'][Math.floor(Math.random()*7)],
  speed: 0.00025 + Math.random() * 0.00125, phase: Math.random() * Math.PI * 2
}));

const DESERT_STROKES: Stroke[] = Array.from({ length: 4000 }).map(() => {
  const side = Math.random() > 0.5 ? 1 : -1;
  const offsetRel = 1.3 + Math.random() * 10;
  return {
    sBase: Math.random(),
    sideRel: side * offsetRel,
    len: 50 + Math.random() * 150,
    width: 15 + Math.random() * 45,
    alpha: 0.12 + Math.random() * 0.2,
    color: ['#d4a373', '#e8cda8', '#c8935a', '#b57c42', '#e3c099'][Math.floor(Math.random() * 5)],
    speed: 0
  };
});

function drawFastCurveStroke(ctx: CanvasRenderingContext2D, sBase: number, offsetRel: number, len: number, width: number, alpha: number, color: string) {
  const s = clamp(sBase), sMid = clamp(sBase + len / 70000), sEnd = clamp(sBase + len / 34000);
  const p1 = pointAt(s), pm = pointAt(sMid), p2 = pointAt(sEnd);
  ctx.globalAlpha = alpha; ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
  ctx.moveTo(p1.x + p1.nx * offsetRel * p1.width, p1.y + p1.ny * offsetRel * p1.width);
  ctx.quadraticCurveTo(pm.x + pm.nx * offsetRel * pm.width, pm.y + pm.ny * offsetRel * pm.width, p2.x + p2.nx * offsetRel * p2.width, p2.y + p2.ny * offsetRel * p2.width); ctx.stroke();
}

function drawRiverBrushField(ctx: CanvasRenderingContext2D, localSamples: Sample[], time: number, cameraY: number, viewHalfWorld: number) {
  ctx.save();
  polygonPath(ctx, [...localSamples.map(s=>({x:s.x+s.nx*s.width,y:s.y+s.ny*s.width})), ...localSamples.slice().reverse().map(s=>({x:s.x-s.nx*s.width,y:s.y-s.ny*s.width}))]);
  ctx.clip();
  for (let i=0;i<950;i++) { const ss=(i*0.00113+time*0.00008)%1,p=pointAt(ss); if(Math.abs(p.y-cameraY)>viewHalfWorld*1.35) continue; drawFastCurveStroke(ctx,ss,Math.sin(i*2.17)*0.42,90+(i%7)*35,16+(i%11)*2.2,0.035,i%2?'#74c69d':'#1a759f'); }
  for (const stroke of WATER_STROKES) { const ss=(stroke.sBase+time*stroke.speed)%1,p=pointAt(ss); if(Math.abs(p.y-cameraY)>viewHalfWorld*1.45) continue; drawFastCurveStroke(ctx,ss,stroke.sideRel,stroke.len,stroke.width,stroke.alpha,stroke.color); if(stroke.width>5&&Math.floor(stroke.sBase*997)%5===0) drawFastCurveStroke(ctx,ss+0.0004,stroke.sideRel*0.94,stroke.len*0.72,stroke.width*0.42,stroke.alpha*0.6,'#d8f3dc'); }
  for (let i=0;i<1900;i++) { const ss=(i*0.00057+time*0.00035)%1,p=pointAt(ss); if(Math.abs(p.y-cameraY)>viewHalfWorld*1.35) continue; drawFastCurveStroke(ctx,ss,Math.sin(i*1.71)*0.78,12+(i%8)*7,1+(i%4)*0.75,0.10+(i%5)*0.025,i%3?'#b7e4c7':'#e9f5db'); }
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

function RiverCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef({ progress: 0, target: 0, camera: pointAt(0.01), time: 0 });

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
      
      // Ensure the camera rigidly tracks the curve using progression cleanly mapped 0-1
      const safeProgress = clamp(0.01 + state.progress * 0.98);
      const target = pointAt(safeProgress);
      state.camera.x += (target.x - state.camera.x) * 0.085;
      state.camera.y += (target.y + 20 - state.camera.y) * 0.085;

      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const scale = Math.min(w / 1000, h / 700);
      const time = state.time;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = "#e3c099"; // Replaced stark black with bright warm desert sand
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(scale, 0, 0, scale, w / 2, h / 2);

      const look = pointAt(clamp(safeProgress + 0.01));
      const angle = Math.atan2(look.y - state.camera.y, look.x - state.camera.x);
      const cinematicRotation = clamp(angle + Math.PI / 2, -0.22, 0.22) * 0.15;
      ctx.rotate(-cinematicRotation);
      ctx.translate(-state.camera.x, -state.camera.y);

      const viewHalfWorld = (h / Math.max(0.001, scale)) * 0.5;
      const visible = visibleSampleSlice(state.camera.y, viewHalfWorld);
      const localSamples = visible.samples;

      // Draw thousands of background desert paint strokes
      for (const stroke of DESERT_STROKES) {
        if (Math.abs(pointAt(stroke.sBase).y - state.camera.y) < viewHalfWorld * 1.5) {
          drawFastCurveStroke(ctx, stroke.sBase, stroke.sideRel, stroke.len, stroke.width, stroke.alpha, stroke.color);
        }
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
      ctx.fillStyle = "#8a5a44"; // Rich wet brown 
      ctx.globalAlpha = 0.92;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Dry desert transition bands — no vegetation corridor.
      polygonPath(ctx, [...leftFertile, ...leftOuter.slice().reverse()]); ctx.fillStyle = "#c8935a"; ctx.globalAlpha = 0.20; ctx.fill();
      polygonPath(ctx, [...rightFertile, ...rightOuter.slice().reverse()]); ctx.fillStyle = "#b57c42"; ctx.globalAlpha = 0.16; ctx.fill(); ctx.globalAlpha = 1;

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
      ctx.fillStyle = "#216f82"; // Deep painted river base
      ctx.fill();

      // Shallow water edges
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
        ctx.fillStyle = side === 1 ? "#264653" : "#1d3557";
        ctx.globalAlpha = 0.25;
        ctx.fill();
      }
      
      drawRiverBrushField(ctx, localSamples, time, state.camera.y, viewHalfWorld);

      ctx.restore(); // Exit clip

      // Soft bank edge highlights
      ctx.save();
      ctx.globalAlpha = 0.25;
      ctx.strokeStyle = "#e8cda8";
      ctx.lineWidth = 3.5;
      smoothPath(ctx, leftInner);
      ctx.stroke();
      ctx.globalAlpha = 0.15;
      smoothPath(ctx, rightInner);
      ctx.stroke();
      ctx.restore();

      // Vignette effect has been strictly removed here per request.

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
