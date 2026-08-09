import Features from "@/modules/landing/views/ui/features";
import Footer from "@/modules/landing/views/ui/footer";
import Hero from "@/modules/landing/views/ui/hero";
import LandingGrid from "@/modules/landing/views/ui/landing-grid";
import Preview from "@/modules/landing/views/ui/preview";

export default function Home() {
  return (
    <LandingGrid>
      <Hero />
      <Preview />
      <Features />
      <Footer />
    </LandingGrid>
  );
}
