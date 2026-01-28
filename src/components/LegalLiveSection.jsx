import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LegalLiveSection = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- ASLI LIVE NEWS FETCH KARO ---
  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Humare naye Server se data maango
        const response = await fetch('https://musab-law-ledger.onrender.com/api/news');
        const data = await response.json();
        setUpdates(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch news:", error);
        // Agar server band ho to ye dikhao
        setUpdates([{ title: "⚠️ Error: Start backend server (node server.js)", link: "#" }]);
        setLoading(false);
      }
    };

    fetchNews();
    
    // Har 5 minute mein refresh karo
    const interval = setInterval(fetchNews, 300000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="library" style={{ padding: '80px 10%', textAlign: 'center' }}>
      
      <h1 className="font-head" style={{ fontSize: '3.5rem', marginBottom: '10px' }}>
        Supreme Court & Legal Library
      </h1>
      <p style={{ color: '#8892b0', fontSize: '1.1rem', marginBottom: '40px' }}>
        REAL-TIME updates sourced from Google News RSS.
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
          padding: '30px',
          textAlign: 'left',
          maxWidth: '900px',
          margin: '0 auto',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          border: '1px solid #233554'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '25px', borderBottom:'1px solid #233554', paddingBottom:'15px' }}>
          <span style={{
            height: '12px', width: '12px', backgroundColor: '#ff0000',
            borderRadius: '50%', display: 'inline-block', marginRight: '15px',
            boxShadow: '0 0 15px #ff0000', animation: 'blink 1s infinite'
          }}></span>
          <h3 className="font-tech" style={{ color: '#ffc107', margin: 0, fontSize: '1.3rem', letterSpacing: '1px' }}>
            LIVE LEGAL FEED (SERVER CONNECTED)
          </h3>
        </div>

        {/* News List */}
        <div style={{ minHeight: '100px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#64ffda' }}>
              <span className="font-tech">Fetching Live Data from Server... 📡</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
              {updates.map((item, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ x: 10, backgroundColor: 'rgba(100, 255, 218, 0.05)' }} 
                  onClick={() => window.open(item.link, '_blank')} // Click karne par asli news khulegi
                  style={{ 
                    borderBottom: '1px solid rgba(136, 146, 176, 0.1)', 
                    padding: '15px 10px', 
                    color: '#e6f1ff', 
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    transition: '0.2s',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span style={{flex: 1}}>{item.title}</span>
                  <span style={{ color: '#64ffda', fontSize: '0.8rem', marginLeft: '10px' }}>↗ READ</span>
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