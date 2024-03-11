/* eslint-disable no-console */
/* eslint-disable camelcase */
import { Webhook } from "svix";
import { UserJSON, WebhookEvent } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import supabase from "../../supabase-server.component";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST") {
      return res.status(405);
    }
    // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET!;

    if (!WEBHOOK_SECRET) {
      throw new Error(
        "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
      );
    }

    // Get the headers
    const svix_id = req.headers["svix-id"] as string;
    const svix_timestamp = req.headers["svix-timestamp"] as string;
    const svix_signature = req.headers["svix-signature"] as string;

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      throw new Error("Error occured -- no svix headers");
    }

    // Get the body
    const body = (await buffer(req)).toString();

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    // Verify the payload with the headers
    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error("Error verifying webhook:", err);
      throw new Error("Error verifying webhook");
    }

    // Get the ID and type
    const { data } = evt;
    const eventType = evt.type;

    console.log(`Webhook with and ID of ${data.id} and type of ${eventType}`);

    if (eventType === "user.created") {
      const userData = data as UserJSON;
      // Ensure the email address array has at least one email, and use a default empty string if not.
      const email = userData.email_addresses[0]?.email_address || "";
      const createdAtIso = new Date(userData.created_at).toISOString();
      const updatedAtIso = new Date(userData.updated_at).toISOString();

      const { data: supabaseResponse, error } = await supabase
        .from("users")
        .insert([
          {
            id: userData.id,
            email,
            first_name: userData.first_name || null, // Use null if `first_name` is not available
            last_name: userData.last_name || null, // Use null if `last_name` is not available
            created_at: createdAtIso,
            updated_at: updatedAtIso,
            image_url: userData.image_url || null, // Use null if `image_url` is not available
          },
        ])
        .select();

      if (error) {
        console.error("Error creating user:", error);
        throw new Error("Error creating user");
      }
      console.log("User created:", supabaseResponse);
      return res.status(200).json({ response: supabaseResponse });
    }

    if (eventType === "user.updated") {
      const userData = data as UserJSON;
      const email = userData.email_addresses[0]?.email_address || "";
      const updatedAtIso = new Date(userData.updated_at).toISOString();

      const { data: supabaseResponse, error } = await supabase
        .from("users")
        .update({
          email,
          first_name: userData.first_name || null, // Use null if `first_name` is not available
          last_name: userData.last_name || null, // Use null if `last_name` is not available
          updated_at: updatedAtIso,
          image_url: userData.image_url || null, // Use null if `image_url` is not available
        })
        .eq("id", userData.id)
        .select();

      if (error) {
        console.error("Error updating user:", error);
        throw new Error("Error updating user");
      }
      console.log("User updated:", supabaseResponse);
      return res.status(200).json({ response: supabaseResponse });
    }

    return res.status(200).json({ response: "Success" });
  } catch (error) {
    console.error("Error verifying webhook:", error);
    return res.status(400).json({ Error: error });
  }
}
