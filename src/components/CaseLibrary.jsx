import React, { useState, useEffect } from 'react';

const casesData = [
  { id: 1, title: "Kesavananda Bharati v. State of Kerala", citation: "AIR 1973 SC 1461", summary: "Verdict: Parliament cannot alter the 'Basic Structure' of the Constitution." },
  { id: 2, title: "Maneka Gandhi v. Union of India", citation: "AIR 1978 SC 597", summary: "Verdict: Expanded Article 21. Laws must be fair, just, and reasonable." },
  { id: 3, title: "Navtej Singh Johar v. Union of India", citation: "AIR 2018 SC 4321", summary: "Verdict: Decriminalized homosexuality. LGBTQ+ rights affirmed." }
];

const CaseLibrary = () => {
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState(null);
  
  // --- Responsive Logic ---
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggle = (id) => setOpenId(openId === id ? null : id);

  return (
    <section id="library" style={{ 
        padding: isMobile ? '80px 5%' : '100px 10%', // Mobile par 5% padding
        minHeight: '100vh', 
        borderTop: '1px solid rgba(255,255,255,0.05)',
        position: 'relative'
    }}>
      
      <h2 className="font-head" style={{ 
          fontSize: isMobile ? '2rem' : '2.5rem', // Mobile par choti heading
          marginBottom: '20px', 
          color: '#e6f1ff' 
      }}>
        <span style={{ color: '#64ffda' }}>///</span> Case Library
      </h2>

      {/* Search Bar */}
      <input 
        type="text" placeholder="Search case law..." 
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: '100%', 
          padding: '15px', 
          background: '#0a192f', 
          border: '1px solid #233554',
          color: 'white', 
          marginBottom: '30px', 
          fontFamily: 'Space Mono, monospace',
          fontSize: isMobile ? '16px' : '1rem', // Mobile par 16px safe rehta hai (zoom nahi hota)
          borderRadius: '4px' // Thoda smooth corners
        }}
      />

      {/* Case List */}
      <div style={{ display: 'grid', gap: '20px' }}>
        {casesData.filter(c => c.title.toLowerCase().includes(search.toLowerCase())).map((item) => (
          <div key={item.id} onClick={() => toggle(item.id)} 
            style={{
              background: 'rgba(17, 34, 64, 0.7)', 
              padding: isMobile ? '15px' : '20px', // Mobile par padding thodi kam
              borderRadius: '8px',
              border: '1px solid rgba(100, 255, 218, 0.1)', 
              cursor: 'pointer', 
              transition: '0.3s'
            }}
            onMouseEnter={(e) => !isMobile && (e.currentTarget.style.borderColor = '#64ffda')}
            onMouseLeave={(e) => !isMobile && (e.currentTarget.style.borderColor = 'rgba(100, 255, 218, 0.1)')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ paddingRight: '10px' }}> {/* Text button se chipke na */}
                <h3 style={{ 
                    margin: 0, 
                    fontFamily: 'Playfair Display', 
                    fontSize: isMobile ? '1.1rem' : '1.3rem', // Responsive title
                    lineHeight: '1.4'
                }}>
                    {item.title}
                </h3>
                <p style={{ color: '#8892b0', fontSize: '0.85rem', marginTop: '5px' }}>
                    {item.citation}
                </p>
              </div>
              <span style={{ 
                  color: '#64ffda', 
                  fontSize: '1.5rem',
                  minWidth: '24px', // Space reserve rakhi taaki shift na ho
                  textAlign: 'center'
              }}>
                  {openId === item.id ? "−" : "+"}
              </span>
            </div>

            {openId === item.id && (
              <div style={{ 
                  marginTop: '15px', 
                  paddingTop: '15px', 
                  borderTop: '1px solid #233554', 
                  color: '#a8b2d1',
                  fontSize: isMobile ? '0.9rem' : '1rem', // Readable font size
                  lineHeight: '1.6'
              }}>
                {item.summary}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default CaseLibrary;