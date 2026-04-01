import type * as React from "react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { NavUser } from "@/components/nav-user";
import SidebarCacheProvider from "@/components/sidebar-cache-provider";
import { useAuth } from "@/hooks/useAuth";
import { menuItemsFromNavKeys } from "@/config/dashboard-navigation-registry";
import {
  userService,
  DASHBOARD_NAV_CHANGED_EVENT,
} from "@/services/UserService";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const [, setNavRevision] = useState(0);
  const { loading, isAuthenticated } = useAuth();

  useEffect(() => {
    const onNav = () => setNavRevision((n) => n + 1);
    window.addEventListener(DASHBOARD_NAV_CHANGED_EVENT, onNav);
    return () =>
      window.removeEventListener(DASHBOARD_NAV_CHANGED_EVENT, onNav);
  }, []);

  /** Solo menú definido por API/tenant; sin claves válidas → vacío (no hay fallback local). */
  const getMenuItems = () => {
    const keys = userService.getStoredNavigationKeys();
    if (keys === null || keys.length === 0) {
      return [];
    }
    return menuItemsFromNavKeys(keys);
  };

  const items = getMenuItems();

  if (loading) {
    return (
      <SidebarCacheProvider>
        <Sidebar {...props} className="border-none p-0">
          <div className="flex h-full w-full flex-col bg-[#2B00FF]">
            <SidebarHeader>
              <SidebarMenu>
                <SidebarMenuItem>
                  <div className="flex w-full justify-center p-4">
                    <div className="relative aspect-[25/13] w-full max-w-[152px] shrink-0">
                      <Image
                        src="/logo_lucia_wb.svg"
                        alt="Logo"
                        fill
                        priority
                        className="object-contain object-center"
                        sizes="152px"
                      />
                    </div>
                  </div>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarHeader>
            <div className="flex flex-1 items-center justify-center">
              <div className="text-white">Cargando...</div>
            </div>
          </div>
        </Sidebar>
      </SidebarCacheProvider>
    );
  }

  if (isAuthenticated === false) {
    return null;
  }

  return (
    <SidebarCacheProvider>
      <Sidebar {...props} className="border-none p-0">
        <div className="flex h-full w-full flex-col bg-[#2B00FF]">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="flex w-full justify-center p-4">
                  <div className="relative aspect-[25/13] w-full max-w-[152px] shrink-0">
                    <Image
                      src="/logo_lucia_wb.svg"
                      alt="Logo"
                      fill
                      priority
                      className="object-contain object-center"
                      sizes="152px"
                    />
                  </div>
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          <SidebarContent className="sidebar-content flex-1 overflow-hidden pl-4 pr-0">
            <SidebarMenu className="space-y-2">
              {items.map((item) => {
                const isActive =
                  pathname === item.url || pathname.startsWith(item.url + "/");
                return (
                  <SidebarMenuItem key={item.key}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      id={`tour-${item.url.split("/").pop()}`}
                      className={`
                        h-12 font-medium transition-all duration-200
                        ${isActive ? "!bg-[#f8f7fc] mr-0 pr-6 rounded-[50px_0px_0px_50px]" : "mx-2 rounded-xl text-white"}
                      `}
                    >
                      <Link
                        href={item.url}
                        className="flex items-center gap-3 px-4"
                      >
                        <div
                          className={
                            isActive
                              ? "[&_img]:[filter:brightness(0)_saturate(100%)_invert(28%)_sepia(95%)_saturate(1200%)_hue-rotate(225deg)_brightness(95%)_contrast(95%)]"
                              : ""
                          }
                        >
                          {item.icon()}
                        </div>
                        <span
                          className={`text-base ${isActive ? "text-[#462bdd]" : "text-white"}`}
                        >
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-4">
            <NavUser />
          </SidebarFooter>
        </div>
      </Sidebar>
    </SidebarCacheProvider>
  );
}
