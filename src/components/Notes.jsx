import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, RefreshCw, Lock } from 'lucide-react'; // Lock icon bhi import kiya
import { useNavigate } from 'react-router-dom'; // 🔥 Redirect ke liye zaroori

const Notes = () => {
  const [notesData, setNotesData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Responsive Check
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  const navigate = useNavigate(); // 🔥 Hook for redirection

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- FETCH NOTES ---
  const fetchNotes = async () => {
    try {
      const response = await fetch('https://musab-law-ledger.onrender.com/api/notes');
      const data = await response.json();
      setNotesData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notes:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
    const interval = setInterval(fetchNotes, 60000); 
    return () => clearInterval(interval);
  }, []);

  // 🔥 SECURITY CHECK HANDLER FOR DOWNLOAD
  const handleDownload = (e) => {
    const user = localStorage.getItem("lawUser"); // Check karo user hai ya nahi
    
    if (!user) {
        e.preventDefault(); // 🛑 Download ROKO
        alert("🔒 Restricted Access! Please Login/Signup to download notes.");
        navigate('/admin'); // Login page par bhejo
    }
    // Agar user hai, to browser default download hone dega
  };

  return (
    <section id="notes" style={{ 
        padding: isMobile ? '60px 5%' : '80px 10%', 
        background: '#020c1b', 
        position: 'relative', 
        zIndex: 10 
    }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h2 className="font-head" style={{ 
            fontSize: isMobile ? '2rem' : '3rem', 
            color: '#e6f1ff', 
            marginBottom: '10px' 
        }}>
          Legal <span style={{ color: '#64ffda' }}>Library</span>
        </h2>
        <p style={{ color: '#8892b0', fontSize: isMobile ? '0.9rem' : '1.1rem' }}>
          Real-time uploaded study material & case summaries.
        </p>
      </div>

      {/* --- REFRESH BUTTON --- */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button 
            onClick={() => { setLoading(true); fetchNotes(); }}
            style={{
                background: 'transparent', border: '1px solid #233554', color: '#8892b0',
                padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
            }}
        >
            <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* --- EMPTY STATE --- */}
      {!loading && notesData.length === 0 && (
        <div style={{ 
            textAlign: 'center', color: '#8892b0', 
            padding: '40px', border: '1px dashed #233554', 
            borderRadius: '12px', background: 'rgba(17, 34, 64, 0.3)'
        }}>
          <p>📭 No notes uploaded yet.</p>
          <p style={{ fontSize: '0.8rem', marginTop: '10px' }}>Admin will upload content soon.</p>
        </div>
      )}

      {/* --- LOADING STATE --- */}
      {loading && notesData.length === 0 && (
          <p style={{ textAlign: 'center', color: '#64ffda', fontFamily: 'Space Mono, monospace' }}>
              Fetching latest notes...
          </p>
      )}

      {/* --- GRID LAYOUT --- */}
      <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '30px' 
      }}>
        
        {notesData.map((note, index) => (
          <motion.div 
            key={note.id || index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={!isMobile ? { y: -5 } : {}} 
            style={{
              background: 'rgba(17, 34, 64, 0.7)',
              padding: '25px', borderRadius: '12px', border: '1px solid #233554',
              position: 'relative',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              minHeight: '200px'
            }}
          >
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                <div style={{ background: 'rgba(100, 255, 218, 0.1)', padding: '12px', borderRadius: '50%', color: '#64ffda' }}>
                    <FileText size={20} />
                </div>
                <div>
                    <h3 className="font-head" style={{ color: '#e6f1ff', fontSize: '1.1rem', margin: 0, lineHeight: 1.3 }}>
                    {note.subject}
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: '#8892b0', display: 'block', marginTop: '4px' }}>
                        {note.date || 'Recently Added'}
                    </span>
                </div>
                </div>

                <p style={{ 
                    color: '#a8b2d1', fontSize: '0.9rem', marginBottom: '20px', 
                    fontFamily: 'sans-serif', lineHeight: '1.5',
                    display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                }}>
                {note.topic}
                </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #233554', paddingTop: '15px' }}>
              <span style={{ color: '#64ffda', fontSize: '0.8rem', fontFamily: 'Space Mono, monospace' }}>
                {note.size || 'PDF'}
              </span>
              
              {/* --- DOWNLOAD BUTTON (PROTECTED) --- */}
              <motion.a 
                href={note.downloadLink} 
                target="_blank" 
                rel="noopener noreferrer"
                download
                onClick={handleDownload} // 🔥 CLICK CHECK ADDED HERE
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(100, 255, 218, 0.1)' }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'transparent', 
                  border: '1px solid #64ffda', 
                  color: '#64ffda',
                  padding: '8px 16px', 
                  borderRadius: '4px', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  gap: '8px', 
                  alignItems: 'center',
                  textDecoration: 'none', 
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }}
              >
                {/* Agar login nahi hai to Lock dikha sakte ho, par abhi Download hi rakhte hain */}
                <Download size={16} /> Download
              </motion.a>
              
            </div>
          </motion.div>
        ))}

      </div>
    </section>
  );
};

export default Notes;