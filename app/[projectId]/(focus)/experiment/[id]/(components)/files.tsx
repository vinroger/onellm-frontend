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
  return (
    <Button
      onClick={() => setActiveEvaluationPointId(evaluationPoint.id)}
      variant="ghost"
      className={cn(
        "flex justify-between h-[30px] min-w-full px-2 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring",
        isActive && "bg-neutral-50"
      )}
    >
      <div className="flex flex-row items-center max-w-3/4">
        <File
          className={cn("font-light w-4 mr-2", isActive && "font-extrabold")}
          strokeWidth={isActive ? 2 : 1}
        />
        <div className={cn("font-light", isActive && "font-bold")}>
          {datapoint && ellipsisString(datapoint.title, 25)}
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
