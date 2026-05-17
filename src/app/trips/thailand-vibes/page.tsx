import { notFound } from "next/navigation";
import TripPageTemplate from "@/components/trips/TripPageTemplate";
import { fetchTripConfig } from "@/lib/api/trips";

export default async function ThailandVibesPage() {
  const config = await fetchTripConfig("thailand-vibes");
  if (!config) notFound();
  return <TripPageTemplate {...config} />;
}
