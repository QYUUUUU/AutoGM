import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import type { CountryExperience, StoryScene } from "../data/schema";
import {
  MOTIFS,
  MOOD_COLORS,
  type MotifGeometry,
  type PanelGeometry,
  type AxisGeometry,
  type ApertureGeometry,
} from "../data/motifs";

const images: Record<string, string> = {
  babel: "/images/art/babel-babel.jpg",
  society: "/images/art/babel-society.jpg",
  goddess: "/images/art/babel-goddess.jpg",
  sabaah: "/images/art/sabaah.jpg",
  warrior: "/images/art/babel-warrior.jpg",
};

type Props = { country: CountryExperience; isAdmin: boolean; onExit: () => void };

type Phase = "idle" | "busy";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** Convert composition-layer geometry into GSAP-tweenable vars. Kept as
 * plain mapping functions (not classes) so both the instant `gsap.set`
 * on mount and the animated `gsap.to` on scene change stay in sync. */
function panelVars(g: PanelGeometry) {
  return { top: g.top, left: g.left, width: g.width, height: g.height, borderRadius: g.borderRadius, backgroundColor: g.background, opacity: g.opacity };
}
function axisVars(g: AxisGeometry) {
  return { top: g.top, left: g.left, height: g.height, opacity: g.opacity, scaleY: g.scaleY };
}
function apertureVars(g: ApertureGeometry) {
  return { top: g.top, left: g.left, width: g.width, height: g.height, borderRadius: g.borderRadius, opacity: g.opacity, scale: g.scale };
}

/**
 * TRANSITION LAYER
 * ----------------
 * This is the only place animation happens. Everything here is GSAP —
 * no CSS transitions, no CSS keyframes. scrollytelling.css only holds
 * static layout/typography.
 *
 * The engine is a small explicit state machine (idle → busy → idle).
 * A single deliberate scroll/swipe/key gesture triggers exactly one
 * scene change:
 *
 *   1. the persistent stage (panel / axis / aperture / mood) starts
 *      morphing toward the next scene's composition immediately —
 *      this is the throughline that makes scenes feel continuous.
 *   2. the CURRENT scene's copy and art animate fully out first.
 *   3. only once they've cleared does the DOM swap to the next
 *      scene's copy — while invisible, so there's no flash.
 *   4. the new copy and art then animate in.
 *   5. the machine returns to idle and the next gesture is accepted.
 *
 * Nothing is ever a full-screen "slide" mounting on top of another —
 * the stage, HUD, and text/visual columns are permanent DOM; only
 * their content and geometry change.
 */
