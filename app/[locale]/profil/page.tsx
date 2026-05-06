import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/actions";
import { ProfileForm } from "@/components/ProfileForm";
import { User, Heart, ShoppingBag } from "lucide-react";
import { Link } from "@/i18n/routing";

export const dynamic = 'force-dynamic';

export default async function ClientProfilePage() {
  const session = await getServerSession(authOptions) as any;

  if (!session) {
    redirect("/admin/login"); // Or a specific client login
  }

  const profile = await getUserProfile(session.user.id, session.user.role);

  if (!profile) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-12">
        
        {/* Sidebar Info */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-black/5 dark:border-white/10 shadow-xl shadow-black/5">
             <div className="flex flex-col items-center text-center">
                <div className="h-24 w-24 rounded-full bg-cyan-500/10 flex items-center justify-center mb-4 overflow-hidden ring-4 ring-slate-50 dark:ring-slate-800">
                  {profile.image ? (
                    <img src={profile.image} alt={(profile as any).nom || (profile as any).name} className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-12 w-12 text-cyan-600" />
                  )}
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{(profile as any).prenom || ""} {(profile as any).nom || (profile as any).name}</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Client Privilège</p>
             </div>

             <div className="mt-10 space-y-2">
                {[
                  { label: "Mes Commandes", icon: ShoppingBag, href: "/mes-commandes" },
                  { label: "Mes Favoris", icon: Heart, href: "/favoris" },
                ].map((link, i) => (
                  <Link 
                    key={i} 
                    href={link.href as any}
                    className="flex items-center gap-3 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-sm font-bold text-slate-600 dark:text-slate-300 group"
                  >
                    <link.icon className="h-5 w-5 group-hover:text-cyan-600 transition-colors" />
                    {link.label}
                  </Link>
                ))}
             </div>
          </div>
        </div>

        {/* Form Area */}
        <div className="lg:col-span-2">
           <div className="mb-10">
              <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Mon <span className="text-cyan-600">Profil</span></h1>
              <p className="text-slate-500 font-medium mt-1">Personnalisez votre compte pour une meilleure expérience d'achat.</p>
           </div>
           
           <ProfileForm user={profile} role={session.user.role} />
        </div>
      </div>
    </div>
  );
}
