import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";
import { generateJwtToken } from "@/utils/functions/jwt";
import OpenAI from "openai";
import supabase from "../../supabase-server.component";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "POST") {
    if (req.query.method === "model_provider_api_key_id") {
      /* 

    1. The request body should contain the model_provider_api_key_id
    2. Hence, we first make a request to supabase to get the key of the model_provider_api_key_id 
    (where model_provider_api_key_id = req.body.model_provider_api_key_id) & check the owner_id also
    3. Then we make a request to the openai api to get the list of models using the openai key from step 2
    4. We then return the list of models from the openai api
    */

      const { data: keys, error } = await supabase
        .from("model_provider_api_keys")
        .select("*")
        .eq("owner_id", userId)
        .eq("id", req.body.model_provider_api_key_id);

      if (error) {
        return res.status(500).json({ error: error.message });
      }
      if (keys.length === 0) {
        return res.status(401).json({ error: "No keys found for the user" });
      }
      const { key: openAIKey } = keys[0] as any;
      // use openai library
      const openai = new OpenAI({
        apiKey: openAIKey, // This is the default and can be omitted
      });
      const models = await openai.models.list();
      return res.status(200).json(models);
    }

    if (req.query.method === "openai_key") {
      // use openai library
      const openai = new OpenAI({
        apiKey: req.body.openai_key, // This is the default and can be omitted
      });
      const models = await openai.models.list();
      return res.status(200).json(models);
    }
  }

  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
