import { useEvaluationContext } from "@/utils/contexts/useEvaluation";
import React, { useState } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Model } from "@/types/table";
import useChatCompletion from "@/utils/hooks/useChatCompletion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useProjectContext } from "@/utils/contexts/useProject";

function DetailsPage() {
  const { activeEvaluationPoint } = useEvaluationContext();

  const datapoint = activeEvaluationPoint?.data_point;

  const [activeModelId, setActiveModelId] = useState("");
  const { evaluation } = useEvaluationContext();

  const { response, status, sendMessage, setResponse } = useChatCompletion();

  const { projectId } = useProjectContext();

  if (!activeEvaluationPoint) {
    return (
      <div className="flex items-center justify-center min-w-full min-h-full p-7">
        Please select a datapoint from the left to continue.
      </div>
    );
  }

  const availableModel = evaluation?.models || [];

  const defaultModel = availableModel?.[0];

  return (
    <div className="min-w-full p-4">
      <p className="mb-2 font-semibold">Prompt</p>
      <div className="overflow-scroll max-h-48">
        <pre className="p-4 overflow-scroll text-xs text-left whitespace-pre-wrap bg-gray-100 rounded-lg text-muted-foreground">
          <code>{JSON.stringify(datapoint?.data, null, 2)}</code>
        </pre>
      </div>
      <div className="flex flex-row items-center mt-10 space-x-3">
        <p className="mt-2 mb-2 font-semibold">Pick a model</p>
        <Tabs
          defaultValue={defaultModel?.name}
          className=""
          orientation="vertical"
          value={activeModelId}
        >
          <TabsList className="">
            {availableModel.map((model: Model) => {
              return (
                <TabsTrigger
                  key={model.name}
                  value={model.name}
                  onClick={() => setActiveModelId(model.name)}
                >
                  {model.name}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      <Separator className="mt-3" />

      <Button
        variant="outline"
        className="mt-3"
        onClick={() => {
          setResponse("");
          sendMessage(projectId, activeModelId, datapoint?.data || {});
        }}
        disabled={!activeModelId || !datapoint?.data || status === "Generating"}
      >
        ▶ Generate
      </Button>

      <div className="h-48 mt-2 overflow-scroll max-h-48">
        <pre className="flex flex-1 min-h-full p-4 overflow-scroll text-xs text-left whitespace-pre-wrap bg-gray-100 rounded-lg text-muted-foreground">
          <code>
            {response || "No response. Pick a model and click generate."}
          </code>
        </pre>
      </div>
    </div>
  );
}

export default DetailsPage;