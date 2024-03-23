import { useEvaluationContext } from "@/utils/contexts/useEvaluation";
import React, { useEffect, useState } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Model } from "@/types/table";
import useChatCompletion from "@/utils/hooks/useChatCompletion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useProjectContext } from "@/utils/contexts/useProject";
import { Input } from "@/components/ui/input";
import { set } from "react-hook-form";
import { cn } from "@/lib/utils";
import NonIdealState from "@/components/NonIdealState";
import { MousePointerClick } from "lucide-react";

function DetailsPage() {
  const { activeEvaluationPoint, evaluation, updateEvaluationPoint } =
    useEvaluationContext();

  const datapoint = activeEvaluationPoint?.data_point;

  const [activeModelId, setActiveModelId] = useState("");

  const { response, status, sendMessage, setResponse } = useChatCompletion();

  const { projectId } = useProjectContext();

  const [tempRating, setTempRating] = useState("");
  const [ratingError, setRatingError] = useState("");

  const handleRatingChange = (rating: number) => {
    setTempRating(rating.toString());
    setRatingError("");
    if (rating < 0) {
      setRatingError("Rating must be greater than 0");
      return;
    }
    if (rating > 10) {
      setRatingError("Rating must be less than or equal to 10");
      return;
    }
    if (activeEvaluationPoint) {
      updateEvaluationPoint(
        activeEvaluationPoint.id,
        {
          data: {
            ...(activeEvaluationPoint.data as any),
            completion: {
              ...(activeEvaluationPoint?.data as any)?.completion,
              [activeModelId]: {
                ...(activeEvaluationPoint?.data as any)?.completion?.[
                  activeModelId
                ],
                rating,
              },
            },
          },
        },
        true
      );
    }
  };

  useEffect(() => {
    if (activeEvaluationPoint) {
      setTempRating(
        (activeEvaluationPoint?.data as any)?.completion?.[activeModelId]
          ?.rating || ""
      );
    }
  }, [activeModelId, activeEvaluationPoint]);

  useEffect(() => {
    if (activeEvaluationPoint) {
      updateEvaluationPoint(
        activeEvaluationPoint.id,
        {
          data: {
            ...(activeEvaluationPoint.data as any),
            completion: {
              ...(activeEvaluationPoint?.data as any)?.completion,
              [activeModelId]: {
                response,
              },
            },
          },
        },
        true
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  if (!activeEvaluationPoint) {
    return (
      <div className="flex items-center justify-center min-w-full min-h-full p-7">
        Please select a datapoint from the left to continue.
      </div>
    );
  }

  const availableModel = evaluation?.models || [];

  availableModel.sort((a, b) => a.name.localeCompare(b.name));

  const defaultModel = availableModel?.[0];

  const responseToDisplay = (activeEvaluationPoint.data as any).completion?.[
    activeModelId
  ]?.response;

  const activeOpenAIModelName = availableModel.find(
    (model) => model.id === activeModelId
  )?.name;

  const greenNumber = Math.max(
    Math.min(Math.floor(Number(tempRating)) * 100, 950),
    50
  );

  return (
    <div className="min-w-full p-4">
      <p className="mb-2 font-semibold">Prompt</p>
      <div className="h-48 overflow-scroll">
        <pre className="min-h-full p-4 overflow-scroll text-xs text-left whitespace-pre-wrap rounded-lg bg-neutral-100 text-muted-foreground">
          <code>{JSON.stringify(datapoint?.data, null, 2)}</code>
        </pre>
      </div>
      <div className="flex flex-row items-center mt-10 space-x-3">
        <p className="mt-2 mb-2 font-semibold">Pick a model</p>
        <Tabs
          defaultValue={defaultModel?.id}
          className=""
          orientation="vertical"
          value={activeModelId}
        >
          <TabsList className={availableModel?.[0]?.name}>
            {availableModel.map((model: Model) => {
              return (
                <TabsTrigger
                  key={model.id}
                  value={model.id}
                  onClick={() => {
                    setActiveModelId(model.id);
                  }}
                >
                  {model.name}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      <Separator className="mt-3" />
      {activeModelId ? (
        <>
          <div className="flex flex-row items-center mt-3 ">
            <Button
              variant="outline"
              onClick={() => {
                setResponse("");
                sendMessage(
                  projectId,
                  activeOpenAIModelName || "",
                  datapoint?.data || {}
                );
              }}
              disabled={
                !activeModelId || !datapoint?.data || status === "Generating"
              }
            >
              ▶ Generate
            </Button>
            <Separator
              orientation="vertical"
              className="h-8 w-[1.5px] ml-3 mr-4"
            />

            <p className="text-sm font-semibold ">Answer Rating </p>
            <Input
              type="number"
              className={cn(
                "w-[10rem] ml-3",
                ratingError &&
                  "border-red-500 focus:border-red-500 focus-visible:ring-red-500"
              )}
              placeholder="Number (1-10)"
              defaultValue={""}
              min={0}
              max={10}
              value={tempRating}
              onChange={(e) => {
                e.preventDefault();
                handleRatingChange(Number(e.target.value));
              }}
              onKeyDown={(e) => {
                e.stopPropagation();
              }}
              step={0.1}
            />
            {ratingError && (
              <p
                className={cn(
                  "ml-2 text-sm text-red-500 transition-all opacity-0 delay-200",
                  ratingError && "opacity-100"
                )}
              >
                {ratingError}
              </p>
            )}
            <div
              className={`w-5 rounded-xl h-5 ml-3 bg-green-${greenNumber}`}
            />
          </div>

          <div className="flex mt-2 overflow-scroll max-h-[24rem] min-h-[20rem]">
            <pre className="flex flex-1 min-h-full p-4 overflow-scroll text-xs text-left whitespace-pre-wrap rounded-lg bg-neutral-100 text-muted-foreground">
              <code>
                {responseToDisplay === undefined
                  ? "No response. Pick a model and click generate."
                  : responseToDisplay}
              </code>
            </pre>
          </div>
        </>
      ) : (
        <div className="pb-8 mt-4 rounded-lg bg-neutral-50 p-7 h-[360px]">
          <NonIdealState
            title="No Model Selected"
            icon={<MousePointerClick />}
            description="Please select a model to continue."
          />
        </div>
      )}
    </div>
  );
}

export default DetailsPage;
