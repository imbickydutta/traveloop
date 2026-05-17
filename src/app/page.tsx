import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import TheLineUp from "@/components/home/TheLineUp";
import NoPlansCTAv2 from "@/components/home/NoPlansCTAv2";
import ExploreAllTripsCTA from "@/components/home/ExploreAllTripsCTA";
import { fetchTrips } from "@/lib/api/trips";

export default async function HomePage() {
  const { trips } = await fetchTrips();
  return (
    <main className="snap-y snap-mandatory sm:snap-none lg:snap-y lg:snap-mandatory h-[100dvh] overflow-y-scroll">
      <Navbar />
      <HeroSection />
      <TheLineUp trips={trips} />
      <NoPlansCTAv2 />
      <ExploreAllTripsCTA />
    </main>
  );
}
