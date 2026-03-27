"use client";

import TripPageTemplate from "@/components/trips/TripPageTemplate";
import { TRIPS } from "@/data/trips";
import { TripPageConfig } from "@/types/trip";

const KENYA = TRIPS.find((t) => t.slug === "kenya-safari")!;

const config: TripPageConfig = {
  trip:   KENYA,
  accent: "#f5a623",

  heroImage:   "/images/trips/kenya/kenya-1.jpg",
  heroLabel:   "🇰🇪 Kenya · Land of Safari Legends",
  heroTitle:   "Kenya Safari",
  heroTagline: "An epic journey into Africa's untamed wilderness — golden savannahs, the Big Five, and sunsets that touch your soul.",
  heroStats: [
    { label: "Dates",    value: "05 – 13 Jun" },
    { label: "Duration", value: "8N · 9D"     },
    { label: "Booking",  value: "₹65,000"     },
    { label: "Final",    value: "USD 1,420"   },
  ],

  introLines: [
    "Golden savannahs stretching endlessly into the horizon, majestic elephants beneath the shadow of Mount Kilimanjaro, flamingo-covered lakes glowing pink at sunrise, and the thunder of hooves across the legendary plains of Masai Mara.",
    "This is not just a journey — <span class=\"text-white font-semibold\">this is Africa in its purest form.</span> Join Bidhan Bar Vlogs on an unforgettable safari expedition through Kenya's most iconic landscapes.",
  ],

  marqueeDestinations: ["Nairobi", "Amboseli", "Lake Naivasha", "Lake Nakuru", "Hell's Gate", "Masai Mara"],

  days: [
    { day: 0, date: "05 June", location: "Kolkata → Nairobi",
      title: "The Journey Begins",      image: "/images/trips/kenya/kenya-4.webp", side: "left",
      bullets: ["Depart via Emirates (Kolkata) or Kenya Airways (Mumbai)", "International flights not included"] },
    { day: 1, date: "06 June", location: "Nairobi",
      title: "Welcome to Kenya",         image: "/images/trips/kenya/kenya-2.jpg",  side: "right",
      bullets: ["Giraffe Centre — feed Rothschild giraffes", "Welcome dinner with fellow travellers"] },
    { day: 2, date: "07 June", location: "Nairobi → Amboseli",
      title: "Into the Wild",            image: "/images/trips/kenya/kenya-1.jpg",  side: "left",
      bullets: ["First game drive against Mount Kilimanjaro", "Bonfire dinner under the African sky"] },
    { day: 3, date: "08 June", location: "Amboseli National Park",
      title: "Wild Majesty of Amboseli", image: "/images/trips/kenya/kenya-3.jpg",  side: "right",
      bullets: ["Sunrise over the peak of Kilimanjaro", "Full-day game drive + savannah picnic"] },
    { day: 4, date: "09 June", location: "Amboseli → Rift Valley",
      title: "The Flamingo Lakes",       image: "/images/trips/kenya/kenya-4.webp", side: "left",
      bullets: ["Great Rift Valley viewpoint stop", "Sunset over Lake Elementaita"] },
    { day: 5, date: "10 June", location: "Lake Nakuru · Hell's Gate",
      title: "Flamingos & Cycling",      image: "/images/trips/kenya/kenya-2.jpg",  side: "right",
      bullets: ["Lake Nakuru — flamingos & white rhinos", "Cycling safari in Hell's Gate"] },
    { day: 6, date: "11 June", location: "Lake Naivasha → Masai Mara",
      title: "The Legendary Mara",       image: "/images/trips/kenya/kenya-1.jpg",  side: "left",
      bullets: ["Boat safari on Lake Naivasha", "First Big Five game drive in the Mara"] },
    { day: 7, date: "12 June", location: "Masai Mara National Reserve",
      title: "The Ultimate Safari",      image: "/images/trips/kenya/kenya-3.jpg",  side: "right",
      bullets: ["Big Five — lions, leopards, elephants", "African Sundowner 🍹 on the plains"] },
    { day: 8, date: "13 June", location: "Masai Mara → Nairobi",
      title: "Farewell, Kenya",           image: "/images/trips/kenya/kenya-2.jpg",  side: "left",
      bullets: ["Traditional Maasai village visit", "Lavish farewell lunch in Nairobi"] },
  ],

  inclusions: [
    "Return airport transfers in Kenya",
    "4★ & 5★ luxury hotels, resorts & safari lodges",
    "Brand new 4×4 Land Cruiser safari vehicles",
    "All meals — daily buffet breakfast, lunch & dinner",
    "All national park entry fees",
    "Professional English-speaking driver–guides",
    "African Sundowner experience 🍹",
    "Wilderness picnic lunches in the savannah",
    "Kenya ETA tourist visa assistance",
    "Comprehensive travel & medical insurance",
    "Two Bengali Trip Managers from India",
  ],

  exclusions: [
    "International flights (Kolkata / Mumbai to Nairobi)",
    "Optional Hot Air Balloon Safari",
    "Tips & gratuities (~USD $50 per person)",
    "Personal shopping & miscellaneous expenses",
    "Drinking water & beverages",
    "Alcoholic & non-alcoholic drinks",
    "Additional hotel charges (Wi-Fi, minibar, etc.)",
    "Washroom usage fees during road trips",
    "Anything not listed in Inclusions",
  ],

  bookingAmount: "₹65,000",
  finalPayment:  "USD 1,420",
  bookingInfoLines: [
    "📞 +91 70037 99172 | +84 38 215 4314 (WhatsApp)",
    "📩 Send passport copy (first & last page) + booking amount to confirm",
    "🎟 Kenya ETA visa issued 21 days before departure",
  ],

  disclaimers: [
    {
      title: "Safari Reality Check",
      body: "A safari is a wildlife expedition into natural habitats — not a controlled wildlife show. Animal sightings can never be guaranteed. Wild animals move freely and their behavior is influenced by weather, migration, and natural instincts. Safari travel involves long game drives, rough terrain, early departures, and variable weather. Approach this with patience and a spirit of adventure.",
    },
    {
      title: "Itinerary Changes",
      body: "Travel is subject to weather, wildlife movement, government regulations, aviation schedules, and local security advisories. In the event of force majeure events, certain parts of the itinerary may be modified or cancelled. Bidhan Bar Vlogs reserves the right to alter any part of the itinerary for safety or operational reasons. No refunds shall arise for missed activities resulting from such events.",
    },
    {
      title: "Group Discipline",
      body: "National parks operate under fixed gate timings. Punctuality is absolutely essential. If a guest fails to report on time, the group may proceed without them. Guests who skip activities will not receive refunds or alternative arrangements. By booking, you accept the operational nature of safari travel and group discipline requirements.",
    },
  ],

  // No custom slots needed for Kenya — add here if required in future
};

export default function KenyaSafariPage() {
  return <TripPageTemplate {...config} />;
}
