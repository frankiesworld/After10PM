import React from 'react';
import CloudRain from './CloudRain';
import ProjectPhonePreview from './ProjectPhonePreview';

// Catch 1's interactive reveal mechanic: rain falls, then a phone mockup
// fades in cycling this catch's screenshots. Knows nothing about scroll or
// activation lifecycle — CatchScene/CatchInteractiveReveal own all of that,
// this just renders the visuals for as long as `active` is true.
const RainPhoneReveal = ({ config, active, reducedMotion }) => (
  <>
    <CloudRain active={active} reducedMotion={reducedMotion} />
    <ProjectPhonePreview screenshots={config.screenshots} active={active} reducedMotion={reducedMotion} />
  </>
);

export default RainPhoneReveal;
