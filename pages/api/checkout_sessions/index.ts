import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
            price: "price_1Oy6YNApwYmaLY96n4kXNOO1",
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${req.headers.origin}/test/?success=true`,
        cancel_url: `${req.headers.origin}/test/?canceled=true`,
        automatic_tax: { enabled: true },
      });
      res.redirect(303, session.url!);
    } catch (err: any) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
