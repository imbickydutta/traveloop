import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import TheLineUp from "@/components/home/TheLineUp";
import FeaturedTrips from "@/components/home/FeaturedTrips";
import NoPlansCTAv2 from "@/components/home/NoPlansCTAv2";
export default function HomePage() {
  return (
    <main className="snap-y snap-mandatory sm:snap-none lg:snap-y lg:snap-mandatory h-[100dvh] overflow-y-scroll">
      <Navbar />
      <HeroSection />
      <TheLineUp />
      <NoPlansCTAv2 />
      <FeaturedTrips />
    </main>
  );
}
