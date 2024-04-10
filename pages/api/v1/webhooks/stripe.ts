/* eslint-disable no-case-declarations */
/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
import getStripe from "@/utils/get-stripejs";
import { manageSubscriptionStatusChange } from "@/utils/stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "node:stream";
import Stripe from "stripe";
import supabase from "../../supabase-server.component";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable: Readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

const relevantEvents = new Set([
  // "product.created",
  // "product.updated",
  // "price.created",
  // "price.updated",
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!stripe) {
    throw new Error("Stripe is not available");
  }
  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event: Stripe.Event | null = null;

    try {
      if (!sig || !webhookSecret) return;
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err: any) {
      console.log(`❌ Error message: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (!event || event === null) {
      res.status(400).send("Webhook Error: Invalid event");
      return;
    }

    if (relevantEvents.has(event.type)) {
      try {
        switch (event.type) {
          // case "product.created":
          // case "product.updated":
          //   await upsertProductRecord(event.data.object as Stripe.Product);
          //   break;
          // case "price.created":
          // case "price.updated":
          //   await upsertPriceRecord(event.data.object as Stripe.Price);
          //   break;
          case "customer.subscription.created":
          case "customer.subscription.updated":
          case "customer.subscription.deleted":
            console.log("Subscription event!");
            const subscription = event.data.object as Stripe.Subscription;
            await manageSubscriptionStatusChange(
              subscription.id,
              subscription.customer as string,
              event.type === "customer.subscription.created"
            );
            break;
          case "checkout.session.completed":
            const checkoutSession = event.data
              .object as Stripe.Checkout.Session;

            if (checkoutSession.mode === "subscription") {
              const { data: user, error } = await supabase
                .from("users")
                .update({
                  stripe_customer_id: checkoutSession.customer as string,
                })
                .eq("id", checkoutSession.client_reference_id as string)
                .select("*");

              if (error) {
                throw error;
              }
              const subscriptionId = checkoutSession.subscription;
              const save = await manageSubscriptionStatusChange(
                subscriptionId as string,
                user[0]?.stripe_customer_id as string,
                true
              );

              console.log(
                "%cpages/api/v1/webhooks/stripe.ts:112 save",
                "color: #007acc;",
                save
              );
            }
            // } else if (checkoutSession.mode === "payment") {
            //   const customerId = await createOrRetrieveCustomer({
            //     uuid: checkoutSession.client_reference_id as string,
            //     email: checkoutSession.customer_email as string,
            //   });
            //   const paymentIntentId = checkoutSession.payment_intent;
            //   console.log(checkoutSession);
            //   await upsertPaymentIntentRecord(
            //     paymentIntentId as string,
            //     customerId as string
            //   );
            // }
            break;
          default:
            throw new Error("Unhandled relevant event!");
        }
      } catch (error) {
        console.log(error);
        res
          .status(400)
          // eslint-disable-next-line quotes
          .send(`Webhook error: "Webhook handler failed. View logs."`);
      }
    }

    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
