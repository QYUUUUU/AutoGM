import type { FlowMood, StoryScene } from "./schema";

/**
 * COMPOSITION LAYER
 * -----------------
 * The old version of this file mapped every scene to one of six fixed
 * "motif" presets (panel-left, panel-right, ...). That produced the
 * same rectangle, recycled, regardless of what the scene actually
 * needed — which is exactly the complaint: shapes that don't serve
 * the composition.
 *
 * This version authors the stage per scene, by id. Every element's
 * presence is a decision:
 *
 * - `carrier`  a rectangular plate. It only appears where it is doing
 *              a job — matting an image, or giving a reading column a
 *              surface to sit on. It is OFF for the two "just look at
 *              this" beats (arrival, finale) because the image or the
 *              eclipse already IS the composition there.
 * - `spine`    a thin vertical rule marking the boundary between "the
 *              world as it stands" and the content. It runs through
 *              Act I (arrival → old-gods), drops out for the private,
 *              interior `amuzazels` beat, disappears entirely for the
 *              rupture, and returns fainter afterward — a visual echo
 *              of "the world is not what it was."
 * - `ring`     a concentric-circle mark. It appears exactly twice:
 *              `society` (a caste hierarchy — rings of status) and
 *              `sabaah`, which the sourcebook itself describes as
 *              "trois grands secteurs concentriques." Everywhere else
 *              it stays off; it is a diagram, not a decoration.
 * - numeral    a giant, near-invisible chapter digit, present only for
 *              the informational beats (reading-quiet / visual-split),
 *              silent during the cinematic and rupture beats.
 * - watermark  a huge, low-opacity background word naming the beat's
 *              subject. It goes explicitly silent at the black sun —
 *              the one moment the whole stage empties down to just
 *              the eclipse.
 *
 * None of this animates itself — OriginExperience.tsx reads these
 * targets and tweens real, persistent DOM nodes toward them with GSAP.
 */

export interface CarrierTarget {
  top: string;
  left: string;
  width: string;
  height: string;
  borderRadius: string;
  background: string;
  opacity: number;
}

export interface SpineTarget {
  top: string;
  left: string;
  height: string;
  opacity: number;
  scaleY: number;
}

export interface RingTarget {
  top: string;
  left: string;
  size: string;
  opacity: number;
  scale: number;
}

export interface CastFrame {
  carrier: CarrierTarget;
  spine: SpineTarget;
  ring: RingTarget;
  /** Whether the corner chapter-numeral is allowed to show for this beat. */
  showNumeral: boolean;
}

const CARRIER_OFF: CarrierTarget = {
  top: "40vh",
  left: "50vw",
  width: "0vw",
  height: "0vh",
  borderRadius: "0px",
  background: "rgba(0,0,0,0)",
  opacity: 0,
};

const SPINE_OFF: SpineTarget = { top: "0", left: "50vw", height: "0vh", opacity: 0, scaleY: 0 };
const RING_OFF: RingTarget = { top: "50vh", left: "50vw", size: "0vw", opacity: 0, scale: 0.6 };

/** Bespoke composition, authored scene-by-scene against the actual
 * Babel content. Keyed by `StoryScene.id`. */
