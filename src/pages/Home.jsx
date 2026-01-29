import { useState, useEffect } from 'react';
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
  // --- MOBILE CHECK LOGIC (Ye raha wo logic jo missing tha) ---
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    // 1. Check karo function
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // 2. Abhi turant check karo
    handleResize();

    // 3. Jab bhi screen size badle, tab check karo
    window.addEventListener('resize', handleResize);

    // 4. Safai karo (Cleanup)
    return () => window.removeEventListener('resize', handleResize);
  }, []); 
  // 👆 Ab ye logic code ke andar hai, isliye useEffect ab DIM nahi hoga!

  return (
    <>
      {/* Agar Laptop hai to hi Custom Cursor dikhana */}
      {!isMobile && <CustomCursor />}
      
      <Background />
      <Navbar />
      
      <Hero />
      <LegalLiveSection />
      
      <div style={{ padding: '0 10%' }}>
        <NewsTicker />
      </div>

      {/* --- ROBOT SECTION (Mobile par Hide rahega) --- */}
      <div style={{ minHeight: isMobile ? '150px' : '500px' }}>
        {!isMobile ? (
           // Laptop: Robot dikhao
           <JudgeRobot />
        ) : (
           // Mobile: Robot ki jagah ye Message dikhao (Crash Fix)
           <div style={{ 
               padding: '30px', 
               textAlign: 'center', 
               color: '#64ffda', 
               background: 'rgba(2, 12, 27, 0.8)',
               marginTop: '20px',
               borderRadius: '10px',
               border: '1px solid #112240',
               margin: '20px'
           }}>
              <h3 style={{ marginBottom: '10px' }}>🤖 AI Judge Mode</h3>
              <p style={{ fontSize: '0.9rem', color: '#8892b0' }}>
                3D Visuals are disabled on mobile to improve speed. 
                <br/>Open on Desktop for full experience.
              </p>
           </div>
        )}
      </div>

      <section id="constitution" style={{ minHeight: '80vh', background: '#020c1b' }}>
          <ConstitutionBook />
      </section>

      <CaseLibrary />
      <Notes />
      <Blogs />

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