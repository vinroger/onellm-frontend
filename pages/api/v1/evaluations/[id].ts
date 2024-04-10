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

  const { id: evaluationId } = req.query as {
    id: string;
    // projectId: string;
  };

  if (req.method === "GET") {
    const { data: evaluationData, error } = await supabase
      .from("evaluations")
      .select("*")
      .eq("id", evaluationId)
      .order("created_at", { ascending: false });

    // get the models associated with this evaluationData

    const { data: modelData, error: modelsError } = await supabase
      .from("evaluation_models")
      .select(
        `
      *,
      model: models(*)
      `
      )
      .eq("evaluation_id", evaluationId);
    if (error) {
      console.error("Error getting logs:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      ...evaluationData[0],
      models: modelData?.map((modelDataItem) => modelDataItem.model),
    });
  }

  if (req.method === "PUT") {
    const fields = req.body;
    const { data: updatedDataset, error } = await supabase
      .from("evaluations")
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq("id", evaluationId)
      .select();
    if (error) {
      console.error("Error updating dataset:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(updatedDataset);
  }

  if (req.method === "DELETE") {
    const { data: evaluations, error } = await supabase
      .from("evaluations")
      .delete()
      .eq("id", evaluationId)
      .select("*");
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ evaluations });
  }

  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
