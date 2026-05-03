'use client';

export function ProductCardSkeleton() {
  return (
    <article className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-glow backdrop-blur-xl">
      <div className="skeleton h-48 rounded-[1.5rem]" />
      <div className="mt-5 space-y-3">
        <div className="skeleton h-5 w-3/4 rounded-full" />
        <div className="skeleton h-4 w-1/2 rounded-full" />
        <div className="skeleton h-4 w-full rounded-full" />
      </div>
    </article>
  );
}
