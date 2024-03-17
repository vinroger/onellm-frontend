/* eslint-disable no-restricted-syntax */
import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";

import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import OpenAI from "openai";
import { DataPoint } from "@/types/table";
import supabase from "../../supabase-server.component";

const validateDataset = (datapoints: DataPoint[]): "PASSED" | string => {
  if (datapoints.length < 10) {
    return "Dataset should contain at least 10 data points";
  }

  for (const datapoint of datapoints) {
    if (!datapoint.data) {
      return "Data points should contain a data field";
    }
    let assistantMessageCount = 0;
    let userMessageCount = 0;
    const datapointData = datapoint.data as any;
    for (const message of datapointData) {
      if (message.role === "assistant") {
        assistantMessageCount += 1;
      } else {
        userMessageCount += 1;
      }
    }
    if (assistantMessageCount < 1 || userMessageCount < 1) {
      return "Data points should contain at least 1 assistant and 1 user message";
    }
  }

  return "PASSED";
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.method === "POST") {
      /* Steps are as follow
        1. The request body should contain the datasetId and projectId
        2. [Supabase] We first make a request to supabase to get the data points of the datasetId
        (2.5) Validate the dataset.
        3. We then convert the data points into .jsonl format
        4. [Supabase] We get the api key from supabase
        5. [OpenAI] We then upload the file to openai
        6. [Supabase] we get the fileId from open ai then We then upload the file record to supabase
        7. [OpenAI] We start the fine-tuning process, POST request to openai
        8. [Supabase] Store the fine-tuning data in supabase.
        8. We then return the response from openai
        */
      const {
        datasetId,
        projectId,
        fineTuningOptions,
        oneLLMBaseModelId,
        openAIModelId,
      } = req.body as {
        datasetId: string;
        projectId: string;
        openAIModelId: string;
        oneLLMBaseModelId: string;
        fineTuningOptions: {
          hyperparameters?: {
            n_epochs: number;
            batch_size: number;
            learning_rate_multiplier: number;
          };
          suffix?: string;
          validation_file?: string;
        };
      };

      if (!datasetId) {
        return res.status(400).json({ error: "datasetId is required" });
      }

      const { data: datapoints, error } = await supabase
        .from("data_points")
        .select("*")
        .eq("dataset_id", datasetId)
        .eq("owner_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error getting datapoints:", error);
        throw new Error(error as any);
      }

      const validateDatasetResult = validateDataset(datapoints);
      if (validateDatasetResult === "PASSED") {
        console.error(`Invalid datapoints: ${validateDatasetResult}`, error);
        throw new Error(`Invalid datapoints: ${validateDatasetResult}`);
      }

      // Convert datapoints into .jsonl format
      const jsonlContent = datapoints
        .map((datapoint) => JSON.stringify({ messages: datapoint.data }))
        .join("\n");

      // upload file to openai first.
      const formData = new FormData();

      const blob = new Blob([jsonlContent], { type: "application/json" });
      formData.append("file", blob, `onellm-${datasetId}.jsonl`);
      formData.append("purpose", "fine-tune");

      // NOW GET THE API KEY FROM OPENAI
      const { data: apiKeys, error: apiKeyError } = await supabase
        .from("model_provider_api_keys")
        .select("*")
        .eq("owner_id", userId)
        .eq("project_id", projectId);

      const apiKey = apiKeys?.[0]?.api_key;

      if (apiKeyError || apiKeys.length === 0 || !apiKey) {
        console.error("Error getting logs:", error);
        throw new Error("No API keys found for the user");
      }

      const openAIResponse = await axios
        .post("https://api.openai.com/v1/files", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${apiKey}`,
          },
        })
        .catch((error) => {
          throw new Error(error);
        });

      const openAiFileId = openAIResponse.data.id;

      // upload file to supabase
      // map to supabase form
      const supabaseFileId = uuidv4();
      const supabaseFile = {
        id: supabaseFileId,
        cloud_provider: "openai",
        owner_id: userId,
        project_id: projectId,
        link: openAiFileId,
      };

      const { data: file, error: fileError } = await supabase
        .from("files")
        .insert([supabaseFile]);

      if (fileError) {
        console.error("Error getting logs:", fileError);
        throw new Error(fileError as any);
      }

      // start fine tuning process
      const openai = new OpenAI({
        apiKey,
      });

      const fineTuningJob = await openai.fineTuning.jobs.create({
        training_file: openAiFileId,
        model: openAIModelId,
        ...fineTuningOptions,
      });

      const supabaseFineTuningJob = {
        id: uuidv4(),
        owner_id: userId,
        project_id: projectId,
        dataset_id: datasetId,
        base_model_id: oneLLMBaseModelId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        training_provider_id: fineTuningJob.id,
        training_started_at: new Date().toISOString(),
        status: fineTuningJob.status,
        title: fineTuningJob.id,
        training_provider_name: "openai",
        file_id: supabaseFileId,
      };

      const { data: fineTuningJobData, error: fineTuningJobError } =
        await supabase
          .from("trainings")
          .insert([supabaseFineTuningJob])
          .select("*");

      if (fineTuningJobError) {
        console.error(fineTuningJobError);
        throw new Error(fineTuningJobError.message);
      }

      return res.status(200).send(fineTuningJobData);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }

  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
