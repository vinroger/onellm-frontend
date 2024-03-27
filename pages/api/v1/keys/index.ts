import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";
import { generateJwtToken } from "@/utils/functions/jwt";
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
    const { projectId } = req.query as { projectId: string };

    if (!projectId) {
      return res.status(400).json({ error: "projectId is required" });
    }
    const { data: keys, error } = await supabase
      .from("keys")
      .select("*")
      .eq("project_id", projectId);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ keys });
  }

  if (req.method === "POST") {
    const { name, projectId } = req.body;

    if (!projectId) {
      return res.status(400).json({ error: "projectId is required" });
    }

    const key = generateJwtToken({ ownerId: userId, projectId });

    const { data, error } = await supabase.from("keys").insert([
      {
        owner_id: userId,
        key,
        name,
        id: uuidv4(),
        created_at: new Date().toISOString(),
        last_used: new Date().toISOString(),
        project_id: projectId,
      },
    ]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json(data);
  }

  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
