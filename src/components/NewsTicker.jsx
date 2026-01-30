import React, { useState, useEffect } from 'react';

const NewsTicker = () => {
  const [newsItems, setNewsItems] = useState([
    "Connecting to Live Server...",
    "Fetching latest Supreme Court updates...",
    "Waiting for Law Ledger Feed..."
  ]);

  // --- 🔥 BACKEND CONNECTION ---
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('https://musab-law-ledger.onrender.com/api/news');
        const data = await response.json();
        
        if (data && data.length > 0) {
          const titles = data.map(item => item.title);
          setNewsItems(titles);
        }
      } catch (error) {
        console.error("Ticker Error:", error);
        setNewsItems([
            "⚠️ Server Connectivity Issue - Showing Cached Updates",
            "Supreme Court hearing on Art 370 continues",
            "Digital Data Protection Bill analysis released"
        ]);
      }
    };

    fetchNews();
    const interval = setInterval(fetchNews, 120000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      margin: '20px 0', 
      background: 'rgba(2, 12, 27, 0.9)', 
      borderTop: '1px solid #64ffda',
      borderBottom: '1px solid #64ffda',
      color: '#e6f1ff', 
      fontFamily: 'Space Mono, monospace',
      display: 'flex', 
      alignItems: 'center',
      height: '50px',
      overflow: 'hidden', 
      position: 'relative',
      whiteSpace: 'nowrap'
    }}>
      
      {/* --- FIXED LABEL --- */}
      <div style={{
        backgroundColor: '#64ffda',
        color: '#0a192f',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: '0 15px',
        fontWeight: 'bold',
        zIndex: 2,
        boxShadow: '5px 0 15px rgba(0,0,0,0.5)',
        fontSize: '0.9rem'
      }}>
        <span style={{
          height: '8px', width: '8px', backgroundColor: '#ff0000',
          borderRadius: '50%', display: 'inline-block', marginRight: '8px',
          animation: 'blink 1.5s infinite'
        }}></span>
        LIVE
      </div>

      {/* --- SCROLLING TEXT --- */}
      <div className="ticker-track" style={{
        display: 'inline-block',
        paddingLeft: '100%', 
        // 👇 SPEED CHANGE: 30s ko 80s kar diya (Jitna bada number, utna slow)
        animation: 'scroll 80s linear infinite', 
      }}>
        {newsItems.map((item, index) => (
          <span key={index} style={{ marginRight: '50px', fontSize: '0.9rem', color: '#ccd6f6' }}>
            {item} <span style={{ color: '#64ffda', marginLeft: '20px' }}>///</span>
          </span>
        ))}
      </div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        @keyframes blink {
          0% { opacity: 1; box-shadow: 0 0 5px red; }
          50% { opacity: 0.4; box-shadow: 0 0 0px red; }
          100% { opacity: 1; box-shadow: 0 0 5px red; }
        }
        
        /* 👇 NEW FEATURE: Mouse upar aate hi news ruk jayegi */
        .ticker-track:hover {
            animation-play-state: paused !important;
        }

        @media (max-width: 768px) {
           .ticker-track span { font-size: 0.8rem; }
        }
      `}</style>
    </div>
  );
};

export default NewsTicker;