// components/dynamic-html.tsx
"use client"
import { useEffect, useState } from 'react'

export function DynamicHtml({ children }: { children: React.ReactNode }) {
  const [currentLang, setCurrentLang] = useState('es')

  useEffect(() => {
    // Escuchar cambios en el lang del documento
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'lang') {
          const newLang = document.documentElement.lang
          setCurrentLang(newLang || 'es')
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['lang']
    })

    return () => observer.disconnect()
  }, [])

  return <html lang={currentLang}>{children}</html>
}