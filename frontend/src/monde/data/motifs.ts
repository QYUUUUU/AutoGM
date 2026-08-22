import type { FlowMood, SceneMotif } from "./schema";

/**
 * COMPOSITION LAYER
 * -----------------
 * Pure geometry and color. No animation logic lives here — this file
 * only describes *where things sit* for a given motif, and what a
 * mood resolves to as an actual color GSAP can tween toward.
 *
 * `OriginExperience.tsx` reads these targets and tweens the real,
 * persistent `flow-panel` / `flow-axis` / `flow-aperture` DOM nodes
 * toward them. Those nodes are never unmounted between scenes — only
 * their geometry changes — which is what makes the motifs feel like
 * they carry through the whole show instead of resetting per slide.
 */

export interface PanelGeometry {
  top: string;
  left: string;
  width: string;
  height: string;
  borderRadius: string;
  background: string;
  opacity: number;
}

export interface AxisGeometry {
  top: string;
  left: string;
  height: string;
  opacity: number;
  scaleY: number;
}

export interface ApertureGeometry {
  top: string;
  left: string;
  width: string;
  height: string;
  borderRadius: string;
  opacity: number;
  scale: number;
}

export interface MotifGeometry {
  panel: PanelGeometry;
  axis: AxisGeometry;
  aperture: ApertureGeometry;
}

const APERTURE_OFF: ApertureGeometry = {
  top: "50%",
  left: "50%",
  width: "0px",
  height: "0px",
  borderRadius: "50%",
  opacity: 0,
  scale: 0.6,
};

const AXIS_OFF: AxisGeometry = { top: "0", left: "50%", height: "0vh", opacity: 0, scaleY: 0 };
const PANEL_OFF: PanelGeometry = {
  top: "0",
  left: "50%",
  width: "0vw",
  height: "100vh",
  borderRadius: "0px",
  background: "rgba(0,0,0,0)",
  opacity: 0,
};

/**
 * Every motif defines a target for all three persistent elements, even
 * when a given element is not meaningfully "used" in that composition
 * (in which case it collapses to width/height 0 rather than vanishing
 * abruptly — so it still visibly retracts on the way out).
 */
export const MOTIFS: Record<SceneMotif, MotifGeometry> = {
  "panel-right": {
    panel: {
      top: "0",
      left: "58%",
      width: "42vw",
      height: "100vh",
      borderRadius: "0px",
      background: "rgba(218,177,122,0.05)",
      opacity: 1,
    },
    axis: { top: "0", left: "58%", height: "100vh", opacity: 0.32, scaleY: 1 },
    aperture: APERTURE_OFF,
  },
  "panel-left": {
    panel: {
      top: "0",
      left: "0",
      width: "34vw",
      height: "100vh",
      borderRadius: "0px",
      background: "rgba(255,255,255,0.025)",
      opacity: 1,
    },
    axis: { top: "0", left: "34vw", height: "100vh", opacity: 0.28, scaleY: 1 },
    aperture: APERTURE_OFF,
  },
  "panel-reading": {
    panel: {
      top: "7.5vh",
      left: "17.5vw",
      width: "65vw",
      height: "85vh",
      borderRadius: "14px",
      background: "rgba(8,7,6,0.34)",
      opacity: 1,
    },
    axis: AXIS_OFF,
    aperture: APERTURE_OFF,
  },
  "pillar-center": {
    panel: {
      top: "0",
      left: "40vw",
      width: "20vw",
      height: "100vh",
      borderRadius: "0px",
      background: "rgba(134,38,35,0.09)",
      opacity: 1,
    },
    axis: { top: "0", left: "50vw", height: "100vh", opacity: 0.18, scaleY: 1 },
    aperture: APERTURE_OFF,
  },
  "mask-circle": {
    panel: PANEL_OFF,
    axis: AXIS_OFF,
    aperture: { top: "50%", left: "72%", width: "38vw", height: "38vw", borderRadius: "50%", opacity: 1, scale: 1 },
  },
  void: {
    panel: PANEL_OFF,
    axis: AXIS_OFF,
    aperture: APERTURE_OFF,
  },
};

/** Real, GSAP-tweenable colors for each mood (mirrors the CSS custom
 * properties in scrollytelling.css, kept here too since GSAP needs an
 * actual color value to interpolate between — it cannot smoothly tween
 * a CSS variable holding another variable). */
export const MOOD_COLORS: Record<FlowMood, string> = {
  sand: "#1f1813",
  stone: "#151413",
  night: "#0a090e",
  obsidian: "#030205",
  water: "#0c1616",
  blood: "#1a0c0e",
};