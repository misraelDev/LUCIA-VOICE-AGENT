"use client"

import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Youtube, Linkedin, Mail } from "lucide-react"
import { Poppins } from "next/font/google"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
})

export default function Footer() {
  return (
    <footer className={`w-full py-8 md:py-16 ${poppins.className} bg-white overflow-hidden`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content with border */}
        <div className="border border-gray-200 bg-gray-50 p-4 sm:p-6 lg:p-12 mb-4 md:mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
            {/* Logo and description */}
            <div className="flex flex-col gap-4 lg:col-span-1">
              <Link href="/" className="relative w-32 sm:w-40 lg:w-48 h-12 lg:h-16">
                <Image 
                  src="/logo-text.png" 
                  alt="Lucia Logo" 
                  fill 
                  style={{ objectFit: "contain" }} 
                />
              </Link>
              <p className="text-gray-500 text-sm lg:text-base">
                Transformamos la manera en que las empresas escalan su operación con inteligencia artificial. Soluciones innovadoras para el futuro digital.
              </p>
              <div className="flex gap-3 mt-2">
                <Link
                  href="#"
                  className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center w-8 h-8"
                >
                  <Facebook size={16} />
                </Link>
                <Link
                  href="#"
                  className="bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-gray-300 transition-colors flex items-center justify-center w-8 h-8"
                >
                  <Twitter size={16} />
                </Link>
                <Link
                  href="#"
                  className="bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-gray-300 transition-colors flex items-center justify-center w-8 h-8"
                >
                  <Youtube size={16} />
                </Link>
                <Link
                  href="#"
                  className="bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-gray-300 transition-colors flex items-center justify-center w-8 h-8"
                >
                  <Linkedin size={16} />
                </Link>
              </div>
            </div>

            {/* Useful Links */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8 lg:col-span-1">
              <div>
                <h3 className="font-medium text-base lg:text-lg mb-3 lg:mb-4 text-gray-900">Navegación</h3>
                <ul className="space-y-2 lg:space-y-3">
                  <li>
                    <Link
                      href="/"
                      className="text-gray-500 hover:text-indigo-600 text-sm lg:text-base transition-colors"
                    >
                      Inicio
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-base lg:text-lg mb-3 lg:mb-4 text-gray-900">Casos de Estudio</h3>
                <ul className="space-y-2 lg:space-y-3">
                  <li>
                    <Link
                      href="/hotels"
                      className="text-gray-500 hover:text-indigo-600 text-sm lg:text-base transition-colors"
                    >
                      Hoteles
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/ecommerce"
                      className="text-gray-500 hover:text-indigo-600 text-sm lg:text-base transition-colors"
                    >
                      Ecommerce
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/restaurants"
                      className="text-gray-500 hover:text-indigo-600 text-sm lg:text-base transition-colors"
                    >
                      Restaurantes
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/sales"
                      className="text-gray-500 hover:text-indigo-600 text-sm lg:text-base transition-colors"
                    >
                      Ventas
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Newsletter */}
            <div className="lg:col-span-1">
              <h3 className="font-medium text-base lg:text-lg mb-3 lg:mb-4 text-gray-900">Mantente Informado</h3>
              <p className="text-gray-500 mb-4 text-sm lg:text-base">
                Suscríbete para recibir las últimas actualizaciones sobre IA y transformación digital.
              </p>
              <div className="flex w-full max-w-md">
                <input
                  type="email"
                  placeholder="Ingresa tu correo"
                  className="flex-1 min-w-0 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 p-2 text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button className="bg-indigo-600 text-white p-2 hover:bg-indigo-700 transition-colors flex items-center justify-center flex-shrink-0">
                  <Mail size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-500 text-xs sm:text-sm px-4">
          © 2024 SAREX.IA - Soluciones de Inteligencia Artificial. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
