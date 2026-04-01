import ExploreHero from "@/components/real-estate/hero/HeroSection";
import TestimonialsSection from "@/components/real-estate/testimonials/TestimonialsSection";
import Prefooter from "@/components/landing/prefooter/PrefooterSection";
import FaqSection from "@/components/real-estate/faq/FaqSection";
import { Header } from "@/components/header/Header";
import Footer from "@/components/landing/footer/Footer";
import CaracteristicsSection from "@/components/real-estate/caracteristics/CaracteristicsSection";
import HighlightSection from "@/components/real-estate/highlitghts/HighlitghtsSection";
import PanelSection from "@/components/landing/panel/PanelSection";
import FeaturesSection from "@/components/real-estate/features/FeaturesSection";
import ContactSection from "@/components/landing/contact/ContactSection";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function CallCentersPage() {
  return (
    <main className="overflow-x-hidden w-full">
      <Header />
      <Breadcrumbs />
      <ExploreHero />
      {/* CARACTERISTICAS */}
      <CaracteristicsSection />
      {/* Features Section */}
      <FeaturesSection />
      {/* <BenefitsSection /> */}
      <TestimonialsSection />
      {/* HIGHLITGHTS */}
      <HighlightSection />
      {/* Contacto Section */}
      <ContactSection />
      <FaqSection />
      <PanelSection />

      <Prefooter />
      {/* Footer Section */}
      <Footer />
    </main>
  );
}
