"use client"

import React from "react"
import Image from "next/image"
import { Menu, X, Mail } from "lucide-react"
import { DesktopNav, type NavLink } from "./DesktopNav"
import { MobileNav } from "./MobileNav"
import Link from "next/link"


export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const headerRef = React.useRef<HTMLDivElement | null>(null)
  const [headerHeight, setHeaderHeight] = React.useState<number>(0)

  const toggleMenu = () => setIsMenuOpen((v) => !v)
  const closeMenu = () => setIsMenuOpen(false)

  React.useEffect(() => {
    const el = headerRef.current
    if (!el) return

    const updateHeight = () => {
      const height = el.offsetHeight
      setHeaderHeight(height)
      if (typeof document !== 'undefined') {
        document.documentElement.style.setProperty('--header-height', `${height}px`)
      }
    }
    updateHeight()

    let resizeObserver: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => updateHeight())
      resizeObserver.observe(el)
    } else {
      window.addEventListener('resize', updateHeight)
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect()
      } else {
        window.removeEventListener('resize', updateHeight)
      }
    }
  }, [])

  // Navigation links
  const navLinks: NavLink[] = [
    { href: "/", label: "Inicio" },
    { href: "/dashboard-info", label: "Para tu empresa" },
    { href: "/industrias", label: "Casos de estudio" },
  ]

  return (
    <>
    <div ref={headerRef} className="w-full fixed top-0 left-0 z-[9999] bg-white shadow-lg">
      <div className="max-w-[1380px] mx-auto px-4">
        <header className="relative">
          <div className="flex justify-between items-center py-1.5">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/">
                <Image
                  src="/logo-text.png"
                  alt="Lucia by Sarex"
                  width={120}
                  height={60}
                  className="w-24 md:w-32 h-auto"
                  priority
                />
              </Link>
            </div>

            {/* Desktop Navigation - Centered */}
            <div className="hidden lg:flex flex-1 justify-center">
              <DesktopNav navLinks={navLinks} />
            </div>

            {/* Contact Button */}
            <div className="hidden lg:flex flex-shrink-0 items-center gap-3">
              <button
                onClick={() => {
                  document.getElementById('contacto')?.scrollIntoView({ 
                    behavior: 'smooth' 
                  });
                }}
                className="h-9 xl:h-10 px-3 xl:px-6 py-1.5 xl:py-2 rounded-[50px] bg-[#462bdd] text-white flex justify-center items-center gap-2 hover:bg-[#462bdd]/90 focus:bg-[#462bdd]/90 transition-colors cursor-pointer"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                <div className="text-white text-sm xl:text-base font-medium">Contáctanos</div>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex-shrink-0 lg:hidden">
              <button
                onClick={toggleMenu}
                className="p-2 text-black transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <MobileNav isOpen={isMenuOpen} onClose={closeMenu} navLinks={navLinks} />
        </header>
      </div>
    </div>
    <div aria-hidden="true" style={{ height: headerHeight }} />
    </>
  )
}
