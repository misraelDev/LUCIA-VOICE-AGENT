"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AgentProvider } from "@/contexts/agent-context";

/**
 * En /auth/* no hace falta Retell, verify-agents ni carga de modelo: evita trabajo pesado
 * en login/registro y reduce ruido en consola (HMR + doble mount en dev).
 */
export function ConditionalAgentProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";
  const isAuthRoute = pathname.startsWith("/auth");

  if (isAuthRoute) {
    return <>{children}</>;
  }

  return <AgentProvider>{children}</AgentProvider>;
}
