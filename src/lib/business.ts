/**
 * Operaciones de base de datos para la entidad Business (negocio).
 *
 * Centraliza todos los accesos a la tabla `businesses` de Supabase
 * para que los API routes no contengan lógica de persistencia directa.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Business, IncentiveCodeType, ReviewPlatformLink } from "@/types";

// ---------------------------------------------------------------------------
// Lectura
// ---------------------------------------------------------------------------

/**
 * Obtiene el negocio asociado a un usuario autenticado.
 * Devuelve null si el usuario aún no ha creado su perfil de negocio.
 */
export async function getBusinessByUserId(
  supabase: SupabaseClient,
  userId: string
): Promise<Business | null> {
  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !data) return null;
  return data as Business;
}

// ---------------------------------------------------------------------------
// Escritura
// ---------------------------------------------------------------------------

/**
 * Parámetros necesarios para actualizar un negocio.
 */
export interface UpdateBusinessParams {
  name: string;
  description: string | null;
  website_url: string | null;
  google_maps_url: string | null;
  review_links: ReviewPlatformLink[];
  logo_url: string | null;
  welcome_message: string;
  tone: Business["tone"];
  incentive_enabled: boolean;
  incentive_description: string | null;
  incentive_code_enabled: boolean;
  incentive_code_type: Business["incentive_code_type"];
  reminder_max_count: number;
}

/**
 * Actualiza los datos de configuración de un negocio.
 * Lanza un error si la operación falla en la base de datos.
 */
export async function updateBusiness(
  supabase: SupabaseClient,
  businessId: string,
  params: UpdateBusinessParams
): Promise<void> {
  const { error } = await supabase
    .from("businesses")
    .update(params)
    .eq("id", businessId);

  if (error) {
    throw new Error(`Error al actualizar el negocio: ${error.message}`);
  }
}
