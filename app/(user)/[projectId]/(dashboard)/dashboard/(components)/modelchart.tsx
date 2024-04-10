import React, { useEffect } from "react";
import axios from "axios";
import { scaleLinear } from "d3-scale";

import { useProjectContext } from "@/utils/contexts/useProject";
import useAsync from "@/utils/hooks/useAsync";
import SkeletonState from "@/components/SkeletonState";
import { useHasOpenAIKey } from "@/utils/hooks/useHasOpenAIKey";
import NonIdealState from "@/components/NonIdealState";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { BarList, Card } from "@tremor/react";
import { cn } from "@/lib/utils";

const chatGptIcon = () => (
  <img src="/assets/chatgptlogo.jpeg" className="h-5 rounded-lg mr-1" />
);

export default function ModelChartComponent({
  className,
}: {
  className?: string;
}) {
  const { projectId } = useProjectContext();
  const { execute, value, status } = useAsync(async () => {
    const response = await axios.get("/api/v1/models", {
      params: {
        projectId,
      },
    });

    return response.data;
  });

  useEffect(() => {
    execute();
  }, [execute]);

  const { hasOpenAIKey } = useHasOpenAIKey();
  const router = useRouter();

  if (status === "LOADING" || value === undefined) {
    return <SkeletonState patternCount={1} />;
  }

  const fineTunedCount = value?.filter(
    (model: any) => model.type === "fine-tune"
  ).length;

  const baseCount = value?.filter((model: any) => model.type === "base").length;

  const data: any[] = [
    {
      name: "OpenAI Fine-Tuned",
      value: fineTunedCount,
      icon: chatGptIcon,
    },
    {
      name: "OpenAI Base",
      value: baseCount,
      icon: chatGptIcon,
    },
  ];

  const minValue = 0;
  const maxValue = 50;

  const getColor = scaleLinear<string>()
    .domain([minValue, maxValue]) // input range
    .range(["#c8e6c9", "#1b5e20"]);

  return (
    <Card className={cn(className)}>
      <p className="font-semibold">Models</p>
      <div className="h-full w-full">
        {!hasOpenAIKey && (
          <div className="absolute z-30">
            <NonIdealState
              additionalComponent={
                <div className="mt-5">
                  <Button onClick={() => router.push(`/${projectId}/settings`)}>
                    Provide API Key →
                  </Button>
                </div>
              }
            />
          </div>
        )}

        {hasOpenAIKey && (
          <BarList
            data={data}
            className="mt-2 text-xs font-semibold"
            color="neutral-300"
          />
        )}
      </div>
    </Card>
  );
}