const BABEL_CAST: Record<string, CastFrame> = {
  arrival: {
    // The image carries this beat. No plate to compete with it — just
    // the spine, staking out where "content" will begin.
    carrier: CARRIER_OFF,
    spine: { top: "0", left: "56vw", height: "100vh", opacity: 0.3, scaleY: 1 },
    ring: RING_OFF,
    showNumeral: false,
  },
  kingdom: {
    // A quiet reading beat: the carrier gives the centered column a
    // surface, nothing else on stage.
    carrier: { top: "9vh", left: "27vw", width: "46vw", height: "82vh", borderRadius: "18px", background: "rgba(10,8,6,0.34)", opacity: 1 },
    spine: { top: "0", left: "56vw", height: "100vh", opacity: 0.22, scaleY: 1 },
    ring: RING_OFF,
    showNumeral: true,
  },
  society: {
    // Caste hierarchy — rendered as rings of status, not a rectangle.
    // The carrier here does one job only: mat the image.
    carrier: { top: "12vh", left: "54vw", width: "40vw", height: "76vh", borderRadius: "6px", background: "rgba(255,255,255,0.03)", opacity: 1 },
    spine: { top: "0", left: "50vw", height: "100vh", opacity: 0.16, scaleY: 1 },
    ring: { top: "46vh", left: "74vw", size: "34vw", opacity: 0.5, scale: 1 },
    showNumeral: true,
  },
  amuzazels: {
    // Interior, private, claustrophobic: the spine drops out for this
    // one beat only. A narrow, blood-lit column, nothing outside it.
    carrier: { top: "14vh", left: "34vw", width: "32vw", height: "72vh", borderRadius: "2px", background: "rgba(134,38,35,0.08)", opacity: 1 },
    spine: SPINE_OFF,
    ring: RING_OFF,
    showNumeral: true,
  },
  "old-gods": {
    carrier: { top: "10vh", left: "6vw", width: "40vw", height: "80vh", borderRadius: "18px", background: "rgba(255,255,255,0.025)", opacity: 1 },
    spine: { top: "0", left: "44vw", height: "100vh", opacity: 0.22, scaleY: 1 },
    ring: RING_OFF,
    showNumeral: true,
  },
  "black-sun": {
    // The rupture. Everything the show has been carrying goes quiet
    // at once — the stage empties so there is nothing to look at but
    // the eclipse itself.
    carrier: CARRIER_OFF,
    spine: SPINE_OFF,
    ring: RING_OFF,
    showNumeral: false,
  },
  sabaah: {
    // The sourcebook describes Sabaah as three concentric sectors —
    // so the ring returns here, larger, and the title is allowed to
    // spill over the image (see `emphasis: "overlap"` in content).
    // The spine stays out: this is still the world re-forming after
    // the rupture, not yet back to "how things were."
    carrier: { top: "8vh", left: "52vw", width: "42vw", height: "84vh", borderRadius: "4px", background: "rgba(12,22,22,0.3)", opacity: 1 },
    spine: SPINE_OFF,
    ring: { top: "50vh", left: "76vw", size: "44vw", opacity: 0.4, scale: 1 },
    showNumeral: true,
  },
  khep: {
    // The spine is back, but fainter than Act I — an echo, not a
    // restoration.
    carrier: { top: "10vh", left: "4vw", width: "38vw", height: "80vh", borderRadius: "2px", background: "rgba(134,38,35,0.07)", opacity: 1 },
    spine: { top: "0", left: "46vw", height: "100vh", opacity: 0.14, scaleY: 1 },
    ring: RING_OFF,
    showNumeral: true,
  },
  finale: {
    // Bookends `arrival`: even barer, on purpose. No plate, no spine,
    // no ring — just the image and an unresolved sentence.
    carrier: CARRIER_OFF,
    spine: SPINE_OFF,
    ring: RING_OFF,
    showNumeral: false,
  },
};

/** Used for any scene/country without bespoke authored composition
 * (i.e. every country besides Babel, for now). Deliberately plain. */
const FALLBACK_CAST: CastFrame = {
  carrier: { top: "10vh", left: "56vw", width: "40vw", height: "80vh", borderRadius: "8px", background: "rgba(255,255,255,0.03)", opacity: 1 },
  spine: { top: "0", left: "50vw", height: "100vh", opacity: 0.2, scaleY: 1 },
  ring: RING_OFF,
  showNumeral: true,
};

export function getCastFrame(scene: StoryScene): CastFrame {
  return BABEL_CAST[scene.id] ?? FALLBACK_CAST;
}

/** Real, GSAP-tweenable colors for each mood. */
export const MOOD_COLORS: Record<FlowMood, string> = {
  sand: "#1f1813",
  stone: "#151413",
  night: "#0a090e",
  obsidian: "#030205",
  water: "#0c1616",
  blood: "#1a0c0e",
};

/** The corner chapter-digit, read straight off the kicker ("01 — …")
 * so it can never drift out of sync with the visible label. */
export function deriveNumeral(scene: StoryScene): string | null {
  const match = scene.kicker?.match(/^(\d{2})\s*—/);
  return match ? match[1] : null;
}

/** The giant background word. Explicit `watermark` wins; `watermark:
 * ""` means "go silent" (used once, deliberately, by the black sun);
 * otherwise it falls back to the first meaningful word of the kicker
 * so unauthored scenes/countries still get a reasonable default. */
export function resolveWatermark(scene: StoryScene): string | null {
  if (scene.watermark === "") return null;
  if (scene.watermark) return scene.watermark;
  if (scene.kicker) {
    const cleaned = scene.kicker.replace(/^\d{2}\s*—\s*/, "");
    const first = cleaned.split(/[\s—]/).filter(Boolean)[0];
    return first || null;
  }
  return null;
}