export function OriginExperience({ country, onExit }: Props) {
  const [displayed, setDisplayed] = useState<StoryScene>(country.scenes[0]);
  const [index, setIndex] = useState(0);

  const phase = useRef<Phase>("busy"); // starts busy: the opening entrance is playing
  const directionRef = useRef<1 | -1>(1);
  const indexRef = useRef(0);
  const wheelAcc = useRef(0);
  const touchStartY = useRef<number | null>(null);
  const prefersReducedMotion = useRef(false);
  const mountedComponent = useRef(false);
  const activeTimelines = useRef<gsap.core.Timeline[]>([]);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const moodBgRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const axisRef = useRef<HTMLDivElement | null>(null);
  const apertureRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const hudTitleRef = useRef<HTMLDivElement | null>(null);

  const kickerRef = useRef<HTMLSpanElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const paragraphsRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const eclipseEnvRef = useRef<HTMLDivElement | null>(null);
  const eclipseBurnRef = useRef<HTMLDivElement | null>(null);
  const eclipseDiscRef = useRef<HTMLDivElement | null>(null);
  const eclipseBoundaryRef = useRef<HTMLDivElement | null>(null);

  const track = (tl: gsap.core.Timeline) => {
    activeTimelines.current.push(tl);
    return tl;
  };

  // ---- persistent-stage tweens -------------------------------------------------

  function tweenMotifs(target: MotifGeometry, duration: number) {
    const ease = "power4.inOut";
    if (panelRef.current) gsap.to(panelRef.current, { ...panelVars(target.panel), duration, ease });
    if (axisRef.current) gsap.to(axisRef.current, { ...axisVars(target.axis), duration, ease });
    if (apertureRef.current) gsap.to(apertureRef.current, { ...apertureVars(target.aperture), duration, ease });
  }

  function tweenMood(mood: StoryScene["mood"], duration: number) {
    if (moodBgRef.current) gsap.to(moodBgRef.current, { backgroundColor: MOOD_COLORS[mood], duration, ease: "power2.inOut" });
  }

  function tweenProgress(fraction: number, duration: number) {
    if (progressBarRef.current) gsap.to(progressBarRef.current, { width: `${fraction * 100}%`, duration, ease: "power3.inOut" });
  }

  // ---- the black sun climax -----------------------------------------------------
  // "the world is being extinguished" — not a static disc appearing.
  // Environmental light drains first, the sun's own color desaturates
  // toward near-black over a slow tween, an irregular obsidian burn
  // spreads across one edge, and only at the very end does a barely
  // visible dashed boundary confirm its shape. No white glow anywhere.

  function buildEclipseTimeline(): gsap.core.Timeline {
    const rm = prefersReducedMotion.current;
    const total = rm ? 0.3 : 2.3;
    const tl = gsap.timeline();

    if (eclipseEnvRef.current) {
      gsap.set(eclipseEnvRef.current, { opacity: 0 });
      tl.to(eclipseEnvRef.current, { opacity: rm ? 0.55 : 0.82, duration: total, ease: "power2.inOut" }, 0);
    }
    if (eclipseDiscRef.current) {
      gsap.set(eclipseDiscRef.current, { opacity: 0, scale: rm ? 1 : 1.04, backgroundColor: "#caa06a" });
      tl.to(eclipseDiscRef.current, { opacity: 1, scale: rm ? 1 : 0.985, duration: total * 0.4, ease: "power2.out" }, 0);
      tl.to(eclipseDiscRef.current, { backgroundColor: "#050405", duration: total * 0.75, ease: "power2.inOut" }, rm ? 0 : total * 0.15);
    }
    if (eclipseBurnRef.current) {
      gsap.set(eclipseBurnRef.current, { opacity: 0, rotate: rm ? 0 : -22, scale: rm ? 1 : 0.9 });
      tl.to(eclipseBurnRef.current, { opacity: 1, rotate: rm ? 0 : 14, scale: rm ? 1 : 1.02, duration: total * 0.6, ease: "power2.inOut" }, rm ? 0 : total * 0.22);
    }
    if (eclipseBoundaryRef.current) {
      gsap.set(eclipseBoundaryRef.current, { opacity: 0 });
      tl.to(eclipseBoundaryRef.current, { opacity: 1, duration: total * 0.3, ease: "power1.out" }, rm ? 0 : total * 0.6);
    }
    return tl;
  }

  // ---- copy / art choreography --------------------------------------------------

  function buildExitTimeline(current: StoryScene): gsap.core.Timeline {
    const rm = prefersReducedMotion.current;
    const d = rm ? 0.12 : 0.42;
    const tl = gsap.timeline();

    if (kickerRef.current) tl.to(kickerRef.current, { opacity: 0, y: rm ? 0 : -8, duration: d * 0.7, ease: "power2.in" }, 0);
    if (titleRef.current) tl.to(titleRef.current, { opacity: 0, y: rm ? 0 : -14, scale: rm ? 1 : 0.985, duration: d, ease: "power2.in" }, 0.02);
    if (subtitleRef.current) tl.to(subtitleRef.current, { opacity: 0, y: rm ? 0 : -10, duration: d * 0.85, ease: "power2.in" }, 0.04);

    const paragraphNodes = paragraphsRef.current ? Array.from(paragraphsRef.current.children) : [];
    if (paragraphNodes.length) {
      tl.to(paragraphNodes, { opacity: 0, y: rm ? 0 : -16, duration: d * 0.85, stagger: rm ? 0 : 0.035, ease: "power2.in" }, 0.06);
    }

    if (current.kind === "rupture-black-sun") {
      if (eclipseEnvRef.current) tl.to(eclipseEnvRef.current, { opacity: 0, duration: d, ease: "power2.in" }, 0);
      if (eclipseBurnRef.current) tl.to(eclipseBurnRef.current, { opacity: 0, duration: d, ease: "power2.in" }, 0);
      if (eclipseDiscRef.current) tl.to(eclipseDiscRef.current, { opacity: 0, scale: rm ? 1 : 0.96, duration: d, ease: "power2.in" }, 0);
      if (eclipseBoundaryRef.current) tl.to(eclipseBoundaryRef.current, { opacity: 0, duration: d, ease: "power2.in" }, 0);
    } else if (imgRef.current) {
      const outX = rm ? 0 : current.imageSide === "left" ? -48 : 48;
      tl.to(imgRef.current, { opacity: 0, x: outX, scale: rm ? 1 : 0.97, duration: d, ease: "power2.in" }, 0);
    }

    return tl;
  }

  function buildEntranceTimeline(next: StoryScene): gsap.core.Timeline {
    const rm = prefersReducedMotion.current;
    const d = rm ? 0.15 : 0.6;
    const tl = gsap.timeline();

    if (hudTitleRef.current) tl.from(hudTitleRef.current, { opacity: 0, duration: d * 0.6, ease: "power1.out" }, 0);
    if (kickerRef.current) tl.from(kickerRef.current, { opacity: 0, y: rm ? 0 : 10, duration: d * 0.6, ease: "power2.out" }, 0);
    if (titleRef.current) tl.from(titleRef.current, { opacity: 0, y: rm ? 0 : 22, scale: rm ? 1 : 0.97, duration: d, ease: "power3.out" }, 0.06);
    if (subtitleRef.current) tl.from(subtitleRef.current, { opacity: 0, y: rm ? 0 : 16, duration: d * 0.85, ease: "power2.out" }, 0.14);

    const paragraphNodes = paragraphsRef.current ? Array.from(paragraphsRef.current.children) : [];
    if (paragraphNodes.length) {
      tl.from(paragraphNodes, { opacity: 0, y: rm ? 0 : 20, duration: d * 0.85, stagger: rm ? 0 : 0.07, ease: "power2.out" }, 0.18);
    }

    if (next.kind === "rupture-black-sun") {
      tl.add(buildEclipseTimeline(), 0.1);
    } else if (imgRef.current) {
      const fromX = rm ? 0 : next.imageSide === "left" ? -70 : next.imageSide === "right" ? 70 : 0;
      tl.from(imgRef.current, { opacity: 0, x: fromX, scale: rm ? 1 : 1.04, duration: d + 0.15, ease: "power3.out" }, 0.05);
    }

    return tl;
  }

  // Entrance runs whenever the displayed scene changes — including the
  // very first mount, so the opening beat gets the same considered
  // choreography as every later one.
  useLayoutEffect(() => {
    const tl = track(buildEntranceTimeline(displayed));
    tl.eventCallback("onComplete", () => {
      phase.current = "idle";
      wheelAcc.current = 0;
    });
    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayed]);

  // ---- state machine --------------------------------------------------------

  function advance(dir: 1 | -1) {
    if (phase.current !== "idle") return;

    const currentIndex = indexRef.current;
    const nextIndex = currentIndex + dir;

    if (nextIndex < 0) {
      onExit();
      return;
    }
    if (nextIndex >= country.scenes.length) return;

    phase.current = "busy";
    directionRef.current = dir;

    const currentScene = country.scenes[currentIndex];
    const nextScene = country.scenes[nextIndex];
    const morphDuration = prefersReducedMotion.current ? 0.2 : 1.05;

    // The persistent stage starts moving toward the next composition
    // right away — it is what "grows out of" the previous scene, so it
    // does not wait for the copy to clear first.
    tweenMotifs(MOTIFS[nextScene.motif], morphDuration);
    tweenMood(nextScene.mood, morphDuration);
    tweenProgress((nextIndex + 1) / country.scenes.length, morphDuration);

    const exitTl = track(buildExitTimeline(currentScene));
    exitTl.eventCallback("onComplete", () => {
      if (!mountedComponent.current) return;
      indexRef.current = nextIndex;
      setIndex(nextIndex);
      setDisplayed(nextScene);
    });
  }

  // ---- lifecycle: lock the page behind the show, snap the opening frame -----

  useLayoutEffect(() => {
    mountedComponent.current = true;
    document.documentElement.classList.add("monde-show-open");
    document.body.classList.add("monde-show-open");
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const media = window.matchMedia(REDUCED_MOTION_QUERY);
    prefersReducedMotion.current = media.matches;
    const onMediaChange = () => {
      prefersReducedMotion.current = media.matches;
    };
    media.addEventListener?.("change", onMediaChange);

    const opening = country.scenes[0];
    gsap.set(panelRef.current, panelVars(MOTIFS[opening.motif].panel));
    gsap.set(axisRef.current, axisVars(MOTIFS[opening.motif].axis));
    gsap.set(apertureRef.current, apertureVars(MOTIFS[opening.motif].aperture));
    gsap.set(moodBgRef.current, { backgroundColor: MOOD_COLORS[opening.mood] });
    gsap.set(progressBarRef.current, { width: `${(1 / country.scenes.length) * 100}%` });

    return () => {
      mountedComponent.current = false;
      document.documentElement.classList.remove("monde-show-open");
      document.body.classList.remove("monde-show-open");
      document.body.style.overflow = previousOverflow;
      media.removeEventListener?.("change", onMediaChange);
      activeTimelines.current.forEach((tl) => tl.kill());
      activeTimelines.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- input: wheel / keyboard / touch, all funneled through advance() -----

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (phase.current !== "idle") return;
      wheelAcc.current += event.deltaY;
      if (Math.abs(wheelAcc.current) >= 80) {
        const dir: 1 | -1 = wheelAcc.current > 0 ? 1 : -1;
        wheelAcc.current = 0;
        advance(dir);
      }
    };

    const onKey = (event: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " "].includes(event.key)) {
        event.preventDefault();
        advance(1);
      } else if (["ArrowUp", "PageUp"].includes(event.key)) {
        event.preventDefault();
        advance(-1);
      } else if (event.key === "Escape") {
        onExit();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onTouchStart = (event: React.TouchEvent) => {
    touchStartY.current = event.changedTouches[0].clientY;
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    if (touchStartY.current == null || phase.current !== "idle") return;
    const delta = touchStartY.current - event.changedTouches[0].clientY;
    touchStartY.current = null;
    if (Math.abs(delta) > 50) advance(delta > 0 ? 1 : -1);
  };

  return (
    <div className="monde-show" ref={rootRef} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="scene-mood-bg" ref={moodBgRef} style={{ backgroundColor: MOOD_COLORS[displayed.mood] }} />
      <div className="scene-environment-gradient" />
      <div className="scene-grain" />

      {/* PERSISTENT STAGE — never unmounts. Only its geometry morphs. */}
      <div className="flow-stage" aria-hidden="true">
        <div className="flow-panel" ref={panelRef} />
        <div className="flow-axis" ref={axisRef} />
        <div className="flow-aperture" ref={apertureRef} />
      </div>

      <div className="scene-content-stage" data-image-side={displayed.imageSide ?? "none"} data-kind={displayed.kind}>
        <div className="scene-inner">
          <div className="content-text-col">
            {displayed.kicker && (
              <span className="content-kicker" ref={kickerRef}>
                {displayed.kicker}
              </span>
            )}
            {displayed.title && (
              <h2 className="content-title" ref={titleRef}>
                {displayed.title}
              </h2>
            )}
            {displayed.subtitle && (
              <p className="content-subtitle" ref={subtitleRef}>
                {displayed.subtitle}
              </p>
            )}
            {displayed.paragraphs && displayed.paragraphs.length > 0 && (
              <div className="content-paragraphs" ref={paragraphsRef}>
                {displayed.paragraphs.map((paragraph, i) => (
                  <p key={`${displayed.id}-p-${i}`}>{paragraph}</p>
                ))}
              </div>
            )}
          </div>

          {displayed.kind === "rupture-black-sun" ? (
            <div className="content-visual-col">
              <div className="black-sun-stage" aria-hidden="true">
                <div className="eclipse-env" ref={eclipseEnvRef} />
                <div className="eclipse-burn" ref={eclipseBurnRef} />
                <div className="eclipse-disc" ref={eclipseDiscRef}>
                  <div className="eclipse-grain" />
                </div>
                <div className="eclipse-boundary" ref={eclipseBoundaryRef} />
              </div>
            </div>
          ) : displayed.image ? (
            <div className="content-visual-col">
              <figure className="content-image-wrap">
                <img ref={imgRef} src={images[displayed.image] ?? ""} alt="" />
              </figure>
            </div>
          ) : null}
        </div>
      </div>

      <div className="monde-hud">
        <button className="monde-back" onClick={onExit}>
          ← Le Monde
        </button>
        <div className="monde-progress">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <div className="monde-progress-line">
            <div ref={progressBarRef} />
          </div>
          <span>{String(country.scenes.length).padStart(2, "0")}</span>
        </div>
        <div className="monde-hud-title" ref={hudTitleRef}>
          {displayed.kicker ?? country.name}
        </div>
      </div>
    </div>
  );
}