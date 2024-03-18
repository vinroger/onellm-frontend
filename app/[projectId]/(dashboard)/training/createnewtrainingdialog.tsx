/* eslint-disable camelcase */
import { useProjectContext } from "@/utils/contexts/useProject";
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
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreateFineTuneReqBodyType } from "@/pages/api/v1/openai/finetune";
import {
  LoaderIcon,
  SquareActivity,
  Terminal,
  TriangleAlert,
} from "lucide-react";
import { validateDataset } from "@/utils/api/dataset";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useAsync from "@/utils/hooks/useAsync";
import { DataSet, Model, Training } from "@/types/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FormLabel } from "@/components/ui/form";
import { Form } from "react-hook-form";
import { cn } from "@/lib/utils";
import { validate } from "uuid";

const validateData = async (
  trainingData: CreateFineTuneReqBodyType
): Promise<boolean> => {
  if (
    !trainingData.title ||
    !trainingData.description ||
    !trainingData.datasetId ||
    !trainingData.projectId ||
    !trainingData.openAIModelId ||
    !trainingData.oneLLMBaseModelId
  ) {
    return false;
  }

  if (
    trainingData.fineTuningOptions.hyperparameters &&
    trainingData.fineTuningOptions.hyperparameters.n_epochs &&
    trainingData.fineTuningOptions.hyperparameters.batch_size &&
    trainingData.fineTuningOptions.hyperparameters.learning_rate_multiplier
  ) {
    const { n_epochs, batch_size, learning_rate_multiplier } =
      trainingData.fineTuningOptions.hyperparameters;

    if (n_epochs <= 0 || batch_size <= 0 || learning_rate_multiplier <= 0) {
      return false;
    }
  }

  // validate dataset
  const datasetValidation = await validateDataset(trainingData.datasetId);

  if (datasetValidation.status === "ERROR") {
    return false;
  }

  return true;
};

const initialState: CreateFineTuneReqBodyType = {
  datasetId: "",
  projectId: "",
  openAIModelId: "",
  fineTuningOptions: {},
  title: "",
  description: "",
  oneLLMBaseModelId: "",
};

const createFineTuneFetch = async (
  data: CreateFineTuneReqBodyType
): Promise<Training> => {
  const response = await axios.post("/api/v1/openai/finetune", data);
  return response.data as Training;
};

