import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ServiceClouds from './components/ServiceClouds';
import './index.css';

const App = () => {
  return (
    <div className="app">
      <Navbar />
      <Hero />
      <main id="home" style={{ textAlign: 'center', paddingTop: '2rem' }}>
        <h2>Everything created After10PM!</h2>
        <p>We offer Websites, Graphics, Games, Art, and more!</p>
      </main>
      <ServiceClouds />
      <section id="contact" className="contact-section">
        <h2>Get in touch</h2>
        <p>Have a project in mind? Reach out anytime.</p>
      </section>
    </div>
  );
};

export default App;