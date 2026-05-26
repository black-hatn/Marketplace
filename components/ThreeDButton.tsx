'use client';

import { useState } from 'react';
import { Rotate3d } from 'lucide-react';
import { ThreeDPreview } from './ThreeDPreview';
import { motion } from 'framer-motion';

type ThreeDStyle = 'cube' | 'sphere' | 'torus' | 'cylinder';

export function ThreeDButton({ title, style = 'cube' }: { title: string; style?: ThreeDStyle }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05, y: -1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl glass border-blue-500/20 text-xs font-black text-blue-400 hover:bg-blue-500 hover:text-white transition-colors group uppercase tracking-widest shadow-lg shadow-blue-500/5"
      >
        <Rotate3d className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700 text-blue-400 group-hover:text-white" />
        Visualisation 3D
      </motion.button>

      <ThreeDPreview open={open} onClose={() => setOpen(false)} title={title} style={style} />
    </>
  );
}

