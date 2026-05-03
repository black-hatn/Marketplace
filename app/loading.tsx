export default function LoadingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
      <div className="flex flex-col items-center gap-4 rounded-[2rem] border border-white/10 bg-slate-900/80 px-10 py-8 shadow-glow backdrop-blur-xl">
        <div className="h-24 w-24 animate-spin rounded-full border-4 border-cyan-300 border-t-transparent" />
        <p className="text-base text-slate-300">Chargement du contenu...</p>
      </div>
    </div>
  );
}
