'use client';

import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function Scene() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += 0.005;
    meshRef.current.rotation.y += 0.01;
    
    // Smooth interaction with mouse
    const targetScale = hovered ? 1.2 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#0891b2" />
      <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#4f46e5" />
      
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        <Sphere
          ref={meshRef}
          args={[1, 64, 64]}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <MeshDistortMaterial
            color={hovered ? "#0891b2" : "#06b6d4"}
            speed={3}
            distort={0.4}
            metalness={0.9}
            roughness={0.1}
          />
        </Sphere>
      </Float>
    </>
  );
}

export function ThreePlaceholder() {
  return (
    <div className="glass-card relative h-full min-h-[400px] overflow-hidden rounded-[2.5rem] p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/10 group">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div className="relative z-10 flex h-full flex-col">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-400">
            <span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
            Matière Interactive
          </div>
          <h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Exploration Sensorielle.</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Survolez pour manipuler l'énergie de la marketplace.</p>
        </div>
        
        <div className="flex-1 rounded-[2rem] bg-slate-50 dark:bg-slate-900/50 backdrop-blur-sm overflow-hidden border border-black/5 dark:border-white/5 shadow-inner">
          <Canvas dpr={[1, 2]}>
            <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={45} />
            <Scene />
          </Canvas>
        </div>
      </div>
    </div>
  );
}
