"use client";

import LoadingState from "@/components/LoadingState";
import NonIdealState from "@/components/NonIdealState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  OPEN_AI_AVAILABLE_GPT_MODELS_FOR_FINE_TUNE,
  OPEN_AI_GPT_MODELS,
} from "@/constants/openai";
import { cn } from "@/lib/utils";
import { Model } from "@/types/table";
import { useProjectContext } from "@/utils/contexts/useProject";
import { toHumanDateString } from "@/utils/functions/date";
import useAsync from "@/utils/hooks/useAsync";
import useDeleteConfirmationDialog from "@/utils/hooks/useDeleteConfirmationDialog";
import axios from "axios";
import { Loader, LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import OpenAI from "openai";
import React, { use, useEffect, useState } from "react";
import { toast } from "sonner";

const fetchKeys = async (projectId: string) => {
  const res = await axios.get("/api/v1/model-provider-api-keys", {
    params: {
      projectId,
    },
  });
  return res.data;
};

function ModelCard({
  ModelName,
  description,
  lastEdited,
  ModelId,
  refetch,
}: {
  ModelName: string;
  description: string | null;
  lastEdited: string;
  ModelId: string;
  refetch: () => void;
}) {
  const router = useRouter();
  const { DialogConfimationCompoment, setOpen } = useDeleteConfirmationDialog();

  const { projectId } = useProjectContext();

  const isBaseModel = OPEN_AI_GPT_MODELS.includes(ModelName);

  const isFineTunedModel = ModelName.startsWith("ft:gpt");

  const handleDelete = async () => {
    setOpen(false);
    await axios.delete(`/api/v1/Models/${ModelId}`);
    await refetch();
    toast("Model has been deleted", {
      description: `The Model ${ModelName} has been deleted.`,
    });
  };
  const [isHovered, setHovered] = useState(false);

  const badgeClassName = isFineTunedModel
    ? "bg-blue-700 hover:bg-blue-800"
    : "bg-green-700 hover:bg-green-800";

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
        <h1 className="p-0 m-0 font-semibold text-md">{ModelName}</h1>
        <p className="p-0 m-0 text-xs text-neutral-600">{description}</p>
        {/* <p className="p-0 m-0 mb-2 text-xs text-neutral-600">
          Last Edited at {lastEdited}
        </p> */}
        <Badge className={cn("text-xs", badgeClassName)}>
          {isFineTunedModel ? "Fine Tuned" : "Base Model"}
        </Badge>
      </div>

      <DialogConfimationCompoment
        onConfirm={() => {
          handleDelete();
        }}
      />
    </Card>
  );
}

const useHasOpenAIKey = () => {
  const [hasOpenAIKey, setHasOpenAIKey] = useState(false);
  const [loading, setLoading] = useState(true);

  const { projectId } = useProjectContext();

  const loadKeys = async () => {
    setLoading(true);
    const data = await fetchKeys(projectId);

    if (data.length > 0) {
      setHasOpenAIKey(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadKeys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { hasOpenAIKey, setHasOpenAIKey, loading, loadKeys };
};

function ModelPage() {
  const { hasOpenAIKey, loading } = useHasOpenAIKey();
  const router = useRouter();

  const { projectId } = useProjectContext();

  const {
    execute,
    value: openaiModelsList,
    status: modelStatus,
  } = useAsync(async () => {
    const res = await axios.get("/api/v1/openai/model-list", {
      params: {
        filter: "gpt",
        projectId,
      },
    });
    return res.data;
  });

  useEffect(() => {
    execute();
  }, [execute]);

  if (loading || modelStatus === "LOADING") {
    return <LoadingState />;
  }

  const gptModels: Model[] = openaiModelsList?.filter((model: any) => {
    return (
      OPEN_AI_GPT_MODELS.includes(model.name) || model.name.includes("ft:gpt")
    );
  });

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
                <Button onClick={() => router.push("/settings")}>
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
            <h1 className="p-0 m-0 text-lg font-bold">Models</h1>
            <p className="p-0 m-0 mb-4 text-sm text-neutral-600">
              Here you can view your list of models. To fine-tune a model visit
              Training Page.
            </p>
          </div>
          <div>
            <Button variant="outline" onClick={() => execute()}>
              Refresh
            </Button>
          </div>
        </div>
        <Separator className="mb-5" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-3">
          {gptModels ? (
            gptModels.map((item, index) => (
              <ModelCard
                key={item.id}
                ModelId={item.id}
                ModelName={item.name}
                description={item.description}
                lastEdited={toHumanDateString(new Date(item.updated_at ?? ""))}
                refetch={execute}
              />
            ))
          ) : (
            <LoaderIcon className="animate-spin" />
          )}
        </div>
        {/* <CreateNewModelDialog
          isOpen={isDialogOpen}
          onClose={async () => {
            setIsDialogOpen(false);
            await loadModel();
          }}
        /> */}
      </div>
    </div>
  );
}

export default ModelPage;
