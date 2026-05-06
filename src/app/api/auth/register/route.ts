import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { checkGeneralRateLimit, getClientIp } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  // ── Rate limiting por IP ──────────────────────────────────────────────────
  // Máx 10 intentos de registro por IP en 1 hora
  const serviceClient = await createServiceClient();
  const ip = getClientIp(request);
  const rl = await checkGeneralRateLimit(serviceClient, `register:ip:${ip}`, 60, 10);
  if (!rl.allowed) {
    logger.warn(`Rate limit de registro alcanzado para IP: ${ip}`);
    return NextResponse.json(
      { error: "Demasiados intentos de registro. Espera un momento e inténtalo de nuevo." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Petición inválida" }, { status: 400 });
  }

  const { email, password, terms_accepted_at, marketing_consent } = body;

  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "Email y contraseña son obligatorios" }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "La contraseña debe tener al menos 8 caracteres" }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "El email no tiene un formato válido" }, { status: 400 });
  }

  // ── Rate limiting por email ───────────────────────────────────────────────
  // Máx 5 intentos de registro con el mismo email en 1 hora
  const emailRl = await checkGeneralRateLimit(
    serviceClient,
    `register:email:${email.toLowerCase()}`,
    60,
    5
  );
  if (!emailRl.allowed) {
    // Respuesta genérica para no confirmar si el email existe
    return NextResponse.json(
      { error: "Demasiados intentos de registro. Espera un momento e inténtalo de nuevo." },
      { status: 429 }
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        terms_accepted_at: terms_accepted_at ?? new Date().toISOString(),
        marketing_consent: marketing_consent ?? false,
      },
    },
  });

  if (error) {
    logger.warn("Error en registro de usuario");
    return NextResponse.json({ error: "Error al crear la cuenta. Inténtalo de nuevo." }, { status: 400 });
  }

  if (data.user) {
    const identities = data.user.identities ?? [];
    const hasEmailIdentity = identities.some((i) => i.provider === "email");

    if (!hasEmailIdentity) {
      const hasGoogleIdentity = identities.some((i) => i.provider === "google");
      if (hasGoogleIdentity) {
        return NextResponse.json(
          { error: "Este email ya está registrado con Google. Usa el botón 'Registrarse con Google' para acceder." },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: "Ya existe una cuenta con este email. Inicia sesión o recupera tu contraseña." },
        { status: 400 }
      );
    }
  }

  if (data.user) {
    // Crear registro de negocio vacío para el nuevo usuario
    await serviceClient.from("businesses").upsert(
      { user_id: data.user.id, name: "" },
      { onConflict: "user_id" }
    );
  }

  return NextResponse.json({ success: true, sessionCreated: !!data.session });
}
