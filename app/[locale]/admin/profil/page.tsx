import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/actions";
import { ProfileForm } from "@/components/ProfileForm";
import { ShieldCheck, UserCircle } from "lucide-react";

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
      {/* ── Header ────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-2">Configuration</p>
          <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
            <UserCircle className="w-8 h-8 text-cyan-400" />
            Profil Administrateur
          </h1>
        </div>
      </div>

      <div className="glass-card bg-violet-500/10 p-6 rounded-[2rem] border border-violet-500/20 mb-8 max-w-2xl">
         <p className="text-sm text-violet-300 font-bold flex items-center gap-3">
           <ShieldCheck className="h-5 w-5 text-violet-400" /> 
           En tant qu'administrateur système, toutes vos modifications sont tracées dans les journaux d'audit.
         </p>
      </div>

      <div className="max-w-2xl">
        <ProfileForm user={profile} role={session.user.role} />
      </div>
    </div>
  );
}
