"use client"

import React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

const routeNames: Record<string, string> = {
  dashboard: "Panel de Control",
  welcome: "Bienvenida",
  tenants: "Tenants",
  "call-history": "Historial de Llamadas",
  conversations: "Conversaciones",
  appointments: "Citas",
  contacts: "Contactos",
  tickets: "Tickets",
  home: "Inicio",
  requests: "Solicitudes"
}

export function SiteHeader() {
  const pathname = usePathname()
  const { isSeller, isUser } = useAuth()

  const isAdminPath = pathname.startsWith('/dashboard/admin')
  const isUserAreaPath = pathname.startsWith('/dashboard/user')
  const isWelcomePath = pathname.startsWith('/dashboard/welcome')

  const generateBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs = [] as { name: string; href: string; isHome: boolean }[]

    const homeHref = isWelcomePath
      ? "/dashboard/welcome"
      : isAdminPath
        ? "/dashboard/admin/home"
        : (isUserAreaPath || isSeller || isUser
            ? "/dashboard/user/home"
            : "/dashboard/welcome")

    breadcrumbs.push({
      name: "Inicio",
      href: homeHref,
      isHome: true
    })

    const onlyInicio =
      pathname === "/dashboard" ||
      pathname === "/dashboard/welcome" ||
      pathname === "/dashboard/admin/home" ||
      pathname === "/dashboard/user/home"

    if (!onlyInicio) {
      let currentPath = ""
      segments.forEach((segment, index) => {
        currentPath += `/${segment}`

        if (segment === "dashboard" && index === 0) return
        if (segment === "admin") return
        if (segment === "user") return
        if (segment === "home" && segments[index - 1] === "admin") return
        if (segment === "home" && segments[index - 1] === "user") return

        const name = routeNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
        breadcrumbs.push({
          name,
          href: currentPath,
          isHome: false
        })
      })
    }

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-white border-b border-gray-200/60 backdrop-blur-sm">
      <div className="flex items-center justify-between w-full px-6">
        <nav className="flex items-center space-x-1 text-sm">
          {breadcrumbs.map((breadcrumb, index) => (
            <div key={breadcrumb.href} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
              )}

              {index === breadcrumbs.length - 1 ? (
                <span className="flex items-center font-medium text-black">
                  {breadcrumb.isHome && <Home className="h-4 w-4 mr-1" />}
                  {breadcrumb.name}
                </span>
              ) : (
                <Link
                  href={breadcrumb.href}
                  className="flex items-center text-gray-600 hover:text-black transition-colors"
                >
                  {breadcrumb.isHome && <Home className="h-4 w-4 mr-1" />}
                  {breadcrumb.name}
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-4">
        </div>
      </div>
    </header>
  )
}
