import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY no configurada");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-04-22.dahlia",
    });
  }
  return _stripe;
}

export const PLANS = {
  starter: {
    name: "Starter",
    get priceId() { return process.env.STRIPE_STARTER_PRICE_ID!; },
    amount: 990,
    limit: 50,
  },
  pro: {
    name: "Pro",
    get priceId() { return process.env.STRIPE_PRO_PRICE_ID!; },
    amount: 2990,
    limit: 250,
  },
} as const;

export type PlanKey = keyof typeof PLANS;
