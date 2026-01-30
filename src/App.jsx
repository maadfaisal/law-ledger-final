import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Lenis from 'lenis'; // Smooth Scroll Library
import Home from './pages/Home';
import Admin from './pages/Admin';

function App() {

  // --- LENIS SMOOTH SCROLL SETUP ---
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2, // Scroll speed (Higher = Smoother/Slower)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Animation curve
      smooth: true,
      direction: 'vertical',
      gestureDirection: 'vertical',
      smoothTouch: false, // Mobile par native scroll behtar lagta hai usually
      touchMultiplier: 2,
    });

    // Animation Loop
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup (Jab component hatega tab band ho jayega)
    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    // Maine yahan 'main-container' diya hai taki hum global control rakh sakein
    <div className="main-container" style={{ width: '100%', overflow: 'hidden' }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
}

export default App;