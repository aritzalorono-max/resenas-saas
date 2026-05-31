import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = "contacto.resenasya@gmail.com";

export async function POST(request: Request) {
  const { nombre, email, asunto, mensaje } = await request.json();

  if (!nombre?.trim() || !email?.trim() || !mensaje?.trim()) {
    return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from:    "ResenasYa Contacto <noreply@resenasya.com>",
    to:      TO_EMAIL,
    replyTo: email,
    subject: `[${asunto}] ${nombre}`,
    text:    `Nombre: ${nombre}\nEmail: ${email}\nAsunto: ${asunto}\n\n${mensaje}`,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
