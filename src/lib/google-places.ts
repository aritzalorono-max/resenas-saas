/**
 * Integración con Google Places API (Legacy).
 * Resuelve el Place ID de un negocio y consulta su puntuación actual.
 */

const BASE = "https://maps.googleapis.com/maps/api/place";

// Abort Google Places requests that hang. The API is usually fast (<1 s)
// but without a timeout a hung request would block the cron for its full slot.
const FETCH_TIMEOUT_MS = 8000;

function apiKey(): string {
  return process.env.GOOGLE_PLACES_API_KEY ?? "";
}

function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timer));
}

/**
 * Intenta extraer el Place ID directamente de una URL de Google Maps.
 * Funciona con URLs largas que contienen el ID embebido en los datos del path.
 */
export function extractPlaceIdFromUrl(url: string): string | null {
  // Formato más común: ...!1sChIJxxxxxxxx...
  const m1 = url.match(/!1s(ChIJ[A-Za-z0-9_-]+)/);
  if (m1) return m1[1];

  // Formato con query param explícito
  const m2 = url.match(/[?&]placeid=(ChIJ[A-Za-z0-9_-]+)/i);
  if (m2) return m2[1];

  return null;
}

/**
 * Busca el Place ID de un negocio por nombre usando Places Text Search.
 * Se usa como fallback cuando no se puede extraer el ID de la URL.
 */
export async function findPlaceIdByName(name: string): Promise<string | null> {
  const key = apiKey();
  if (!key) return null;

  const params = new URLSearchParams({
    input: name,
    inputtype: "textquery",
    fields: "place_id",
    key,
  });

  try {
    const res  = await fetchWithTimeout(`${BASE}/findplacefromtext/json?${params}`);
    const data = await res.json() as { status: string; candidates?: { place_id: string }[] };
    if (data.status === "OK" && data.candidates?.[0]?.place_id) {
      return data.candidates[0].place_id;
    }
  } catch {
    // network error or timeout — handled by caller
  }
  return null;
}

export interface PlaceRating {
  rating: number | null;
  review_count: number | null;
}

/**
 * Obtiene la puntuación y número de reseñas actuales de un lugar.
 */
export async function getPlaceRating(placeId: string): Promise<PlaceRating> {
  const key = apiKey();
  if (!key) return { rating: null, review_count: null };

  const params = new URLSearchParams({
    place_id: placeId,
    fields: "rating,user_ratings_total",
    key,
  });

  try {
    const res  = await fetchWithTimeout(`${BASE}/details/json?${params}`);
    const data = await res.json() as {
      status: string;
      result?: { rating?: number; user_ratings_total?: number };
    };
    if (data.status === "OK") {
      return {
        rating:       data.result?.rating              ?? null,
        review_count: data.result?.user_ratings_total  ?? null,
      };
    }
  } catch {
    // network error or timeout — handled by caller
  }
  return { rating: null, review_count: null };
}
