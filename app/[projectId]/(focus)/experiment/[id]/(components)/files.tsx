"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DataPoint,
  EvaluationPoint,
  EvaluationPointJoinedDataPoint,
} from "@/types/table";

import { useEvaluationContext } from "@/utils/contexts/useEvaluation";
import { useProjectContext } from "@/utils/contexts/useProject";
import { ellipsisString } from "@/utils/functions/string";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { File, LoaderIcon, Pencil, Save, Trash } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";
import { v4 as uuidv4 } from "uuid";

function EvaluationPointButton({
  evaluationPoint,
  setActiveEvaluationPointId,
  isActive,
}: {
  evaluationPoint: EvaluationPointJoinedDataPoint;
  isActive: boolean;
  setActiveEvaluationPointId: (id: string) => void;
}) {
  const datapoint = evaluationPoint.data_point;

  const colors = [100, 200, 300, 400, 500, 600, 700, 800, 900];

  const completionData = (evaluationPoint?.data as any)?.completion;

  const { evaluation } = useEvaluationContext();

  const availableModel = evaluation?.models;
  availableModel.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Button
      onClick={() => setActiveEvaluationPointId(evaluationPoint.id)}
      variant="ghost"
      className={cn(
        "flex justify-between h-[30px] min-w-full px-2 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring",
        isActive && "bg-neutral-50"
      )}
    >
      <div className="flex flex-row items-center justify-between w-full max-w-3/4">
        <div className="flex flex-row items-center">
          <File
            className={cn("font-light w-4 mr-2", isActive && "font-extrabold")}
            strokeWidth={isActive ? 2 : 1}
          />
          <div className={cn("font-light", isActive && "font-bold")}>
            {datapoint && ellipsisString(datapoint.title, 25)}
          </div>
        </div>

        <div className="flex flex-row items-center space-x-[1px]">
          {availableModel.map((model) => {
            const score = completionData?.[model.id]?.rating;
            if (!score) {
              return <div key={model.id} className={"w-2 h-2 bg-red-200"} />;
            }

            const greenNumber = Math.max(
              Math.min(Math.floor(score) * 100, 950),
              50
            );

            return (
              <div
                key={model.id}
                className={`w-2 h-2 bg-green-${greenNumber}`}
              />
            );
          })}
        </div>
      </div>
    </Button>
  );
}

function Files() {
  const { userId } = useAuth();

  const pathname = usePathname();
  const evaluationId = pathname?.split("/evaluation/")[1];

  const { projectId } = useProjectContext();

  const {
    loading,
    evaluationPoints,
    activeEvaluationPointId,
    setActiveEvaluationPointId,
  } = useEvaluationContext();

  // sort by created_at
  evaluationPoints.sort((a, b) => {
    if (!a.data_point?.created_at || !b.data_point?.created_at) {
      return 0;
    }
    return (
      new Date(b.data_point.created_at).getTime() -
      new Date(a.data_point.created_at).getTime()
    );
  });

  return (
    <div className="flex flex-col min-w-full p-4">
      <div className="flex flex-row items-center mb-4 ">
        <h1 className="p-0 m-0 font-bold text-md">Evaluation Points</h1>
        {loading && (
          <LoaderIcon className="w-4 h-4 ml-2 animate-spin text-neutral-500" />
        )}
      </div>
      {evaluationPoints &&
        evaluationPoints.map((evaluationPoint) => {
          return (
            <div
              key={evaluationPoint.id}
              className={"flex flex-row items-center min-w-full"}
            >
              <EvaluationPointButton
                isActive={activeEvaluationPointId === evaluationPoint.id}
                evaluationPoint={evaluationPoint}
                setActiveEvaluationPointId={setActiveEvaluationPointId}
              />
            </div>
          );
        })}
    </div>
  );
}

export default Files;
