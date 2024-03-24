"use client";

import React, { createContext, useCallback, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Evaluation,
  EvaluationPoint,
  EvaluationPointJoinedDataPoint,
  Model,
} from "@/types/table";

import { useDebounceCallback } from "usehooks-ts";
import debounce from "debounce";

type EvaluationWithModel = Evaluation & { models: Model[] };

type EvaluationContextType = {
  evaluation: EvaluationWithModel;
  fetchEvaluation: () => void;
  evaluationPoints: EvaluationPointJoinedDataPoint[];
  fetchEvaluationPoints: () => void;
  updateEvaluation: (payload: Partial<Evaluation>) => void;
  updateEvaluationPoint: (
    evaluationPointId: string,
    payload: Partial<EvaluationPoint>,
    debouncedMs?: boolean
  ) => void;
  loading: boolean;
  deleteEvaluationPoint: (evaluationPointId: string) => void;
  activeEvaluationPointId: string;
  setActiveEvaluationPointId: (id: string) => void;
  activeEvaluationPoint: EvaluationPointJoinedDataPoint | undefined;
  setEvaluationPoints: (
    evaluationPoints: EvaluationPointJoinedDataPoint[]
  ) => void;
};

const EvaluationContext = createContext<EvaluationContextType>({
  evaluation: {
    id: "",
    title: "",
    description: "",
    owner_id: "",
    project_id: "",
    created_at: null,
    updated_at: null,
    models: [],
  },
  fetchEvaluation: () => {},
  evaluationPoints: [],
  fetchEvaluationPoints: () => {},
  updateEvaluation: () => {},
  updateEvaluationPoint: () => {},
  loading: false,
  deleteEvaluationPoint: () => {},
  activeEvaluationPointId: "",
  setActiveEvaluationPointId: () => {},
  activeEvaluationPoint: undefined,
  setEvaluationPoints: () => {},
});

const EvaluationProvider = ({
  evaluationId,
  children,
}: {
  evaluationId: string;
  children: React.ReactNode;
}) => {
  const [evaluation, setEvaluation] = React.useState<EvaluationWithModel>({
    id: "",
    title: "",
    description: "",
    owner_id: "",
    project_id: "",
    created_at: null,
    updated_at: null,
    models: [],
  });

  const [evaluationPoints, setEvaluationPoints] = React.useState<
    EvaluationPointJoinedDataPoint[]
  >([]);
  const [loading, setLoading] = React.useState(false);
  const [activeEvaluationPointId, setActiveEvaluationPointId] =
    React.useState<string>("");

  const fetchEvaluation = useCallback(async () => {
    setLoading(true);
    const res = await axios.get(`/api/v1/evaluations/${evaluationId}`);
    setEvaluation(res.data);
    setLoading(false);
  }, [evaluationId, setEvaluation, setLoading]);

  const fetchEvaluationPoints = useCallback(async () => {
    setLoading(true);
    const response = await axios.get("/api/v1/evaluationpoints", {
      params: {
        evaluationId,
      },
    });
    setEvaluationPoints(response.data);
    setLoading(false);
  }, [evaluationId, setEvaluationPoints, setLoading]);

  useEffect(() => {
    fetchEvaluation();
  }, [fetchEvaluation]);

  useEffect(() => {
    fetchEvaluationPoints();
  }, [fetchEvaluationPoints]);

  const updateEvaluation = useCallback(
    async (payload: Partial<Evaluation>) => {
      setLoading(true);
      setEvaluation((prev: any) => {
        return { ...prev, ...payload };
      });
      await axios.put(`/api/v1/evaluations/${evaluation.id}`, payload);
      setLoading(false);
    },
    [evaluation.id]
  );

  const debouncedUpdate = useMemo(() => {
    // Debounce the entire update function
    return debounce(
      async (evaluationPointId: string, payload: Partial<EvaluationPoint>) => {
        await axios.put(
          `/api/v1/evaluationpoints/${evaluationPointId}`,
          payload
        );

        setLoading(false);
      },
      1000
    );
  }, []);

  const updateEvaluationPoint = useCallback(
    async (
      evaluationPointId: string,
      payload: Partial<EvaluationPoint>,
      debouncedMs?: boolean
    ) => {
      setLoading(true);
      setEvaluationPoints((prev) => {
        return prev.map((d) => {
          if (d.id === evaluationPointId) {
            return { ...d, ...payload };
          }
          return d;
        });
      });

      if (debouncedMs) {
        debouncedUpdate(evaluationPointId, payload);
      } else {
        await axios.put(
          `/api/v1/evaluationpoints/${evaluationPointId}`,
          payload
        );
        setLoading(false);
      }

      setLoading(false);
    },
    [debouncedUpdate]
  );

  const deleteEvaluationPoint = useCallback(
    async (evaluationPointId: string) => {
      setLoading(true);
      setEvaluationPoints((prev) => {
        return prev.filter((d) => d.id !== evaluationPointId);
      });
      await axios.delete(`/api/v1/evaluationpoints/${evaluationPointId}`);
      setLoading(false);
    },
    [setEvaluationPoints]
  );

  const activeEvaluationPoint =
    evaluationPoints[
      evaluationPoints.findIndex(
        (evaluationPoint) => evaluationPoint.id === activeEvaluationPointId
      )
    ];

  const value = useMemo(() => {
    return {
      evaluation,
      fetchEvaluation,
      evaluationPoints,
      fetchEvaluationPoints,
      updateEvaluation,
      updateEvaluationPoint,
      loading,
      deleteEvaluationPoint,
      activeEvaluationPointId,
      setActiveEvaluationPointId,
      activeEvaluationPoint,
      setEvaluationPoints,
    };
  }, [
    evaluation,
    fetchEvaluation,
    evaluationPoints,
    fetchEvaluationPoints,
    updateEvaluation,
    updateEvaluationPoint,
    loading,
    deleteEvaluationPoint,
    activeEvaluationPointId,
    setActiveEvaluationPointId,
    activeEvaluationPoint,
    setEvaluationPoints,
  ]);

  return (
    <EvaluationContext.Provider value={value}>
      {children}
    </EvaluationContext.Provider>
  );
};

export function useEvaluationContext(): EvaluationContextType {
  const context = React.useContext(EvaluationContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a Project Provider");
  }

  return context;
}

export default EvaluationProvider;
