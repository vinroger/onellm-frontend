import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";

import supabase from "../../supabase-server.component";

export type Log = {
  api: string | null;
  api_key_id: string | null;
  chat: any;
  completion_token: number | null;
  created_at: string | null;
  id: number;
  ip_address: string | null;
  owner_id: string;
  prompt_tokens: number | null;
  provider: string | null;
  type: string | null;
  user_id: string;
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
    const { data: logs, error } = await supabase
      .from("logs")
      .select("*")
      .eq("owner_id", userId);
    if (error) {
      console.error("Error getting logs:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ logs });
  }

  if (req.method === "POST") {
    const reqData = req.body as Log;

    const { data, error } = await supabase.from("logs").insert([
      {
        owner_id: userId,
        name,
        description,
      },
    ]);

    if (error) {
      console.error("Error creating log:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json(data);
  }

  return res.status(405).end(`Method ${req.method} Not Allowed`);
}