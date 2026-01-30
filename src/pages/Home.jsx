import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import JudgeRobot from '../components/JudgeRobot';
import NewsTicker from '../components/NewsTicker';
import LegalLiveSection from '../components/LegalLiveSection';
import ConstitutionBook from '../components/ConstitutionBook';
import CaseLibrary from '../components/CaseLibrary';
import Notes from '../components/Notes';
import Blogs from '../components/Blogs';
import Background from '../components/Background';
import CustomCursor from '../components/CustomCursor';

const Home = () => {
  // --- RESPONSIVE CHECK ---
  // Robot sirf laptop/PC par dikhna chahiye, mobile par wo screen gher lega
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    
    <div style={{ position: 'relative', overflowX: 'hidden' }}>
      {!isMobile && <JudgeRobot />}
      {/* 1. CORE UTILITIES */}
      <CustomCursor />
      <Background /> {/* Stars wala background */}
      <Navbar />

      {/* 3. MAIN CONTENT SECTIONS */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        
        {/* Landing Area */}
        <section id="home">
          <Hero />
        </section>

        {/* Breaking News Bar */}
        <NewsTicker />

        {/* Live Legal Updates */}
        <LegalLiveSection />

        {/* Interactive Constitution Book */}
        <div style={{ margin: '50px 0' }}>
            <ConstitutionBook />
        </div>

        {/* Case Laws Library */}
        <section id="library">
            <CaseLibrary />
        </section>

        {/* Student Notes Section */}
        <section id="notes">
            <Notes />
        </section>

        {/* Blogs & Articles */}
        <section id="blogs">
            <Blogs />
        </section>

        {/* 4. FOOTER */}
        <footer style={{
            textAlign: 'center',
            padding: '40px 20px',
            background: '#020c1b',
            borderTop: '1px solid #233554',
            color: '#8892b0',
            fontFamily: 'Space Mono, monospace',
            fontSize: '0.9rem'
        }}>
            <p>© {new Date().getFullYear()} LawLedger. Built for Justice.</p>
            <p style={{ fontSize: '0.8rem', marginTop: '10px', opacity: 0.7 }}>
                Designed & Developed by Musab
            </p>
        </footer>

      </div>
    </div>
  );
};

export default Home;