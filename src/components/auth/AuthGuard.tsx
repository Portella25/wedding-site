"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { loading, authenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--champagne)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--gold)]"></div>
      </div>
    );
  }

  if (!authenticated) {
    return null; // O hook useAuth já redireciona
  }

  return <>{children}</>;
}
