"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { type Icon } from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
  const pathname = usePathname()

  const isActive = (url: string) => {
    // Si la ruta es exactamente igual, está activa
    if (pathname === url) return true
    
    // Si la ruta actual comienza con la URL del menú y no es la raíz
    if (url !== "/dashboard" && pathname.startsWith(url)) return true
    
    return false
  }

  return (
    <SidebarGroup className="p-0 px-0">
      <SidebarGroupContent className="flex flex-col gap-2 p-0 px-0">
        <SidebarMenu className="p-0 px-0">
          {items.map((item) => {
            const active = isActive(item.url)
            return (
              <SidebarMenuItem 
                key={item.title} 
                className={`
                  mx-2
                  list-none
                `}
              >
                <Link href={item.url} className="w-full block">
                  <SidebarMenuButton 
                    tooltip={item.title}
                    className={`
                      transition-all duration-200 w-full h-12
                      ${active 
                        ? "bg-white text-[#462bdd]" 
                        : "hover:bg-accent/50"
                      }
                    `}
                    style={
                      active
                        ? {
                            borderRadius: "1rem",
                            margin: "0",
                            paddingRight: "1.5rem",
                            paddingLeft: "1.5rem",
                            backgroundColor: "white",
                            color: "#462bdd",
                            height: "3rem",
                          }
                        : {
                            paddingLeft: "1.5rem",
                            paddingRight: "1.5rem",
                            height: "3rem",
                          }
                    }
                  >
                    {item.icon && <item.icon className={`${active ? "text-[#462bdd]" : ""} w-6 h-6`} />}
                    <span className="text-base">{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}