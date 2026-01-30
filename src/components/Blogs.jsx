import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null); 
  const [loading, setLoading] = useState(true);
  
  // Responsive Check
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch Blogs
  useEffect(() => {
    // 👇 YAHAN GALTI THI: Localhost hata kar Asli Server ka Link lagao
    fetch('https://musab-law-ledger.onrender.com/api/blogs')
      .then(res => res.json())
      .then(data => { setBlogs(data); setLoading(false); })
      .catch(err => {
          console.error("Blog Fetch Error:", err);
          setLoading(false);
      });
  }, []);

  return (
    <section id="blogs" style={{ 
        padding: isMobile ? '60px 5%' : '80px 10%', 
        position: 'relative', 
        zIndex: 100 
    }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: isMobile ? '40px' : '60px' }}>
        <h2 className="font-head" style={{ 
            fontSize: isMobile ? '2rem' : '3rem', 
            color: '#e6f1ff',
            lineHeight: 1.2
        }}>
          Legal <span style={{ color: '#ffc107' }}>Insights</span>
        </h2>
        <p style={{ color: '#8892b0', marginTop: '10px', fontSize: isMobile ? '0.9rem' : '1rem' }}>
            Deep dives into complex legal matters.
        </p>
      </div>

      {/* Grid Layout */}
      <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '30px' 
      }}>
        
        {loading ? (
            <p style={{color:'white', textAlign: 'center', gridColumn: '1/-1'}}>Loading thoughts...</p>
        ) : blogs.length === 0 ? (
            // Agar koi blog nahi hai to ye dikhao
            <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '40px', color: '#8892b0', border: '1px dashed #233554', borderRadius: '10px' }}>
                <p>No articles published yet.</p>
                <p style={{fontSize: '0.8rem'}}>Go to Admin Panel to write one.</p>
            </div>
        ) : (
            blogs.map((blog, index) => (
              <motion.div 
                key={blog._id || index}
                whileHover={!isMobile ? { y: -10, boxShadow: '0 10px 30px rgba(255, 193, 7, 0.2)' } : {}}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => setSelectedBlog(blog)}
                style={{
                  background: 'rgba(2, 12, 27, 0.7)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 193, 7, 0.2)',
                  borderRadius: '16px',
                  padding: '25px',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between', 
                  minHeight: '280px'
                }}
              >
                {/* Category Tag */}
                <span style={{ 
                    position: 'absolute', top: '20px', right: '20px', 
                    background: 'rgba(255, 193, 7, 0.1)', color: '#ffc107', 
                    padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' 
                }}>
                    {blog.category}
                </span>

                <div>
                    <h3 className="font-head" style={{ 
                        color: '#e6f1ff', 
                        fontSize: '1.4rem', 
                        marginTop: '25px', 
                        lineHeight: '1.4' 
                    }}>
                        {blog.title}
                    </h3>
                    <p style={{ 
                        color: '#8892b0', 
                        fontSize: '0.9rem', 
                        marginTop: '15px', 
                        display: '-webkit-box', 
                        WebkitLineClamp: 3, 
                        WebkitBoxOrient: 'vertical', 
                        overflow: 'hidden' 
                    }}>
                        {blog.content}
                    </p>
                </div>

                <div style={{ 
                    display: 'flex', alignItems: 'center', gap: '8px', 
                    color: '#64ffda', marginTop: '20px', 
                    fontWeight: 'bold', fontSize: '0.85rem' 
                }}>
                    READ FULL ARTICLE <ArrowRight size={16} />
                </div>
              </motion.div>
            ))
        )}
      </div>

      {/* --- READING MODAL (POPUP) --- */}
      <AnimatePresence>
        {selectedBlog && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
                zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', 
                padding: isMobile ? '10px' : '20px'
            }}
            onClick={() => setSelectedBlog(null)}
          >
            <motion.div
                initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: '#0a192f', 
                    width: '100%', 
                    maxWidth: '800px', 
                    maxHeight: '85vh',
                    borderRadius: '16px', 
                    border: '1px solid #ffc107',
                    overflowY: 'auto',
                    padding: isMobile ? '25px' : '40px',
                    position: 'relative',
                    boxShadow: '0 0 50px rgba(255, 193, 7, 0.1)'
                }}
            >
                <button 
                    onClick={() => setSelectedBlog(null)}
                    style={{ 
                        position: 'sticky', top: '0', float: 'right', 
                        background: 'none', border: 'none', color: '#ffc107', cursor: 'pointer',
                        zIndex: 10
                    }}
                >
                    <X size={28} />
                </button>

                <div style={{ marginTop: '10px' }}>
                    <span style={{ color: '#64ffda', fontSize: '0.85rem', letterSpacing: '1px' }}>
                        {selectedBlog.category?.toUpperCase()} • {selectedBlog.date ? new Date(selectedBlog.date).toDateString() : 'Recent'}
                    </span>
                    
                    <h1 className="font-head" style={{ 
                        fontSize: isMobile ? '1.8rem' : '2.5rem',
                        color: '#e6f1ff', 
                        margin: '15px 0 25px 0',
                        lineHeight: 1.2
                    }}>
                        {selectedBlog.title}
                    </h1>
                    
                    <div style={{ 
                        color: '#a8b2d1', 
                        fontSize: isMobile ? '1rem' : '1.1rem', 
                        lineHeight: '1.7', 
                        fontFamily: 'sans-serif', 
                        whiteSpace: 'pre-wrap' 
                    }}>
                        {selectedBlog.content}
                    </div>

                    <div style={{ 
                        marginTop: '40px', paddingTop: '20px', 
                        borderTop: '1px solid #233554', color: '#64ffda', 
                        fontStyle: 'italic', display: 'flex', 
                        justifyContent: 'space-between', fontSize: '0.9rem',
                        flexDirection: isMobile ? 'column' : 'row',
                        gap: isMobile ? '10px' : '0'
                    }}>
                        <span>Written by: {selectedBlog.author || 'Anonymous'}</span>
                        <span>{selectedBlog.date ? new Date(selectedBlog.date).toLocaleDateString() : ''}</span>
                     </div>
                </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
};

export default Blogs;