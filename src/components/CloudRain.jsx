import React from 'react';

const DROP_COUNT = 7;

// Lightweight CSS-driven rain — plain divs + a keyframe animation, no
// canvas/particle library. Purely decorative, so it's hidden from AT.
const CloudRain = ({ active, reducedMotion }) => {
  if (!active || reducedMotion) return null;

  return (
    <div className="cloud-rain" aria-hidden="true">
      {Array.from({ length: DROP_COUNT }).map((_, i) => (
        <span
          key={i}
          className="cloud-rain__drop"
          style={{
            left: `${8 + i * (84 / (DROP_COUNT - 1))}%`,
            animationDelay: `${(i * 0.18).toFixed(2)}s`,
          }}
        />
      ))}
    </div>
  );
};

export default CloudRain;
