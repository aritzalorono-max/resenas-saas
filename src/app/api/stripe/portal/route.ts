import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";
import { logger } from "@/lib/logger";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { data: business } = await supabase
      .from("businesses")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    if (!business?.stripe_customer_id) {
      return NextResponse.json({ error: "No tienes ninguna suscripción activa" }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://resenasya.com";

    const session = await getStripe().billingPortal.sessions.create({
      customer: business.stripe_customer_id,
      return_url: `${appUrl}/facturacion`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    logger.error("Error creando sesión del portal de Stripe", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
