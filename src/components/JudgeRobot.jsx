import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, PerspectiveCamera, Environment, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// --- ROBOT MODEL ---
const RobotModel = ({ mouse, isStriking, setIsStriking }) => {
  const { scene, animations } = useGLTF('/robot.glb'); 
  const { actions } = useAnimations(animations, scene);
  const headRef = useRef();
  
  // Head Tracking
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isBone && (child.name.includes('Head') || child.name.includes('Neck'))) {
        headRef.current = child;
      }
    });
  }, [scene]);

  // Hammer Animation
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

  // Head Rotation
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
      scale={1.6} // 👇 SIZE THODA CHOTA KIYA (Taaki frame mein fit aaye)
      position={[0, -2.8, 0]} // 👇 POSITION ADJUST KI (Thoda neeche khiskaya)
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
        position: 'absolute', 
        top: '100px',      
        right: '2%',       // 👇 Thoda dynamic rakha taaki screen se kate nahi
        width: '400px',    // 👇 WIDTH BADHAYI
        height: '600px',   // 👇 HEIGHT BADHAYI (Ab pair nahi katenge)
        zIndex: 50,        
        pointerEvents: 'auto', 
      }}
    >
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#64ffda" />
        <spotLight position={[-10, 20, 10]} angle={0.3} intensity={2} color="#ffc107" />

        {/* 👇 CAMERA PEECHE LIYA (Z = 8) taaki pura view aaye */}
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
  );
};

export default JudgeRobot;