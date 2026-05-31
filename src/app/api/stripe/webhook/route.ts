import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import type Stripe from "stripe";

export const runtime = "nodejs";

async function updateSubscription(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sub: any
) {
  const businessId = sub.metadata?.business_id;
  if (!businessId) return;

  const plan = (sub.metadata?.plan ?? "free") as string;
  const status = sub.status;
  const periodEnd = sub.current_period_end ?? sub.items?.data?.[0]?.current_period_end ?? null;

  await supabase
    .from("businesses")
    .update({
      stripe_subscription_id: sub.id,
      subscription_status: status,
      subscription_plan: ["active", "trialing"].includes(status) ? plan : "free",
      subscription_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
    })
    .eq("id", businessId);
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig  = req.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    logger.warn("Webhook de Stripe con firma inválida", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const supabase = await createServiceClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === "subscription" && session.subscription) {
          const sub = await getStripe().subscriptions.retrieve(session.subscription as string);
          await updateSubscription(supabase, sub);
        }
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await updateSubscription(supabase, sub);
        if (event.type === "customer.subscription.deleted") {
          await supabase
            .from("businesses")
            .update({ subscription_plan: "free", subscription_status: "canceled" })
            .eq("stripe_subscription_id", sub.id);
        }
        break;
      }
      case "invoice.payment_succeeded": {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const invoice = event.data.object as any;
        if (invoice.subscription) {
          const sub = await getStripe().subscriptions.retrieve(invoice.subscription);
          const businessId = sub.metadata?.business_id;
          if (businessId) {
            await supabase.from("payments").insert({
              user_id: sub.metadata?.user_id,
              amount: invoice.amount_paid ?? 0,
              currency: invoice.currency,
              plan: sub.metadata?.plan ?? "starter",
              status: "paid",
              description: `Suscripción ${sub.metadata?.plan ?? ""} — ResenasYa`,
              invoice_url: invoice.hosted_invoice_url ?? null,
              period_start: invoice.period_start ? new Date(invoice.period_start * 1000).toISOString() : null,
              period_end:   invoice.period_end   ? new Date(invoice.period_end   * 1000).toISOString() : null,
            });
          }
        }
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice & { subscription?: string };
        if (invoice.subscription) {
          await supabase
            .from("businesses")
            .update({ subscription_status: "past_due" })
            .eq("stripe_subscription_id", invoice.subscription);
        }
        break;
      }
    }
  } catch (err) {
    logger.error(`Error procesando webhook ${event.type}`, err);
  }

  return new NextResponse("ok", { status: 200 });
}
