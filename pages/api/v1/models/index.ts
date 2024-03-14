import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";

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

  const { projectId } = req.query as { projectId: string };

  if (!projectId) {
    return res.status(400).json({ error: "projectId is required" });
  }

  if (req.method === "GET") {
    const { data: datasets, error } = await supabase
      .from("datasets")
      .select("*")
      .eq("owner_id", userId)
      .eq("project_id", projectId)
      .order("updated_at", { ascending: false });
    if (error) {
      console.error("Error getting logs:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(datasets);
  }

  // if (req.method === "POST") {
  //   const { data, error } = await supabase
  //     .from("datasets")
  //     .insert([{ ...req.body, owner_id: userId, id: uuidv4() }])
  //     .select("*");

  //   if (error) {
  //     console.error("Error creating log:", error);
  //     return res.status(500).json({ error: error.message });
  //   }

  //   return res.status(201).json(data);
  // }

  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
