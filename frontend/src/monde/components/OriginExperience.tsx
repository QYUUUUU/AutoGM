import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import type { CountryExperience, SceneKind, StoryScene } from "../data/schema";
import {
  getCastFrame,
  deriveNumeral,
  resolveWatermark,
  MOOD_PALETTE,
  type CastFrame,
  type CarrierTarget,
  type SpineTarget,
  type RingTarget,
} from "../data/composition";

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

/** Kinds dramatic enough to earn a per-word reveal instead of a single
 * block fade. Kept small on purpose — if every title did this, none
 * of them would read as a climax. */
const SPLIT_TITLE_KINDS = new Set<SceneKind>(["cinematic-hero", "rupture-black-sun", "cinematic-finale"]);

function carrierVars(t: CarrierTarget) {
  return { top: t.top, left: t.left, width: t.width, height: t.height, borderRadius: t.borderRadius, backgroundColor: t.background, opacity: t.opacity };
}
function spineVars(t: SpineTarget) {
  return { top: t.top, left: t.left, width: t.width, height: t.height, backgroundColor: t.color, opacity: t.opacity, scaleY: t.scaleY };
}
function ringVars(t: RingTarget) {
  return { top: t.top, left: t.left, width: t.size, height: t.size, borderWidth: t.borderWidth, borderColor: t.color, opacity: t.opacity, scale: t.scale };
}

/** Does a word (post-punctuation) contain the accent target? Substring
 * match so "insoumise" still lights up the token "l'insoumise". */
function isAccentWord(word: string, accent?: string) {
  if (!accent) return false;
  return word.toLowerCase().includes(accent.toLowerCase());
}

/** Renders a title's words either as plain inline spans (accent word
 * gets a color/weight class) or, for the high-impact kinds, wrapped in
 * an overflow-hidden mask per word so GSAP can reveal them one at a
 * time from behind a hard edge instead of just cross-fading a block
 * of text. */
function renderTitleWords(title: string, accent: string | undefined, split: boolean) {
  const words = title.split(" ");
  return words.map((word, i) => {
    const accented = isAccentWord(word, accent);
    const key = `${word}-${i}`;
    if (split) {
      return (
        <span className="word-mask" key={key}>
          <span className={accented ? "word-inner accent" : "word-inner"}>
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      );
    }
    return (
      <React.Fragment key={key}>
        <span className={accented ? "accent" : undefined}>{word}</span>
        {i < words.length - 1 ? " " : ""}
      </React.Fragment>
    );
  });
}

/**
 * TRANSITION LAYER
 * ----------------
 * All motion is GSAP; scrollytelling.css is static layout/typography
 * only. A small explicit state machine (idle → busy → idle) means one
 * deliberate gesture triggers exactly one scene change:
 *
 *   1. the persistent cast (carrier / spine / ring / mood) starts
 *      morphing toward the next scene's composition immediately.
 *   2. the CURRENT scene's copy and decoration animate fully out.
 *   3. only once cleared does the DOM swap to the next scene's copy —
 *      invisible, so there's no flash.
 *   4. the new copy, art, and decoration animate in, several elements
 *      choreographed with distinct timing rather than one blanket fade.
 *   5. the machine returns to idle; the next gesture is accepted.
 */
