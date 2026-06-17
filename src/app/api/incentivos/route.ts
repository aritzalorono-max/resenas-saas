import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { checkGeneralRateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import type { IncentiveCodeType, IncentiveTiming } from "@/types";

const VALID_CODE_TYPES: IncentiveCodeType[] = ["random", "pool", "fixed"];
const VALID_TIMINGS: IncentiveTiming[] = ["initial", "after_positive"];
const DESCRIPTION_MAX = 200;
const FIXED_CODE_MAX = 100;

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // 10 incentive saves per minute per user
    const rateSvc = await createServiceClient();
    const rl = await checkGeneralRateLimit(rateSvc, `incentivos:${user.id}`, 1, 10);
    if (!rl.allowed) {
      return NextResponse.json({ error: "Demasiadas solicitudes. Espera un momento." }, { status: 429 });
    }

    const body = await request.json();
    const {
      incentive_enabled,
      incentive_description,
      incentive_timing,
      incentive_code_enabled,
      incentive_code_type,
      incentive_fixed_code,
    } = body;

    // Validate fields
    const safeCodeType: IncentiveCodeType = VALID_CODE_TYPES.includes(incentive_code_type)
      ? incentive_code_type : "fixed";
    const safeTiming: IncentiveTiming = VALID_TIMINGS.includes(incentive_timing)
      ? incentive_timing : "initial";
    const safeDescription = String(incentive_description ?? "").trim().slice(0, DESCRIPTION_MAX) || null;
    const safeFixedCode = safeCodeType === "fixed"
      ? String(incentive_fixed_code ?? "").trim().slice(0, FIXED_CODE_MAX) || null
      : null;

    const { error } = await supabase
      .from("businesses")
      .update({
        incentive_enabled: Boolean(incentive_enabled),
        incentive_description: safeDescription,
        incentive_timing: safeTiming,
        incentive_code_enabled: Boolean(incentive_code_enabled),
        incentive_code_type: safeCodeType,
        incentive_fixed_code: safeFixedCode,
      })
      .eq("user_id", user.id);

    if (error) {
      logger.error("Error al guardar configuración de incentivos", error);
      return NextResponse.json({ error: "Error al guardar los cambios" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error("Error inesperado en /api/incentivos", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
