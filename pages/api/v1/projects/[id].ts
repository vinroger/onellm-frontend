import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";

import supabase from "../../supabase-server.component";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { id } = req.query as { id: string };

  if (req.method === "GET") {
    const { data: projects, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .eq("owner_id", userId);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(projects[0]);
  }

  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
