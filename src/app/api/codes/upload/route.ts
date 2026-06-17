import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getBusinessByUserId } from "@/lib/business";
import { uploadPoolCodes } from "@/lib/discount-codes";
import { checkGeneralRateLimit } from "@/lib/rate-limit";
import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import * as xlsx from "xlsx";

// Column headers to skip when parsing uploaded code files
const DISCOUNT_CODE_HEADER_WORDS = new Set(["CÓDIGO", "CODIGOS", "CODE", "CODES", "COUPON", "COUPONS"]);

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  // 3 file uploads per minute per user (files can contain up to 5 000 rows each)
  const rateSvc = await createServiceClient();
  const rl = await checkGeneralRateLimit(rateSvc, `codes-upload:${user.id}`, 1, 3);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Demasiadas subidas. Espera un momento." }, { status: 429 });
  }

  const business = await getBusinessByUserId(supabase, user.id);
  if (!business) {
    return NextResponse.json({ error: "Negocio no encontrado" }, { status: 404 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Formato de solicitud inválido" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No se ha enviado ningún archivo" }, { status: 400 });
  }

  const buffer = await file.arrayBuffer();
  let codes: string[] = [];

  try {
    const wb = xlsx.read(buffer, { type: "array" });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json<string[]>(ws, { header: 1 });

    codes = rows
      .flat()
      .map((v) => String(v ?? "").trim().toUpperCase())
      .filter((v) => {
        if (v.length === 0 || DISCOUNT_CODE_HEADER_WORDS.has(v)) return false;
        if (v.length > 100) return false;
        // Only allow alphanumeric characters plus hyphens and underscores
        return /^[A-Z0-9_\-]+$/.test(v);
      });
  } catch {
    return NextResponse.json({ error: "No se pudo leer el archivo. Asegúrate de que sea .xlsx, .xls o .csv" }, { status: 400 });
  }

  if (codes.length === 0) {
    return NextResponse.json({ error: "El archivo no contiene códigos válidos" }, { status: 400 });
  }

  if (codes.length > 5000) {
    return NextResponse.json({ error: "Máximo 5000 códigos por subida" }, { status: 400 });
  }

  try {
    const inserted = await uploadPoolCodes(supabase, business.id, codes);
    return NextResponse.json({ success: true, inserted, total: codes.length });
  } catch (err) {
    logger.error("Error al subir códigos de descuento", err);
    return NextResponse.json({ error: "Error al procesar los códigos. Por favor, inténtalo de nuevo." }, { status: 500 });
  }
}
