export type TripType = "group" | "curated";

export interface TripDay {
  day: number;
  date: string;
  location: string;
  title: string;
  image: string;
  side: "left" | "right";
  bullets: string[];
}

export interface TripDisclaimer {
  title: string;
  body: string;
}

export interface TripSlots {
  afterIntro?:      React.ReactNode;
  afterJourney?:    React.ReactNode;
  afterInclusions?: React.ReactNode;
}

export interface TripPageConfig {
  trip:                 Trip;
  accent:               string;
  heroImage:            string;
  heroLabel:            string;   // e.g. "🇰🇪 Kenya · Land of Safari Legends"
  heroTitle:            string;
  heroTagline:          string;
  heroStats:            { label: string; value: string }[];
  introLines:           [string, string];
  marqueeDestinations:  string[];
  days:                 TripDay[];
  inclusions:           string[];
  exclusions:           string[];
  bookingAmount:        string;   // e.g. "₹65,000"
  finalPayment:         string;   // e.g. "USD 1,420"
  bookingInfoLines?:    string[]; // extra lines below pricing (phone, passport note, etc.)
  disclaimers:          TripDisclaimer[];
  slots?:               TripSlots;
}
export type TripStatus = "available" | "filling-fast" | "sold-out";

export interface Trip {
  id: string;
  slug: string;
  name: string;
  destination: string;
  tagline: string;

  /** Ordered list of images. images[0] is used as the cover / poster. */
  images: string[];
  videoUrl?: string;

  dateDisplay: string;
  durationShort: string;

  pricePerPaxINR: number;
  earlyBirdPercent?: number;

  attractions: string[];

  status: TripStatus;
  type: TripType;
  accentColor: string;

  seatsTotal?: number;
  seatsLeft?: number;
}
