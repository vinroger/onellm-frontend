/* eslint-disable camelcase */
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

  const { id: evaluationPointId } = req.query as { id: string };

  if (req.method === "PUT") {
    const { data: evaluationPoints, error } = await supabase
      .from("evaluation_points")
      .update({ ...req.body })
      .eq("id", evaluationPointId)
      .select();

    if (
      !evaluationPoints ||
      evaluationPoints.length === 0 ||
      evaluationPoints[0].evaluation_id === null
    ) {
      return res.status(404).json({ error: "Not Found" });
    }

    const { evaluation_id } = evaluationPoints[0];

    // update dataset updated_date
    await supabase
      .from("evaluations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", evaluation_id)
      .select("*");

    if (error) {
      return res.status(500).json({ error: (error as any).message });
    }
    return res.status(200).json(evaluationPoints);
  }

  if (req.method === "DELETE") {
    const { data: evaluationPoints, error } = await supabase
      .from("evaluation_points")
      .delete()
      .eq("id", evaluationPointId);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ evaluationPoints });
  }

  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
