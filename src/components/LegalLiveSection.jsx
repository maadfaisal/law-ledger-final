import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LegalLiveSection = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Responsive Check
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch News Logic
 // --- UPDATED FETCH LOGIC (BACKEND RESTORED) ---
  const fetchNews = async () => {
    setLoading(true);
    try {
      // ✅ AB YE DIRECT AAPKE SERVER SE BAAT KAREGA
      const response = await fetch('https://musab-law-ledger.onrender.com/api/news');
      const data = await response.json();
      
      if(data && data.length > 0) {
          setUpdates(data);
      } else {
          // Agar server khali array bheje
          setUpdates([{ title: "No live updates at the moment.", link: "#" }]);
      }
      setLoading(false);

    } catch (error) {
      console.error("Failed to fetch news:", error);
      // Fallback agar server down ho
      setUpdates([{ title: "⚠️ Connecting to Law Ledger Server...", link: "#" }]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 300000); // 5 min refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="news-section" style={{ 
        padding: isMobile ? '60px 5%' : '80px 10%', // Responsive Padding
        textAlign: 'center' 
    }}>
      
      <h1 className="font-head" style={{ 
          fontSize: isMobile ? '2rem' : '3.5rem', // Responsive Heading
          marginBottom: '10px',
          color: '#e6f1ff',
          lineHeight: '1.2'
      }}>
        Supreme Court & Legal Library
      </h1>
      
      <p style={{ 
          color: '#8892b0', 
          fontSize: isMobile ? '0.9rem' : '1.1rem', 
          marginBottom: '40px' 
      }}>
        REAL-TIME updates sourced from Legal Feeds.
      </p>

      {/* YELLOW/BLUE CARD */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: 'rgba(10, 25, 47, 0.9)', 
          borderLeft: '5px solid #ffc107',       
          borderRadius: '8px',
          padding: isMobile ? '20px' : '30px', // Mobile par padding kam
          textAlign: 'left',
          maxWidth: '900px',
          width: '100%',
          margin: '0 auto',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          border: '1px solid #233554'
        }}
      >
        {/* Header */}
        <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '25px', 
            borderBottom:'1px solid #233554', 
            paddingBottom:'15px',
            flexWrap: 'wrap' // Mobile par agar text lamba ho to neeche aaye
        }}>
          <span style={{
            height: '10px', width: '10px', backgroundColor: '#ff0000',
            borderRadius: '50%', display: 'inline-block', marginRight: '15px',
            boxShadow: '0 0 10px #ff0000', animation: 'blink 1s infinite',
            flexShrink: 0
          }}></span>
          
          <h3 className="font-tech" style={{ 
              color: '#ffc107', 
              margin: 0, 
              fontSize: isMobile ? '1rem' : '1.3rem', // Responsive Title
              letterSpacing: '1px',
              wordBreak: 'break-word'
          }}>
            LIVE LEGAL FEED
          </h3>
        </div>

        {/* News List */}
        <div style={{ minHeight: '100px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#64ffda' }}>
              <span className="font-tech">Fetching Live Data... 📡</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
              {updates.map((item, index) => (
                <motion.div 
                  key={index}
                  whileHover={!isMobile ? { x: 10, backgroundColor: 'rgba(100, 255, 218, 0.05)' } : {}}
                  onClick={() => window.open(item.link, '_blank')}
                  style={{ 
                    borderBottom: '1px solid rgba(136, 146, 176, 0.1)', 
                    padding: '15px 10px', 
                    color: '#e6f1ff', 
                    fontSize: isMobile ? '0.95rem' : '1.1rem',
                    cursor: 'pointer',
                    transition: '0.2s',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <span style={{flex: 1, lineHeight: '1.5'}}>{item.title}</span>
                  <span style={{ 
                      color: '#64ffda', 
                      fontSize: '0.8rem', 
                      whiteSpace: 'nowrap', // Read button toote nahi
                      border: '1px solid rgba(100,255,218,0.3)',
                      padding: '2px 8px',
                      borderRadius: '4px'
                  }}>
                      READ ↗
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      <style>{`
        @keyframes blink { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }
      `}</style>
    </section>
  );
};

export default LegalLiveSection;