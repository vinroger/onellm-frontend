/* eslint-disable no-restricted-syntax */
import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import OpenAI from "openai";
import { getOpenAIKey } from "@/utils/api/apikey";
import supabase from "../../supabase-server.component";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);

  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  if (req.method !== "GET")
    return res.status(405).end(`Method ${req.method} Not Allowed`);

  const { projectId } = req.query as { projectId: string };
  if (!projectId)
    return res.status(400).json({ error: "projectId is required" });

  const { apiKey, apiKeyId } = await getOpenAIKey(projectId, userId);

  const { data: trainings, error: trainingError } = await supabase
    .from("trainings")
    .select("*")
    .eq("owner_id", userId)
    .eq("project_id", projectId);

  if (trainingError)
    return res.status(500).json({ error: trainingError.message });

  const openai = new OpenAI({
    apiKey,
  });

  const { data: fineTuneJobs } = await openai.fineTuning.jobs.list();

  const updates = fineTuneJobs.map((job) => {
    const trainingObject = trainings.find((t) => t.id === job.id);
    if (!trainingObject) {
      return {
        status: job.status,
        data: job as any,
        owner_id: userId,
        project_id: projectId,
        id: job.id,
        title: job.id,
        training_provider_name: "openai",
        training_started_at: new Date(job.created_at * 1000).toISOString(),
        training_completed_at: job.finished_at
          ? new Date(job.finished_at * 1000).toISOString()
          : null,
        training_provider_id: job.id,
      };
    }
    return {
      ...trainingObject,
      status: job.status,
      training_started_at: new Date(job.created_at * 1000).toISOString(),
      training_completed_at: job.finished_at
        ? new Date(job.finished_at * 1000).toISOString()
        : null,
      data: job as any,
    };
  });

  const { data: updatedTrainings, error } = await supabase
    .from("trainings")
    .upsert(updates)
    .select("*");

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json(updatedTrainings);
}
