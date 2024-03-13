/* eslint-disable react/jsx-curly-newline */

"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DataSet } from "@/types/table";
import { toHumanDateString } from "@/utils/functions/date";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DatabaseZap,
  DatabaseZapIcon,
  Loader,
  LoaderIcon,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import useDeleteConfirmationDialog from "@/utils/hooks/useDeleteConfirmationDialog";
import { cn } from "@/lib/utils";

function DatasetCard({
  datasetName,
  description,
  lastEdited,
  datasetId,
  refetch,
}: {
  datasetName: string;
  description: string | null;
  lastEdited: string;
  datasetId: string;
  refetch: () => void;
}) {
  const router = useRouter();
  const { DialogConfimationCompoment, setOpen } = useDeleteConfirmationDialog();

  const handleDelete = async () => {
    setOpen(false);
    await axios.delete(`/api/v1/datasets/${datasetId}`);
    await refetch();
    toast("Dataset has been deleted", {
      description: `The dataset ${datasetName} has been deleted.`,
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
        router.push(`/dataset/${datasetId}`);
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
        <h1 className="p-0 m-0 font-semibold text-md">{datasetName}</h1>
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

export const CreateNewDatasetDialog = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [datasetData, setDatasetData] = useState<Partial<DataSet>>({
    description: "",
    integration_id: null,
    name: "",
    owner_id: "",
  });

  const router = useRouter();

  const handleSubmit = async () => {
    const response: any = await axios.post("/api/v1/datasets/", datasetData);

    setDatasetData({
      description: "",
      integration_id: null,
      name: "",
      owner_id: "",
    });
    await onClose();

    toast("Dataset has been created", {
      description: `You can now start adding datapoints to the ${response.data[0].name} dataset.`,
      action: {
        label: <div>Go to Dataset →</div>,
        onClick: () => {
          router.push(`/dataset/${response.data[0].id}`);
        },
      },
    });
  };

  const isSubmitButtonDistabled =
    datasetData.name?.length === 0 || datasetData.description?.length === 0;

  return (
    <div className="min-w-screen">
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[850px]">
          <DialogHeader>
            <DialogTitle>New Dataset</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <div className="flex flex-col placeholder:min-w-full">
              <div className="flex flex-col items-center justify-center min-w-full">
                <DatabaseZap className="mb-2 text-green-500 h-[25px] w-[25px]" />
                <h1 className="max-w-[250px] text-center">
                  Store your datapoints and messages to be used later for
                  fine-tuning.
                </h1>
              </div>
              <div className="flex flex-col min-w-full mt-3 text-black">
                <p className="mb-2">Dataset Name *</p>
                <Input
                  type="text"
                  placeholder="e.g. Accountant Model Dataset"
                  onChange={(e: any) =>
                    setDatasetData({ ...datasetData, name: e.target.value })
                  }
                />
                <p className="mt-4 mb-2">Dataset Description *</p>
                <Input
                  type="text"
                  placeholder="e.g. This dataset will be used for finetuning my accountant model."
                  onChange={(e: any) =>
                    setDatasetData({
                      ...datasetData,
                      description: e.target.value,
                    })
                  }
                />
                <p className="mt-4 mb-2 cursor-not-allowed text-neutral-300">
                  Import Dataset (coming soon!)
                </p>
                <Input
                  type="file"
                  onChange={(e: any) =>
                    setDatasetData({ ...datasetData, name: e.target.value })
                  }
                  disabled
                />

                <Button
                  variant="default"
                  className="self-end mt-4"
                  onClick={() => {
                    handleSubmit();
                  }}
                  disabled={isSubmitButtonDistabled}
                >
                  {"Create Dataset   →"}
                </Button>
              </div>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const fetchDataset = async () => {
  const response = await axios.get("/api/v1/datasets/");
  return response.data;
};

function Dataset() {
  const [datasets, setDatasets] = useState<DataSet[]>();
  const [loading, setLoading] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const loadDataset = async () => {
    setLoading(true);
    const fetchedDatasets = await fetchDataset();

    setDatasets(fetchedDatasets);
    setLoading(false);
  };

  useEffect(() => {
    loadDataset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-7">
      <div className="flex flex-row items-center justify-between">
        <div>
          <h1 className="p-0 m-0 text-lg font-bold">Dataset</h1>
          <p className="p-0 m-0 mb-4 text-sm text-neutral-600">
            Here you can view and manage your datasets.
          </p>
        </div>
        <div>
          <Button
            onClick={() => {
              setIsDialogOpen(true);
            }}
          >
            + Create New Dataset
          </Button>
        </div>
      </div>
      <Separator className="mb-5" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4">
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
      />
    </div>
  );
}

export default Dataset;
