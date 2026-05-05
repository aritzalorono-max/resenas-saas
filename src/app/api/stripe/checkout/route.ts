import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe, PLANS, type PlanKey } from "@/lib/stripe";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { plan } = await req.json() as { plan: PlanKey };
    if (!PLANS[plan]) {
      return NextResponse.json({ error: "Plan no válido" }, { status: 400 });
    }

    const { data: business } = await supabase
      .from("businesses")
      .select("id, name, stripe_customer_id, stripe_subscription_id, subscription_status")
      .eq("user_id", user.id)
      .single();

    if (!business) {
      return NextResponse.json({ error: "Negocio no encontrado" }, { status: 404 });
    }

    // Si ya tiene suscripción activa, redirigir al portal
    if (business.stripe_subscription_id && business.subscription_status === "active") {
      return NextResponse.json({ error: "Ya tienes una suscripción activa. Usa el portal para cambiar de plan." }, { status: 400 });
    }

    // Crear o recuperar el Customer de Stripe
    let customerId = business.stripe_customer_id;
    if (!customerId) {
      const customer = await getStripe().customers.create({
        email: user.email,
        name: business.name,
        metadata: { user_id: user.id, business_id: business.id },
      });
      customerId = customer.id;
      await supabase
        .from("businesses")
        .update({ stripe_customer_id: customerId })
        .eq("id", business.id);
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://resenasya.com";

    const session = await getStripe().checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: PLANS[plan].priceId, quantity: 1 }],
      success_url: `${appUrl}/facturacion?success=1`,
      cancel_url:  `${appUrl}/facturacion?canceled=1`,
      subscription_data: {
        metadata: { user_id: user.id, business_id: business.id, plan },
      },
      locale: "es",
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error("Error creando sesión de Stripe Checkout", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
