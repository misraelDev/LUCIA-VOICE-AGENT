"use client";

import { useAuth } from "@/hooks/useAuth";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PageHeaderProvider, PageHeader } from "@/components/page-header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, loading } = useAuth();

  if (loading || isAdmin === undefined) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-gray-600">Verificando permisos...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <PageHeaderProvider>
      <SidebarProvider>
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