export function OriginExperience({ country, onExit }: Props) {
  const [displayed, setDisplayed] = useState<StoryScene>(country.scenes[0]);
  const [index, setIndex] = useState(0);

  const phase = useRef<Phase>("busy"); // busy while the opening entrance plays
  const indexRef = useRef(0);
  const wheelAcc = useRef(0);
  const touchStartY = useRef<number | null>(null);
  const prefersReducedMotion = useRef(false);
  const mountedComponent = useRef(false);
  const activeTimelines = useRef<gsap.core.Timeline[]>([]);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const moodBgRef = useRef<HTMLDivElement | null>(null);
  const carrierRef = useRef<HTMLDivElement | null>(null);
  const spineRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const watermarkRef = useRef<HTMLDivElement | null>(null);
  const numeralRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const hudTitleRef = useRef<HTMLDivElement | null>(null);

  const kickerRef = useRef<HTMLSpanElement | null>(null);
  const kickerRuleRef = useRef<HTMLSpanElement | null>(null);
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

  const titleTargets = (): Element[] => {
    if (!titleRef.current) return [];
    const inner = titleRef.current.querySelectorAll(".word-inner");
    return inner.length ? Array.from(inner) : [titleRef.current];
  };

  // ---- persistent-cast tweens -------------------------------------------------

  function tweenCast(frame: CastFrame, duration: number) {
    const ease = "power4.inOut";
    if (carrierRef.current) gsap.to(carrierRef.current, { ...carrierVars(frame.carrier), duration, ease });
    if (spineRef.current) gsap.to(spineRef.current, { ...spineVars(frame.spine), duration, ease });
    if (ringRef.current) gsap.to(ringRef.current, { ...ringVars(frame.ring), duration, ease });
  }

  function tweenMood(mood: StoryScene["mood"], duration: number) {
    if (moodBgRef.current) gsap.to(moodBgRef.current, { backgroundColor: MOOD_PALETTE[mood].bg, duration, ease: "power2.inOut" });
  }

  function tweenProgress(fraction: number, duration: number) {
    if (progressBarRef.current) gsap.to(progressBarRef.current, { width: `${fraction * 100}%`, duration, ease: "power3.inOut" });
  }

  // ---- the black sun climax -----------------------------------------------------

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

  // ---- copy / art / decoration choreography --------------------------------------

  function buildExitTimeline(current: StoryScene): gsap.core.Timeline {
    const rm = prefersReducedMotion.current;
    const d = rm ? 0.12 : 0.42;
    const tl = gsap.timeline();

    if (kickerRef.current) tl.to(kickerRef.current, { opacity: 0, y: rm ? 0 : -8, duration: d * 0.7, ease: "power2.in" }, 0);
    if (kickerRuleRef.current) tl.to(kickerRuleRef.current, { scaleX: 0, duration: d * 0.6, ease: "power2.in" }, 0);
    if (numeralRef.current) tl.to(numeralRef.current, { opacity: 0, y: rm ? 0 : -12, duration: d, ease: "power2.in" }, 0);
    if (watermarkRef.current) tl.to(watermarkRef.current, { opacity: 0, scale: rm ? 1 : 1.05, duration: d, ease: "power2.in" }, 0);

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
    const cast = getCastFrame(next);
    const numeralValue = cast.showNumeral ? deriveNumeral(next) : null;
    const watermarkWord = resolveWatermark(next);

    if (hudTitleRef.current) tl.from(hudTitleRef.current, { opacity: 0, duration: d * 0.6, ease: "power1.out" }, 0);

    if (numeralValue) {
      tl.from(numeralRef.current, { opacity: 0, y: rm ? 0 : 14, duration: d + 0.15, ease: "power3.out" }, 0.05);
    } else if (numeralRef.current) {
      gsap.set(numeralRef.current, { opacity: 0 });
    }

    if (watermarkWord) {
      tl.from(watermarkRef.current, { opacity: 0, scale: rm ? 1 : 0.94, duration: d + 0.3, ease: "power2.out" }, 0);
    } else if (watermarkRef.current) {
      gsap.set(watermarkRef.current, { opacity: 0 });
    }

    if (kickerRef.current) tl.from(kickerRef.current, { opacity: 0, y: rm ? 0 : 10, duration: d * 0.6, ease: "power2.out" }, 0);
    if (kickerRuleRef.current) tl.from(kickerRuleRef.current, { scaleX: 0, duration: 0.5, ease: "power3.out" }, 0.12);

    // Title: a dramatic per-word reveal for the beats that earn it,
    // a single considered block for everything else.
    const split = SPLIT_TITLE_KINDS.has(next.kind);
    if (split) {
      const targets = titleTargets();
      if (targets.length) {
        if (next.kind === "rupture-black-sun") {
          tl.from(targets, { yPercent: 100, opacity: 0, filter: "blur(10px)", stagger: 0.06, duration: 0.85, ease: "power3.out" }, 0.08);
        } else {
          tl.from(targets, { yPercent: 100, opacity: 0, stagger: 0.045, duration: 0.65, ease: "power3.out" }, 0.05);
        }
      }
    } else if (titleRef.current) {
      tl.from(titleRef.current, { opacity: 0, y: rm ? 0 : 22, scale: rm ? 1 : 0.97, duration: d, ease: "power3.out" }, 0.06);
    }

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

    const currentScene = country.scenes[currentIndex];
    const nextScene = country.scenes[nextIndex];
    const morphDuration = prefersReducedMotion.current ? 0.2 : 1.05;

    // The cast starts moving toward the next composition immediately —
    // it is what "grows out of" the previous scene, so it does not
    // wait for the copy to clear first.
    tweenCast(getCastFrame(nextScene), morphDuration);
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
    const openingCast = getCastFrame(opening);
    gsap.set(carrierRef.current, carrierVars(openingCast.carrier));
    gsap.set(spineRef.current, spineVars(openingCast.spine));
    gsap.set(ringRef.current, ringVars(openingCast.ring));
    gsap.set(moodBgRef.current, { backgroundColor: MOOD_PALETTE[opening.mood].bg });
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

  const split = SPLIT_TITLE_KINDS.has(displayed.kind);

  const accentStyle = { "--scene-accent": MOOD_PALETTE[displayed.mood].accent } as React.CSSProperties;

  return (
    <div className="monde-show" ref={rootRef} style={accentStyle} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="scene-mood-bg" ref={moodBgRef} style={{ backgroundColor: MOOD_PALETTE[displayed.mood].bg }} />
      <div className="scene-environment-gradient" />
      <div className="scene-grain" />

      {/* BACKGROUND TYPOGRAPHY — its own compositional layer, not
          decoration bolted onto the reading text. */}
      <div className="stage-watermark" ref={watermarkRef} aria-hidden="true">
        {resolveWatermark(displayed) ?? ""}
      </div>
      <div className="stage-numeral" ref={numeralRef} aria-hidden="true">
        {getCastFrame(displayed).showNumeral ? deriveNumeral(displayed) : ""}
      </div>

      {/* PERSISTENT CAST — never unmounts. Only geometry morphs, and
          not every member is "on" for every scene. */}
      <div className="flow-stage" aria-hidden="true">
        <div className="flow-carrier" ref={carrierRef} />
        <div className="flow-spine" ref={spineRef} />
        <div className="flow-ring" ref={ringRef} />
      </div>

      <div
        className="scene-content-stage"
        data-image-side={displayed.imageSide ?? "right"}
        data-kind={displayed.kind}
        data-emphasis={displayed.emphasis ?? "none"}
      >
        <div className="scene-inner">
          <div className="content-text-col">
            {displayed.kicker && (
              <span className="content-kicker-row">
                <span className="content-kicker" ref={kickerRef}>
                  {displayed.kicker}
                </span>
                <span className="kicker-rule" ref={kickerRuleRef} />
              </span>
            )}
            {displayed.title && (
              <h2 className="content-title" ref={titleRef}>
                {renderTitleWords(displayed.title, displayed.accentWord, split)}
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