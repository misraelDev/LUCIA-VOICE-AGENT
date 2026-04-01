"use client";

import { useAuth } from "@/hooks/useAuth";

export default function DashboardWelcomePage() {
  const { user } = useAuth();

  const displayName =
    user?.fullName?.trim() ||
    (user?.email ? user.email.split("@")[0] : null) ||
    "Usuario";

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 pb-16 pt-8">
      <div className="max-w-md text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-[#462bdd]/80">
          LUCIA
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-gray-900">
          Bienvenido, {displayName}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-gray-600">
          Este es tu panel. Cuando tu organización configure las secciones
          disponibles, aparecerán en el menú lateral.
        </p>
      </div>
    </div>
  );
}
