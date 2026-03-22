import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import TheLineUp from "@/components/home/TheLineUp";
export default function HomePage() {
  return (
    <main className="sm:snap-none snap-y snap-mandatory h-screen overflow-y-scroll">
      <Navbar />
      <HeroSection />
      <TheLineUp />
    </main>
  );
}
