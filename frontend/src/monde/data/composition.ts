import type { FlowMood, StoryScene } from "./schema";

/**
 * COMPOSITION LAYER
 * -----------------
 * Two things changed here from the previous pass:
 *
 * 1. PALETTE. Previously this file invented its own near-black,
 *    barely-differentiated "moods" from scratch. It now takes its
 *    hues from the app's own design tokens (gold primary, oxblood
 *    destructive, purple/green/blue chart colors) — brightened and
 *    resaturated, because those exact token values are tuned for a
 *    cream (#F6F2EC) background and go muddy on a near-black one.
 *    Every mood carries a `panel` color (near-opaque, for surfaces
 *    text sits on) and an `accent` color (the one saturated hue that
 *    shows up boldly in that scene's kicker rule, its accent word,
 *    and its shapes) — never both diluted into a 10%-opacity wash.
 *
 * 2. SHAPES. `carrier` is no longer "a rounded rectangle, repositioned."
 *    It is authored per scene as whatever shape actually serves that
 *    beat: a full-height edge-bleeding column, a horizon-line band
 *    across the top, a floor across the bottom, a narrow monolith, a
 *    tight boxed-in slab. No border-radius anywhere — these are
 *    architecture, not UI cards. Where a shape sits behind an image,
 *    it can be a bold, saturated color (nothing to lose legibility
 *    over). Where a shape sits behind TEXT, it is a near-opaque dark
 *    panel instead, so paragraphs stay readable, and the color lives
 *    in a crisp accent seam or ring at its edge instead of a tinted
 *    wash under the words.
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
  width: string;
  height: string;
  color: string;
  opacity: number;
  scaleY: number;
}

export interface RingTarget {
  top: string;
  left: string;
  size: string;
  borderWidth: string;
  color: string;
  opacity: number;
  scale: number;
}

export interface CastFrame {
  carrier: CarrierTarget;
  spine: SpineTarget;
  ring: RingTarget;
  showNumeral: boolean;
}

const CARRIER_OFF: CarrierTarget = { top: "40vh", left: "50vw", width: "0vw", height: "0vh", borderRadius: "0px", background: "rgba(0,0,0,0)", opacity: 0 };
const SPINE_OFF: SpineTarget = { top: "0", left: "50vw", width: "0px", height: "0vh", color: "rgba(0,0,0,0)", opacity: 0, scaleY: 0 };
const RING_OFF: RingTarget = { top: "50vh", left: "50vw", size: "0vw", borderWidth: "0px", color: "rgba(0,0,0,0)", opacity: 0, scale: 0.6 };

/** Hues pulled from the app's own tokens (gold primary #9A7818,
 * oxblood destructive #8B2635, purple/blue chart colors), brightened
 * for a dark stage. `panel` is a near-black, near-opaque surface for
 * text; `accent` is the one saturated color that gets to be bold. */
export const MOOD_PALETTE: Record<FlowMood, { bg: string; panel: string; accent: string }> = {
  sand: { bg: "#1c140d", panel: "#110b06", accent: "#caa034" }, // civilization — gold
  stone: { bg: "#141216", panel: "#0b0a0d", accent: "#d8c9a3" }, // order/geography — pale gold
  night: { bg: "#0d0a1a", panel: "#080613", accent: "#8a63c4" }, // the old gods, the queen's ambiguity — purple
  obsidian: { bg: "#07040c", panel: "#040308", accent: "#8f2038" }, // the rupture and its aftermath — deep blood
  water: { bg: "#050f13", panel: "#03080a", accent: "#3f83b8" }, // Sabaah, the Siirh — blue
  blood: { bg: "#170608", panel: "#0e0304", accent: "#c22c46" }, // violence, resistance — bright blood red
};

