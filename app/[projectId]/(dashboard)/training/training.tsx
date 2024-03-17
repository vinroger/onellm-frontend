"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import React from "react";

type FineTuningObject = {
  datasetId: string;
  projectId: string;
  oneLLMModelId: string;
  openAIModelId: string;
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

const createFineTuneFetch = async ({
  datasetId,
  projectId,
  openAIModelId,
  fineTuningOptions,
}: FineTuningObject) => {
  const response = await axios.post("/api/v1/openai/finetune", {
    datasetId,
    projectId,

    openAIModelId,
    fineTuningOptions,
  });
  return response.data;
};

function Training() {
  const handleCreateFineTune = async () => {
    const fineTune = await createFineTuneFetch({
      oneLLMModelId: "11201c63-d9fe-4c58-8f7f-6952a950c778",
      datasetId: "fef6dcd1-0d3c-45d6-93e3-c350bab1785f",
      projectId: "53778932-56da-44c4-9e00-175ffe4165bd",
      openAIModelId: "gpt-3.5-turbo",
      fineTuningOptions: {
        hyperparameters: {
          n_epochs: 1,
          batch_size: 1,
          learning_rate_multiplier: 1,
        },
      },
    });

    const data = fineTune;
    console.log(data);
  };
  return (
    <div>
      <Button onClick={() => handleCreateFineTune()}>test</Button>Training
    </div>
  );
}

export default Training;
