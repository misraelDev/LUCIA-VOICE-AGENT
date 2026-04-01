"use client";

import {
  createContext,
  useContext,
  useState,
  useLayoutEffect,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

/* ── context: lets pages inject action buttons into the header ── */

interface PageHeaderCtx {
  actions: ReactNode;
  setActions: (node: ReactNode) => void;
}

const Ctx = createContext<PageHeaderCtx>({
  actions: null,
  setActions: () => {},
});

export function PageHeaderProvider({ children }: { children: ReactNode }) {
  const [actions, setActions] = useState<ReactNode>(null);
  return (
    <Ctx.Provider value={{ actions, setActions }}>{children}</Ctx.Provider>
  );
}

/**
 * Renders nothing visually — portals its children into the persistent
 * PageHeader that lives in the layout.  Clears automatically on unmount.
 */
export function PageHeaderActions({ children }: { children: ReactNode }) {
  const { setActions } = useContext(Ctx);
  useLayoutEffect(() => {
    setActions(children);
    return () => setActions(null);
  });
  return null;
}

/* ── route → title / icon ── */

interface HeaderCfg {
  title: string;
  icon: string;
}

const exact: Record<string, HeaderCfg> = {
  "/dashboard/welcome":           { title: "Bienvenida",                      icon: "/dash.svg" },
  "/dashboard/user/home":          { title: "Dashboard",                       icon: "/dash.svg" },
  "/dashboard/user/call-history":  { title: "Historial de Llamadas",           icon: "/contact.svg" },
  "/dashboard/user/conversations": { title: "Conversaciones de WhatsApp",      icon: "/conversation.svg" },
  "/dashboard/user/appointments":  { title: "Citas",                           icon: "/contact.svg" },
  "/dashboard/user/contacts":      { title: "Contactos",                       icon: "/contact.svg" },

  "/dashboard/admin/home":          { title: "Panel de Administración",         icon: "/das/dash.svg" },
  "/dashboard/admin/users":         { title: "Gestión de Usuarios",             icon: "/das/user.svg" },
  "/dashboard/admin/tenants":       { title: "Tenants y menú por rol",          icon: "/das/user.svg" },
};

const prefixes: [string, HeaderCfg][] = [
  ["/dashboard/user/call-history/",  { title: "Detalles de la llamada",    icon: "/phone.svg" }],
  ["/dashboard/user/contacts/",      { title: "Detalles del contacto",     icon: "/contact.svg" }],
  ["/dashboard/admin/users/",         { title: "Detalles del Usuario",      icon: "/das/user.svg" }],
];

function resolve(pathname: string): HeaderCfg | null {
  if (exact[pathname]) return exact[pathname];
  for (const [prefix, cfg] of prefixes) {
    if (pathname.startsWith(prefix)) return cfg;
  }
  return null;
}

/** Iconos en /das/ son blancos (sidebar oscuro); en cabecera clara se pintan con máscara morada. */
function PageHeaderIcon({ src }: { src: string }) {
  const onLightBg = src.startsWith("/das/");
  if (onLightBg) {
    return (
      <div
        className="h-6 w-6 shrink-0 bg-[#462bdd]"
        style={{
          maskImage: `url(${src})`,
          WebkitMaskImage: `url(${src})`,
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
        }}
        aria-hidden
      />
    );
  }
  return (
    <div className="relative flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden">
      <Image className="object-contain" fill alt="" src={src} sizes="24px" />
    </div>
  );
}

/* ── the persistent header rendered once in the layout ── */

export function PageHeader() {
  const pathname = usePathname();
  const { actions } = useContext(Ctx);
  const cfg = resolve(pathname);

  if (!cfg) return null;

  return (
    <div className="flex min-h-[4.5rem] items-center justify-between border-b pb-4 px-6 pt-6">
      <div className="flex min-w-0 items-center gap-3">
        <PageHeaderIcon src={cfg.icon} />
        <h1 className="text-2xl font-bold tracking-tight">{cfg.title}</h1>
      </div>
      <div className="flex min-h-10 shrink-0 items-center justify-end gap-2.5">
        {actions}
      </div>
    </div>
  );
}
