"use client"

import { useLayoutEffect, useState } from "react"

/**
 * Breakpoint móvil para el sidebar. useLayoutEffect evita un frame pintado
 * con layout de escritorio antes de aplicar el modo móvil (reduce CLS).
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useLayoutEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)")
    setIsMobile(mediaQuery.matches)

    const handleResize = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
    }

    mediaQuery.addEventListener("change", handleResize)
    return () => mediaQuery.removeEventListener("change", handleResize)
  }, [])

  return isMobile
} 