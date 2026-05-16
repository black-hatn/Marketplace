'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const allImages = images.length > 0 ? images : ['/placeholder.jpg'];

  const prev = () => setCurrent((c) => (c === 0 ? allImages.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === allImages.length - 1 ? 0 : c + 1));

  return (
    <div className="space-y-6">
      {/* Main Image View */}
      <div 
        className="relative aspect-square w-full rounded-[2.5rem] overflow-hidden bg-surface-light group cursor-zoom-in border border-white/5"
        onClick={() => setLightbox(true)}
      >
        <AnimatePresence mode="wait">
          <motion.div 
            key={current} 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.4 }} 
            className="absolute inset-0"
          >
            <Image 
              src={allImages[current]} 
              alt={`${title} ${current + 1}`} 
              fill 
              unoptimized={true}
              className="object-cover transition-transform duration-700 group-hover:scale-105" 
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-white">
            <ZoomIn className="w-6 h-6" />
          </div>
        </div>

        {/* Floating Nav */}
        {allImages.length > 1 && (
          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
            <button 
              onClick={(e) => { e.stopPropagation(); prev(); }} 
              className="h-12 w-12 rounded-full glass flex items-center justify-center text-white hover:bg-white hover:text-black transition-all pointer-events-auto opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); next(); }} 
              className="h-12 w-12 rounded-full glass flex items-center justify-center text-white hover:bg-white hover:text-black transition-all pointer-events-auto opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        )}
      </div>

      {/* Thumbnails Grid */}
      {allImages.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
          {allImages.map((img, i) => (
            <button 
              key={i} 
              onClick={() => setCurrent(i)} 
              className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                i === current ? 'border-blue-500 scale-95' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <Image src={img} alt={`${title} ${i + 1}`} fill unoptimized={true} className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {lightbox && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl"
            onClick={() => setLightbox(false)}
          >
            <button className="absolute top-8 right-8 text-white/60 hover:text-white p-4">
              <X className="w-8 h-8" />
            </button>
            
            <div className="relative w-full h-[80vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <div className="relative w-full h-full max-w-[90vw]">
                <Image src={allImages[current]} alt={title} fill unoptimized={true} className="object-contain" />
              </div>
              
              {allImages.length > 1 && (
                <>
                  <button onClick={prev} className="absolute left-8 h-16 w-16 rounded-full glass flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
                    <ChevronLeft className="h-8 w-8" />
                  </button>
                  <button onClick={next} className="absolute right-8 h-16 w-16 rounded-full glass flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
                    <ChevronRight className="h-8 w-8" />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
