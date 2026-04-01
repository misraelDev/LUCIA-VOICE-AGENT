"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import HeroSection from "@/components/landing/hero/HeroSection";
import MetricsSection from "@/components/landing/metrics/MetricsSection";
import BenefitsSection from "@/components/landing/benefits/BenefitsSection";
import CasesSection from "@/components/landing/cases/CasesSection";
import ProcessSection from "@/components/landing/process/ProcessSection";
import ContactSection from "@/components/landing/contact/ContactSection";
import Footer from "@/components/landing/footer/Footer";
import PanelSection from "@/components/landing/panel/PanelSection";
import Prefooter from "@/components/landing/prefooter/PrefooterSection";
import { Header } from "@/components/header/Header";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Verificar si hay tokens de confirmación en el hash de la URL
    const hash = window.location.hash.substring(1);
    if (hash && hash.includes('access_token')) {
      // Si hay tokens de confirmación, redirigir a la página de confirmación
      router.push('/auth/confirm' + window.location.hash);
      return;
    }
  }, [router]);

  return (
    <div className="overflow-x-hidden w-full" id="top">
      <div className="bg-[#ffffff]">
        <Header />
        <Breadcrumbs />

        {/* Secciones con gradiente compartido */}
        <div className="[background:linear-gradient(180deg,_#e5efff,_rgba(229,_239,_255,_0.26)_83.7%,_rgba(229,_239,_255,_0))]">
          <HeroSection />

          {/* Metrics Section */}
          <MetricsSection />

          {/* Beneficios Section */}
          <BenefitsSection />
        </div>

        {/* Casos de Estudio Section */}
        <CasesSection />
        {/* Como Lo Hacemos Section */}
        <ProcessSection />

        <PanelSection />

        <ContactSection />

        {/* Prefooter Section */}
        <Prefooter />

        {/* Footer Section */}
        <Footer />
      </div>

      {/* Botón flotante para volver arriba */}
      <a
        href="#top"
        aria-label="Volver arriba"
        className="fixed bottom-6 right-6 z-50"
      >
        <div className="w-16 h-16 bg-zinc-200 rounded-[30px] flex items-center justify-center">
          {/* Opcional: flecha hacia arriba usando un simple caret */}
          <span className="text-2xl text-zinc-700">↑</span>
        </div>
      </a>
    </div>
  );
}
