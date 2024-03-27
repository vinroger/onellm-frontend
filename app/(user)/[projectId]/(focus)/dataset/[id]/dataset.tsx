"use client";

import React, { useCallback, useEffect } from "react";
import { DataPoint } from "@/types/table";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useDatasetContext } from "@/utils/contexts/useDataset";
import Details from "./(components)/details";
import Files from "./(components)/files";

const fetchDatapoints = async (datasetId: string) => {
  const response = await axios.get("/api/v1/datapoints", {
    params: {
      datasetId,
    },
  });
  return response.data;
};

function Dataset() {
  const pathname = usePathname();
  const datasetId = pathname?.split("/dataset/")[1];

  if (!datasetId) {
    throw new Error("No dataset id");
  }

  const { datapoints, loading } = useDatasetContext();

  // Context stuff
  const { activeDatapointId, setActiveDatapointId } = useDatasetContext();

  useEffect(() => {
    const handleArrowKeys = (e: any) => {
      const activeDatapointIdx = datapoints.findIndex(
        (datapoint) => datapoint.id === activeDatapointId
      );

      if (e.key === "ArrowLeft" && activeDatapointIdx > 0) {
        setActiveDatapointId(datapoints[activeDatapointIdx - 1].id);
      }
      if (
        e.key === "ArrowRight" &&
        activeDatapointIdx < datapoints.length - 1
      ) {
        setActiveDatapointId(datapoints[activeDatapointIdx + 1].id);
      }
      if (e.key === "ArrowUp" && activeDatapointIdx > 0) {
        setActiveDatapointId(datapoints[activeDatapointIdx - 1].id);
      }
      if (e.key === "ArrowDown" && activeDatapointIdx < datapoints.length - 1) {
        setActiveDatapointId(datapoints[activeDatapointIdx + 1].id);
      }
    };
    window.addEventListener("keydown", handleArrowKeys);
    return () => {
      window.removeEventListener("keydown", handleArrowKeys);
    };
  }, [activeDatapointId, datapoints, setActiveDatapointId]);

  const activeDatapointIdx = datapoints.findIndex(
    (datapoint) => datapoint.id === activeDatapointId
  );

  return (
    <div className="flex flex-row min-w-full min-h-full space-x-2 p-7">
      <div className="flex overflow-scroll max-h-full w-[300px] bg-white rounded-lg ">
        <Files
          loading={loading}
          datapoints={datapoints}
          setActiveDatapointId={setActiveDatapointId}
          activeDatapointId={activeDatapointId}
        />
      </div>
      <div className="flex flex-1 max-h-full overflow-scroll bg-white rounded-lg">
        <Details />
      </div>
    </div>
  );
}

export default Dataset;
