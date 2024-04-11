/* eslint-disable camelcase */
import LoadingState from "@/components/LoadingState";
import SkeletonState from "@/components/SkeletonState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ModelProviderApiKey } from "@/types/table";
import { useProjectContext } from "@/utils/contexts/useProject";
import { sensitizeKey } from "@/utils/functions/string";
import useAsync from "@/utils/hooks/useAsync";
import axios from "axios";
import { Pencil } from "lucide-react";
import Image from "next/image";
import React, { useEffect } from "react";
import { toast } from "sonner";

const validateKey = async (key: string) => {
  try {
    const response = await axios.post(
      "/api/v1/openai/model-list?method=openai_key",
      {
        openai_key: key,
      }
    );
    if (response.status !== 200) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

const saveAPIKey = async (
  api_key: string,
  model_provider: string,
  reqType: "post" | "put",
  projectId: string,
  keyId?: string
) => {
  if (reqType === "put") {
    const res = await axios.put("/api/v1/model-provider-api-keys", {
      api_key,
      model_provider,
      id: keyId,
    });
    return res.data;
  }
  const res = await axios.post("/api/v1/model-provider-api-keys", {
    api_key,
    model_provider,
    projectId,
  });
  return res.data;
};

const fetchKeys = async (projectId: string) => {
  const response: { data: ModelProviderApiKey[] } = await axios.get(
    "/api/v1/model-provider-api-keys",
    {
      params: {
        projectId,
      },
    }
  );
  return response.data;
};

export default function APIKeySettings() {
  const [selectedProvider, setSelectedProvider] = React.useState("openai");

  const [apiKeyInput, setApiKeyInput] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const [dialogReqMode, setDialogReqMode] = React.useState<"post" | "put">(
    "post"
  );

  const { projectId } = useProjectContext();

  const {
    value: availableKeys,
    execute,
    status,
  } = useAsync(() => fetchKeys(projectId));

  const [isSubmitLoading, setIsSubmitLoading] = React.useState(false);

  const handleCreateKey = async () => {
    setIsSubmitLoading(true);
    const isValid = await validateKey(apiKeyInput);
    if (isValid) {
      await saveAPIKey(apiKeyInput, selectedProvider, dialogReqMode, projectId);
      setOpen(false);
      toast.success("API Key updated successfully");
      execute();
      setIsSubmitLoading(false);
      return;
    }
    toast.error("Invalid API Key");
    setIsSubmitLoading(false);
  };

  useEffect(() => {
    execute();
  }, [execute]);

  if (status === "LOADING") {
    return <SkeletonState patternCount={2} />;
  }

  const openaiKey = availableKeys?.find(
    (key: any) => key.model_provider === "openai"
  );

  return (
    <div>
      <h1 className="p-0 m-0 text-lg font-bold">Model Provider Keys</h1>
      <p className="p-0 m-0 mb-4 text-sm text-neutral-600">
        Connect to OpenAI, Gemini, Anthropic, LLaMa 2 and more.
      </p>

      <div className="flex flex-col p-2">
        <div className="flex flex-row items-center p-2 space-x-4">
          <Image
            src="/modelprovider/openai.png"
            alt="OpenAI"
            height={20}
            width={20}
          />
          <p className="text-sm font-semibold min-w-[100px] max-w-[100px]">
            OpenAI
          </p>
          {openaiKey ? (
            <pre className="p-2 text-sm rounded-lg bg-neutral-100">
              {sensitizeKey(openaiKey.api_key!, 3, 4, 10)}
            </pre>
          ) : (
            <Button
              variant="outline"
              className="text-sm h-[28px]"
              onClick={() => {
                setSelectedProvider("openai");
                setOpen(true);
                setDialogReqMode("post");
              }}
            >
              Connect
            </Button>
          )}
          <Button
            variant="ghost"
            className="h-2 p-0 text-green-700"
            onClick={() => {
              setSelectedProvider("openai");
              setOpen(true);
              setDialogReqMode("put");
            }}
          >
            <Pencil className="w-4" />
          </Button>
        </div>
        <div className="flex flex-row items-center p-2 space-x-4 opacity-50 cursor-not-allowed">
          <Image
            src="/modelprovider/meta.png"
            alt="Meta"
            height={20}
            width={20}
          />
          <p className="text-sm font-semibold min-w-[100px] max-w-[100px]">
            LLaMa 2
          </p>
          <Button variant="outline" className="text-sm h-[28px]">
            Connect
          </Button>
          <p className="text-sm font-semibold min-w-[100px] max-w-[100px]">
            Coming Soon!
          </p>
        </div>
        <Dialog open={open} onOpenChange={(bool: boolean) => setOpen(bool)}>
          <DialogContent className="w-[850px]">
            <DialogHeader>
              <DialogTitle className="mb-0">OpenAI</DialogTitle>
            </DialogHeader>
            <p>Insert your API Key below.</p>
            <p className=" text-neutral-500">
              Visit this
              <Button
                variant="link"
                onClick={() => {
                  window.open("https://platform.openai.com/api-keys");
                }}
                className="p-0 mx-2 mb-3 text-blue-500 h-fit text-md"
              >
                link
              </Button>
              for more information.
            </p>
            <Input
              placeholder="sk-*********************************"
              autoFocus
              type="text"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
            />
            <DialogFooter>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateKey} disabled={isSubmitLoading}>
                Connect
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
