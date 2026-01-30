import React from 'react';

const Home = () => {
  return (
    <div style={{
      height: '100vh',        // Poori screen height
      width: '100vw',         // Poori screen width
      backgroundColor: '#7BC4E8', // Image ke sky color se match kiya
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      margin: 0,
      padding: 0
    }}>
      <img 
        src="/maintenance.png" 
        alt="Site Under Maintenance" 
        style={{
          maxWidth: '90%',      // Mobile par screen se bahar na jaye
          maxHeight: '90%',     // Screen ke andar rahe
          objectFit: 'contain',
          borderRadius: '20px', // Thoda stylish look
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)' // Thoda 3D effect
        }} 
      />
    </div>
  );
};

export default Home;