import {
  Trip,
  TripPageConfig,
  TripStatus,
  TripType,
  TripDay,
  TripDisclaimer,
} from "@/types/trip";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

interface BackendItineraryDay {
  day: number;
  date: string;
  location: string;
  title: string;
  activities: string[];
  image?: string;
}

export interface BackendTrip {
  _id: string;
  slug: string;
  name: string;
  destination: string;
  flag: string;
  duration: string;
  dates: string;
  startDate: string;
  endDate: string;
  month: string[];
  price: number;
  priceFinal: string;
  currency: string;
  seatsTotal: number;
  seatsLeft: number;
  status: "active" | "filling_fast" | "sold_out" | "upcoming";
  tags: string[];
  vibe: string;
  highlights: string[];
  itinerary: BackendItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  images: string[];
  bestFor: string[];
  budgetRange: "budget" | "mid" | "premium" | "luxury";
  featured: boolean;
  accentColor: string;
  type: TripType;
  videoUrl?: string;
  earlyBirdPercent: number;
  heroImage: string;
  heroLabel: string;
  heroTagline: string;
  introLines: string[];
  bookingAmount: string;
  bookingInfoLines: string[];
  disclaimers: TripDisclaimer[];
}

function mapStatus(s: BackendTrip["status"]): TripStatus {
  switch (s) {
    case "filling_fast": return "filling-fast";
    case "sold_out":     return "sold-out";
    case "active":
    case "upcoming":
    default:             return "available";
  }
}

function mapItinerary(days: BackendItineraryDay[]): TripDay[] {
  return days.map((d) => ({
    day: d.day,
    date: d.date,
    location: d.location,
    title: d.title,
    image: d.image ?? "",
    side: d.day % 2 === 0 ? "left" : "right",
    bullets: d.activities,
  }));
}

export function mapBackendTripToFrontend(raw: BackendTrip): Trip {
  return {
    id: raw._id,
    slug: raw.slug,
    name: raw.name,
    destination: raw.destination,
    flag: raw.flag,
    tagline: raw.vibe,
    images: raw.images,
    videoUrl: raw.videoUrl,
    dateDisplay: raw.dates,
    startDate: raw.startDate,
    endDate: raw.endDate,
    durationShort: raw.duration,
    month: raw.month,
    pricePerPaxINR: raw.price,
    earlyBirdPercent: raw.earlyBirdPercent,
    attractions: raw.highlights,
    status: mapStatus(raw.status),
    type: raw.type,
    accentColor: raw.accentColor,
    seatsTotal: raw.seatsTotal,
    seatsLeft: raw.seatsLeft,
  };
}

export function buildTripPageConfig(raw: BackendTrip): TripPageConfig {
  const trip = mapBackendTripToFrontend(raw);
  // Two intro lines required by the type; pad if backend has fewer.
  const intro: [string, string] = [
    raw.introLines[0] ?? "",
    raw.introLines[1] ?? "",
  ];
  return {
    trip,
    accent: raw.accentColor,
    heroImage: raw.heroImage || raw.images[0] || "",
    heroLabel: raw.heroLabel,
    heroTitle: raw.name,
    heroTagline: raw.heroTagline,
    heroStats: [
      { label: "Dates",    value: raw.dates },
      { label: "Duration", value: raw.duration },
      { label: "Booking",  value: raw.bookingAmount },
      { label: "Final",    value: raw.priceFinal },
    ],
    introLines: intro,
    marqueeDestinations: raw.tags,
    days: mapItinerary(raw.itinerary),
    inclusions: raw.inclusions,
    exclusions: raw.exclusions,
    bookingAmount: raw.bookingAmount,
    finalPayment: raw.priceFinal,
    bookingInfoLines: raw.bookingInfoLines,
    disclaimers: raw.disclaimers,
  };
}

export interface TripFilters {
  bestFor?: string;
  budgetRange?: string;
  month?: string;
  status?: string;
  featured?: boolean;
}

export interface TripsResult {
  trips: Trip[];
  total: number;
}

export async function fetchTrips(opts?: {
  filters?: TripFilters;
  /** Pass a number to use Next.js ISR; omit for no-store (default). */
  revalidate?: number;
}): Promise<TripsResult> {
  const params = new URLSearchParams();
  const f = opts?.filters ?? {};
  if (f.bestFor) params.set("bestFor", f.bestFor);
  if (f.budgetRange) params.set("budgetRange", f.budgetRange);
  if (f.month) params.set("month", f.month);
  if (f.status) params.set("status", f.status);
  if (f.featured) params.set("featured", "true");
  const qs = params.toString();
  const url = `${API_BASE}/api/trips${qs ? `?${qs}` : ""}`;

  const init: RequestInit & { next?: { revalidate?: number } } =
    typeof opts?.revalidate === "number"
      ? { next: { revalidate: opts.revalidate } }
      : { cache: "no-store" };

  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`fetchTrips: ${res.status}`);
  const { trips, total } = (await res.json()) as { trips: BackendTrip[]; total: number };
  return { trips: trips.map(mapBackendTripToFrontend), total };
}

export async function fetchTripConfig(slug: string): Promise<TripPageConfig | null> {
  const res = await fetch(`${API_BASE}/api/trips/${slug}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`fetchTripConfig(${slug}): ${res.status}`);
  const { trip } = (await res.json()) as { trip: BackendTrip };
  return buildTripPageConfig(trip);
}