export const CreateNewTrainingDialog = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { projectId } = useProjectContext();
  const [trainingData, setTrainingData] =
    useState<CreateFineTuneReqBodyType>(initialState);

  const [alertError, setAlertError] = useState("");

  const router = useRouter();

  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsSubmitLoading(true);
      const validation = await validateData(trainingData);
      if (validation === false) {
        setIsSubmitLoading(false);
        toast("Error occurred.", {
          description:
            "Error: Invalid values. Please see the documentation for more details.",
        });
        return;
      }
      const data: any = await createFineTuneFetch(trainingData);

      setTrainingData(initialState);
      setIsSubmitLoading(false);
      await onClose();

      toast("Fine Tune Process has been started", {
        description: `You can now start viewing the report of ${data[0].title}.`,
        action: {
          label: <div>Go to Fine Tune Report →</div>,
          onClick: () => {
            router.push(`/${projectId}/training/${data[0].id}`);
          },
        },
      });
    } catch (err) {
      setIsSubmitLoading(false);
      if ((err as any)?.response?.status === 500) {
        toast("Server Error", {
          description: `A server error occurred: ${
            (err as any)?.response?.data?.message || "Unknown error"
          }. Please try again later.`,
        });
      } else {
        // Handle other errors
        toast("Error occurred.", {
          description: `Error: ${
            (err as any)?.message || "An unknown error occurred"
          }. Please contact us to resolve the issue.`,
        });
      }
    }
  };

  const {
    execute,
    value: datasets,
    status,
  } = useAsync(async () => {
    const res = await axios.get("/api/v1/datasets/", {
      params: {
        projectId,
      },
    });
    return res.data;
  });

  const {
    execute: executeFetchModels,
    value: models,
    status: modelsStatus,
  } = useAsync(async () => {
    const res = await axios.get("/api/v1/openai/model-list", {
      params: {
        projectId,
        filter: "fine-tune-base",
      },
    });
    return res.data;
  });

  useEffect(() => {
    setTrainingData((prev) => {
      return { ...prev, projectId };
    });
  }, [projectId]);

  useEffect(() => {
    execute();
    executeFetchModels();
  }, [execute, executeFetchModels]);

  useEffect(() => {
    if (!trainingData.datasetId) {
      return;
    }
    validateDataset(trainingData.datasetId).then((validation) => {
      if (validation.status === "ERROR") {
        setAlertError(validation.message);
      } else {
        setAlertError("");
      }
    });
  }, [trainingData.datasetId]);

  const isSubmitButtonDistabled = !validateData(trainingData);

  return (
    <div className="min-w-screen">
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[850px]">
          <DialogHeader>
            <DialogTitle>Start a Training</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <div className="flex flex-col placeholder:min-w-full">
              <div className="flex flex-col items-center justify-center min-w-full">
                <SquareActivity className="mb-2 text-green-500 h-[25px] w-[25px]" />
                <h1 className="max-w-[250px] text-center">
                  Ready to make your LLM becomes smarter & more accurate?
                </h1>
              </div>
              {alertError && (
                <Alert variant="destructive" className="mt-5 mb-2">
                  <TriangleAlert className="w-4 h-4" />
                  <AlertTitle>Error!</AlertTitle>
                  <AlertDescription>
                    {alertError}. Please update or change your dataset.{" "}
                    <a
                      href={`/${projectId}/dataset/${trainingData.datasetId}`}
                      target="_blank"
                      className="h-2 p-0 underline text-red hover:font-semibold"
                    >
                      Go to your dataset →
                    </a>
                  </AlertDescription>
                </Alert>
              )}
              <div className="flex flex-col min-w-full mt-3 text-black">
                <p className="mb-2">Training Name *</p>
                <Input
                  type="text"
                  placeholder="e.g. Accountant Model Training"
                  onChange={(e: any) => {
                    setTrainingData({ ...trainingData, title: e.target.value });
                  }}
                />
                <p className="mt-4 mb-2">Training Description *</p>
                <Input
                  type="text"
                  placeholder="e.g. to make the LLM understand accounting terms better."
                  onChange={(e: any) => {
                    setTrainingData({
                      ...trainingData,
                      description: e.target.value,
                    });
                  }}
                />
                <p className="mt-4 mb-2">Select Dataset * </p>
                <Select
                  onValueChange={(value) => {
                    setTrainingData({
                      ...trainingData,
                      datasetId: value as string,
                    });
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a Dataset" />
                  </SelectTrigger>
                  <SelectContent>
                    {datasets &&
                      datasets.map((dataset: DataSet) => {
                        return (
                          <SelectItem
                            value={dataset.id}
                            key={dataset.id}
                            className="hover:bg-neutral-50"
                          >
                            {dataset.name}
                          </SelectItem>
                        );
                      })}
                  </SelectContent>
                </Select>
                <p className="mt-4 mb-2">Select Base Model * </p>
                <Select
                  onValueChange={(value) => {
                    const data: any = JSON.parse(value);
                    setTrainingData({
                      ...trainingData,
                      openAIModelId: data.name as string,
                      oneLLMBaseModelId: data.id as string,
                    });
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a Model" />
                  </SelectTrigger>
                  <SelectContent>
                    {models &&
                      models.map((model: Model) => {
                        return (
                          <SelectItem
                            value={JSON.stringify(model)}
                            key={model.id}
                            className="hover:bg-neutral-50"
                          >
                            {model.name}
                          </SelectItem>
                        );
                      })}
                  </SelectContent>
                </Select>
                <p className="mt-4 mb-2">Learning Rate Multiplier (optional)</p>
                <Input
                  type="number"
                  className={cn("w-1/2")}
                  onChange={(e) => {
                    () => {
                      setTrainingData({
                        ...trainingData,
                        fineTuningOptions: {
                          ...trainingData.fineTuningOptions,
                          hyperparameters: {
                            ...trainingData.fineTuningOptions?.hyperparameters,
                            learning_rate_multiplier: Number(e.target.value),
                          },
                        },
                      });
                    };
                  }}
                />
                <p className="mt-4 mb-2">n_epoch (optional) </p>
                <Input
                  type="number"
                  className={cn("w-1/2")}
                  onChange={(e) => {
                    setTrainingData({
                      ...trainingData,
                      fineTuningOptions: {
                        ...trainingData.fineTuningOptions,
                        hyperparameters: {
                          ...trainingData.fineTuningOptions?.hyperparameters,
                          n_epochs: Number(e.target.value),
                        },
                      },
                    });
                  }}
                />

                <p className="mt-4 mb-2">batch_size (optional) </p>
                <Input
                  type="number"
                  className={cn("w-1/2")}
                  onChange={(e) => {
                    setTrainingData({
                      ...trainingData,
                      fineTuningOptions: {
                        ...trainingData.fineTuningOptions,
                        hyperparameters: {
                          ...trainingData.fineTuningOptions?.hyperparameters,
                          batch_size: Number(e.target.value),
                        },
                      },
                    });
                  }}
                />
                <p className="mt-4 mb-2">suffix (optional) </p>
                <Input
                  className={cn("w-1/2")}
                  onChange={(e) => {
                    setTrainingData({
                      ...trainingData,
                      fineTuningOptions: {
                        ...trainingData.fineTuningOptions,
                        suffix: e.target.value,
                      },
                    });
                  }}
                />

                <Button
                  variant="default"
                  className="self-end mt-4"
                  onClick={() => {
                    handleSubmit();
                  }}
                  disabled={isSubmitButtonDistabled || isSubmitLoading}
                >
                  {isSubmitLoading && (
                    <LoaderIcon className="h-4 mr-2 animate-spin" />
                  )}
                  {!isSubmitLoading ? "Run Fine-tuning   →" : "Processing..."}
                </Button>
              </div>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default CreateNewTrainingDialog;
