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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DatabaseZap, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import useDeleteConfirmationDialog from "@/utils/hooks/useDeleteConfirmationDialog";
import { cn } from "@/lib/utils";
import { useProjectContext } from "@/utils/contexts/useProject";
import { Skeleton } from "@/components/ui/skeleton";

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

export const CreateNewEvaluationDialog = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { projectId } = useProjectContext();
  const [EvaluationData, setEvaluationData] = useState<Partial<Evaluation>>({
    description: "",
    project_id: "",
    title: "",
  });

  const router = useRouter();

  const handleSubmit = async () => {
    const response: any = await axios.post("/api/v1/evaluations/", {
      ...EvaluationData,
      project_id: projectId,
    });

    setEvaluationData({
      description: "",
      title: "",
      owner_id: "",
    });
    await onClose();

    toast("Evaluation has been created", {
      description: `You can now start adding datapoints to the ${response.data[0].name} evaluation.`,
      action: {
        label: <div>Go to Evaluation →</div>,
        onClick: () => {
          router.push(`/${projectId}/Evaluation/${response.data[0].id}`);
        },
      },
    });
  };

  const isSubmitButtonDistabled =
    EvaluationData.title?.length === 0 ||
    EvaluationData.description?.length === 0;

  return (
    <div className="min-w-screen">
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[850px]">
          <DialogHeader>
            <DialogTitle>New Experiment</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <div className="flex flex-col placeholder:min-w-full">
              <div className="flex flex-col items-center justify-center min-w-full">
                <DatabaseZap className="mb-2 text-green-500 h-[25px] w-[25px]" />
                <h1 className="max-w-[250px] text-center">
                  Try out different models and compare.
                </h1>
              </div>
              <div className="flex flex-col min-w-full mt-3 text-black">
                <p className="mb-2">Experiment Name *</p>
                <Input
                  type="text"
                  placeholder="e.g. gpt3.5 vs fine-tuned v1"
                  onChange={(e: any) =>
                    setEvaluationData({
                      ...EvaluationData,
                      title: e.target.value,
                    })
                  }
                />
                <p className="mt-4 mb-2">Experiment Description *</p>
                <Input
                  type="text"
                  placeholder="e.g. compare performance of gpt3.5 after trained with xxx datasets"
                  onChange={(e: any) =>
                    setEvaluationData({
                      ...EvaluationData,
                      description: e.target.value,
                    })
                  }
                />

                <Button
                  variant="default"
                  className="self-end mt-4"
                  onClick={() => {
                    handleSubmit();
                  }}
                  disabled={isSubmitButtonDistabled}
                >
                  {"Create Evaluation   →"}
                </Button>
              </div>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const fetchEvaluation = async (projectId: string) => {
  const response = await axios.get("/api/v1/evaluations/", {
    params: {
      projectId,
    },
  });
  return response.data;
};

function Experiment() {
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

  useEffect(() => {
    loadEvaluation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-7">
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
  );
}

export default Experiment;
