import React from 'react';

const NewsTicker = () => {
  return (
    <div style={{
      margin: '40px 0', padding: '15px',
      background: 'rgba(2, 12, 27, 0.8)',
      border: '3px solid transparent',
      borderImage: 'linear-gradient(45deg, #ff0000, #ffc107, #64ffda, #0000ff) 1',
      color: '#64ffda', fontFamily: 'Space Mono, monospace',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 0 15px rgba(100, 255, 218, 0.2)'
    }}>
      <span style={{
        height: '10px', width: '10px', backgroundColor: 'red',
        borderRadius: '50%', display: 'inline-block', marginRight: '10px',
        boxShadow: '0 0 10px red'
      }}></span>
      <span>
        LATEST: Supreme Court begins hearing on Art 370 | New Guidelines for Digital Data Protection Bill released...
      </span>
    </div>
  );
};

export default NewsTicker;