import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { checkGeneralRateLimit, getClientIp } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  const serviceClient = await createServiceClient();
  const ip = getClientIp(request);

  const rl = await checkGeneralRateLimit(serviceClient, `recover:ip:${ip}`, 60, 5);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Demasiados intentos. Espera unos minutos e inténtalo de nuevo." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Petición inválida" }, { status: 400 });
  }

  const { email, redirectTo } = body;
  if (typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  let foundUser: { identities?: { provider: string }[] } | null = null;

  try {
    const adminRes = await fetch(
      `${supabaseUrl}/auth/v1/admin/users?page=1&per_page=1&filter=${encodeURIComponent(email)}`,
      { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } }
    );
    if (adminRes.ok) {
      const adminData = await adminRes.json();
      foundUser = adminData.users?.[0] ?? null;
    }
  } catch {
    // If admin lookup fails, fall through and attempt reset anyway
  }

  // Google-only account — tell user to sign in with Google instead
  if (foundUser !== null) {
    const identities = foundUser.identities ?? [];
    const hasEmailIdentity = identities.some((i) => i.provider === "email");
    if (!hasEmailIdentity && identities.some((i) => i.provider === "google")) {
      logger.info("Recover: cuenta Google, no tiene contraseña");
      return NextResponse.json({ googleAccount: true });
    }
  }

  // For email/password accounts (or unknown), attempt the reset.
  // Always return success to prevent email enumeration.
  if (foundUser !== null) {
    const supabase = await createClient();
    await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    logger.info("Recover: email de recuperación enviado");
  } else {
    logger.info("Recover: email no encontrado, respuesta genérica enviada");
  }

  return NextResponse.json({ success: true });
}
