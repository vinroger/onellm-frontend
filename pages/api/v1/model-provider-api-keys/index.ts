/* eslint-disable camelcase */
import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";

import supabase from "../../supabase-server.component";

type model_provider_api_key = {
  owner_id: string;
  key: any;
  name: void;
  id: string;
  created_at: string;
  last_used: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    const { projectId } = req.query as { projectId: string };

    if (!projectId) {
      return res.status(400).json({ error: "projectId is required" });
    }
    const { data: api_keys, error } = await supabase
      .from("model_provider_api_keys")
      .select("*")
      .eq("owner_id", userId)
      .eq("project_id", projectId);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(api_keys);
  }

  if (req.method === "POST") {
    const { projectId } = req.body;
    if (!projectId) {
      return res.status(400).json({ error: "projectId is required" });
    }
    const { data, error } = await supabase
      .from("model_provider_api_keys")
      .insert([
        {
          owner_id: userId,
          api_key: req.body.api_key,
          id: uuidv4(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          model_provider: req.body.model_provider,
          project_id: projectId,
        },
      ])
      .eq("owner_id", userId)
      .select("*");

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json(data);
  }

  if (req.method === "PUT") {
    const { projectId } = req.body;
    if (!projectId) {
      return res.status(400).json({ error: "projectId is required" });
    }
    const { data, error } = await supabase
      .from("model_provider_api_keys")
      .update({
        api_key: req.body.api_key,
        updated_at: new Date().toISOString(),
      })
      .eq("owner_id", userId)
      .eq("model_provider", req.body.model_provider)
      .eq("project_id", projectId)
      .select("*");

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(data);
  }

  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
