/**
 * POST /api/generate-welcome-message
 *
 * Genera con Claude un mensaje de bienvenida personalizado para el negocio.
 * El mensaje resultante es editable por el usuario antes de guardarse.
 */

import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";
import { logger } from "@/lib/logger";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const SYSTEM_PROMPT = `Eres un experto en comunicación con clientes para negocios locales.
Tu tarea es redactar el mensaje de WhatsApp inicial que un negocio envía a un cliente justo después de su visita, cuyo único objetivo es preguntarle cómo le fue.

MUY IMPORTANTE — Lo que NUNCA debe aparecer en este mensaje:
- NO menciones Google Maps, Trustpilot, TripAdvisor ni ninguna plataforma de reseñas
- NO pidas que dejen una reseña, valoración ni opinión pública
- NO incluyas ningún enlace ni URL
Este mensaje es solo para preguntar por la experiencia del cliente. Si responde positivamente, el sistema le enviará automáticamente en otro mensaje el enlace para dejar la reseña.

Reglas del mensaje:
- Usa SIEMPRE {nombre} para el nombre del cliente y {negocio} para el nombre del negocio
- Entre 1 y 3 frases cortas y naturales
- Adapta el lenguaje estrictamente al tono indicado:
  * tuteo: trato de tú, cercano y amigable
  * usted: trato formal y profesional
  * juvenil: muy informal, desenfadado, puede usar algún emoji
- Usa la descripción del negocio para personalizar el mensaje y hacerlo más específico
- Solo responde con el texto del mensaje, sin comillas ni explicaciones adicionales`;

export async function POST(request: Request): Promise<Response> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "No autenticado" }, { status: 401 });
  }

  let body: { name?: string; description?: string; website_url?: string; tone?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Body inválido" }, { status: 400 });
  }

  const { name = "", description = "", website_url = "", tone = "tuteo" } = body;

  const userPrompt = [
    `Nombre del negocio: ${name || "un negocio local"}`,
    description ? `Descripción: ${description}` : null,
    website_url ? `Web: ${website_url}` : null,
    `Tono: ${tone}`,
  ]
    .filter(Boolean)
    .join("\n");

  logger.info(`Generando mensaje de bienvenida para "${name}" (tono: ${tone})`);

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 256,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const message =
      response.content[0].type === "text" ? response.content[0].text.trim() : "";

    if (!message) {
      return Response.json({ error: "No se pudo generar el mensaje" }, { status: 500 });
    }

    logger.info("Mensaje de bienvenida generado correctamente");
    return Response.json({ message });
  } catch (err) {
    logger.error("Error al generar mensaje con Claude", err);
    return Response.json({ error: "Error al contactar con la IA" }, { status: 502 });
  }
}
