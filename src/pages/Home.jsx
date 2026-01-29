import React, { useState, useEffect } from 'react'; // 👈 React hooks import kiye
import Background from '../components/Background';
import Hero from '../components/Hero';
import Navbar from '../components/Navbar';
import CustomCursor from '../components/CustomCursor';
import NewsTicker from '../components/NewsTicker';
import CaseLibrary from '../components/CaseLibrary';
import Blogs from '../components/Blogs';  
import Notes from '../components/Notes';  
import JudgeRobot from '../components/JudgeRobot';
import LegalLiveSection from '../components/LegalLiveSection';
import ConstitutionBook from '../components/ConstitutionBook';

const Home = () => {
  // 👇 1. Screen size check karne ka logic
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Sirf Desktop par Custom Cursor dikhana (CSS handle karega, lekin yahan safe side) */}
      {!isMobile && <CustomCursor />}
      
      <Background />
      <Navbar />
      
      {/* Hero Section */}
      <Hero />
      <LegalLiveSection />
      
      {/* News Ticker Section */}
      <div style={{ padding: '0 10%' }}>
        <NewsTicker />
      </div>

      {/* 👇 2. Mobile Optimization: Robot ko Phone par mat dikhao */}
      <div style={{ minHeight: isMobile ? '0px' : '500px' }}>
        {!isMobile ? (
           <JudgeRobot />
        ) : (
           <div style={{ 
               padding: '40px', 
               textAlign: 'center', 
               color: '#64ffda', 
               opacity: 0.6,
               borderTop: '1px solid #112240',
               borderBottom: '1px solid #112240',
               background: '#020c1b'
           }}>
              🤖 <br/> <small>(3D Visuals optimized for Desktop)</small>
           </div>
        )}
      </div>

      <section id="constitution" style={{ minHeight: '80vh', background: '#020c1b' }}>
          <ConstitutionBook />
      </section>

      <CaseLibrary />
      <Notes />
      <Blogs />

      {/* Blogs & Notes (Placeholder section - Isse hata sakte ho agar upar wala Blogs component chal raha hai) */}
      <section id="more-blogs" style={{ padding: '50px 10%', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <h2 className="font-head" style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Latest Perspectives</h2>
        <div style={{ padding: '40px', background: 'rgba(17,34,64,0.5)', borderRadius: '8px' }}>
          <p style={{ color: '#8892b0' }}>More resources loading soon...</p>
        </div>
      </section>
    </>
  );
};

export default Home;