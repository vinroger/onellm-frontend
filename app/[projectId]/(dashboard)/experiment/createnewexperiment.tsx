import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useProjectContext } from "@/utils/contexts/useProject";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { ClipboardPlus, DatabaseZap, TriangleAlert } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CreateEvaluationReqBodyType } from "@/pages/api/v1/evaluations";
import useAsync from "@/utils/hooks/useAsync";
import { DataSet, Model } from "@/types/table";
import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ListBoxCustom from "./listbox";

function validateData(data: CreateEvaluationReqBodyType): {
  isValid: boolean;
  message: string;
} {
  if (!data.title) {
    return {
      isValid: false,
      message: "Title is required",
    };
  }
  if (!data.description) {
    return {
      isValid: false,
      message: "Description is required",
    };
  }
  if (!data.datasetId) {
    return {
      isValid: false,
      message: "Dataset is required",
    };
  }
  if (!data.modelIds || data.modelIds.length === 0) {
    return {
      isValid: false,
      message: "Model is required",
    };
  }
  return {
    isValid: true,
    message: "",
  };
}

const initialEvaluationData: CreateEvaluationReqBodyType = {
  title: "",
  description: "",
  datasetId: "",
  projectId: "",
  modelIds: [],
};

export const CreateNewEvaluationDialog = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { projectId } = useProjectContext();
  const [EvaluationData, setEvaluationData] = useState<
    Partial<CreateEvaluationReqBodyType>
  >(initialEvaluationData);

  const [alertError, setAlertError] = useState<string>("");

  const router = useRouter();

  const handleSubmit = async () => {
    const validation = validateData(
      EvaluationData as CreateEvaluationReqBodyType
    );
    if (!validation.isValid) {
      setAlertError(validation.message);
      return;
    }

    const response: any = await axios.post("/api/v1/evaluations/", {
      ...EvaluationData,
      projectId,
    });

    setEvaluationData(initialEvaluationData);
    await onClose();

    toast("Evaluation has been created", {
      description: `You can now start trying out your models in the ${response.data[0].title} experiment.`,
      action: {
        label: <div>Go to Evaluation →</div>,
        onClick: () => {
          router.push(`/${projectId}/experiment/${response.data[0].id}`);
        },
      },
    });
  };

  const validation = validateData(
    EvaluationData as CreateEvaluationReqBodyType
  );
  const isSubmitButtonDistabled = !validation.isValid;

  const {
    value: models,
    execute,
    status,
  } = useAsync(async () => {
    const response = await axios.get(
      `/api/v1/models?projectId=${projectId}&filter=chat`
    );
    return response.data;
  });

  const {
    value: datasets,
    execute: fetchDatasets,
    status: datasetsStatus,
  } = useAsync(async () => {
    const response = await axios.get(`/api/v1/datasets?projectId=${projectId}`);
    return response.data;
  });

  useEffect(() => {
    execute();
    fetchDatasets();
  }, [execute, fetchDatasets]);

  if (status === "LOADING" || datasetsStatus === "LOADING") {
    return null;
  }

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
                <ClipboardPlus className="mb-2 text-green-500 h-[25px] w-[25px]" />
                <h1 className="max-w-[250px] text-center">
                  Try out different models and compare.
                </h1>
              </div>

              {alertError && (
                <Alert variant="destructive" className="mt-5 mb-2">
                  <TriangleAlert className="w-4 h-4" />
                  <AlertTitle>Error!</AlertTitle>
                  <AlertDescription>{alertError}</AlertDescription>
                </Alert>
              )}
              <div className="flex flex-col min-w-full mt-3 text-black">
                <p className="mb-2">Experiment Name *</p>
                <Input
                  type="text"
                  placeholder="e.g. gpt3.5 vs fine-tuned v1"
                  onChange={(e: any) => {
                    setEvaluationData({
                      ...EvaluationData,
                      title: e.target.value,
                    });
                  }}
                />
                <p className="mt-4 mb-2">Experiment Description *</p>
                <Input
                  type="text"
                  placeholder="e.g. compare performance of gpt3.5 after trained with xxx datasets"
                  onChange={(e: any) => {
                    setEvaluationData({
                      ...EvaluationData,
                      description: e.target.value,
                    });
                  }}
                />

                <p className="mt-4 mb-2">Select Dataset *</p>
                <Select
                  onValueChange={(value) => {
                    const data: any = JSON.parse(value);
                    setEvaluationData((prev) => {
                      return {
                        ...prev,
                        datasetId: data.id,
                      };
                    });
                  }}
                >
                  <SelectTrigger className="w-[500px]">
                    <SelectValue placeholder="Select a Dataset" />
                  </SelectTrigger>
                  <SelectContent>
                    {datasets &&
                      datasets.map((dataset: DataSet) => {
                        return (
                          <SelectItem
                            value={JSON.stringify(dataset)}
                            key={dataset.id}
                            className="hover:bg-neutral-50"
                          >
                            {dataset.name}
                          </SelectItem>
                        );
                      })}
                  </SelectContent>
                </Select>

                <p className="mt-4 mb-2">Select Models to Experiment *</p>
                <div className="w-[500px]">
                  {models && (
                    <ListBoxCustom
                      options={models}
                      idKey="id"
                      displayKey="name"
                      selected={EvaluationData.modelIds || []}
                      onChange={(value) => {
                        setEvaluationData((prev) => {
                          return {
                            ...prev,
                            modelIds: value,
                          };
                        });
                      }}
                      label="Model"
                    />
                  )}
                </div>

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
