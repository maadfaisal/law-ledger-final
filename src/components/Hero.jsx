import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section id = 'Home' style={{ height: '100vh', display: 'flex', alignItems: 'center', padding: '0 10%', paddingTop: '80px' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
      >
        <span className="font-tech" style={{ color: '#64ffda' }}>v4.0 SYSTEM ONLINE</span>
        
        <h1 className="font-head" style={{ fontSize: '4rem', lineHeight: 1.1, margin: '20px 0' }}>
          Decoding Justice <br />
          <span style={{ color: 'transparent', WebkitTextStroke: '1px #e6f1ff' }}>Algorithmically.</span>
        </h1>
        
        <p style={{ maxWidth: '600px', color: '#8892b0', fontSize: '1.1rem', marginBottom: '30px' }}>
          The modern legal scholar's digital arsenal. Access landmark judgments and AI-summarized notes in real-time.
        </p>

        <button style={{
          padding: '15px 30px', background: '#64ffda', border: 'none', 
          fontWeight: 'bold', cursor: 'pointer', borderRadius: '4px', fontSize: '1rem'
        }}>
          Explore Library →
        </button>
      </motion.div>
    </section>
  );
};


export default Hero;