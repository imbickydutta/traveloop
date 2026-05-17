import { notFound } from "next/navigation";
import TripPageTemplate from "@/components/trips/TripPageTemplate";
import { fetchTripConfig } from "@/lib/api/trips";

export default async function BaliVibesPage() {
  const config = await fetchTripConfig("bali-vibes");
  if (!config) notFound();
  return <TripPageTemplate {...config} />;
}
