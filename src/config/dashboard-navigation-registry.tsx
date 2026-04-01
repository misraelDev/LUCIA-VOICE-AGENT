"use client";

import type * as React from "react";
import Image from "next/image";
import {
  isDashboardNavSectionId,
  type DashboardNavSectionId,
} from "@/types/dashboard-navigation";

export type DashboardNavKey = DashboardNavSectionId;

export type DashboardNavMenuItem = {
  key: string;
  title: string;
  url: string;
  icon: () => React.ReactElement;
};

function NavMenuIcon({ src, alt }: { src: string; alt: string }) {
  return (
    <span className="relative block size-[22px] shrink-0">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain"
        sizes="22px"
      />
    </span>
  );
}

const REGISTRY: Record<
  DashboardNavSectionId,
  Omit<DashboardNavMenuItem, "key">
> = {
  user_home: {
    title: "Inicio",
    url: "/dashboard/user/home",
    icon: () => <NavMenuIcon src="/das/dash.svg" alt="Inicio" />,
  },
  user_call_history: {
    title: "Historial de llamadas",
    url: "/dashboard/user/call-history",
    icon: () => (
      <NavMenuIcon src="/das/message.svg" alt="Historial de llamadas" />
    ),
  },
  user_conversations: {
    title: "Conversaciones",
    url: "/dashboard/user/conversations",
    icon: () => <NavMenuIcon src="/das/message.svg" alt="Conversaciones" />,
  },
  user_appointments: {
    title: "Citas",
    url: "/dashboard/user/appointments",
    icon: () => <NavMenuIcon src="/das/apoitment.svg" alt="Citas" />,
  },
  user_contacts: {
    title: "Contactos",
    url: "/dashboard/user/contacts",
    icon: () => <NavMenuIcon src="/das/user.svg" alt="Contactos" />,
  },
  admin_home: {
    title: "Inicio",
    url: "/dashboard/admin/home",
    icon: () => <NavMenuIcon src="/das/dash.svg" alt="Inicio" />,
  },
  admin_users: {
    title: "Usuarios",
    url: "/dashboard/admin/users",
    icon: () => <NavMenuIcon src="/das/user.svg" alt="Usuarios" />,
  },
  admin_tenants: {
    title: "Tenants y menú",
    url: "/dashboard/admin/tenants",
    icon: () => <NavMenuIcon src="/das/user.svg" alt="Tenants" />,
  },
};

/** Título conocido o el código tal cual (IDs legacy / custom en JSON de tenant). */
export function getDashboardNavSectionTitle(id: string): string {
  if (!isDashboardNavSectionId(id)) return id;
  return REGISTRY[id].title;
}

/** Título de sección o el código crudo (p. ej. permisos viejos en JSON de tenant). */
export function getDashboardNavSectionLabel(id: string): string {
  if (!isDashboardNavSectionId(id)) return id;
  return REGISTRY[id].title;
}

export function menuItemsFromNavKeys(keys: string[]): DashboardNavMenuItem[] {
  const out: DashboardNavMenuItem[] = [];
  for (const k of keys) {
    if (!isDashboardNavSectionId(k)) continue;
    const def = REGISTRY[k];
    out.push({ key: k, ...def });
  }
  return out;
}
