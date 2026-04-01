import ExploreHero from "@/components/dashboard-info/hero/HeroSection";

import Prefooter from "@/components/landing/prefooter/PrefooterSection";
import Footer from "@/components/landing/footer/Footer";
import FunctionsSection from "@/components/dashboard-info/function/Functions";
import LearningSection from "@/components/dashboard-info/learning/Learning";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Header } from "@/components/header/Header";

export default function EcommercePage() {
  return (
    <main className="overflow-x-hidden w-full">
      <Header />
      <Breadcrumbs />
      <ExploreHero />
      <FunctionsSection />
      <LearningSection />
      <Prefooter />
      <Footer />
    </main>
  );
}
