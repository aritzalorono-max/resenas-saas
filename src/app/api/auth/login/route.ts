import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { checkGeneralRateLimit, getClientIp } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  const serviceClient = await createServiceClient();
  const ip = getClientIp(request);

  const rl = await checkGeneralRateLimit(serviceClient, `login:ip:${ip}`, 15, 10);
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

  const { email, password } = body;
  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "Email y contraseña son obligatorios" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return NextResponse.json({ error: "El email no tiene un formato válido" }, { status: 400 });
  }

  // Check if email is registered — GoTrue Admin REST API supports ?filter=<email>
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
    // If the admin lookup fails, fall through to normal signIn
  }

  if (foundUser === null) {
    logger.info(`Login fallido: email no encontrado`);
    return NextResponse.json(
      { error: "No encontramos ninguna cuenta con ese email. ¿Quieres registrarte?" },
      { status: 400 }
    );
  }

  // Check if account is Google-only (no email identity)
  const identities = foundUser.identities ?? [];
  const hasEmailIdentity = identities.some((i) => i.provider === "email");
  if (!hasEmailIdentity && identities.some((i) => i.provider === "google")) {
    return NextResponse.json(
      { error: "Esta cuenta usa Google para iniciar sesión. Usa el botón 'Continuar con Google'." },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

  if (signInError) {
    logger.info(`Login fallido: contraseña incorrecta`);
    return NextResponse.json(
      { error: "Contraseña incorrecta. ¿Olvidaste tu contraseña?" },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}
