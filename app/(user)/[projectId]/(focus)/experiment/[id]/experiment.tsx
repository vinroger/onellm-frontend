"use client";

import React, { useCallback, useEffect } from "react";
import { DataPoint } from "@/types/table";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useEvaluationContext } from "@/utils/contexts/useEvaluation";
import Details from "./(components)/details";
import Files from "./(components)/files";

function Evaluation() {
  const pathname = usePathname();
  const evaluationId = pathname?.split("/experiment/")[1];

  if (!evaluationId) {
    throw new Error("No evaluation id");
  }

  const { evaluationPoints } = useEvaluationContext();

  // Context stuff
  const { activeEvaluationPointId, setActiveEvaluationPointId } =
    useEvaluationContext();

  useEffect(() => {
    const handleArrowKeys = (e: any) => {
      const activeEvaluationPointIdx = evaluationPoints.findIndex(
        (evaluationPoint) => evaluationPoint.id === activeEvaluationPointId
      );

      if (e.key === "ArrowLeft" && activeEvaluationPointIdx > 0) {
        setActiveEvaluationPointId(
          evaluationPoints[activeEvaluationPointIdx - 1].id
        );
      }
      if (
        e.key === "ArrowRight" &&
        activeEvaluationPointIdx < evaluationPoints.length - 1
      ) {
        setActiveEvaluationPointId(
          evaluationPoints[activeEvaluationPointIdx + 1].id
        );
      }
      if (e.key === "ArrowUp" && activeEvaluationPointIdx > 0) {
        setActiveEvaluationPointId(
          evaluationPoints[activeEvaluationPointIdx - 1].id
        );
      }
      if (
        e.key === "ArrowDown" &&
        activeEvaluationPointIdx < evaluationPoints.length - 1
      ) {
        setActiveEvaluationPointId(
          evaluationPoints[activeEvaluationPointIdx + 1].id
        );
      }
    };
    window.addEventListener("keydown", handleArrowKeys);
    return () => {
      window.removeEventListener("keydown", handleArrowKeys);
    };
  }, [activeEvaluationPointId, evaluationPoints, setActiveEvaluationPointId]);

  return (
    <div className="flex flex-row min-w-full min-h-full space-x-2 p-7">
      <div className="flex overflow-scroll max-h-full w-[300px] bg-white rounded-lg ">
        <Files />
      </div>
      <div className="flex flex-1 max-h-full overflow-scroll bg-white rounded-lg">
        <Details />
      </div>
    </div>
  );
}

export default Evaluation;
