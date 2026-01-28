import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  // State to track user
  const [user, setUser] = useState(null);

  // Check login on load & change
  useEffect(() => {
    const checkUser = () => {
        const storedUser = localStorage.getItem("lawUser");
        setUser(storedUser);
    };
    
    checkUser();
    // Ek listener taaki jab login ho to navbar turant update ho
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, [location]); // Location change hone par bhi re-check karega

  const scrollToSection = (id) => {
    if (!isHomePage) {
      window.location.href = `/${id}`;
    } else {
      const element = document.getElementById(id.replace('#', ''));
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav style={{
      display: 'flex', justifyContent: 'space-between', padding: '20px 50px',
      position: 'absolute', width: '100%', top: 0, zIndex: 9999,
      borderBottom: '1px solid rgba(100,255,218,0.1)', boxSizing: 'border-box', background: 'transparent',
      pointerEvents: 'auto'
    }}>
      <div className="font-head" style={{ fontSize: '1.5rem', fontWeight: 'bold', cursor:'pointer' }} onClick={() => window.location.href='/'}>
        LawLedger<span style={{ color: '#64ffda' }}>.</span>
      </div>
      
      <div className="font-tech" style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
        <button onClick={() => scrollToSection('#home')} style={btnStyle}>Home</button>
        <button onClick={() => scrollToSection('#blogs')} style={btnStyle}>Blogs</button>
        <button onClick={() => scrollToSection('#library')} style={btnStyle}>Library</button>
        <button onClick={() => scrollToSection('#notes')} style={btnStyle}>Notes</button>
        
        {/* --- DYNAMIC PROFILE LOGIC --- */}
        {user ? (
            // 🟢 AGAR LOGGED IN HAI: Show Profile Circle
            <Link to="/admin" style={{ textDecoration: 'none' }}>
                <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: '#64ffda', color: '#020c1b',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 'bold', fontSize: '1.2rem',
                    border: '2px solid #e6f1ff', cursor: 'pointer'
                }} title={`Logged in as ${user}`}>
                    {user.charAt(0).toUpperCase()} {/* Pehla Letter */}
                </div>
            </Link>
        ) : (
            // 🔴 AGAR LOGGED OUT HAI: Show Login Button
            <Link to="/admin" style={{ 
                color: '#ffc107', textDecoration: 'none', border:'1px solid #ffc107', 
                padding:'5px 10px', borderRadius:'4px' 
            }}>
                Login / Join
            </Link>
        )}

      </div>
    </nav>
  );
};

const btnStyle = {
  background: 'transparent', border: 'none', color: '#8892b0',
  cursor: 'pointer', fontSize: '1rem', fontFamily: 'Space Mono, monospace'
};

export default Navbar;