"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function useAuth() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [guestName, setGuestName] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("wedding_token");
      const storedName = localStorage.getItem("guest_name");

      if (!token) {
        setAuthenticated(false);
        setLoading(false);
        if (pathname !== "/") {
          router.push("/");
        }
        return;
      }

      setGuestName(storedName);
      setAuthenticated(true);
      setLoading(false);
    };

    checkAuth();
  }, [router, pathname]);

  const logout = () => {
    localStorage.removeItem("wedding_token");
    localStorage.removeItem("guest_name");
    localStorage.removeItem("guest_id");
    router.push("/");
  };

  return { loading, authenticated, guestName, logout };
}
