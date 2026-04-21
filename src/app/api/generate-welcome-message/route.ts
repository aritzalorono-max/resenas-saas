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
Tu tarea es redactar un mensaje de WhatsApp breve y cercano que un negocio envía a sus clientes después de su visita para pedir su opinión.

Reglas estrictas:
- Usa SIEMPRE {nombre} donde va el nombre del cliente y {negocio} donde va el nombre del negocio
- El mensaje debe tener entre 1 y 3 frases cortas
- Debe preguntar por la experiencia del cliente de forma natural
- Debe adaptarse al tono indicado
- Solo responde con el texto del mensaje, sin explicaciones ni comillas

Tonos disponibles:
- tuteo: trato informal de tú, cercano y amigable
- usted: trato formal, profesional y respetuoso
- juvenil: muy informal, desenfadado, con algún emoji`;

export async function POST(request: Request): Promise<Response> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "No autenticado" }, { status: 401 });
  }

  let body: { name?: string; description?: string; tone?: string; platformName?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Body inválido" }, { status: 400 });
  }

  const { name = "", description = "", tone = "tuteo", platformName = "Google Maps" } = body;

  const userPrompt = [
    `Negocio: ${name || "un negocio local"}`,
    description ? `Descripción: ${description}` : null,
    `Tono: ${tone}`,
    `Plataforma de reseñas: ${platformName}`,
  ]
    .filter(Boolean)
    .join("\n");

  logger.info(`Generando mensaje de bienvenida para negocio "${name}" (tono: ${tone})`);

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
