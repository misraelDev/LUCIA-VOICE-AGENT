"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { menuItemsFromNavKeys } from "@/config/dashboard-navigation-registry";
import {
  userService,
  DASHBOARD_NAV_CHANGED_EVENT,
} from "@/services/UserService";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading || !user) return;

    const redirectFromNav = () => {
      const tenant = userService.getStoredTenantBrief();
      const rawKeys = userService.getStoredNavigationKeys() ?? [];
      const items = menuItemsFromNavKeys(rawKeys);
      const sinTenantOPermisos = tenant === null || items.length === 0;

      if (sinTenantOPermisos) {
        router.replace("/dashboard/welcome");
        return;
      }
      router.replace(items[0].url);
    };

    redirectFromNav();
    window.addEventListener(DASHBOARD_NAV_CHANGED_EVENT, redirectFromNav);
    return () =>
      window.removeEventListener(DASHBOARD_NAV_CHANGED_EVENT, redirectFromNav);
  }, [router, user, loading]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-gray-600">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-3 px-4">
        <p className="text-center text-gray-600">No hay sesión activa.</p>
        <Link
          href="/auth/login"
          className="text-[#1868db] underline hover:text-[#1458c4]"
        >
          Ir a iniciar sesión
        </Link>
      </div>
    );
  }

  return null;
}

