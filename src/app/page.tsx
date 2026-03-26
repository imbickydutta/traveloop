import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import TheLineUp from "@/components/home/TheLineUp";
import FeaturedTrips from "@/components/home/FeaturedTrips";
export default function HomePage() {
  return (
    <main className="snap-y snap-mandatory sm:snap-none lg:snap-y lg:snap-mandatory h-screen overflow-y-scroll">
      <Navbar />
      <HeroSection />
      <TheLineUp />
      <FeaturedTrips />
    </main>
  );
}
