import { notFound } from "next/navigation";
import TripPageTemplate from "@/components/trips/TripPageTemplate";
import { fetchTripConfig } from "@/lib/api/trips";

export default async function EgyptVibesPage() {
  const config = await fetchTripConfig("egypt-vibes");
  if (!config) notFound();
  return <TripPageTemplate {...config} />;
}
