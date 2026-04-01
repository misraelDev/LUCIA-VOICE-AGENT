'use client';

import { useEffect, useState } from 'react';

interface CacheProviderProps {
  children: React.ReactNode;
}

export default function CacheProvider({ children }: CacheProviderProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Verificar si hay datos en caché
    const cachedData = localStorage.getItem('landingPageCache');
    const cachedTimestamp = localStorage.getItem('landingPageCacheTimestamp');
    const now = Date.now();
    
    // Si no hay datos en caché o han pasado más de 24 horas, guardar la vista actual
    if (!cachedData || !cachedTimestamp || (now - parseInt(cachedTimestamp)) > 86400000) {
      // Esperar a que el contenido se renderice completamente
      setTimeout(() => {
        const pageContent = document.documentElement.outerHTML;
        localStorage.setItem('landingPageCache', pageContent);
        localStorage.setItem('landingPageCacheTimestamp', now.toString());
      }, 1000);
    }
  }, []);

  if (!isClient) {
    return null;
  }

  return <>{children}</>;
} 