import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";

import { getOpenAIKey } from "@/utils/api/apikey";
import OpenAI from "openai";
import {
  OPEN_AI_AVAILABLE_GPT_MODELS_FOR_FINE_TUNE,
  OPEN_AI_GPT_MODELS,
} from "@/constants/openai";

import { v4 as uuidv4 } from "uuid";
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
    const { projectId, filter } = req.query as any;

    if (!projectId) {
      return res.status(400).json({ error: "projectId is required" });
    }

    // get the api key from the database

    const { data: apikeys, error } = await supabase
      .from("model_provider_api_keys")
      .select("*")
      .eq("owner_id", userId)
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
      await supabase
        .from("models")
        .select("*")
        .eq("owner_id", userId)
        .eq("project_id", projectId);

    if (supabaseModelsError) {
      return res.status(500).json({ error: supabaseModelsError.message });
    }

    const updates = models.map((model) => {
      const supabaseModel = supabaseModelsData.find((m) => m.name === model.id);
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

    if (filter === "chat") {
      const chatModels = supabaseResponse.filter(
        (model) =>
          OPEN_AI_GPT_MODELS.includes(model.name) ||
          model.name.startsWith("ft:")
      );
      return res.status(200).json(chatModels);
    }

    return res.status(200).json(supabaseResponse);
  }

  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
