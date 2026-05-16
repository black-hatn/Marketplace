'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Float, MeshDistortMaterial, MeshWobbleMaterial, PerspectiveCamera, Environment } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import { X, Rotate3d, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ThreeDPreview({ open, onClose, title }: { open: boolean, onClose: () => void, title: string }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-12"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/90 backdrop-blur-3xl" onClick={onClose} />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl aspect-square sm:aspect-video glass rounded-[3rem] border border-white/10 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-8 flex items-center justify-between relative z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-blue-400">
                  <Rotate3d className="w-5 h-5 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Vision Immersive 360°</span>
                </div>
                <h3 className="text-2xl font-bold text-white">{title}</h3>
              </div>
              <button 
                onClick={onClose}
                className="w-12 h-12 rounded-full glass flex items-center justify-center text-white/40 hover:text-white transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* 3D Scene */}
            <div className="flex-1 relative cursor-grab active:cursor-grabbing">
              <Suspense fallback={
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-white/20" />
                </div>
              }>
                <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 4], fov: 50 }}>
                  <color attach="background" args={['#000']} />
                  <fog attach="fog" args={['#000', 5, 15]} />
                  
                  <Stage environment="city" intensity={0.6} contactShadow={false}>
                    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                      <mesh castShadow receiveShadow>
                        <boxGeometry args={[1, 1, 1]} />
                        <MeshDistortMaterial
                          color="#3b82f6"
                          speed={3}
                          distort={0.4}
                          radius={1}
                        />
                      </mesh>
                    </Float>
                  </Stage>

                  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
                    <planeGeometry args={[10, 10]} />
                    <meshStandardMaterial color="#050505" transparent opacity={0.5} />
                  </mesh>

                  <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} enablePan={false} minDistance={2} maxDistance={6} />
                </Canvas>
              </Suspense>

              {/* Interaction Guide */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-3 rounded-2xl glass border-white/5 text-[10px] font-bold text-white/30 uppercase tracking-widest pointer-events-none">
                Utilisez votre souris pour pivoter l&apos;objet
              </div>
            </div>

            {/* Footer / Specs */}
            <div className="p-8 border-t border-white/5 bg-white/[0.02] flex items-center justify-between">
              <div className="flex gap-12">
                <div>
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Maillage</p>
                  <p className="text-sm font-bold text-white">42,800 Polys</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Textures</p>
                  <p className="text-sm font-bold text-white">4K PBR Materials</p>
                </div>
              </div>
              <div className="hidden sm:block">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Technologie WebGL 2.0</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
