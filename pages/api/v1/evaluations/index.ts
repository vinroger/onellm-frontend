/* eslint-disable camelcase */
import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";

import { v4 as uuidv4 } from "uuid";
import { GETDatapointsByDatasetId } from "@/utils/api/datapoints";
import { EvaluationPoint } from "@/types/table";
import supabase from "../../supabase-server.component";

export type CreateEvaluationReqBodyType = {
  title: string;
  description: string;
  datasetId: string;
  projectId: string;
  modelIds: string[];
};

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
    const { data: datasets, error } = await supabase
      .from("evaluations")
      .select("*")
      .eq("project_id", req.query.projectId as string)
      .order("updated_at", { ascending: false });
    if (error) {
      console.error("Error getting logs:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(datasets);
  }
  if (req.method === "POST") {
    const { datasetId, projectId, modelIds, title, description } =
      req.body as CreateEvaluationReqBodyType;
    /* 

    1. get datapoints based on the datasetId. 
    2. Create evaluation (title and description) -> evaluation_id
    3.. Insert into evaluation_points table, 
      each with the data_point_id, evaluation_id, copy the data also.
    4. Insert into evaluation_models table.
    */

    const datapoints = await GETDatapointsByDatasetId(datasetId, userId);

    const evaluationId = uuidv4();

    const { data, error } = await supabase
      .from("evaluations")
      .insert([
        {
          title,
          description,
          owner_id: userId,
          id: evaluationId,
          project_id: projectId,
          dataset_id: datasetId,
        },
      ])
      .select("*");

    if (error) {
      console.error("Error creating log:", error);
      return res.status(500).json({ error: error.message });
    }

    const evaluationPoints: EvaluationPoint[] = datapoints.map((datapoint) => ({
      evaluation_id: evaluationId,
      data_point_id: datapoint.id,
      data: {
        prompt: datapoint.data,
        answer: {},
      },
      project_id: projectId,
      owner_id: userId,
      id: uuidv4(),
      score: 0,
      comment: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    const { data: evaluationPointsData, error: evaluationPointsError } =
      await supabase.from("evaluation_points").insert(evaluationPoints);

    if (evaluationPointsError) {
      console.error("Error creating evalpoints:", evaluationPointsError);
      return res.status(500).json({ error: evaluationPointsError.message });
    }

    const evaluationModels = modelIds.map((modelId) => ({
      evaluation_id: evaluationId,
      model_id: modelId,
    }));

    const { data: evaluationModelsData, error: evaluationModelsError } =
      await supabase.from("evaluation_models").insert(evaluationModels);

    if (evaluationModelsError) {
      console.error("Error creating evalmodels:", evaluationModelsError);
      return res.status(500).json({ error: evaluationModelsError.message });
    }

    return res.status(201).json(data);
  }

  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
