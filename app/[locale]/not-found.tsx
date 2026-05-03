import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-xl rounded-[2rem] border border-white/10 bg-slate-900/80 p-10 text-center shadow-glow backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Page introuvable</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">Oups, cette page n’existe pas.</h1>
        <p className="mt-4 text-sm leading-7 text-slate-300">Retournez à la page d’accueil ou explorez nos catégories premium.</p>
        <Link href="/" className="mt-8 inline-flex rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">
          Retour à l’accueil
        </Link>
      </div>
    </main>
  );
}
