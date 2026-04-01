"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"

const Breadcrumbs = () => {
  const pathname = usePathname()

  // Mapeo de rutas a nombres legibles (absolutos)
  const routeNames: Record<string, string> = {
    "/": "Inicio",
    "/hotels": "Hotelería",
    "/real-estate": "Inmobiliarias",
    "/sales": "Ventas",
    "/ecommerce": "Ecommerce",
    "/clinics": "Clínicas",
    "/dashboard-info": "Dashboard",
  }

  // Mapeo por segmento
  const segmentNames: Record<string, string> = {
    users: "Usuarios",
    home: "Inicio",
    contacts: "Contactos",
    appointments: "Citas",
    seller: "",
    admin: "",
    dashboard: "",
  }

  // No mostrar breadcrumb en la página principal
  if (pathname === "/") {
    return null
  }

  // Función para generar las rutas del breadcrumb
  const generateBreadcrumbs = () => {
    const paths = pathname.split("/").filter(Boolean)
    const breadcrumbs = [{ path: "/", name: "Inicio" }]

    let currentPath = ""
    paths.forEach((segment) => {
      currentPath += `/${segment}`

      // Omitir segmentos administrativos/intermedios
      if (segment === "dashboard" || segment === "admin") {
        return
      }

      // Nombre por ruta absoluta o por segmento
      const name =
        routeNames[currentPath] ||
        segmentNames[segment] ||
        segment.charAt(0).toUpperCase() + segment.slice(1)

      breadcrumbs.push({ path: currentPath, name })
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <div className="w-full bg-[#000000] m-0 p-0 fixed top-[var(--header-height)] z-40">
      <div className="max-w-[1380px] mx-auto px-4">
        <nav className="flex items-center py-3 text-sm" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            {breadcrumbs.map((breadcrumb, index) => (
              <li key={breadcrumb.path} className="flex items-center">
                {index > 0 && <span className="mx-2 text-gray-300">{" > "}</span>}
                {index === breadcrumbs.length - 1 ? (
                  <span className="font-medium text-white" aria-current="page">
                    {breadcrumb.name}
                  </span>
                ) : (
                  <Link
                    href={breadcrumb.path}
                    className="font-medium text-gray-100 hover:text-white transition-colors duration-200 hover:underline"
                  >
                    {breadcrumb.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  )
}

export default Breadcrumbs