"use client";

import React, { useCallback, useEffect } from "react";
import { DataPoint } from "@/types/table";
import axios from "axios";
import { usePathname } from "next/navigation";
import Details from "./details";
import Files from "./files";

const fetchDatapoints = async (datasetId: string) => {
  const response = await axios.get(`/api/v1/datapoints/${datasetId}`);
  return response.data;
};

function Dataset() {
  const [datapoints, setDatapoints] = React.useState<DataPoint[]>([]);
  const [loading, setLoading] = React.useState(false);

  const pathname = usePathname();
  const datasetId = pathname?.split("/dataset/")[1];

  if (!datasetId) {
    throw new Error("No dataset id");
  }

  const loadDatapoints = useCallback(async () => {
    setLoading(true);
    const fetchedDatapoints = await fetchDatapoints(datasetId);

    setDatapoints(fetchedDatapoints);
    setLoading(false);
  }, [datasetId, setDatapoints, setLoading]);

  useEffect(() => {
    loadDatapoints();
  }, [loadDatapoints]);

  // Context stuff
  const [activeDatapointId, setActiveDatapointId] = React.useState<string>("");

  const activeDatapoint = datapoints.find(
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
          refetch={loadDatapoints}
        />
      </div>
      <div className="flex flex-1 max-h-full overflow-scroll bg-white rounded-lg">
        <Details datapoint={activeDatapoint} refetch={loadDatapoints} />
      </div>
    </div>
  );
}

export default Dataset;