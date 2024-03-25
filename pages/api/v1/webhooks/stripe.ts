/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
import getStripe from "@/utils/get-stripejs";
import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "node:stream";
import Stripe from "stripe";

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

    console.log(event.type);

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
            break;
          case "checkout.session.completed":
            console.log("Checkout session completed!");
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
