import { useEvaluationContext } from "@/utils/contexts/useEvaluation";
import React, { useState } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Model } from "@/types/table";

function DetailsPage() {
  const { activeEvaluationPoint } = useEvaluationContext();

  const datapoint = activeEvaluationPoint?.data_point;

  const [activeModelId, setActiveModelId] = useState("");
  const { evaluation } = useEvaluationContext();

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
      <p className="mt-2 mb-2 font-semibold">Result</p>
      <Tabs
        defaultValue={defaultModel?.id}
        className="mb-10 "
        orientation="vertical"
        value={activeModelId}
      >
        <TabsList className="">
          {availableModel.map((model: Model) => {
            return (
              <TabsTrigger
                key={model.id}
                value={model.id}
                onClick={() => setActiveModelId(model.id)}
              >
                {model.name}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
    </div>
  );
}

export default DetailsPage;
