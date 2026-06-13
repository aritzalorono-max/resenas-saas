/**
 * GET /r/[code]
 *
 * Redirige al enlace real de la plataforma de reseñas asociada al código corto.
 * Los clientes reciben esta URL corta en el WhatsApp y son redirigidos aquí.
 */

import { createServiceClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> }
): Promise<Response> {
  const { code } = await params;

  if (!code) return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL));

  const supabase = await createServiceClient();
  const { data } = await supabase
    .from("short_links")
    .select("url")
    .eq("code", code)
    .single();

  const url = data?.url ?? "";
  // Only redirect to http/https URLs to prevent javascript: or data: redirects
  const isSafe = url.startsWith("https://") || url.startsWith("http://");
  const target = isSafe ? url : (process.env.NEXT_PUBLIC_APP_URL ?? "/");

  return NextResponse.redirect(target, {
    status: 301,
    headers: {
      "Cache-Control": "public, max-age=300, stale-while-revalidate=86400",
    },
  });
}
