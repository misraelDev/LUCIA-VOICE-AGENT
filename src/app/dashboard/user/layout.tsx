"use client";

import { useAuth } from "@/hooks/useAuth";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PageHeaderProvider, PageHeader } from "@/components/page-header";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isUser, isSeller, loading } = useAuth();

  if (loading || isUser === undefined || isSeller === undefined) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-gray-600">Verificando permisos...</div>
      </div>
    );
  }

  if (!isUser && !isSeller) {
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
