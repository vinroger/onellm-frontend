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

  if (req.method === "GET") {
    const { evaluationId } = req.query as { evaluationId: string };
    const { data: evaluationPoints, error } = await supabase
      .from("evaluation_points")
      .select(
        `
      *,
      data_point: data_points(*)
      `
      )
      .eq("evaluation_id", evaluationId)
      .eq("owner_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(evaluationPoints);
  }

  if (req.method === "POST") {
    const { data: evaluationPoints, error } = await supabase
      .from("evaluation_points")
      .insert({ ...req.body })
      .select("*");

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(evaluationPoints);
  }

  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
