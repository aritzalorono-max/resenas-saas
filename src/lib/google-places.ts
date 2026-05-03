/**
 * Integración con Google Places API (Legacy).
 * Resuelve el Place ID de un negocio y consulta su puntuación actual.
 */

const BASE = "https://maps.googleapis.com/maps/api/place";

function apiKey(): string {
  return process.env.GOOGLE_PLACES_API_KEY ?? "";
}

/**
 * Resuelve una URL acortada de Google Maps (maps.app.goo.gl) siguiendo la redirección
 * para obtener la URL completa con el Place ID embebido.
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
 * Intenta extraer el Place ID directamente de una URL de Google Maps.
 * Funciona con URLs largas que contienen el ID embebido en los datos del path.
 * Si recibe una URL acortada (maps.app.goo.gl), la resuelve primero.
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

  // Formato hex: ...!1s0xHEX:0xHEX... (URLs de google.es/maps)
  const m3 = resolved.match(/!1s(0x[0-9a-f]+:0x[0-9a-f]+)/i);
  if (m3) return m3[1];

  // Formato con query param explícito
  const m2 = resolved.match(/[?&]placeid=(ChIJ[A-Za-z0-9_-]+)/i);
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
