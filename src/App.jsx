import React from 'react';
import Navbar from './components/Navbar';
import CatchScene from './components/CatchScene';
import './index.css';

const App = () => {
  return (
    <div className="app">
      <Navbar />
      <CatchScene />
    </div>
  );
};

export default App;