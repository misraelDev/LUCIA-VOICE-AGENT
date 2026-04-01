import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recuperar contraseña | Lucía",
  description: "Recuperación de contraseña",
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 py-12">
      <div className="w-full max-w-md space-y-6 text-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          ¿Olvidaste tu contraseña?
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          Por ahora la recuperación automática no está disponible en la app. Si
          necesitas restablecer tu acceso, contacta al administrador de tu
          organización o al equipo de soporte de Lucía.
        </p>
        <Link
          href="/auth/login"
          className="inline-flex text-sm font-medium text-[#1868db] hover:text-[#1458c4] underline-offset-2 hover:underline"
        >
          Volver al inicio de sesión
        </Link>
      </div>
    </div>
  );
}
