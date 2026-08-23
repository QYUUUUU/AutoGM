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
  /** Which side the image sits on. When a scene has no `image`, this
   * still controls which side the text column hugs (the composition
   * is authored to expect it there) — "right" (or omitted) keeps text
   * flush left, "left" pushes it flush right, "center" stacks text
   * over a full-width image below it. */
  imageSide?: "left" | "right" | "center";

  /** A word inside `title` to typographically emphasize (color +
   * weight). Matched as a case-insensitive substring of each word, so
   * "insoumise" also matches the token "l'insoumise". */
  accentWord?: string;

  /** Giant, near-invisible background word for this beat. Omit to
   * derive one from `kicker`; set to "" to explicitly go silent
   * (used once, by the black sun rupture). */
  watermark?: string;

  /** Lets this scene's title spill over into the visual column
   * instead of staying in its own lane. Used sparingly — a beat has
   * to earn it. */
  emphasis?: "overlap";
}

export interface CountryExperience {
  id: string;
  name: string;
  region: string;
  authored: boolean;
  scenes: StoryScene[];
}