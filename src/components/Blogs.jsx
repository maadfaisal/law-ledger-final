import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X, ArrowRight } from 'lucide-react';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null); // Modal ke liye
  const [loading, setLoading] = useState(true);

  // Fetch Blogs
  useEffect(() => {
    fetch('http://localhost:5000/api/blogs')
      .then(res => res.json())
      .then(data => { setBlogs(data); setLoading(false); })
      .catch(err => setLoading(false));
  }, []);

  return (
    <section id="blogs" style={{ padding: '80px 10%', position: 'relative', zIndex: 100 }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h2 className="font-head" style={{ fontSize: '3rem', color: '#e6f1ff' }}>
          Legal <span style={{ color: '#ffc107' }}>Insights</span>
        </h2>
        <p style={{ color: '#8892b0' }}>Deep dives into complex legal matters.</p>
      </div>

      {/* Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
        
        {loading ? <p style={{color:'white'}}>Loading thoughts...</p> : blogs.map((blog, index) => (
          <motion.div 
            key={blog._id || index}
            whileHover={{ y: -10, boxShadow: '0 10px 30px rgba(255, 193, 7, 0.2)' }}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            onClick={() => setSelectedBlog(blog)} // Open Modal
            style={{
              background: 'rgba(2, 12, 27, 0.7)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 193, 7, 0.2)', // Gold Border
              borderRadius: '16px',
              padding: '30px',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '300px'
            }}
          >
            {/* Category Tag */}
            <span style={{ 
                position: 'absolute', top: '20px', right: '20px', 
                background: 'rgba(255, 193, 7, 0.1)', color: '#ffc107', 
                padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' 
            }}>
                {blog.category}
            </span>

            <div>
                <h3 className="font-head" style={{ color: '#e6f1ff', fontSize: '1.5rem', marginTop: '20px', lineHeight: '1.4' }}>
                    {blog.title}
                </h3>
                <p style={{ color: '#8892b0', fontSize: '0.95rem', marginTop: '15px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {blog.content}
                </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64ffda', marginTop: '20px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                READ FULL ARTICLE <ArrowRight size={16} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* --- READING MODAL (POPUP) --- */}
      <AnimatePresence>
        {selectedBlog && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)',
                zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
            }}
            onClick={() => setSelectedBlog(null)} // Close on background click
          >
            <motion.div
                initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside content
                style={{
                    background: '#0a192f', width: '100%', maxWidth: '800px', maxHeight: '80vh',
                    borderRadius: '20px', border: '1px solid #ffc107',
                    overflowY: 'auto', padding: '40px', position: 'relative',
                    boxShadow: '0 0 50px rgba(255, 193, 7, 0.1)'
                }}
            >
                <button 
                    onClick={() => setSelectedBlog(null)}
                    style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#ffc107', cursor: 'pointer' }}
                >
                    <X size={30} />
                </button>

                <span style={{ color: '#64ffda', fontSize: '0.9rem', letterSpacing: '1px' }}>
                    {selectedBlog.category.toUpperCase()} • {new Date(selectedBlog.date).toDateString()}
                </span>
                
                <h1 className="font-head" style={{ fontSize: '2.5rem', color: '#e6f1ff', margin: '15px 0 30px 0' }}>
                    {selectedBlog.title}
                </h1>
                
                <div style={{ color: '#a8b2d1', fontSize: '1.1rem', lineHeight: '1.8', fontFamily: 'sans-serif', whiteSpace: 'pre-wrap' }}>
                    {selectedBlog.content}
                </div>
                {/* Modal ke sabse neeche */}
                <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #233554', color: '#64ffda', fontStyle: 'italic', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Written by: {selectedBlog.author || 'Anonymous User'}</span>
                    <span>{new Date(selectedBlog.date).toLocaleDateString()}</span>
                 </div>
            </motion.div>
          </motion.div>
          
        )}
      </AnimatePresence>

    </section>
  );
};

export default Blogs;