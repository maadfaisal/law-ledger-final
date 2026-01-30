import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

const Background = () => {
  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100vh', 
      zIndex: -1, 
      // 👇 SABSE ZAROORI LINE: Iske bina buttons click nahi honge!
      pointerEvents: 'none', 
      // 👇 Fallback color (Agar 3D load hone me 1 sec lage to white flash na ho)
      backgroundColor: '#020c1b' 
    }}>
      <Canvas
        camera={{ position: [0, 0, 1] }}
        // 👇 Performance Boost: Stars ke liye antialias ki zarurat nahi hoti, isse phone fast chalega
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <Stars 
          radius={100} 
          depth={50} 
          count={5000} // Desktop/Mobile dono pe acha lagega
          factor={4} 
          saturation={0} 
          fade 
          speed={1} 
        />
      </Canvas>
    </div>
  );
};

export default Background;