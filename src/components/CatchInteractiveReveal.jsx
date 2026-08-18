import React from 'react';
import RainPhoneReveal from './RainPhoneReveal';

// Maps a catch's `revealType` to its interactive reveal component.
// 'terminal' and 'playground' are reserved revealType values for Catch
// 2/3's future mechanics — no component yet, so they fall through to null
// below until TerminalReveal/PlaygroundReveal exist.
const REVEAL_COMPONENTS = {
  'rain-phone': RainPhoneReveal,
};

// Picks the right catch-specific interactive reveal for `config.revealType`.
// This is the only place that needs to know the full set of reveal types —
// CatchScene stays generic (activation state, release cleanup, keyboard/
// touch handling, ScrollTrigger sync) and never branches on revealType.
const CatchInteractiveReveal = ({ config, active, reducedMotion, behindContainer }) => {
  const RevealComponent = REVEAL_COMPONENTS[config.revealType];
  if (!RevealComponent) return null;

  return (
    <RevealComponent
      config={config}
      active={active}
      reducedMotion={reducedMotion}
      behindContainer={behindContainer}
    />
  );
};

export default CatchInteractiveReveal;
