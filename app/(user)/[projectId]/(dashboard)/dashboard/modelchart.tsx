import React, { FC, useEffect } from "react";
import { ResponsiveBar } from "@nivo/bar";
import axios from "axios";
import { scaleLinear } from "d3-scale";

import { useProjectContext } from "@/utils/contexts/useProject";
import useAsync from "@/utils/hooks/useAsync";
import SkeletonState from "@/components/SkeletonState";
import { useHasOpenAIKey } from "@/utils/hooks/useHasOpenAIKey";
import NonIdealState from "@/components/NonIdealState";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function ModelChart() {
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
      type: "Fine-Tuned",
      count: fineTunedCount,
    },
    {
      type: "Base",
      count: baseCount,
    },
  ];

  const minValue = 0;
  const maxValue = 50;

  const getColor = scaleLinear<string>()
    .domain([minValue, maxValue]) // input range
    .range(["#c8e6c9", "#1b5e20"]);

  return (
    <div className="h-full w-full">
      {!hasOpenAIKey && (
        <div className="absolute z-30">
          <NonIdealState
            title="No API Key"
            description="You need to provide an OpenAI API Key to view this chart."
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

      {hasOpenAIKey && (
        <ResponsiveBar
          data={data}
          keys={["count"]}
          indexBy="type"
          margin={{ left: 70 }}
          padding={0.3}
          valueScale={{ type: "linear" }}
          indexScale={{ type: "band", round: true }}
          colors={(bar) => getColor(bar.data.count as number)}
          colorBy="indexValue"
          borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          axisTop={null}
          axisRight={null}
          axisBottom={null}
          layout="horizontal"
          labelSkipWidth={12}
          labelSkipHeight={12}
          animate={true}
        />
      )}
    </div>
  );
}