/** Bespoke, per-scene composition for Babel. */
const BABEL_CAST: Record<string, CastFrame> = {
  arrival: {
    // The image carries this beat. Just a bold, thin seam staking out
    // where "content" begins — nothing else competes with the art.
    carrier: CARRIER_OFF,
    spine: { top: "0", left: "57vw", width: "2px", height: "100vh", color: MOOD_PALETTE.sand.accent, opacity: 0.55, scaleY: 1 },
    ring: RING_OFF,
    showNumeral: false,
  },
  kingdom: {
    // A full-bleed dark reading panel, edge to edge on three sides,
    // with a bold gold seam marking its edge — not a floating card.
    carrier: { top: "0", left: "0", width: "43vw", height: "100vh", borderRadius: "0px", background: MOOD_PALETTE.sand.panel, opacity: 0.92 },
    spine: { top: "0", left: "43vw", width: "3px", height: "100vh", color: MOOD_PALETTE.sand.accent, opacity: 0.7, scaleY: 1 },
    ring: RING_OFF,
    showNumeral: true,
  },
  siirh: {
    // A different shape register entirely: a wide horizon-band across
    // the top, like a skyline over the desert, text settling below it.
    carrier: { top: "0", left: "0", width: "100vw", height: "30vh", borderRadius: "0px", background: "#171009", opacity: 0.85 },
    spine: { top: "0", left: "70vw", width: "2px", height: "100vh", color: MOOD_PALETTE.stone.accent, opacity: 0.45, scaleY: 1 },
    ring: RING_OFF,
    showNumeral: true,
  },
  taerhonis: {
    // A tall, narrow, dark presence standing beside her — a shadow
    // more than a panel. Nothing else on stage; the ambiguity is the
    // whole composition.
    carrier: { top: "0", left: "78vw", width: "22vw", height: "100vh", borderRadius: "0px", background: MOOD_PALETTE.night.panel, opacity: 0.9 },
    spine: SPINE_OFF,
    ring: RING_OFF,
    showNumeral: true,
  },
  society: {
    // Castes as rings of status, not a rectangle — a real diagram, the
    // one graphic statement in this scene. The carrier only mats the
    // image; it is not asked to carry meaning on its own.
    carrier: { top: "0", left: "56vw", width: "44vw", height: "100vh", borderRadius: "0px", background: MOOD_PALETTE.stone.accent, opacity: 0.22 },
    spine: SPINE_OFF,
    ring: { top: "48vh", left: "78vw", size: "36vw", borderWidth: "3px", color: MOOD_PALETTE.stone.accent, opacity: 0.55, scale: 1 },
    showNumeral: true,
  },
  "hors-caste": {
    // A floor across the bottom of the frame — those the system keeps
    // underfoot. Full-width, unambiguous.
    carrier: { top: "70vh", left: "0", width: "100vw", height: "30vh", borderRadius: "0px", background: MOOD_PALETTE.blood.panel, opacity: 0.9 },
    spine: { top: "0", left: "68vw", width: "2px", height: "100vh", color: MOOD_PALETTE.blood.accent, opacity: 0.6, scaleY: 1 },
    ring: RING_OFF,
    showNumeral: true,
  },
  amuzazels: {
    // Deliberately the one carrier that does NOT bleed to the edges —
    // boxed in, contained, isolated. Nothing else on stage.
    carrier: { top: "12vh", left: "6vw", width: "30vw", height: "76vh", borderRadius: "0px", background: MOOD_PALETTE.blood.panel, opacity: 0.9 },
    spine: SPINE_OFF,
    ring: RING_OFF,
    showNumeral: true,
  },
  "old-gods": {
    carrier: { top: "0", left: "0", width: "44vw", height: "100vh", borderRadius: "0px", background: MOOD_PALETTE.night.accent, opacity: 0.16 },
    spine: { top: "0", left: "44vw", width: "2px", height: "100vh", color: MOOD_PALETTE.night.accent, opacity: 0.4, scaleY: 1 },
    ring: RING_OFF,
    showNumeral: true,
  },
  nashee: {
    // Mirrors `kingdom`'s shape on the opposite edge, deliberately —
    // Act I's divine thread closes with the same architecture that
    // opened the show.
    carrier: { top: "0", left: "57vw", width: "43vw", height: "100vh", borderRadius: "0px", background: MOOD_PALETTE.night.panel, opacity: 0.92 },
    spine: { top: "0", left: "57vw", width: "3px", height: "100vh", color: MOOD_PALETTE.night.accent, opacity: 0.6, scaleY: 1 },
    ring: RING_OFF,
    showNumeral: true,
  },
  "black-sun": {
    // The rupture. Every persistent element the show has been
    // carrying goes quiet at once — nothing left but the eclipse.
    carrier: CARRIER_OFF,
    spine: SPINE_OFF,
    ring: RING_OFF,
    showNumeral: false,
  },
  avenement: {
    // The Tour Sombre, literally: a tall, narrow, near-black monolith
    // standing at the edge of frame, one bold red seam down its side.
    carrier: { top: "0", left: "80vw", width: "14vw", height: "100vh", borderRadius: "0px", background: MOOD_PALETTE.obsidian.panel, opacity: 0.95 },
    spine: { top: "0", left: "80vw", width: "3px", height: "100vh", color: MOOD_PALETTE.obsidian.accent, opacity: 0.65, scaleY: 1 },
    ring: RING_OFF,
    showNumeral: true,
  },
  sabaah: {
    // The sourcebook itself describes Sabaah as three concentric
    // sectors — so the ring returns, larger, as an actual diagram.
    carrier: { top: "0", left: "54vw", width: "46vw", height: "100vh", borderRadius: "0px", background: MOOD_PALETTE.water.accent, opacity: 0.16 },
    spine: SPINE_OFF,
    ring: { top: "50vh", left: "77vw", size: "46vw", borderWidth: "4px", color: MOOD_PALETTE.water.accent, opacity: 0.6, scale: 1 },
    showNumeral: true,
  },
  ahabas: {
    // A belt across the mid-frame — a battle-line, not a card.
    carrier: { top: "38vh", left: "0", width: "100vw", height: "22vh", borderRadius: "0px", background: MOOD_PALETTE.blood.panel, opacity: 0.88 },
    spine: { top: "0", left: "32vw", width: "2px", height: "100vh", color: MOOD_PALETTE.blood.accent, opacity: 0.55, scaleY: 1 },
    ring: RING_OFF,
    showNumeral: true,
  },
  khep: {
    carrier: { top: "0", left: "0", width: "42vw", height: "100vh", borderRadius: "0px", background: MOOD_PALETTE.blood.accent, opacity: 0.2 },
    spine: { top: "0", left: "42vw", width: "3px", height: "100vh", color: MOOD_PALETTE.blood.accent, opacity: 0.6, scaleY: 1 },
    ring: RING_OFF,
    showNumeral: true,
  },
  finale: {
    // Bookends `arrival` — even barer. No plate, no spine, no ring.
    carrier: CARRIER_OFF,
    spine: SPINE_OFF,
    ring: RING_OFF,
    showNumeral: false,
  },
};

/** Used for any scene/country without bespoke authored composition
 * (every country besides Babel, for now). Deliberately plain. */
const FALLBACK_CAST: CastFrame = {
  carrier: { top: "0", left: "56vw", width: "42vw", height: "100vh", borderRadius: "0px", background: MOOD_PALETTE.stone.panel, opacity: 0.9 },
  spine: { top: "0", left: "56vw", width: "2px", height: "100vh", color: MOOD_PALETTE.stone.accent, opacity: 0.5, scaleY: 1 },
  ring: RING_OFF,
  showNumeral: true,
};

export function getCastFrame(scene: StoryScene): CastFrame {
  return BABEL_CAST[scene.id] ?? FALLBACK_CAST;
}

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