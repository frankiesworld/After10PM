import React from 'react';
import SubmarineDescription from './SubmarineDescription';
import CloudRain from './CloudRain';
import ProjectPhonePreview from './ProjectPhonePreview';

// Catch 1's interactive reveal mechanic: the submarine enters trailing the
// service description, rain falls, then a phone mockup fades in cycling
// this catch's screenshots. Knows nothing about scroll or activation
// lifecycle — CatchScene/CatchInteractiveReveal own all of that, this just
// renders the visuals for as long as `active` is true.
const RainPhoneReveal = ({ config, active, reducedMotion, behindContainer }) => (
  <>
    <SubmarineDescription
      active={active}
      reducedMotion={reducedMotion}
      descriptionLead={config.descriptionLead}
      descriptionTrail={config.descriptionTrail}
      behindContainer={behindContainer}
    />
    <CloudRain active={active} reducedMotion={reducedMotion} />
    <ProjectPhonePreview screenshots={config.screenshots} active={active} reducedMotion={reducedMotion} />
  </>
);

export default RainPhoneReveal;
