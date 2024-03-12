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

  const { id: datasetId } = req.query as { id: string };

  if (req.method === "GET") {
    const { data: datasets, error } = await supabase
      .from("datasets")
      .select("*")
      .eq("id", datasetId)
      .eq("owner_id", userId);
    if (error) {
      console.error("Error getting logs:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(datasets);
  }

  if (req.method === "PUT") {
    const fields = req.body;
    const { data: updatedDataset, error } = await supabase
      .from("datasets")
      .update(fields)
      .eq("id", datasetId)
      .eq("owner_id", userId)
      .select();
    if (error) {
      console.error("Error updating dataset:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(updatedDataset);
  }

  if (req.method === "DELETE") {
    const { data: datasets, error } = await supabase
      .from("datasets")
      .delete()
      .eq("id", datasetId)
      .eq("owner_id", userId)
      .select("*");
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ datasets });
  }

  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
