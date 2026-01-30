import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 1. Mobile Check (Phone par cursor load hi mat karo to save battery/performance)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // 2. Mouse Movement & Hover Logic
    const mouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      // Check karo ki user kisi clickable cheez ke upar hai kya?
      const target = e.target;
      const isClickable = (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' ||
        target.closest('a') || 
        target.closest('button') ||
        target.classList.contains('clickable') ||
        window.getComputedStyle(target).cursor === 'pointer'
      );
      setIsHovering(isClickable);
    };

    // 3. Click "Strike" Logic
    const mouseDown = () => setIsClicking(true);
    const mouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mousedown", mouseDown);
    window.addEventListener("mouseup", mouseUp);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mousedown", mouseDown);
      window.removeEventListener("mouseup", mouseUp);
    };
  }, []);

  // Agar Mobile hai, toh kuch mat dikhao (Native touch use hoga)
  if (isMobile) return null;

  return (
    <motion.div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        fontSize: '32px',
        pointerEvents: 'none', // Click aar-paar jayega (Zaroori)
        zIndex: 99999,
        transformOrigin: 'bottom right', // Hammer pakadne ka handle point
        filter: 'drop-shadow(0 0 8px rgba(255, 193, 7, 0.4))' // Thoda neon glow
      }}
      animate={{
        x: mousePosition.x - 16, // Thoda center adjust kiya
        y: mousePosition.y - 16,
        // Click karne par Hammer ghumega (-45deg), nahi to normal (0)
        rotate: isClicking ? -45 : 0, 
        // Link par jane se thoda bada hoga
        scale: isHovering ? 1.2 : 1 
      }}
      transition={{
        type: 'spring',
        stiffness: 800,
        damping: 25, // Thoda snappy banaya
        mass: 0.5
      }}
    >
      🔨
    </motion.div>
  );
};

export default CustomCursor;