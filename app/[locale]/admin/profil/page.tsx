import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/actions";
import { ProfileForm } from "@/components/ProfileForm";
import { ChevronRight, ShieldCheck } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminProfilePage() {
  const session = await getServerSession(authOptions) as any;

  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const profile = await getUserProfile(session.user.id, session.user.role);

  if (!profile) {
    redirect("/admin");
  }

  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
          <span>Panel Administration</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-violet-600">Mon Profil Admin</span>
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight flex items-center gap-4">
          <ShieldCheck className="h-10 w-10 text-violet-600" /> Profil Administrateur
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">Mettez à jour vos identifiants de sécurité et votre avatar.</p>
      </div>

      <div className="bg-violet-50 dark:bg-violet-500/5 p-6 rounded-3xl border border-violet-100 dark:border-violet-500/10 mb-8 max-w-2xl">
         <p className="text-sm text-violet-700 dark:text-violet-300 font-medium flex items-center gap-2">
           <ShieldCheck className="h-4 w-4" /> En tant qu'administrateur, vos modifications affectent les journaux système.
         </p>
      </div>

      <ProfileForm user={profile} role={session.user.role} />
    </div>
  );
}
