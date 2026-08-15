import React, { forwardRef } from 'react';

// Reused for every catch's reveal content — only the props differ.
// When previewEnabled is true, the CTA doubles as this catch's interactive
// reveal activation control (CatchInteractiveReveal) — hover, click, or tap
// starts it. No separate button, so the cloud's content stays just title +
// CTA for catches whose reveal type says "the cloud itself activates it".
const CatchReveal = forwardRef(function CatchReveal(
  { title, description, cta, showDescription = true, previewEnabled, isActivated, onActivate, style },
  ref
) {
  return (
    <div className="catch-reveal" ref={ref} style={style}>
      <h3 className="catch-reveal__title">{title}</h3>
      {showDescription && <p className="catch-reveal__desc">{description}</p>}
      <button
        type="button"
        className={`catch-reveal__cta${previewEnabled ? ' catch-reveal__cta--active' : ''}`}
        aria-pressed={previewEnabled ? isActivated : undefined}
        aria-label={previewEnabled ? `${cta} — reveal project preview` : undefined}
        onClick={previewEnabled ? onActivate : undefined}
        onMouseEnter={previewEnabled ? onActivate : undefined}
        onFocus={previewEnabled ? onActivate : undefined}
      >
        {cta}
      </button>
    </div>
  );
});

export default CatchReveal;
