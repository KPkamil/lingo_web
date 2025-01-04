"use server";

import { auth, currentUser } from "@clerk/nextjs/server";

import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import { getUserSubscription } from "@/db/queries";

const returnUrl = absoluteUrl("/shop");

export const createStripeUrl = async () => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    throw new Error("Unauthorized");
  }

  const userSubscription = await getUserSubscription();

  if (userSubscription && userSubscription.stripeCustomerId) {
    const stripeSession = await stripe.billingPortal.sessions.create({
      return_url: returnUrl,
      customer: userSubscription.stripeCustomerId,
    });

    return { data: stripeSession.url };
  }

  const stripeSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    cancel_url: `${returnUrl}`,
    success_url: `${returnUrl}`,
    payment_method_types: ["card"],
    customer_email: user.emailAddresses[0].emailAddress,
    metadata: {
      userId,
    },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "USD",
          product_data: {
            name: "Lingo Pro",
            description: "Unlimited hearts.",
          },
          unit_amount: 2000, // $20.00
          recurring: {
            interval: "month",
          },
        },
      },
    ],
  });

  return { data: stripeSession.url };
};
