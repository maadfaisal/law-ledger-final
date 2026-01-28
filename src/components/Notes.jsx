import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText } from 'lucide-react';

const Notes = () => {
  const [notesData, setNotesData] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- SERVER SE NOTES FETCH KARO ---
  useEffect(() => {
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

    fetchNotes();
    const interval = setInterval(fetchNotes, 5000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="notes" style={{ padding: '80px 10%', background: '#020c1b', position: 'relative', zIndex: 100 }}>
      
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h2 className="font-head" style={{ fontSize: '3rem', color: '#e6f1ff', marginBottom: '10px' }}>
          Legal <span style={{ color: '#64ffda' }}>Library</span>
        </h2>
        <p style={{ color: '#8892b0', fontSize: '1.1rem' }}>
          Real-time uploaded study material.
        </p>
      </div>

      {/* Agar Notes Nahi Hain */}
      {!loading && notesData.length === 0 && (
        <div style={{ textAlign: 'center', color: '#8892b0', padding: '40px', border: '1px dashed #233554', borderRadius: '8px' }}>
          <p>No notes uploaded yet. Go to Admin Panel to add files.</p>
        </div>
      )}

      {/* Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
        
        {notesData.map((note, index) => (
          <motion.div 
            key={note.id || index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            style={{
              background: 'rgba(17, 34, 64, 0.7)',
              padding: '25px', borderRadius: '12px', border: '1px solid #233554',
              position: 'relative',
              zIndex: 101 // Card ko aur upar rakha
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
              <div style={{ background: 'rgba(100, 255, 218, 0.1)', padding: '10px', borderRadius: '50%', color: '#64ffda' }}>
                <FileText size={24} />
              </div>
              <div>
                <h3 className="font-head" style={{ color: '#e6f1ff', fontSize: '1.2rem', margin: 0 }}>
                  {note.subject}
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#8892b0' }}>{note.date}</span>
              </div>
            </div>

            <p style={{ color: '#a8b2d1', fontSize: '0.95rem', marginBottom: '20px', fontFamily: 'Space Mono, monospace' }}>
              {note.topic}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #233554', paddingTop: '15px' }}>
              <span style={{ color: '#64ffda', fontSize: '0.8rem' }}>{note.size}</span>
              
              {/* --- CORRECT DOWNLOAD BUTTON --- */}
              <a 
                href={note.downloadLink} 
                target="_blank" 
                rel="noopener noreferrer"
                download
                style={{
                  background: 'transparent', 
                  border: '1px solid #64ffda', 
                  color: '#64ffda',
                  padding: '8px 15px', 
                  borderRadius: '4px', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  gap: '5px', 
                  alignItems: 'center',
                  textDecoration: 'none', 
                  fontWeight: 'bold',
                  zIndex: 102 // Button sabse upar
                }}
              >
                <Download size={16} /> Download
              </a>
              {/* --- END BUTTON --- */}

            </div>
          </motion.div>
        ))}

      </div>
    </section>
  );
};

export default Notes;