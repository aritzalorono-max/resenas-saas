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
 * - fixed: devuelve siempre el mismo código configurado por el negocio
 * - random: genera un código nuevo y lo inserta como "used"
 * - pool: selecciona el primer código "available" y lo marca como "used"
 * Devuelve el código o null si no hay disponibles.
 */
export async function assignDiscountCode(
  supabase: SupabaseClient,
  businessId: string,
  codeType: IncentiveCodeType,
  reviewRequestId: string,
  fixedCode?: string | null
): Promise<string | null> {
  const usedAt = new Date().toISOString();

  if (codeType === "fixed") {
    return fixedCode?.trim() || null;
  }

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

  // Pool: assign atomically via RPC (UPDATE … FOR UPDATE SKIP LOCKED)
  // to prevent two concurrent requests getting the same code.
  const { data, error } = await supabase.rpc("assign_pool_discount_code", {
    p_business_id:       businessId,
    p_review_request_id: reviewRequestId,
  });

  if (error || data === null) return null;
  return data as string;
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
