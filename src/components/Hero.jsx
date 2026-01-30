import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  // --- Responsive Logic ---
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Smooth Scroll Function
  const scrollToLibrary = () => {
    const librarySection = document.getElementById('library'); // CaseLibrary ki ID
    if (librarySection) {
      librarySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id='Home' 
      style={{ 
        minHeight: '100vh', // height: 100vh se behtar hai (content cut nahi hoga)
        display: 'flex', 
        alignItems: 'center', 
        padding: isMobile ? '120px 5% 50px' : '0 10%', // Mobile par upar se thoda neeche
        position: 'relative',
        zIndex: 10 // Background stars ke upar dikhe
      }}
    >
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ width: '100%' }}
      >
        {/* Tech Tagline */}
        <span className="font-tech" style={{ 
          color: '#64ffda', 
          fontSize: isMobile ? '0.9rem' : '1rem',
          letterSpacing: '2px',
          display: 'block',
          marginBottom: '10px'
        }}>
          v4.0 SYSTEM ONLINE
        </span>
        
        {/* Main Headline */}
        <h1 className="font-head" style={{ 
          fontSize: isMobile ? '2.8rem' : '4.5rem', // Mobile par font chota kiya
          lineHeight: 1.1, 
          margin: '20px 0',
          color: '#e6f1ff'
        }}>
          Decoding Justice <br />
          <span style={{ 
            color: 'transparent', 
            WebkitTextStroke: isMobile ? '1px #64ffda' : '1px #e6f1ff', // Mobile par thoda pop color
            fontFamily: 'sans-serif', // Thoda modern look outline ke liye
            fontWeight: 800
          }}>
            Algorithmically.
          </span>
        </h1>
        
        {/* Subtitle Paragraph */}
        <p style={{ 
          maxWidth: '600px', 
          color: '#8892b0', 
          fontSize: isMobile ? '1rem' : '1.2rem', 
          marginBottom: '40px',
          lineHeight: '1.6'
        }}>
          The modern legal scholar's digital arsenal. Access landmark judgments and AI-summarized notes in real-time.
        </p>

        {/* CTA Button */}
        <motion.button 
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(100, 255, 218, 0.1)' }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToLibrary}
          style={{
            padding: isMobile ? '12px 25px' : '18px 35px', 
            background: 'transparent', 
            border: '1px solid #64ffda', 
            color: '#64ffda',
            fontWeight: 'bold', 
            cursor: 'pointer', 
            borderRadius: '4px', 
            fontSize: isMobile ? '0.9rem' : '1rem',
            fontFamily: 'Space Mono, monospace',
            letterSpacing: '1px'
          }}
        >
          Explore Library →
        </motion.button>
      </motion.div>
    </section>
  );
};

export default Hero;