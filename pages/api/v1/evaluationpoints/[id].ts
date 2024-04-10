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
    const upsertData = { ...req.body, id: evaluationPointId, owner_id: userId };

    const { data: evaluationPoints, error } = await supabase
      .from("evaluation_points")
      .upsert(upsertData) // Use upsert here
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!evaluationPoints || evaluationPoints.length === 0) {
      return res.status(404).json({ error: "Operation failed" });
    }

    const { evaluation_id } = evaluationPoints[0];
    if (!evaluation_id) {
      return res.status(404).json({ error: "Not Found" });
    }

    const { error: updateError } = await supabase
      .from("evaluations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", evaluation_id);

    if (updateError) {
      return res.status(500).json({ error: updateError.message });
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
