import React, { forwardRef } from 'react';

// Reused for every catch's reveal content — only the props differ.
const CatchReveal = forwardRef(function CatchReveal({ title, description, cta, style }, ref) {
  return (
    <div className="catch-reveal" ref={ref} style={style}>
      <h3 className="catch-reveal__title">{title}</h3>
      <p className="catch-reveal__desc">{description}</p>
      <button type="button" className="catch-reveal__cta">
        {cta}
      </button>
    </div>
  );
});

export default CatchReveal;
