import type { useTranslations } from "next-intl";

export type TFunction = ReturnType<typeof useTranslations>;

export interface GoogleReview {
  name: string;
  reviewId: string;
  reviewer: { displayName: string; isAnonymous?: boolean; profilePhotoUrl?: string };
  starRating: string;
  starRatingNum: number;
  comment?: string;
  createTime: string;
  updateTime: string;
  reviewReply?: { comment: string; updateTime: string };
  replied: boolean;
  flagged: boolean;
  flagStatus: string | null;
}

export interface ReviewAnalysis {
  overallSentiment: string;
  averageRating: number;
  reviewCount: number;
  ratingTrend: string;
  topPraises: string[];
  topComplaints: string[];
  profileSuggestions: string[];
}

export interface Business {
  name: string;
  google_access_token: string | null;
  google_location_name: string | null;
  tone: string;
}
