/**
 * Google Business Profile API client.
 *
 * Handles OAuth token exchange/refresh and all Google My Business API calls.
 * Uses native fetch — no extra dependencies required.
 */

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://resenasya.com"}/api/google-business/callback`;

const SCOPES = ["https://www.googleapis.com/auth/business.manage"].join(" ");

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GoogleAccount {
  name: string; // e.g. "accounts/123456789"
  accountName: string;
  type: string;
  state?: { status: string };
}

export interface GoogleLocation {
  name: string; // e.g. "accounts/123/locations/456"
  title: string;
  phoneNumbers?: { primaryPhone?: string };
  websiteUri?: string;
  regularHours?: object;
  categories?: { primaryCategory?: { displayName?: string } };
  profile?: { description?: string };
}

export interface GoogleReview {
  name: string; // e.g. "accounts/123/locations/456/reviews/abc"
  reviewId: string;
  reviewer: {
    profilePhotoUrl?: string;
    displayName: string;
    isAnonymous?: boolean;
  };
  starRating: "STAR_RATING_UNSPECIFIED" | "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE";
  comment?: string;
  createTime: string;
  updateTime: string;
  reviewReply?: {
    comment: string;
    updateTime: string;
  };
}

export interface GoogleTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

export interface ReviewAnalysis {
  overallSentiment: string;
  topPraises: string[];
  topComplaints: string[];
  profileSuggestions: string[];
  ratingTrend: string;
  averageRating: number;
  reviewCount: number;
}

// ---------------------------------------------------------------------------
// OAuth helpers
// ---------------------------------------------------------------------------

/**
 * Generate the Google OAuth URL to redirect users to.
 * state should be a base64-encoded string identifying the user/session.
 */
export function getAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: SCOPES,
    access_type: "offline",
    prompt: "consent",
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Exchange an OAuth authorization code for access + refresh tokens.
 */
export async function exchangeCode(code: string): Promise<GoogleTokenResponse> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Google token exchange failed: ${res.status} ${body}`);
  }

  return await res.json() as GoogleTokenResponse;
}

/**
 * Use a refresh token to obtain a new access token.
 */
export async function refreshAccessToken(
  refreshToken: string
): Promise<{ access_token: string; expires_in: number }> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Google token refresh failed: ${res.status} ${body}`);
  }

  return res.json() as Promise<{ access_token: string; expires_in: number }>;
}

// ---------------------------------------------------------------------------
// API helpers
// ---------------------------------------------------------------------------

async function googleFetch(url: string, accessToken: string, options: RequestInit = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Google API error ${res.status}: ${body}`);
  }

  // Some endpoints return empty body on success (e.g. DELETE)
  const text = await res.text();
  return text ? JSON.parse(text) : {};
}

// ---------------------------------------------------------------------------
// Accounts & Locations
// ---------------------------------------------------------------------------

/**
 * Get all Google Business accounts for the authenticated user.
 */
export async function getAccounts(accessToken: string): Promise<GoogleAccount[]> {
  const data = await googleFetch(
    "https://mybusinessaccountmanagement.googleapis.com/v1/accounts",
    accessToken
  );
  return (data.accounts ?? []) as GoogleAccount[];
}

/**
 * Get all locations for a given account.
 */
export async function getLocations(
  accessToken: string,
  accountName: string
): Promise<GoogleLocation[]> {
  const readMask =
    "name,title,phoneNumbers,websiteUri,regularHours,categories,profile";
  const data = await googleFetch(
    `https://mybusinessbusinessinformation.googleapis.com/v1/${accountName}/locations?readMask=${readMask}`,
    accessToken
  );
  return (data.locations ?? []) as GoogleLocation[];
}

/**
 * Get detailed info for a single location (for profile analysis).
 */
export async function getLocationInfo(
  accessToken: string,
  locationName: string
): Promise<GoogleLocation> {
  const readMask =
    "name,title,phoneNumbers,websiteUri,regularHours,categories,profile";
  return googleFetch(
    `https://mybusinessbusinessinformation.googleapis.com/v1/${locationName}?readMask=${readMask}`,
    accessToken
  ) as Promise<GoogleLocation>;
}

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------

/**
 * Fetch all reviews for a location (paginated — fetches up to 200).
 */
export async function getReviews(
  accessToken: string,
  locationName: string
): Promise<GoogleReview[]> {
  const all: GoogleReview[] = [];
  let pageToken: string | undefined;

  do {
    const url = new URL(`https://mybusiness.googleapis.com/v4/${locationName}/reviews`);
    url.searchParams.set("pageSize", "50");
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    const data = await googleFetch(url.toString(), accessToken);
    const reviews = (data.reviews ?? []) as GoogleReview[];
    all.push(...reviews);
    pageToken = data.nextPageToken as string | undefined;
  } while (pageToken && all.length < 200);

  return all;
}

/**
 * Publish or update a reply to a Google review.
 */
export async function replyToReview(
  accessToken: string,
  reviewName: string,
  reply: string
): Promise<void> {
  await googleFetch(
    `https://mybusiness.googleapis.com/v4/${reviewName}/reply`,
    accessToken,
    {
      method: "PUT",
      body: JSON.stringify({ comment: reply }),
    }
  );
}

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

/** Convert Google star rating string to numeric value */
export function starRatingToNumber(
  rating: GoogleReview["starRating"]
): number {
  const map: Record<string, number> = {
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5,
    STAR_RATING_UNSPECIFIED: 0,
  };
  return map[rating] ?? 0;
}
