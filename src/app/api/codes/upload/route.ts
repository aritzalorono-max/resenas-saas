import { createClient } from "@/lib/supabase/server";
import { getBusinessByUserId } from "@/lib/business";
import { uploadPoolCodes } from "@/lib/discount-codes";
import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import * as xlsx from "xlsx";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
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
      .filter((v) => v.length > 0 && v !== "CÓDIGO" && v !== "CODE" && v !== "CODES" && v !== "CODIGOS");
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
