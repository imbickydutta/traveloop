import Link from "next/link";
import { fetchTrips } from "@/lib/api/trips";
import TripsCalendar from "@/components/trips/TripsCalendar";
import Navbar from "@/components/layout/Navbar";

const BRAND_GOLD = "#e8b84b";

export const metadata = {
  title: "Trip Calendar — See What's Coming Up",
};

export default async function TripsCalendarPage() {
  const { trips } = await fetchTrips({ revalidate: 3600 });

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <div className="pt-20 sm:pt-24 pb-16">
        <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-8 sm:mb-10">
          <p className="text-xs font-bold tracking-[0.25em] uppercase mb-3" style={{ color: BRAND_GOLD }}>
            Trip Calendar
          </p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h1 className="font-script font-bold text-white text-4xl sm:text-6xl leading-none">
              Every Trip,{" "}
              <span className="italic" style={{ color: BRAND_GOLD }}>
                One View
              </span>
            </h1>
            <Link
              href="/trips"
              className="text-xs font-bold uppercase tracking-wide text-white/50 hover:text-white transition-colors pb-2"
            >
              ← List view
            </Link>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 sm:px-6">
          <TripsCalendar trips={trips} />
        </section>
      </div>
    </main>
  );
}
