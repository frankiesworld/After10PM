import React, { useEffect, useRef, useState } from 'react';

const Hero = () => {
  const pinRef = useRef(null);
  const [progress, setProgress] = useState(0); // 0 = start, 1 = fully scrolled through

  useEffect(() => {
    const handleScroll = () => {
      if (!pinRef.current) return;
      const rect = pinRef.current.getBoundingClientRect();
      const scrollDistance = pinRef.current.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const p = Math.min(Math.max(scrolled / scrollDistance, 0), 1);
      setProgress(p);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="hero-pin" ref={pinRef}>
      <div className="hero-inner">
        <img
          src="/After10PMlogo.PNG"
          alt="After10PM"
          className="hero-logo"
          style={{
            opacity: 1 - progress,
            transform: `scale(${1 + progress * 0.15}) translateY(${progress * -40}px)`,
          }}
        />
      </div>
    </div>
  );
};

export default Hero;