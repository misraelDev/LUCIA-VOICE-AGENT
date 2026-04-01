"use client"

import { useState } from "react"
import {
  IconDotsVertical,
} from "@tabler/icons-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { LogOut } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { ConfirmLogoutDialog } from "@/components/confirm-logout-dialog"

export function NavUser() {
  const { isMobile } = useSidebar()
  const { user, logout } = useAuth()
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [logoutSubmitting, setLogoutSubmitting] = useState(false)

  const handleConfirmLogout = async () => {
    setLogoutSubmitting(true)
    try {
      await logout()
    } finally {
      setLogoutSubmitting(false)
      setLogoutOpen(false)
    }
  }

  if (!user) return null

  return (
    <>
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground text-white hover:bg-white/10"
            >
              <Avatar className="h-8 w-8 rounded-full">
                <AvatarImage src="/favicon2.jpg" alt={user.fullName || user.email} />
                <AvatarFallback className="rounded-full">
                  {user.fullName?.[0] || user.email?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium text-white">{user.fullName || user.email}</span>
                <span className="text-white/70 truncate text-xs">
                  {user.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4 text-white" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-full">
                  <AvatarImage src="/favicon2.jpg" alt={user.fullName || user.email} />
                  <AvatarFallback className="rounded-full">
                    {user.fullName?.[0] || user.email?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.fullName || user.email}</span>
                  <span className=" truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => setLogoutOpen(true)}
            >
              <LogOut />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
    <ConfirmLogoutDialog
      open={logoutOpen}
      onOpenChange={setLogoutOpen}
      onConfirm={handleConfirmLogout}
      submitting={logoutSubmitting}
    />
    </>
  )
}
