"use client";

import { useAuth } from "@/hooks/useAuth";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PageHeaderProvider, PageHeader } from "@/components/page-header";

/** Área por defecto (bienvenida): cualquier rol autenticado; mismo shell que el resto del dashboard. */
export default function WelcomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, isUser, isSeller, loading, isAuthenticated } = useAuth();

  if (
    loading ||
    isAdmin === undefined ||
    isUser === undefined ||
    isSeller === undefined
  ) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-gray-600">Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated || (!isAdmin && !isUser && !isSeller)) {
    return null;
  }

  return (
    <PageHeaderProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" className="bg-[#f8f7fc]" />
        <SidebarInset className="bg-[#f8f7fc]">
          <SiteHeader />
          <div className="flex min-h-0 flex-1 flex-col bg-[#f8f7fc]">
            <div className="@container/main flex min-h-0 flex-1 flex-col">
              <PageHeader />
              {children}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </PageHeaderProvider>
  );
}
