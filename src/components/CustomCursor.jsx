import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const mouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", mouseMove);
    return () => window.removeEventListener("mousemove", mouseMove);
  }, []);

  return (
    <motion.div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        fontSize: '32px', // Hammer ka size yahan se adjust karo
        pointerEvents: 'none', // TA-DA! Sabse zaroori line. Click aar-paar jayega.
        zIndex: 99999, // Sabse upar
        transform: 'translate(-50%, -50%)', // Center align taaki nok par click ho
        // Agar thoda aur "style" chahiye to ye uncomment kar sakte ho:
        // filter: 'drop-shadow(0 0 5px #ffc107)' 
      }}
      animate={{
        x: mousePosition.x,
        y: mousePosition.y
      }}
      // Thoda smooth movement ke liye spring physics
      transition={{ type: 'spring', stiffness: 800, damping: 35 }}
    >
      🔨
    </motion.div>
  );
};

export default CustomCursor;