import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { checkGeneralRateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // 10 billing info saves per minute per user
    const rateSvc = await createServiceClient();
    const rl = await checkGeneralRateLimit(rateSvc, `facturacion:${user.id}`, 1, 10);
    if (!rl.allowed) {
      return NextResponse.json({ error: "Demasiadas solicitudes. Espera un momento." }, { status: 429 });
    }

    const body = await request.json();
    const { tipo, nombre, nif, direccion, ciudad, codigo_postal, pais, email_facturacion } = body;

    const safeTipo = ["particular", "empresa"].includes(tipo) ? tipo : "particular";

    const rawEmail = String(email_facturacion ?? "").trim();
    const safeEmail = rawEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail)
      ? rawEmail.slice(0, 200)
      : null;

    const payload = {
      user_id: user.id,
      tipo: safeTipo,
      nombre: String(nombre ?? "").trim().slice(0, 200),
      // Allow alphanumeric, hyphens, and dots (covers ES NIF/NIE and EU VAT formats)
      nif: String(nif ?? "").trim().replace(/[^A-Z0-9\-\.]/gi, "").slice(0, 20),
      direccion: String(direccion ?? "").trim().slice(0, 300),
      ciudad: String(ciudad ?? "").trim().slice(0, 100),
      codigo_postal: String(codigo_postal ?? "").trim().replace(/[^A-Z0-9\- ]/gi, "").slice(0, 10),
      pais: String(pais ?? "España").trim().slice(0, 100) || "España",
      email_facturacion: safeEmail,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("billing_info")
      .upsert(payload, { onConflict: "user_id" });

    if (error) {
      logger.error("Error al guardar datos de facturación", error);
      return NextResponse.json({ error: "Error al guardar los datos" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error("Error inesperado en /api/facturacion", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
