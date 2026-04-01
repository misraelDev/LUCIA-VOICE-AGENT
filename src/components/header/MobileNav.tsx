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

export function MobileNav({
  isOpen,
  onClose,
  navLinks,
}: { isOpen: boolean; onClose: () => void; navLinks: NavLink[] }) {
  const [showIndustriesPopup, setShowIndustriesPopup] = useState(false)
  const pathname = usePathname()

  if (!isOpen) return null

  return (
    <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t z-50 mx-auto max-w-[1380px] max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      <div className="px-4 py-4 space-y-4">
        {navLinks.map((link) => {
          // Special handling for Industries link in mobile
          if (link.href === "/industrias") {
            const isActive = pathname?.startsWith("/industrias")
            return (
              <div key={link.href}>
                <button
                  onClick={() => setShowIndustriesPopup(!showIndustriesPopup)}
                  className={`${poppins.className} flex items-center gap-2 text-lg font-medium transition-colors py-2 w-full text-left ${isActive ? "text-[#462bdd]" : "text-black"}`}
               >
                  {link.label}
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showIndustriesPopup && (
                  <div className="mt-4 px-2">
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
              onClick={onClose}
              className={`${poppins.className} block text-lg font-medium transition-colors py-2 ${isActive ? "text-[#462bdd]" : "text-black"}`}
            >
              {link.label}
            </Link>
          )
        })}
        <div className="pt-4 border-t border-zinc-200 space-y-4">
          <button
            onClick={() => {
              document.getElementById('contacto')?.scrollIntoView({ 
                behavior: 'smooth' 
              });
              onClose();
            }}
            className="w-full h-11 px-5 py-2.5 rounded-[50px] bg-[#462bdd] text-white flex justify-center items-center gap-2 hover:bg-[#462bdd]/90 focus:bg-[#462bdd]/90 transition-colors cursor-pointer"
          >
            <div className={`${poppins.className} text-white text-base font-medium`}>Contáctanos</div>
          </button>
        </div>
      </div>
    </div>
  )
}
