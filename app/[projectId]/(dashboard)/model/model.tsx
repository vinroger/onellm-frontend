"use client";

import LoadingState from "@/components/LoadingState";
import NonIdealState from "@/components/NonIdealState";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useProjectContext } from "@/utils/contexts/useProject";
import axios from "axios";
import { Loader, LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";

const fetchKeys = async (projectId: string) => {
  const res = await axios.get("/api/v1/model-provider-api-keys", {
    params: {
      projectId,
    },
  });
  return res.data;
};

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

function Model() {
  const { hasOpenAIKey, loading } = useHasOpenAIKey();
  const router = useRouter();

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
              Here you can view and manage your models.
            </p>
          </div>
          <div>
            <Button>+ Create New Model</Button>
          </div>
        </div>
        <Separator className="mb-5" />

        {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {datasets ? (
            datasets.map((item: DataSet, index) => (
              <DatasetCard
                key={item.id}
                datasetId={item.id}
                datasetName={item.name}
                description={item.description}
                lastEdited={toHumanDateString(new Date(item.updated_at ?? ""))}
                refetch={loadDataset}
              />
            ))
          ) : (
            <LoaderIcon className="animate-spin" />
          )}
        </div>
        <CreateNewDatasetDialog
          isOpen={isDialogOpen}
          onClose={async () => {
            setIsDialogOpen(false);
            await loadDataset();
          }}
        /> */}
      </div>
    </div>
  );
}

export default Model;
