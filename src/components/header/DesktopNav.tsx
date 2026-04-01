"use client"

import Link from "next/link"
import { useState } from "react"
import { Poppins } from "next/font/google"
import { ChevronDown } from "lucide-react"
import IndustriesPopup from "./industries-popup"
import { usePathname } from "next/navigation"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
})

export type NavLink = { href: string; label: string }

export function DesktopNav({ navLinks }: { navLinks: NavLink[] }) {
  const [showIndustriesPopup, setShowIndustriesPopup] = useState(false)
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-6 xl:gap-10">
      {navLinks.map((link) => {
        // Special handling for Industries link
        if (link.label === "Casos de estudio") {
          const isActive = pathname?.startsWith("/industrias")
          return (
            <div key={link.href} className="relative">
              <button
                onClick={() => setShowIndustriesPopup(!showIndustriesPopup)}
                className={`${poppins.className} flex items-center gap-2 text-base xl:text-lg font-medium transition-colors ${isActive ? "text-[#462bdd]" : "text-black"}`}
              >
                {link.label}
                <ChevronDown className="w-4 h-4" />
              </button>

              {showIndustriesPopup && (
                <div className="absolute top-full mt-2 right-0 md:left-1/2 md:-translate-x-1/2 md:right-auto z-50">
                  <IndustriesPopup />
                </div>
              )}
            </div>
          )
        }

        const isActive = pathname === link.href

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`${poppins.className} text-base xl:text-lg font-medium transition-colors ${isActive ? "text-[#462bdd]" : "text-black"}`}
          >
            {link.label}
          </Link>
        )
      })}

      {/* Overlay for closing popup when clicking outside */}
      {showIndustriesPopup && <div className="fixed inset-0 z-40" onClick={() => setShowIndustriesPopup(false)} />}
    </div>
  )
}
