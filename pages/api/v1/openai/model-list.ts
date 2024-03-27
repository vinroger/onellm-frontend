import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";

import OpenAI from "openai";
import { OPEN_AI_AVAILABLE_GPT_MODELS_FOR_FINE_TUNE } from "@/constants/openai";
import supabase from "../../supabase-server.component";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.method === "POST") {
      if (req.query.method === "model_provider_api_key_id") {
        const { projectId } = req.body as { projectId: string };

        if (!projectId) {
          return res.status(400).json({ error: "projectId is required" });
        }
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
          .eq("project_id", projectId)
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

    if (req.method === "GET") {
      const { projectId, filter } = req.query as any;

      if (!projectId) {
        return res.status(400).json({ error: "projectId is required" });
      }

      // get the api key from the database

      const { data: apikeys, error } = await supabase
        .from("model_provider_api_keys")
        .select("*")
        .eq("project_id", projectId);

      const openAIAPIKey = apikeys?.[0]?.api_key;
      const modelProviderApiKeyId = apikeys?.[0]?.id;

      if (error || !openAIAPIKey) {
        return res.status(500).json({ error: error?.message });
      }

      // use openai library
      const openai = new OpenAI({
        apiKey: openAIAPIKey,
      });

      const { data: models } = await openai.models.list();

      // fetch supaabse
      const { data: supabaseModelsData, error: supabaseModelsError } =
        await supabase.from("models").select("*").eq("project_id", projectId);

      if (supabaseModelsError) {
        return res.status(500).json({ error: supabaseModelsError.message });
      }

      const updates = models.map((model) => {
        const supabaseModel = supabaseModelsData.find(
          (m) => m.name === model.id
        );
        if (!supabaseModel) {
          return {
            id: uuidv4(),
            name: model.id,
            owner_id: userId,
            project_id: projectId,
            model_provider_api_key_id: modelProviderApiKeyId,
            type: model.id.startsWith("ft:") ? "fine-tune" : "base",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
        }
        return {
          ...supabaseModel,
          updated_at: new Date().toISOString(),
        };
      });

      // Now time to update supabase
      const { data: supabaseResponse, error: updateError } = await supabase
        .from("models")
        .upsert(updates, { onConflict: "name,project_id" })
        .select("*");

      if (updateError) {
        return res.status(500).json({ error: updateError.message });
      }

      if (filter === "fine-tune") {
        const fineTuneModels = supabaseResponse.filter((model) =>
          model.name.startsWith("ft:")
        );
        return res.status(200).json(fineTuneModels);
      }

      if (filter === "fine-tune-base") {
        const fineTuneModels = supabaseResponse.filter((model) =>
          OPEN_AI_AVAILABLE_GPT_MODELS_FOR_FINE_TUNE.includes(model.name)
        );
        return res.status(200).json(fineTuneModels);
      }

      return res.status(200).json(supabaseResponse);
    }

    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error });
  }
}
