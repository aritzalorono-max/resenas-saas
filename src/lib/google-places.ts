/**
 * Integración con Google Places API (Legacy).
 * Resuelve el Place ID de un negocio y consulta su puntuación actual.
 */

const BASE = "https://maps.googleapis.com/maps/api/place";

function apiKey(): string {
  return process.env.GOOGLE_PLACES_API_KEY ?? "";
}

/**
 * Resuelve una URL acortada de Google Maps (maps.app.goo.gl) siguiendo la redirección.
 */
export async function resolveShortUrl(url: string): Promise<string> {
  try {
    const res = await fetch(url, { redirect: "follow", method: "HEAD" });
    return res.url || url;
  } catch {
    return url;
  }
}

/**
 * Extrae nombre y coordenadas de una URL de Google Maps.
 * Ej: /maps/place/Mi+Negocio/@43.356,-3.011,...
 */
function extractNameAndCoords(url: string): { name: string | null; lat: number | null; lng: number | null } {
  const nameMatch = url.match(/\/maps\/place\/([^/@?]+)/);
  const name = nameMatch ? decodeURIComponent(nameMatch[1].replace(/\+/g, " ")) : null;

  const coordsMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  const lat = coordsMatch ? parseFloat(coordsMatch[1]) : null;
  const lng = coordsMatch ? parseFloat(coordsMatch[2]) : null;

  return { name, lat, lng };
}

/**
 * Intenta extraer el Place ID directamente de una URL de Google Maps (formato ChIJ).
 * Si recibe una URL acortada (maps.app.goo.gl), la resuelve primero.
 * Si no encuentra el Place ID en la URL, busca por nombre + coordenadas como fallback.
 */
export async function extractPlaceIdFromUrl(url: string): Promise<string | null> {
  let resolved = url;

  // Resolve short URLs (maps.app.goo.gl, goo.gl, etc.)
  if (/goo\.gl|maps\.app/i.test(url)) {
    resolved = await resolveShortUrl(url);
  }

  // Formato ChIJ: ...!1sChIJxxxxxxxx...
  const m1 = resolved.match(/!1s(ChIJ[A-Za-z0-9_-]+)/);
  if (m1) return m1[1];

  // Formato con query param explícito
  const m2 = resolved.match(/[?&]placeid=(ChIJ[A-Za-z0-9_-]+)/i);
  if (m2) return m2[1];

  // Fallback: buscar por nombre + coordenadas extraídas de la URL
  const { name, lat, lng } = extractNameAndCoords(resolved);
  if (name) {
    return findPlaceIdByName(name, lat ?? undefined, lng ?? undefined);
  }

  return null;
}

/**
 * Busca el Place ID de un negocio por nombre usando Places Text Search.
 * Acepta coordenadas opcionales para acotar la búsqueda geográficamente.
 */
export async function findPlaceIdByName(name: string, lat?: number, lng?: number): Promise<string | null> {
  const key = apiKey();
  if (!key) return null;

  const params = new URLSearchParams({
    input: name,
    inputtype: "textquery",
    fields: "place_id",
    key,
  });

  if (lat != null && lng != null) {
    params.set("locationbias", `point:${lat},${lng}`);
  }

  try {
    const res  = await fetch(`${BASE}/findplacefromtext/json?${params}`);
    const data = await res.json() as { status: string; candidates?: { place_id: string }[] };
    if (data.status === "OK" && data.candidates?.[0]?.place_id) {
      return data.candidates[0].place_id;
    }
  } catch {
    // network error — handled by caller
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
    const res  = await fetch(`${BASE}/details/json?${params}`);
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
    // network error — handled by caller
  }
  return { rating: null, review_count: null };
}
