import Link from 'next/link';
import { notFound } from 'next/navigation';
import { navigationSections } from '@/lib/content';

type SubpagePageProps = {
  params: { section: string; subpage: string };
};

export const generateStaticParams = () =>
  navigationSections.flatMap((section) =>
    section.links.map((link) => ({
      section: section.id,
      subpage: link.href.split('/').pop() ?? ''
    }))
  );

export default function SubpagePage({ params }: SubpagePageProps) {
  const section = navigationSections.find((item) => item.id === params.section);
  if (!section) {
    notFound();
  }

  const page = section.links.find((link) => link.href.endsWith(`/${params.subpage}`));
  if (!page) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="relative mx-auto flex max-w-[1600px] flex-col gap-10 px-6 py-16">
        <div className="rounded-[2.5rem] border border-white/10 bg-slate-900/85 p-10 shadow-glow backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">{section.title}</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-white">{page.label}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
            Contenu présenté pour {page.label.toLowerCase()} dans l’univers {section.title}. Découvrez des tendances, inspirations et services adaptés aux besoins premium.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link href={section.href} className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">
              Retour à {section.title}
            </Link>
            <Link href="/produits" className="inline-flex items-center justify-center rounded-full border border-white/10 bg-slate-800/80 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              Explorer le catalogue
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {section.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-glow transition hover:-translate-y-1 hover:bg-slate-900/95"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">{section.title}</p>
                  <h2 className="mt-4 text-3xl font-semibold text-white">{link.label}</h2>
                </div>
                <span className="rounded-full bg-cyan-500/15 px-3 py-2 text-xs uppercase tracking-[0.25em] text-cyan-100">Voir</span>
              </div>
              <p className="mt-6 text-sm leading-7 text-slate-300">Accédez à toute la sous-section {link.label.toLowerCase()} et découvrez les offres les plus adaptées.</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
