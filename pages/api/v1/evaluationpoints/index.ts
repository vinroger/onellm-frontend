/* eslint-disable no-restricted-syntax */
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

  if (req.method === "GET") {
    const { evaluationId } = req.query as { evaluationId: string };

    // Fetch the Evaluation to get dataset_id
    const { data: evaluations, error: evaluationError } = await supabase
      .from("evaluations")
      .select("*")
      .eq("id", evaluationId);

    const evaluation = evaluations?.[0];
    if (evaluationError || !evaluation) {
      return res.status(500).json({ error: evaluationError?.message });
    }

    // Fetch All Data Points for the Dataset
    const { data: dataPoints, error: dataPointsError } = await supabase
      .from("data_points")
      .select("id, data") // Include the data field for mapping
      .eq("dataset_id", evaluation.dataset_id!);

    if (dataPointsError) {
      return res.status(500).json({ error: dataPointsError.message });
    }

    // Fetch Existing Evaluation Points
    const { data: existingEvaluationPoints, error: existingEvalPointsError } =
      await supabase
        .from("evaluation_points")
        .select("data_point_id")
        .eq("evaluation_id", evaluationId);

    if (existingEvalPointsError) {
      return res.status(500).json({ error: existingEvalPointsError.message });
    }

    const existingDataPointIds = existingEvaluationPoints.map(
      (ep) => ep.data_point_id
    );

    // Identify and Create Missing Evaluation Points
    const missingDataPoints = dataPoints.filter(
      (dp) => !existingDataPointIds.includes(dp.id)
    );

    // Assuming uuidv4 and other necessary imports are available
    const evaluationPoints = missingDataPoints.map((datapoint) => ({
      evaluation_id: evaluationId,
      data_point_id: datapoint.id,
      data: {
        prompt: datapoint.data,
        answer: {},
      },
      project_id: evaluation.project_id,
      owner_id: evaluation.owner_id,
      id: uuidv4(), // Ensure this function is imported and available
      score: 0,
      comment: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    // Perform a batch insert if there are missing evaluation points
    if (evaluationPoints.length > 0) {
      const { error: insertError } = await supabase
        .from("evaluation_points")
        .insert(evaluationPoints);

      if (insertError) {
        return res.status(500).json({ error: insertError.message });
      }
    }

    // Return Updated Evaluation Points including the ones just created
    const { data: updatedEvaluationPoints, error: finalError } = await supabase
      .from("evaluation_points")
      .select(
        `
          *,
          data_point: data_points(*)
          `
      )
      .eq("evaluation_id", evaluationId)
      .order("created_at", { ascending: false });

    if (finalError) {
      return res.status(500).json({ error: finalError.message });
    }

    return res.status(200).json(updatedEvaluationPoints);
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
