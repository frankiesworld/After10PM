import React, { useEffect, useRef, useState } from 'react';

const services = [
  {
    title: 'Websites',
    desc: 'Custom-built sites that feel like you.',
    exampleImg: '/examples/Website.png', // matches your actual filename
    exampleLabel: 'Featured build: SoukMT',
    slug: 'websites',
  },
  {
    title: 'Graphics',
    desc: 'Logos, banners, and visual branding.',
    exampleImg: '/examples/graphics-example.png',
    exampleLabel: 'Featured: Nightowl Brand Kit',
    slug: 'graphics',
  },
  {
    title: 'Games',
    desc: 'Small interactive experiences and game jams.',
    exampleImg: '/examples/games-example.png',
    exampleLabel: 'Featured: Moonlit Jam Entry',
    slug: 'games',
  },
  {
    title: 'Art',
    desc: 'Illustration and character design.',
    exampleImg: '/examples/art-example.png',
    exampleLabel: 'Featured: Character Study Set',
    slug: 'art',
  },
];

const Cloud = ({ title, desc, exampleImg, exampleLabel, slug }) => {
  const pinRef = useRef(null);
  const [style, setStyle] = useState({ opacity: 0, transform: 'scale(0.85)' });

  useEffect(() => {
    const handleScroll = () => {
      if (!pinRef.current) return;
      const rect = pinRef.current.getBoundingClientRect();
      const wrapperHeight = pinRef.current.offsetHeight;
      const scrollRange = wrapperHeight - window.innerHeight;
      const scrolled = -rect.top;
      const p = Math.min(Math.max(scrolled / scrollRange, 0), 1);

      let opacity;
      if (p < 0.15) opacity = p / 0.15;
      else if (p > 0.85) opacity = (1 - p) / 0.15;
      else opacity = 1;

      const scale = 0.85 + Math.min(opacity, 1) * 0.15;

      setStyle({ opacity, transform: `scale(${scale})` });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    // Placeholder navigation — swap for React Router once services becomes its own route
    window.location.hash = `services-${slug}`;
  };

  return (
    <div className="cloud-pin" ref={pinRef}>
      <div className="cloud-inner">
        <div className="cloud-group" style={style}>
          <div className="cloud-shape" onClick={handleClick} role="button" tabIndex={0}>
            <img src="/HangingCloud.png" alt="" className="cloud-bg-image" />
            <div className="cloud-content">
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          </div>

          <div className="cloud-example" onClick={handleClick} role="button" tabIndex={0}>
            <img src={exampleImg} alt={exampleLabel} className="cloud-example-img" />
            <p className="cloud-example-label">{exampleLabel}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ServiceClouds = () => {
  return (
    <section className="clouds-section" id="services">
      {services.map((service) => (
        <Cloud key={service.title} {...service} />
      ))}
    </section>
  );
};

export default ServiceClouds;