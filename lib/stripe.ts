import Stripe from "stripe";

if (!process.env.STRIPE_API_KEY) {
  throw new Error("Missing STRIPE_API_KEY");
}

export const stripe = new Stripe(process.env.STRIPE_API_KEY, {
  typescript: true,
  apiVersion: "2024-12-18.acacia",
});
