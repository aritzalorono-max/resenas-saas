import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});

export const PLANS = {
  starter: {
    name: "Starter",
    priceId: process.env.STRIPE_STARTER_PRICE_ID!,
    amount: 990,   // 9,9€ en céntimos
    limit: 50,
  },
  pro: {
    name: "Pro",
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    amount: 2990,  // 29,9€ en céntimos
    limit: 250,
  },
} as const;

export type PlanKey = keyof typeof PLANS;
