export type ReviewStatus = "pending" | "positive" | "negative" | "neutral" | "no_response";
export type BusinessTone = "tuteo" | "usted" | "juvenil";

export interface Business {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  website_url: string | null;
  google_maps_url: string | null;
  welcome_message: string;
  tone: BusinessTone;
  created_at: string;
  updated_at: string;
}

export interface ReviewRequest {
  id: string;
  business_id: string;
  customer_name: string;
  customer_phone: string;
  status: ReviewStatus;
  customer_response: string | null;
  sentiment_score: number | null;
  twilio_message_sid: string | null;
  follow_up_sent: boolean;
  created_at: string;
  responded_at: string | null;
}

export interface BusinessStats {
  business_id: string;
  user_id: string;
  total_requests: number;
  positive_count: number;
  negative_count: number;
  neutral_count: number;
  pending_count: number;
  no_response_count: number;
  positive_rate: number;
}

export interface SentimentResult {
  sentiment: "positive" | "negative" | "neutral";
  score: number;
  summary: string;
}
