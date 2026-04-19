import { createClient } from "@/lib/supabase/server";
import { sendWhatsAppMessage } from "@/lib/twilio";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { customer_name, customer_phone } = body as {
      customer_name: string;
      customer_phone: string;
    };

    if (!customer_name?.trim() || !customer_phone?.trim()) {
      return NextResponse.json(
        { error: "Nombre y teléfono son obligatorios" },
        { status: 400 }
      );
    }

    const { data: business, error: businessError } = await supabase
      .from("businesses")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (businessError || !business) {
      return NextResponse.json(
        { error: "Negocio no encontrado. Completa tu perfil primero." },
        { status: 404 }
      );
    }

    const message = business.welcome_message
      .replace("{nombre}", customer_name)
      .replace("{negocio}", business.name);

    const messageSid = await sendWhatsAppMessage(customer_phone, message);

    const { data: reviewRequest, error: insertError } = await supabase
      .from("review_requests")
      .insert({
        business_id: business.id,
        customer_name: customer_name.trim(),
        customer_phone: customer_phone.trim(),
        twilio_message_sid: messageSid,
        status: "pending",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting review request:", insertError);
      return NextResponse.json(
        { error: "Error al guardar la solicitud" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: reviewRequest });
  } catch (error) {
    console.error("Send review request error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
