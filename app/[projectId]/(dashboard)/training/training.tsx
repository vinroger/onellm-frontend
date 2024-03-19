/* eslint-disable no-nested-ternary */

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Training } from "@/types/table";
import { useProjectContext } from "@/utils/contexts/useProject";
import { toHumanDateString } from "@/utils/functions/date";
import { toTitleCase } from "@/utils/functions/string";
import useAsync from "@/utils/hooks/useAsync";
import useDeleteConfirmationDialog from "@/utils/hooks/useDeleteConfirmationDialog";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import NonIdealState from "@/components/NonIdealState";
import { useHasOpenAIKey } from "@/utils/hooks/useHasOpenAIKey";

import LoadingState from "@/components/LoadingState";
// eslint-disable-next-line import/no-named-as-default
import CreateNewTrainingDialog from "./createnewtrainingdialog";

export type FineTuningObject = {
  datasetId: string;
  projectId: string;
  oneLLMtrainingId: string;
  openAItrainingId: string;
  fineTuningOptions: {
    hyperparameters?: {
      n_epochs: number;
      batch_size: number;
      learning_rate_multiplier: number;
    };
    suffix?: string;
    validation_file?: string;
  };
  title: string;
  description: string;
};

export const BadgeComponent = ({ status }: { status: string }) => {
  const successKind = ["completed"];
  const dangerKind = ["failed"];
  const warningKind = ["in_progress", "queued"];

  if (successKind.includes(status)) {
    return (
      <Badge
        variant="default"
        className="text-green-600 bg-green-100 hover:bg-green-100"
      >
        {toTitleCase(status)}
      </Badge>
    );
  }
  if (dangerKind.includes(status)) {
    return (
      <Badge
        variant="secondary"
        className="text-red-600 bg-red-100 hover:bg-red-100"
      >
        {toTitleCase(status)}
      </Badge>
    );
  }
  if (warningKind.includes(status)) {
    return (
      <Badge
        variant="default"
        className="text-yellow-600 bg-yellow-100 hover:bg-yellow-100"
      >
        {toTitleCase(status)}
      </Badge>
    );
  }
  return <Badge variant="default">{status}</Badge>;
};

function ModelCard({
  trainingName,
  description,
  trainingId,
  refetch,
  providerName,
  status,
  startedAt,
  completedAt,
}: {
  trainingName: string;
  description: string | null;
  trainingId: string;
  refetch: () => void;
  providerName: string | null;
  status: string | null;
  startedAt: string | null;
  completedAt: string | null;
}) {
  const { DialogConfimationCompoment, setOpen } = useDeleteConfirmationDialog();

  const handleDelete = async () => {
    setOpen(false);
    await axios.delete(`/api/v1/Models/${trainingId}`);
    await refetch();
    toast("Model has been deleted", {
      description: `The Model ${trainingName} has been deleted.`,
    });
  };
  const [isHovered, setHovered] = useState(false);

  return (
    <Card
      className={cn(
        "p-4 relative"
        // isHovered && "bg-neutral-100"
      )}
      onMouseEnter={() => {
        setHovered(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
      }}
    >
      <div className="space-y-1">
        <h1 className="p-0 m-0 font-semibold text-md">{trainingName}</h1>
        <p className="p-0 m-0 text-xs text-neutral-600">{description}</p>

        {startedAt && (
          <p className="p-0 m-0 mb-2 text-xs text-neutral-600">
            Started at {toHumanDateString(new Date(startedAt))}{" "}
          </p>
        )}

        {completedAt && (
          <p className="p-0 m-0 mb-2 text-xs text-neutral-600">
            Completed at {toHumanDateString(new Date(completedAt))}
          </p>
        )}
      </div>
      <div className="flex flex-row items-center mt-5">
        <p className="p-0 m-0 mr-2 text-xs font-semibold">Status:</p>
        <BadgeComponent status={status ?? "warning"} />
        <p className="p-0 m-0 mr-2 text-xs font-semibold">{providerName}</p>
      </div>

      <DialogConfimationCompoment
        onConfirm={() => {
          handleDelete();
        }}
      />
    </Card>
  );
}

const FineTuningCards = ({
  openAIFineTuningJobs,
  refetch,
}: {
  openAIFineTuningJobs: Training[];
  refetch: () => void;
}) => {
  if (!openAIFineTuningJobs) {
    return (
      <div>
        {Array.from({ length: 2 }).map((_, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Card className="p-8" key={index}>
            <Skeleton className="w-[200px] h-4" />
          </Card>
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-2">
      {openAIFineTuningJobs.map((item: Training) => {
        return (
          <ModelCard
            key={item.id}
            trainingName={item.title}
            description={item.description}
            trainingId={item.id}
            providerName={item.training_provider_name}
            status={item.status}
            startedAt={item.training_started_at}
            completedAt={item.training_completed_at}
            refetch={refetch}
          />
        );
      })}
    </div>
  );
};

function TrainingPage() {
  const { projectId } = useProjectContext();
  const { hasOpenAIKey, loading } = useHasOpenAIKey();
  const router = useRouter();

  const {
    execute,
    value: openAIFineTuningJobs,
    status: modelStatus,
  } = useAsync(async (): Promise<Training[]> => {
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

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (loading) {
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
            <h1 className="p-0 m-0 text-lg font-bold">Trainings</h1>
            <p className="p-0 m-0 mb-4 text-sm text-neutral-600">
              Here you can view your list of trainings or fine-tuning processes.
              To try out models, visit the evaluation page.
            </p>
          </div>
          <div className="flex flex-row space-x-2">
            <Button variant="outline" onClick={() => execute()}>
              Refresh
            </Button>
            <Button
              onClick={() => {
                setIsDialogOpen(true);
              }}
            >
              + Start a New Training
            </Button>
          </div>
        </div>
        <Separator className="mb-5" />

        <div className="flex flex-col space-y-2">
          {modelStatus !== "LOADING" && openAIFineTuningJobs ? (
            <FineTuningCards
              openAIFineTuningJobs={openAIFineTuningJobs}
              refetch={execute}
            />
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
        <CreateNewTrainingDialog
          isOpen={isDialogOpen}
          onClose={async () => {
            setIsDialogOpen(false);
            await execute();
          }}
        />
      </div>
    </div>
  );
}

export default TrainingPage;
