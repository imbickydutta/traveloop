import { notFound } from "next/navigation";
import TripPageTemplate from "@/components/trips/TripPageTemplate";
import { fetchTripConfig } from "@/lib/api/trips";

export default async function KenyaSafariPage() {
  const config = await fetchTripConfig("kenya-safari");
  if (!config) notFound();
  return <TripPageTemplate {...config} />;
}
