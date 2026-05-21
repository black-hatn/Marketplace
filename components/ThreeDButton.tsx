'use client';

import { useState } from 'react';
import { Rotate3d } from 'lucide-react';
import { ThreeDPreview } from './ThreeDPreview';

type ThreeDStyle = 'cube' | 'sphere' | 'torus' | 'cylinder';

export function ThreeDButton({ title, style = 'cube' }: { title: string; style?: ThreeDStyle }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass border-blue-500/20 text-xs font-bold text-blue-400 hover:bg-blue-400 hover:text-black transition-all group"
      >
        <Rotate3d className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />
        Visualisation 3D
      </button>

      <ThreeDPreview open={open} onClose={() => setOpen(false)} title={title} style={style} />
    </>
  );
}
