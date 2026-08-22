/**
 * CONTENT LAYER
 * -------------
 * This file defines the *story* shape only: what a scene says.
 * It intentionally knows nothing about pixels, easing, or DOM.
 *
 * - COMPOSITION (where the persistent stage elements sit for a given
 *   motif) lives in `motifs.ts`.
 * - TRANSITION (how the engine gets from one scene to the next) lives
 *   in `OriginExperience.tsx`, driven entirely by GSAP.
 *
 * Kept intentionally stable so authored content (babelExperience.ts)
 * doesn't need to change when the rendering engine changes.
 */

export type FlowMood = "sand" | "stone" | "night" | "obsidian" | "water" | "blood";

export type SceneKind =
  | "cinematic-hero"
  | "reading-quiet"
  | "visual-split"
  | "rupture-black-sun"
  | "cinematic-finale";

export type SceneMotif =
  | "panel-right"
  | "panel-reading"
  | "panel-left"
  | "mask-circle"
  | "pillar-center"
  | "void";

export interface StoryNote {
  index: string;
  title: string;
  body: string;
}

export interface StoryScene {
  id: string;
  mood: FlowMood;
  kind: SceneKind;
  motif: SceneMotif;

  kicker?: string;
  title?: string;
  subtitle?: string;
  paragraphs?: string[];
  notes?: StoryNote[];

  image?: string;
  imageSide?: "left" | "right" | "center";
  accentWord?: string;
}

export interface CountryExperience {
  id: string;
  name: string;
  region: string;
  authored: boolean;
  scenes: StoryScene[];
}