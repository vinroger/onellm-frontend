"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjectContext } from "@/utils/contexts/useProject";
import useAsync from "@/utils/hooks/useAsync";

import axios from "axios";
import React, { useEffect } from "react";

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
  const { projectId } = useProjectContext();
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

  const {
    execute,
    value: openAIFineTuningJobs,
    status: modelStatus,
  } = useAsync(async () => {
    const res = await axios.get("/api/v1/trainings", {
      params: {
        projectId,
      },
    });
    return res.data;
  });

  useEffect(() => {
    execute();
  }, [execute]);

  return (
    <div className="p-7">
      <div className="flex flex-row items-center justify-between">
        <div>
          <h1 className="p-0 m-0 text-lg font-bold">Trainings</h1>
          <p className="p-0 m-0 mb-4 text-sm text-neutral-600">
            Here you can view your list of trainings or fine-tuning processes.
            To try out models, visit the evaluation page.
          </p>
        </div>
        <div>
          <Button variant="outline" onClick={() => execute()}>
            Refresh
          </Button>
        </div>
      </div>
      <Separator className="mb-5" />
      <div className="flex flex-col space-y-2">
        {modelStatus !== "LOADING" ? (
          <Button onClick={() => handleCreateFineTune()}>test</Button>
        ) : (
          <>
            {Array.from({ length: 2 }).map((_, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <Card className="p-8" key={index}>
                <Skeleton className="w-[200px] h-4" />
              </Card>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default Training;
