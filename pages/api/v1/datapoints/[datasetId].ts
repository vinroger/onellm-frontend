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

  const { datasetId } = req.query as { datasetId: string };

  if (req.method === "GET") {
    const { data: datapoints, error } = await supabase
      .from("data_points")
      .select("*")
      .eq("dataset_id", datasetId)
      .eq("owner_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(datapoints);
  }
  if (req.method === "PUT") {
    const { data: datapoints, error } = await supabase
      .from("data_points")
      .update({ ...req.body })
      .eq("id", datasetId)
      .eq("owner_id", userId)
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(datapoints);
  }

  if (req.method === "DELETE") {
    const { data: datapoints, error } = await supabase
      .from("data_points")
      .delete()
      .eq("id", datasetId)
      .eq("owner_id", userId);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ datapoints });
  }

  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
