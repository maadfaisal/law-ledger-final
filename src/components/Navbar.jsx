import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react'; // Icons ke liye

const Navbar = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  // State
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // Mobile Menu Toggle
  const [scrolled, setScrolled] = useState(false); // Navbar background change on scroll
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // --- 1. RESPONSIVE & SCROLL LISTENER ---
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth > 768) setIsOpen(false); // Desktop banne par menu band karo
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // --- 2. USER CHECK LOGIC ---
  useEffect(() => {
    const checkUser = () => {
        const storedUser = localStorage.getItem("lawUser");
        setUser(storedUser);
    };
    checkUser();
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, [location]);

  // --- 3. SCROLL LOGIC ---
  const scrollToSection = (id) => {
    setIsOpen(false); // Link click karte hi mobile menu band ho jaye
    if (!isHomePage) {
      window.location.href = `/${id}`;
    } else {
      const element = document.getElementById(id.replace('#', ''));
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav style={{
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: isMobile ? '20px 20px' : '20px 50px', // Mobile par padding kam
        position: 'fixed', // Fixed taaki scroll ke saath chale
        width: '100%', 
        top: 0, 
        zIndex: 9999,
        transition: '0.3s ease',
        // Scroll hone par background dark aur blur ho jayega
        background: scrolled ? 'rgba(10, 25, 47, 0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        boxShadow: scrolled ? '0 10px 30px -10px rgba(2,12,27,0.7)' : 'none'
      }}>
        
        {/* LOGO */}
        <div 
          className="font-head" 
          style={{ fontSize: '1.5rem', fontWeight: 'bold', cursor:'pointer', zIndex: 10001 }} 
          onClick={() => window.location.href='/'}
        >
          LawLedger<span style={{ color: '#64ffda' }}>.</span>
        </div>
        
        {/* --- DESKTOP MENU (Hidden on Mobile) --- */}
        {!isMobile && (
          <div className="font-tech" style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
            <NavLinks scrollToSection={scrollToSection} />
            <UserButton user={user} />
          </div>
        )}

        {/* --- MOBILE HAMBURGER BUTTON (Visible only on Mobile) --- */}
        {isMobile && (
          <button 
            onClick={() => setIsOpen(!isOpen)}
            style={{ 
              background: 'transparent', border: 'none', color: '#64ffda', 
              cursor: 'pointer', zIndex: 10001 
            }}
          >
            {isOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        )}
      </nav>

      {/* --- MOBILE MENU OVERLAY --- */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ x: '100%' }} // Right side se aayega
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            style={{
              position: 'fixed', top: 0, right: 0,
              width: '75%', height: '100vh',
              background: '#112240', // Thoda light dark background
              zIndex: 10000,
              display: 'flex', flexDirection: 'column',
              justifyContent: 'center', alignItems: 'center',
              gap: '40px',
              boxShadow: '-10px 0px 30px -15px rgba(2,12,27,0.7)'
            }}
          >
            <NavLinks scrollToSection={scrollToSection} isMobile={true} />
            <UserButton user={user} isMobile={true} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Blur Backdrop when menu is open */}
      {isMobile && isOpen && (
        <div 
            onClick={() => setIsOpen(false)}
            style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh',
                background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(3px)',
                zIndex: 9999
            }}
        />
      )}
    </>
  );
};

// --- SUB-COMPONENTS (Code Clean Rakhne ke liye) ---

const NavLinks = ({ scrollToSection, isMobile }) => {
  const style = {
    background: 'transparent', border: 'none', color: '#ccd6f6',
    cursor: 'pointer', fontSize: isMobile ? '1.2rem' : '1rem', 
    fontFamily: 'Space Mono, monospace',
    transition: '0.2s',
    display: 'block' // Mobile par vertical spacing ke liye
  };

  return (
    <>
      <button onClick={() => scrollToSection('#home')} style={style} className="nav-hover">Home</button>
      <button onClick={() => scrollToSection('#blogs')} style={style} className="nav-hover">Blogs</button>
      <button onClick={() => scrollToSection('#library')} style={style} className="nav-hover">Library</button>
      <button onClick={() => scrollToSection('#notes')} style={style} className="nav-hover">Notes</button>
    </>
  );
};

const UserButton = ({ user, isMobile }) => {
  if (user) {
    return (
      <Link to="/admin" style={{ textDecoration: 'none' }}>
        <div style={{
            width: isMobile ? '50px' : '40px', 
            height: isMobile ? '50px' : '40px', 
            borderRadius: '50%',
            background: 'transparent', color: '#64ffda',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 'bold', fontSize: '1.2rem',
            border: '2px solid #64ffda', cursor: 'pointer',
            boxShadow: '0 0 10px rgba(100, 255, 218, 0.2)'
        }} title={`Logged in as ${user}`}>
            {user.charAt(0).toUpperCase()}
        </div>
      </Link>
    );
  }

  return (
    <Link to="/admin" style={{ 
        color: '#64ffda', textDecoration: 'none', 
        border:'1px solid #64ffda', 
        padding: isMobile ? '12px 25px' : '8px 16px', 
        borderRadius:'4px',
        fontFamily: 'Space Mono, monospace',
        fontSize: isMobile ? '1.1rem' : '0.9rem'
    }}>
        Login / Join
    </Link>
  );
};

export default Navbar;