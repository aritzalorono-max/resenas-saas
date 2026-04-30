import type { SupabaseClient } from "@supabase/supabase-js";
import type { IncentiveCodeType } from "@/types";

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateRandomCode(length = 8): string {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return code;
}

/**
 * Asigna un código de descuento a una solicitud de reseña.
 * - random: genera un código nuevo y lo inserta como "used"
 * - pool: selecciona el primer código "available" y lo marca como "used"
 * Devuelve el código o null si no hay disponibles (pool vacío o error).
 */
export async function assignDiscountCode(
  supabase: SupabaseClient,
  businessId: string,
  codeType: IncentiveCodeType,
  reviewRequestId: string
): Promise<string | null> {
  const usedAt = new Date().toISOString();

  if (codeType === "random") {
    const code = generateRandomCode();
    const { error } = await supabase.from("discount_codes").insert({
      business_id: businessId,
      code,
      type: "random",
      status: "used",
      review_request_id: reviewRequestId,
      used_at: usedAt,
    });
    return error ? null : code;
  }

  // Pool: pick the first available code atomically
  const { data, error } = await supabase
    .from("discount_codes")
    .select("id, code")
    .eq("business_id", businessId)
    .eq("type", "pool")
    .eq("status", "available")
    .order("created_at", { ascending: true })
    .limit(1)
    .single();

  if (error || !data) return null;

  await supabase
    .from("discount_codes")
    .update({ status: "used", review_request_id: reviewRequestId, used_at: usedAt })
    .eq("id", data.id);

  return data.code;
}

/**
 * Inserta una lista de códigos de pool para un negocio.
 * Ignora duplicados (código ya existente para ese negocio).
 * Devuelve el número de códigos insertados realmente.
 */
export async function uploadPoolCodes(
  supabase: SupabaseClient,
  businessId: string,
  codes: string[]
): Promise<number> {
  const rows = codes.map((code) => ({
    business_id: businessId,
    code: code.trim().toUpperCase(),
    type: "pool" as const,
    status: "available" as const,
  }));

  const { data, error } = await supabase
    .from("discount_codes")
    .upsert(rows, { onConflict: "business_id,code", ignoreDuplicates: true })
    .select("id");

  if (error) throw new Error(error.message);
  return data?.length ?? 0;
}
