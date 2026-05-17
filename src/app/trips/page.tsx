import { fetchTrips } from "@/lib/api/trips";
import TripsBrowser from "@/components/trips/TripsBrowser";
import Navbar from "@/components/layout/Navbar";

export const metadata = {
  title: "All Trips — Find Your Next Adventure",
};

export default async function TripsPage() {
  const { trips, total } = await fetchTrips({ revalidate: 3600 });
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <TripsBrowser initialTrips={trips} initialTotal={total} />
    </main>
  );
}
