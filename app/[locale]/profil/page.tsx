import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/actions";
import { ProfileForm } from "@/components/ProfileForm";
import { User, Heart, ShoppingBag, LogOut, ShieldCheck, ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/routing";
import PageTransition from "@/components/PageTransition";

export const dynamic = 'force-dynamic';

export default async function ClientProfilePage() {
  const session = await getServerSession(authOptions) as any;

  if (!session) {
    redirect("/admin/login");
  }

  const profile = await getUserProfile(session.user.id, session.user.role);

  if (!profile) {
    redirect("/");
  }

  return (
    <PageTransition>
      <div className="relative w-full min-h-screen bg-[#030303] text-white overflow-hidden selection:bg-cyan-500/30 pb-24">
        {/* Background glow effects */}
        <div className="fixed top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none" />
        <div className="fixed bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />

        <div className="h-24 sm:h-32"></div>

        <main className="relative z-10 max-w-6xl mx-auto px-6 sm:px-12 grid lg:grid-cols-[350px_1fr] gap-12">
          
          {/* Sidebar Info */}
          <div className="space-y-8">
            <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group hover:border-white/10 transition-all">
               <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
               
               <div className="flex flex-col items-center text-center relative z-10">
                  <div className="h-24 w-24 rounded-[2rem] bg-white/5 flex items-center justify-center mb-5 overflow-hidden ring-1 ring-white/10 shadow-xl group-hover:scale-105 transition-transform">
                    {profile.image ? (
                      <img src={profile.image} alt={(profile as any).nom || (profile as any).name} className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-10 w-10 text-cyan-400" />
                    )}
                  </div>
                  <h2 className="text-xl font-black text-white tracking-tight">{(profile as any).prenom || ""} {(profile as any).nom || (profile as any).name}</h2>
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-1.5 flex items-center gap-1.5 justify-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Client Privilège
                  </p>
               </div>

               <div className="mt-10 space-y-3 relative z-10">
                  {[
                    { label: "Mes Commandes", icon: ShoppingBag, href: "/mes-commandes" },
                    { label: "Mes Favoris", icon: Heart, href: "/favoris" },
                  ].map((link, i) => (
                    <Link 
                      key={i} 
                      href={link.href as any}
                      className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all text-xs font-bold text-white/70 hover:text-white group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-cyan-500/10 group-hover:text-cyan-400 transition-colors">
                        <link.icon className="h-4 w-4" />
                      </div>
                      {link.label}
                    </Link>
                  ))}
               </div>
            </div>

            <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-cyan-400 transition-colors px-4">
              <ArrowLeft className="w-4 h-4" />
              Retour à l'accueil
            </Link>
          </div>

          {/* Form Area */}
          <div>
             <div className="mb-12">
                <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tighter">
                  Mon <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Profil</span>
                </h1>
                <p className="text-white/40 font-medium mt-3 text-sm">Personnalisez votre compte pour une expérience d'achat sur mesure.</p>
             </div>
             
             <div className="glass-card p-8 sm:p-12 rounded-[3rem] border border-white/5">
                <ProfileForm user={profile} role={session.user.role} />
             </div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
