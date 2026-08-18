import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const PLACEHOLDER_SLIDES = ['Screenshot 1', 'Screenshot 2', 'Screenshot 3'];

// Assembled from layered PNGs rather than one flattened image, so the
// screen content can be swapped/clipped independently of the case/frame:
//   PhoneCase.png   — body, sits behind the screen
//   PhoneBorder.png — bezel/frame, sits in front, masks the screen's edges
// That order is a standard mockup-asset convention, unverified against the
// real files (they aren't in /public/catch1/ yet) — flip the two <img>
// layers below once they're in place if it looks wrong.
const ProjectPhonePreview = ({ screenshots = [], active, reducedMotion }) => {
  const phoneRef = useRef(null);
  const trackRef = useRef(null);
  const hasRealScreenshots = screenshots.length > 0;
  const slides = hasRealScreenshots ? screenshots : PLACEHOLDER_SLIDES;

  // Plain gsap.timeline() here — no scrollTrigger — so this never touches
  // or competes with CatchScene's single scroll-driven timeline. Runs only
  // while this catch is activated; torn down the moment it isn't.
  useEffect(() => {
    if (!active) return undefined;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(
        phoneRef.current,
        { autoAlpha: 0, scale: 0.85, y: 20 },
        { autoAlpha: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.6)' }
      );

      if (!reducedMotion) {
        tl.to(phoneRef.current, {
          y: -6,
          duration: 1.6,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });

        if (slides.length > 1 && trackRef.current) {
          const loop = gsap.timeline({ repeat: -1, delay: 1 });
          slides.forEach((_, i) => {
            const next = (i + 1) % slides.length;
            loop.to(
              trackRef.current,
              { xPercent: -100 * next, duration: 1, ease: 'power2.inOut' },
              '+=1.6'
            );
          });
        }
      }
    });

    return () => ctx.revert();
  }, [active, reducedMotion, slides]);

  if (!active) return null;

  return (
    <div className="project-phone" ref={phoneRef} aria-hidden="true">
      <div className="project-phone__backdrop" />
      <img className="project-phone__case" src="/catch1/PhoneCase.png" alt="" />
      <div className="project-phone__screen">
        <div className="project-phone__track" ref={trackRef}>
          {slides.map((slide, i) =>
            hasRealScreenshots ? (
              <img key={slide} className="project-phone__slide" src={slide} alt="" />
            ) : (
              <div key={`placeholder-${i}`} className="project-phone__slide project-phone__slide--placeholder">
                {slide}
              </div>
            )
          )}
        </div>
      </div>
      <img className="project-phone__border" src="/catch1/PhoneBorder.png" alt="" />
    </div>
  );
};

export default ProjectPhonePreview;
