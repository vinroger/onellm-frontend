import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";

import { stripe } from "@/lib/stripe";
import supabase from "../../supabase-server.component";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const { data: subscriptions, error: subscriptionError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("owner_id", userId);

    if (subscriptionError) {
      return res.status(500).json({ error: subscriptionError.message });
    }

    let isSubscriptionActive = false;
    let subscriptionPlan = "";
    let subscriptionMetadata = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const subscription of subscriptions) {
      if (
        subscription.status === "active" ||
        subscription.status === "trialing"
      ) {
        if (new Date(subscription.current_period_end ?? "") < new Date()) {
          // eslint-disable-next-line no-continue
          continue;
        }
        isSubscriptionActive = true;

        const productId = subscription.product_id;
        if (!productId) {
          // eslint-disable-next-line no-continue
          continue;
        }

        // eslint-disable-next-line no-await-in-loop
        const product = await stripe.products.retrieve(productId);
        // get the subscription plan from stripe
        subscriptionPlan = product.metadata.nickname;
        subscriptionMetadata = { subscription, product };
        break;
      }
    }

    const returnedObject = {
      ...users[0],
      subscription_is_active: isSubscriptionActive,
      subscription_plan: subscriptionPlan,
      subscription_metadata: subscriptionMetadata,
    };

    return res.status(200).json(returnedObject);
  }

  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
