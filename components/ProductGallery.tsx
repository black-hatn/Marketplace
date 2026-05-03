'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const allImages = images.length > 0 ? images : ['/placeholder.jpg'];

  const prev = () => setCurrent((c) => (c === 0 ? allImages.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === allImages.length - 1 ? 0 : c + 1));

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative h-[420px] sm:h-[500px] w-full rounded-[2rem] overflow-hidden bg-slate-100 dark:bg-slate-900 group cursor-zoom-in" onClick={() => setLightbox(true)}>
          <AnimatePresence mode="wait">
            <motion.div key={current} initial={{ opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="absolute inset-0">
              <Image src={allImages[current]} alt={`${title} ${current + 1}`} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
            </motion.div>
          </AnimatePresence>

          {/* Overlay Zoom */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors">
            <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-all drop-shadow-xl" />
          </div>

          {/* Nav Arrows */}
          {allImages.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl bg-white/90 dark:bg-slate-900/90 shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 transition-all opacity-0 group-hover:opacity-100">
                <ChevronLeft className="h-5 w-5 text-slate-700 dark:text-white" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl bg-white/90 dark:bg-slate-900/90 shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 transition-all opacity-0 group-hover:opacity-100">
                <ChevronRight className="h-5 w-5 text-slate-700 dark:text-white" />
              </button>
            </>
          )}

          {/* Dots */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              {allImages.map((_, i) => (
                <button key={i} onClick={(e) => { e.stopPropagation(); setCurrent(i); }} className={`h-1.5 rounded-full transition-all ${i === current ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`} />
              ))}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {allImages.length > 1 && (
          <div className="grid grid-cols-4 gap-3">
            {allImages.map((img, i) => (
              <button key={i} onClick={() => setCurrent(i)} className={`relative h-20 rounded-xl overflow-hidden ring-2 transition-all ${i === current ? 'ring-cyan-500 ring-offset-2 dark:ring-offset-slate-950' : 'ring-transparent hover:ring-slate-300 dark:hover:ring-slate-600'}`}>
                <Image src={img} alt={`${title} ${i + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={() => setLightbox(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="relative max-h-[90vh] max-w-[90vw] w-full h-full" onClick={(e) => e.stopPropagation()}>
              <Image src={allImages[current]} alt={title} fill className="object-contain" />
            </motion.div>
            <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center">
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center">
              <ChevronRight className="h-6 w-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
