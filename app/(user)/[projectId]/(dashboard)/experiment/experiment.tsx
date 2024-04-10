/* eslint-disable react/jsx-curly-newline */

"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Evaluation } from "@/types/table";
import { toHumanDateString } from "@/utils/functions/date";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { Trash2 } from "lucide-react";

import { toast } from "sonner";
import useDeleteConfirmationDialog from "@/utils/hooks/useDeleteConfirmationDialog";
import { cn } from "@/lib/utils";
import { useProjectContext } from "@/utils/contexts/useProject";
import { Skeleton } from "@/components/ui/skeleton";
import { useHasOpenAIKey } from "@/utils/hooks/useHasOpenAIKey";
import NonIdealState from "@/components/NonIdealState";
import LoadingState from "@/components/LoadingState";
import NonIdealStateCard from "@/components/NonIdealStateCard";
import { CreateNewEvaluationDialog } from "./createnewexperiment";

function EvaluationCard({
  EvaluationName,
  description,
  lastEdited,
  EvaluationId,
  refetch,
}: {
  EvaluationName: string;
  description: string | null;
  lastEdited: string;
  EvaluationId: string;
  refetch: () => void;
}) {
  const router = useRouter();
  const { DialogConfimationCompoment, setOpen } = useDeleteConfirmationDialog();

  const { projectId } = useProjectContext();

  const handleDelete = async () => {
    setOpen(false);
    await axios.delete(`/api/v1/evaluations/${EvaluationId}`);
    await refetch();
    toast("Evaluation has been deleted", {
      description: `The evaluation ${EvaluationName} has been deleted.`,
    });
  };
  const [isHovered, setHovered] = useState(false);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  return (
    <Card
      className={cn(
        "p-4 cursor-pointer relative",
        isHovered && "bg-neutral-100"
      )}
      onClick={() => {
        router.push(`/${projectId}/experiment/${EvaluationId}`);
      }}
      onMouseEnter={() => {
        setHovered(true);
        setShowDeleteButton(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
        setShowDeleteButton(false);
      }}
    >
      <div className="space-y-1">
        <h1 className="p-0 m-0 font-semibold text-md">{EvaluationName}</h1>
        <p className="p-0 m-0 text-xs text-neutral-600">{description}</p>
        <p className="p-0 m-0 mb-2 text-xs text-neutral-600">
          Last Edited at {lastEdited}
        </p>
      </div>

      {showDeleteButton && (
        <button
          type="button"
          onClick={(e) => {
            setOpen(true);
            // e.preventDefault();
            e.stopPropagation();
          }}
          onMouseEnter={(e) => {
            setHovered(false);
            e.stopPropagation();
          }}
          onMouseLeave={(e) => {
            setHovered(showDeleteButton);
            e.stopPropagation();
          }}
          className="absolute top-0 right-0 p-3 mt-2 mr-2 rounded-md hover:bg-neutral-100"
        >
          <Trash2 className="w-4 h-4 text-red-700" />
        </button>
      )}
      <DialogConfimationCompoment
        onConfirm={() => {
          handleDelete();
        }}
      />
    </Card>
  );
}

const fetchEvaluation = async (projectId: string) => {
  const response = await axios.get("/api/v1/evaluations/", {
    params: {
      projectId,
    },
  });
  return response.data;
};

function Experiment() {
  const { hasOpenAIKey, loading: openAiLoading } = useHasOpenAIKey();
  const [evaluations, setEvaluations] = useState<Evaluation[]>();
  const [loading, setLoading] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { projectId } = useProjectContext();

  const loadEvaluation = async () => {
    setLoading(true);
    const fetchedEvaluations = await fetchEvaluation(projectId);

    setEvaluations(fetchedEvaluations);
    setLoading(false);
  };

  const router = useRouter();

  useEffect(() => {
    loadEvaluation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading || openAiLoading) {
    return <LoadingState />;
  }

  return (
    <div>
      {!hasOpenAIKey && (
        <div
          className="absolute z-30"
          style={{ top: "calc(100% /2.3 )", left: "calc(100%/2.2)" }}
        >
          <NonIdealState
            title={<p className="text-lg font-semibold">No OpenAI API Key</p>}
            description="Please provide your OpenAI API key to continue"
            additionalComponent={
              <div className="mt-5">
                <Button onClick={() => router.push(`/${projectId}/settings`)}>
                  Go to Settings →
                </Button>
              </div>
            }
          />
        </div>
      )}
      <div
        className={cn(
          "p-7",
          !hasOpenAIKey && "blur-md disabled cursor-not-allowed"
        )}
        style={{
          pointerEvents: !hasOpenAIKey ? "none" : "auto",
        }}
      >
        <div className="flex flex-row items-center justify-between">
          <div>
            <h1 className="p-0 m-0 text-lg font-bold">Experiments</h1>
            <p className="p-0 m-0 mb-4 text-sm text-neutral-600">
              Here you can view and manage your experiments. Try out different
              models and compare.
            </p>
          </div>
          <div>
            <Button
              onClick={() => {
                setIsDialogOpen(true);
              }}
            >
              + Create New Experiment
            </Button>
          </div>
        </div>
        <Separator className="mb-5" />

        {evaluations?.length === 0 && (
          <NonIdealStateCard
            title="No experiment found."
            description="Start creating a new experiment."
          />
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {evaluations && !loading ? (
            evaluations.map((item: Evaluation) => (
              <EvaluationCard
                key={item.id}
                EvaluationId={item.id}
                EvaluationName={item.title}
                description={item.description}
                lastEdited={toHumanDateString(new Date(item.updated_at ?? ""))}
                refetch={loadEvaluation}
              />
            ))
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
        <CreateNewEvaluationDialog
          isOpen={isDialogOpen}
          onClose={async () => {
            setIsDialogOpen(false);
            await loadEvaluation();
          }}
        />
      </div>
    </div>
  );
}

export default Experiment;
