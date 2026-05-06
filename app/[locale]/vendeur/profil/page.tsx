import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/actions";
import { ProfileForm } from "@/components/ProfileForm";
import { ChevronRight, Settings } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function VendorProfilePage() {
  const session = await getServerSession(authOptions) as any;

  if (!session || (session.user.role !== "VENDOR" && session.user.role !== "ADMIN")) {
    redirect("/admin/login");
  }

  const profile = await getUserProfile(session.user.id, session.user.role);

  if (!profile) {
    redirect("/vendeur/dashboard");
  }

  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
          <span>Dashboard Vendeur</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-cyan-600">Mon Profil</span>
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight flex items-center gap-4">
          <Settings className="h-10 w-10 text-cyan-600" /> Paramètres de Profil
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">Gérez vos informations personnelles et votre identité visuelle.</p>
      </div>

      <ProfileForm user={profile} role={session.user.role} />
    </div>
  );
}
