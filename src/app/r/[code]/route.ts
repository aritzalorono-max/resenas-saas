/**
 * GET /r/[code]
 *
 * Redirige al enlace real de la plataforma de reseñas asociada al código corto.
 * Los clientes reciben esta URL corta en el WhatsApp y son redirigidos aquí.
 */

import { createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> }
): Promise<never> {
  const { code } = await params;

  if (!code) redirect("/");

  const supabase = await createServiceClient();
  const { data } = await supabase
    .from("short_links")
    .select("url")
    .eq("code", code)
    .single();

  redirect(data?.url ?? "/");
}
