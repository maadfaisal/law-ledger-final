import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, PerspectiveCamera, Environment, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// --- ROBOT MODEL (Logic Same hai) ---
const RobotModel = ({ mouse, isStriking, setIsStriking }) => {
  const { scene, animations } = useGLTF('/robot.glb'); 
  const { actions } = useAnimations(animations, scene);
  const headRef = useRef();
  
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isBone && (child.name.includes('Head') || child.name.includes('Neck'))) {
        headRef.current = child;
      }
    });
  }, [scene]);

  useEffect(() => {
    if (isStriking) {
      const actionName = Object.keys(actions).find(key => key.toLowerCase().includes('attack') || key.toLowerCase().includes('hit')) || Object.keys(actions)[0];
      const action = actions[actionName];
      if (action) {
        action.reset().fadeIn(0.1).play();
        action.setLoop(THREE.LoopOnce);
        action.clampWhenFinished = true;
        setTimeout(() => { action.fadeOut(0.5); setIsStriking(false); }, 1000);
      }
    }
  }, [isStriking, actions, setIsStriking]);

  useFrame(() => {
    if (headRef.current) {
      const targetX = (mouse.current.x / window.innerWidth - 0.5) * 2;
      const targetY = -(mouse.current.y / window.innerHeight - 0.5) * 2;
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetX * 0.5, 0.1);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetY * 0.3, 0.1);
    }
  });

  return (
    <primitive 
      object={scene} 
      scale={1.7} // Thoda bada dikhega
      position={[0, -3, 0]} 
      rotation={[0, -0.5, 0]} // Thoda Left ki taraf muda hua (Text ki taraf dekhega)
    />
  );
};

// --- MAIN COMPONENT ---
const JudgeRobot = () => {
  const mouse = useRef({ x: 0, y: 0 });
  const [isStriking, setIsStriking] = useState(false);

  useEffect(() => {
    const handleMouseMove = (event) => {
      mouse.current = { x: event.clientX, y: event.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      style={{
        // 🔥 SUPER IMPORTANT SETTINGS
        position: 'fixed',      // Scroll se independent
        top: '80px',            // Navbar ke neeche
        right: '0px',           // 🔥 BILKUL RIGHT MEIN CHIPKA DIYA
        left: 'auto',           // 🔥 LEFT SE KOI WAASTA NAHI
        
        width: '500px',         // Width thodi badhai taaki kat na jaye
        height: '600px',        
        zIndex: 50,             
        pointerEvents: 'none',  // Aar-paar click allow karega
      }}
    >
      <div style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}>
        <Canvas>
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#64ffda" />
          <spotLight position={[-10, 20, 10]} angle={0.3} intensity={2} color="#ffc107" />

          <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />

          <OrbitControls 
             enableZoom={false} 
             enablePan={false}
             minPolarAngle={Math.PI / 3} 
             maxPolarAngle={Math.PI / 2}
          />

          <group onClick={() => setIsStriking(true)}>
             <RobotModel mouse={mouse} isStriking={isStriking} setIsStriking={setIsStriking} />
          </group>
          
          <Environment preset="city" />
        </Canvas>
      </div>
    </div>
  );
};

export default JudgeRobot;