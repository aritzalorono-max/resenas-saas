/**
 * POST /api/send-review-request
 *
 * Envía un mensaje de WhatsApp a un cliente pidiéndole su opinión
 * y crea el registro correspondiente en la base de datos.
 *
 * Flujo:
 *   1. Verificar que el usuario está autenticado
 *   2. Validar los datos del formulario
 *   3. Obtener la configuración del negocio
 *   4. Enviar el WhatsApp via Twilio
 *   5. Guardar la solicitud en Supabase
 */

import { createClient } from "@/lib/supabase/server";
import { sendWhatsAppMessage } from "@/lib/twilio";
import { getBusinessByUserId } from "@/lib/business";
import { createReviewRequest } from "@/lib/review-requests";
import { logger } from "@/lib/logger";
import { NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// Tipos del endpoint
// ---------------------------------------------------------------------------

interface RequestBody {
  customer_name: string;
  customer_phone: string;
}

interface SuccessResponse {
  success: true;
  data: object;
}

interface ErrorResponse {
  error: string;
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export async function POST(
  request: Request
): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  logger.info("Nueva solicitud de reseña recibida");

  // ── 1. Autenticación ──────────────────────────────────────────────────────
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    logger.warn("Intento de acceso sin sesión activa");
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  logger.info(`Usuario autenticado: ${user.id}`);

  // ── 2. Validación del cuerpo de la petición ───────────────────────────────
  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    logger.warn("Cuerpo de la petición no es JSON válido");
    return NextResponse.json(
      { error: "El cuerpo de la petición no es válido" },
      { status: 400 }
    );
  }

  const customerName = body.customer_name?.trim();
  const customerPhone = body.customer_phone?.trim();

  if (!customerName) {
    return NextResponse.json(
      { error: "El nombre del cliente es obligatorio" },
      { status: 400 }
    );
  }

  if (!customerPhone) {
    return NextResponse.json(
      { error: "El teléfono del cliente es obligatorio" },
      { status: 400 }
    );
  }

  logger.info(`Procesando solicitud para: ${customerName} (${customerPhone})`);

  // ── 3. Obtener configuración del negocio ──────────────────────────────────
  const business = await getBusinessByUserId(supabase, user.id);

  if (!business) {
    logger.warn(`No se encontró negocio para el usuario ${user.id}`);
    return NextResponse.json(
      { error: "Negocio no encontrado. Completa tu perfil en Configuración primero." },
      { status: 404 }
    );
  }

  logger.info(`Negocio encontrado: ${business.name} (${business.id})`);

  // ── 4. Construir y enviar el WhatsApp ─────────────────────────────────────
  const messageText = business.welcome_message
    .replace("{nombre}", customerName)
    .replace("{negocio}", business.name);

  let messageSid: string;
  try {
    messageSid = await sendWhatsAppMessage(customerPhone, messageText);
    logger.info(`WhatsApp enviado correctamente. SID: ${messageSid}`);
  } catch (twilioError) {
    logger.error("Error al enviar el WhatsApp via Twilio", twilioError);
    return NextResponse.json(
      {
        error:
          "No se pudo enviar el WhatsApp. Comprueba que el número es correcto y que el cliente ha aceptado el sandbox de Twilio.",
      },
      { status: 502 }
    );
  }

  // ── 5. Guardar en base de datos ───────────────────────────────────────────
  let reviewRequest: object;
  try {
    reviewRequest = await createReviewRequest(supabase, {
      business_id: business.id,
      customer_name: customerName,
      customer_phone: customerPhone,
      twilio_message_sid: messageSid,
    });
    logger.info(`Solicitud guardada en BD. ID: ${(reviewRequest as { id: string }).id}`);
  } catch (dbError) {
    logger.error("Error al guardar la solicitud en la base de datos", dbError);
    return NextResponse.json(
      { error: "El mensaje fue enviado pero no se pudo guardar el registro. Contacta con soporte." },
      { status: 500 }
    );
  }

  logger.info(`Flujo completado: solicitud enviada y guardada para ${customerName}`);
  return NextResponse.json({ success: true, data: reviewRequest });
}
