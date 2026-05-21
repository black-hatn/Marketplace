'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export function SignOutButton({ className, showLabel = true }: { className?: string; showLabel?: boolean }) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className={className}
    >
      <LogOut className="h-3.5 w-3.5" />
      {showLabel && <span className="hidden sm:inline">Quitter</span>}
    </button>
  );
}
