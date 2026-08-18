import React, { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CatchReveal from './CatchReveal';
import CatchInteractiveReveal from './CatchInteractiveReveal';
import './CatchScene.css';

gsap.registerPlugin(ScrollTrigger);

// SurfaceScene and UnderwaterScene are each their own 100vh section, stacked
// in a 200vh track (.catch-world) that the camera travels through via
// translateY. The fishing-line SVG spans the full track with
// viewBox="0 0 100 200": y 0-100 is surface-local, y 100-200 is underwater.
const ROD_PIVOT = '51% 50%'; // surface-local, near the fisherman's hand
const LINE_START = { x: 38, y: 42 }; // surface-local, rod tip / line's resting point

// The line always targets this ONE fixed spot underwater — it never
// retargets per cloud. Every catch's cloud slides into this spot first,
// then goes through the same catch/reel/reveal/release motion.
const CLOUD_HOME = { x: 46, y: 80 };
const CATCH_POINT = { x: 46, y: 78 };
const REEL_POINT = { x: 47, y: 52 };
const REVEAL_POINT = { x: 50, y: 34 };
const RELEASE_POINT = { x: 82, y: 12 };

// One entry per catch. Adding Catch #4 later is: add another entry here.
// `nativeHome` is where that cloud's art actually sits in its own PNG
// canvas (measured directly off the asset) — used to compute how far it
// has to slide to reach CLOUD_HOME, and where its placeholder logo starts.
// `sizeScale` compensates for clouds whose native art is smaller than
// MainCloud's (measured ~29% canvas width vs ~10% for the minis, ratio
// ~2.9) so the pulled/revealed/released size matches Catch #1's on-screen
// footprint exactly, even though the source art is smaller.
const CATCHES = [
  {
    id: 'catch1',
    cloudImg: '/catch1/MiniCloud2.png',
    nativeHome: { x: 14.8, y: 46 }, // measured directly from the PNG's pixel data
    startsAtHome: true, // pre-placed at CLOUD_HOME on mount — no slide-in for this one
    revealPos: { x: 14.8, y: 44.5 }, // manually tuned to sit inside this cloud's shape
    revealWidth: 10,
    sizeScale: 2,
    cameraY: '-100vh', // camera settles underwater during this catch's approach
    title: 'Web Design & Development',
    description: 'Custom responsive websites and interactive experiences for people, brands, and small businesses.',
    descriptionLead: 'Custom responsive websites and interactive experiences', // settles left of the phone
    descriptionTrail: 'for people, brands, and small businesses.', // settles right of the phone
    cta: 'View Web Work',
    showDescription: false, // description "leaves the cloud" as part of the rain-phone reveal
    previewEnabled: true,
    revealType: 'rain-phone',
    screenshots: ['/catch1/WebDesignExample1.png', '/catch1/WebDesignExample2.png'],
  },
  {
    id: 'catch2',
    cloudImg: '/catch1/MiniCloud2.png', // the small "left" cloud
    nativeHome: { x: 14.8, y: 46 }, // measured directly from the PNG's pixel data
    revealPos: { x: 14.8, y: 44.5 },
    revealWidth: 7, // 32 / sizeScale, so it lands at the same on-screen footprint as catch1's
    sizeScale: 2,
    title: 'Apps & Digital Tools',
    description: 'From simple utilities to custom platforms, we turn useful concepts into working software.',
    cta: 'Explore Software',
    previewEnabled: false, // revealType reserved, no interactive reveal implemented yet
    revealType: 'terminal',
  },
  {
    id: 'catch3',
    cloudImg: '/catch1/MiniCloud.png',
    nativeHome: { x: 81.0, y: 56 }, // measured directly from the PNG's pixel data
    revealPos: { x: 81.0, y: 54.5 },
    revealWidth: 8,
    sizeScale: 2,
    title: 'The Playground',
    description: 'Games, animation, interactive experiments, prototypes, and whatever idea keeps us awake.',
    cta: 'Enter the Playground',
    previewEnabled: false, // revealType reserved, no interactive reveal implemented yet
    revealType: 'playground',
  },
];

// Converts an underwater-local point into full-track coordinates for the line.
const toLineTarget = (point) => ({ x: point.x, y: 100 + point.y });

// Same offset math addCatch uses for every tween target, exposed so setup
// can pre-place a "starts at home" cloud without duplicating the formula.
const offsetTo = (point, nativeHome) => ({
  xPercent: point.x - nativeHome.x,
  yPercent: point.y - nativeHome.y,
});

// Appends one catch's tween sequence onto the shared timeline, starting at
// `label`. Every catch runs the exact same sequence against the exact same
// shared points (CATCH_POINT/REEL_POINT/REVEAL_POINT/RELEASE_POINT) — only
// which cloud/logo element is being moved changes.
function addCatch(tl, label, config, shared) {
  const { cloudEl, revealEl, rodEl, worldEl, linePos, applyLinePos, previewEl, onRelease } = shared;
  const { nativeHome, cameraY, sizeScale = 1 } = config;

  const to = (point) => offsetTo(point, nativeHome);

  tl.addLabel(label);

  if (cameraY) {
    tl.to(worldEl, { y: cameraY, duration: 1 }, label);
  }

  const needsSlideIn =
    !config.startsAtHome && (nativeHome.x !== CLOUD_HOME.x || nativeHome.y !== CLOUD_HOME.y);
  if (needsSlideIn) {
    // this cloud isn't already at the shared spot — slide it in first,
    // normalizing its size to match catch1's footprint at the same time
    tl.to(cloudEl, { ...to(CLOUD_HOME), scale: sizeScale, duration: 0.6 }, label);
  }

  tl
    .to(rodEl, { rotation: -10, duration: 1 }, label)
    .to(linePos, { ...toLineTarget(CATCH_POINT), duration: 1, onUpdate: applyLinePos }, label)
    .addLabel(`${label}-caught`)
    .to(cloudEl, { ...to(REEL_POINT), duration: 1 }, `${label}-caught`)
    .to(linePos, { ...toLineTarget(REEL_POINT), duration: 1, onUpdate: applyLinePos }, `${label}-caught`)
    .to(rodEl, { rotation: -16, duration: 1 }, `${label}-caught`)
    .addLabel(`${label}-reeled`)
    .to(cloudEl, { ...to(REVEAL_POINT), scale: 1.7 * sizeScale, duration: 1 }, `${label}-reeled`)
    .to(linePos, { ...toLineTarget(REVEAL_POINT), duration: 1, onUpdate: applyLinePos }, `${label}-reeled`)
    .to(rodEl, { rotation: -6, duration: 1 }, `${label}-reeled`)
    .to(revealEl, { autoAlpha: 1, scale: 1, duration: 1 }, `${label}-reeled+=0.4`)
    .to(previewEl, { autoAlpha: 1, duration: 1 }, `${label}-reeled+=0.4`)
    .addLabel(`${label}-revealed`)
    .to(cloudEl, { ...to(RELEASE_POINT), scale: 1.4 * sizeScale, opacity: 0, duration: 1 }, `${label}-revealed`)
    .to(revealEl, { autoAlpha: 0, duration: 0.6 }, `${label}-revealed`)
    .to(previewEl, { autoAlpha: 0, duration: 0.6 }, `${label}-revealed`)
    .call(onRelease, [], `${label}-revealed`)
    .to(linePos, { ...LINE_START, duration: 1, onUpdate: applyLinePos }, `${label}-revealed`)
    .to(rodEl, { rotation: 0, duration: 1 }, `${label}-revealed`)
    .addLabel(`${label}-released`);
}

const CatchScene = () => {
  const wrapperRef = useRef(null);
  const pinRef = useRef(null);
  const worldRef = useRef(null);
  const rodRef = useRef(null);
  const lineRef = useRef(null);
  const hookRef = useRef(null);
  const cloudRefs = useRef([]);
  const revealRefs = useRef([]);
  const previewRefs = useRef([]);
  // Portal target for reveal mechanics that need to render *behind* the
  // cloud/preview stacking (e.g. RainPhoneReveal's submarine) — a sibling
  // of .catch-preview rather than nested inside it, since z-index can never
  // let a child escape below its own parent's stacking level. Shared by all
  // catches: harmless, since only one catch is ever active at a time.
  const behindSlotRef = useRef(null);

  // Each catch owns its own activation flag — no shared "which catch is
  // active" tracker needed, since only one CatchReveal is ever visible
  // (autoAlpha) at a time. Reset via the timeline's onRelease call below.
  const [activated, setActivated] = useState(() => CATCHES.map(() => false));
  const [prefersReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(rodRef.current, { transformOrigin: ROD_PIVOT });
      CATCHES.forEach((config, i) => {
        // Each cloud-group fills the whole underwater viewport, but the
        // cloud art is a small shape somewhere inside it. Without this,
        // GSAP scales around the box's default center (50% 50% = screen
        // center) instead of the cloud's own center, flinging off-center
        // clouds further off-center as they scale up.
        gsap.set(cloudRefs.current[i], {
          transformOrigin: `${config.nativeHome.x}% ${config.nativeHome.y}%`,
        });
        if (config.startsAtHome) {
          gsap.set(cloudRefs.current[i], {
            ...offsetTo(CLOUD_HOME, config.nativeHome),
            scale: config.sizeScale || 1,
          });
        }
      });
      revealRefs.current.forEach((el) => {
        // xPercent/yPercent: -50 centers each reveal card on its own
        // top/left anchor and stays constant — only scale animates.
        // autoAlpha (not plain opacity) also drives visibility:hidden at 0,
        // which removes the activation button from tab order while hidden.
        gsap.set(el, { autoAlpha: 0, scale: 0.6, xPercent: -50, yPercent: -50 });
      });
      previewRefs.current.forEach((el) => {
        gsap.set(el, { autoAlpha: 0 });
      });

      const linePos = { x: LINE_START.x, y: LINE_START.y };
      const applyLinePos = () => {
        lineRef.current.setAttribute('x2', linePos.x);
        lineRef.current.setAttribute('y2', linePos.y);
        hookRef.current.setAttribute('cx', linePos.x);
        hookRef.current.setAttribute('cy', linePos.y);
      };
      applyLinePos();

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top top',
          end: 'bottom bottom',
          pin: pinRef.current,
          scrub: 1,
        },
      });

      const shared = {
        rodEl: rodRef.current,
        worldEl: worldRef.current,
        linePos,
        applyLinePos,
      };

      CATCHES.forEach((config, i) => {
        addCatch(tl, config.id, config, {
          ...shared,
          cloudEl: cloudRefs.current[i],
          revealEl: revealRefs.current[i],
          previewEl: previewRefs.current[i],
          onRelease: () => setActivated((prev) => prev.map((v, idx) => (idx === i ? false : v))),
        });
      });

      // The per-catch onRelease call above only reliably fires when scroll
      // crosses a catch's own release point moving forward. Scrubbing
      // backward — even just back up to the surface, still inside this
      // pinned section — doesn't consistently trigger it, leaving a stale
      // activated interactive reveal on screen. This runs on every scroll
      // update instead: each catch's "active window" is the span between
      // its own reveal and release labels, already set by addCatch above,
      // and anything activated outside its own window gets force-reset,
      // regardless of scroll direction or how the timeline got there.
      const activeWindows = CATCHES.map((config) => ({
        start: tl.labels[`${config.id}-reeled`],
        end: tl.labels[`${config.id}-revealed`],
      }));

      tl.eventCallback('onUpdate', () => {
        const t = tl.time();
        setActivated((prev) => {
          let changed = false;
          const next = prev.map((isActive, i) => {
            if (isActive && (t < activeWindows[i].start || t > activeWindows[i].end)) {
              changed = true;
              return false;
            }
            return isActive;
          });
          return changed ? next : prev;
        });
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  // Idempotent on purpose: the activate button wires the same handler to
  // onClick, onMouseEnter, and onFocus (click/tap is the required path;
  // hover/focus are desktop-only enhancements, never the only way in).
  const handleActivate = (i) => {
    setActivated((prev) => (prev[i] ? prev : prev.map((v, idx) => (idx === i ? true : v))));
  };

  return (
    <section className="catch-scene" ref={wrapperRef}>
      <div className="catch-scene__pin" ref={pinRef}>
        <div className="catch-world" ref={worldRef}>

          <div className="surface-scene">
            <img className="layer" src="/catch1/TopSceneBG.PNG" alt="" />
            <img className="layer" src="/catch1/10PMLogo.png" alt="After 10pm" />
            <img className="layer" src="/catch1/FisherMan.png" alt="" />
            <img className="layer" src="/catch1/Boat.png" alt="" />
            <img className="layer" src="/catch1/10PmBoat.png" alt="" />
            <img className="layer rod" ref={rodRef} src="/catch1/FishingPole.png" alt="" />
          </div>

          <div className="underwater-scene">
            <img className="layer" src="/catch1/UnderWaterScene.PNG" alt="" />

            {CATCHES.map((config, i) => (
              <div
                key={config.id}
                className="cloud-group"
                ref={(el) => (cloudRefs.current[i] = el)}
              >
                <img className="layer" src={config.cloudImg} alt="" />
                <CatchReveal
                  ref={(el) => (revealRefs.current[i] = el)}
                  title={config.title}
                  description={config.description}
                  cta={config.cta}
                  showDescription={config.showDescription}
                  previewEnabled={config.previewEnabled}
                  isActivated={activated[i]}
                  onActivate={() => handleActivate(i)}
                  style={{
                    top: `${config.revealPos.y}%`,
                    left: `${config.revealPos.x}%`,
                    width: `${config.revealWidth}%`,
                    fontSize: `${1 / (config.sizeScale || 1)}em`,
                  }}
                />
              </div>
            ))}
          </div>

          <div className="catch-world__seam" />

          <svg className="fishing-line-svg" viewBox="0 0 100 200" preserveAspectRatio="none">
            <line
              ref={lineRef}
              x1={LINE_START.x}
              y1={LINE_START.y}
              x2={LINE_START.x}
              y2={LINE_START.y}
              stroke="#e8ddc7"
              strokeWidth="0.3"
              vectorEffect="non-scaling-stroke"
            />
            <circle
              ref={hookRef}
              cx={LINE_START.x}
              cy={LINE_START.y}
              r="0.8"
              fill="none"
              stroke="#ec1f8f"
              strokeWidth="0.4"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

        </div>

        <div className="catch-behind-slot" ref={behindSlotRef} />

        {CATCHES.map((config, i) => (
          <div
            key={config.id}
            className="catch-preview"
            ref={(el) => (previewRefs.current[i] = el)}
          >
            {activated[i] ? (
              <CatchInteractiveReveal
                config={config}
                active={activated[i]}
                reducedMotion={prefersReducedMotion}
                behindContainer={behindSlotRef.current}
              />
            ) : (
              <p className="catch-preview__idle" aria-hidden="true">
                Project preview coming soon
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default CatchScene;
