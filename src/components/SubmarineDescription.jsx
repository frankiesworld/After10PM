import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';

// Catch 1's "description leaves the cloud" moment: a small submarine flies
// left-to-right across the full screen width once, like a banner-towing
// plane — carrying the description, dropping the lead half at a fixed
// point left of the phone and the trail half at a fixed point right of it,
// then continuing on bare, off-screen. One pass only — it does not loop;
// it only replays if this catch is reactivated (scrolled away and back) or
// the page is refreshed. Breaks out of the portal target's width on
// purpose — needs the whole viewport to fly across.
//
// Portaled into `behindContainer` (a sibling of .catch-preview rendered by
// CatchScene, not a child of it) so it can render *behind* both the cloud
// and the phone — z-index can't let a child escape below its own parent's
// stacking level, and .catch-preview sits above the cloud on purpose.
//
// Propellers spin continuously while it's on screen; the scope does a
// periodic sweep — mostly still, then a couple of turns — so it reads as
// "searching" instead of a second propeller. Plain gsap timelines, no
// ScrollTrigger — gated by `active` the same way ProjectPhonePreview is.
const SubmarineDescription = ({ active, reducedMotion, descriptionLead, descriptionTrail, behindContainer }) => {
  const leadRef = useRef(null);
  const trailRef = useRef(null);
  const trackRef = useRef(null);
  const propellerRef = useRef(null);
  const scopeRef = useRef(null);

  useEffect(() => {
    if (!active || !behindContainer) return undefined;

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        // No flight, no parked submarine — just the text, instantly.
        gsap.set([leadRef.current, trailRef.current], { autoAlpha: 1 });
        return;
      }

      // One pass, left to right, then done.
      gsap.fromTo(
        trackRef.current,
        { left: '-25%', autoAlpha: 1 },
        { left: '115%', duration: 8, ease: 'none' }
      );

      // Dropped off roughly when the sub reaches each spot along that path.
      gsap.fromTo(leadRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1, delay: 3 });
      gsap.fromTo(trailRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1, delay: 5 });

      // Gentle up/down bob layered on top of the horizontal drift, so the
      // path reads as a wavy line instead of dead-straight.
      gsap.to(trackRef.current, {
        y: '-0.6em',
        duration: 1.7,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to(propellerRef.current, {
        rotation: 360,
        duration: 1.1,
        repeat: -1,
        ease: 'none',
      });

      gsap
        .timeline({ repeat: -1 })
        .to(scopeRef.current, { rotation: 22, duration: 0.8, ease: 'sine.inOut' }, '+=2.4')
        .to(scopeRef.current, { rotation: -18, duration: 1.1, ease: 'sine.inOut' }, '+=0.3')
        .to(scopeRef.current, { rotation: 0, duration: 0.7, ease: 'sine.inOut' }, '+=0.3');
    });

    return () => ctx.revert();
  }, [active, reducedMotion, behindContainer]);

  if (!active || !behindContainer) return null;

  return createPortal(
    <div className="submarine-banner">
      <p className="submarine__description submarine__description--lead" ref={leadRef}>
        {descriptionLead}
      </p>
      <p className="submarine__description submarine__description--trail" ref={trailRef}>
        {descriptionTrail}
      </p>
      <div className="submarine-banner__track" ref={trackRef}>
        <div className="submarine" aria-hidden="true">
          <div className="submarine__outline">
            <img src="/catch1/SubMarineOutline.png" alt="" />
          </div>
          <div className="submarine__body">
            <img src="/catch1/SubMarineMain.png" alt="" />
          </div>
          <div className="submarine__propeller" ref={propellerRef}>
            <img src="/catch1/SubMarinePropellers.png" alt="" />
          </div>
          <div className="submarine__scope" ref={scopeRef}>
            <div className="submarine__beam" />
            <img src="/catch1/SubMarineScope.png" alt="" />
          </div>
        </div>
      </div>
    </div>,
    behindContainer
  );
};

export default SubmarineDescription;
