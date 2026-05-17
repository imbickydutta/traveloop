const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

export type LeadSource =
  | "ai_form"
  | "talk_to_us"
  | "book_spot"
  | "whatsapp"
  | "floating_button"
  | "plan_trip";
export type LeadTravellerType = "solo" | "couple" | "group" | "family";

export interface CreateLeadInput {
  name: string;
  phone: string;
  tripInterested?: string;
  travellerType?: LeadTravellerType;
  groupSize?: number;
  budget?: string;
  duration?: string;
  vibes?: string[];
  note?: string;
  source: LeadSource;
}

export interface CreateLeadResponse {
  success: true;
  leadId: string;
}

export async function createLead(input: CreateLeadInput): Promise<CreateLeadResponse> {
  const res = await fetch(`${API_BASE}/api/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json?.error ?? `createLead failed: ${res.status}`);
  }
  return json as CreateLeadResponse;
}
