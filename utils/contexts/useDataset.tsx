"use client";

import React, { createContext, useCallback, useEffect, useMemo } from "react";
import axios from "axios";
import { DataPoint, DataSet } from "@/types/table";
import { set } from "react-hook-form";
import { useDebounceCallback } from "usehooks-ts";

type DatasetContextType = {
  dataset: DataSet;
  fetchDataset: () => void;
  datapoints: DataPoint[];
  fetchDatapoints: () => void;
  updateDataset: (payload: Partial<DataSet>) => void;
  updateDatapoint: (
    datapointId: string,
    payload: Partial<DataPoint>,
    debouncedMs?: number
  ) => void;
  loading: boolean;
  deleteDatapoint: (datapointId: string) => void;
  activeDatapointId: string;
  setActiveDatapointId: (id: string) => void;
  activeDatapoint: DataPoint | undefined;
  setDatapoints: (datapoints: DataPoint[]) => void;
};

const DatasetContext = createContext<DatasetContextType>({
  dataset: {
    id: "",
    name: "",
    description: "",
    integration_id: "",
    owner_id: "",
    project_id: "",
    created_at: null,
    updated_at: null,
  },
  fetchDataset: () => {},
  datapoints: [],
  fetchDatapoints: () => {},
  updateDataset: () => {},
  updateDatapoint: () => {},
  loading: false,
  deleteDatapoint: () => {},
  activeDatapointId: "",
  setActiveDatapointId: () => {},
  activeDatapoint: undefined,
  setDatapoints: () => {},
});

const DatasetProvider = ({
  datasetId,
  children,
}: {
  datasetId: string;
  children: React.ReactNode;
}) => {
  const [datasets, setDataset] = React.useState<DataSet>({
    id: datasetId,
    name: "",
    description: "",
    integration_id: "",
    owner_id: "",
    project_id: "",
    created_at: null,
    updated_at: null,
  });

  const [datapoints, setDatapoints] = React.useState<DataPoint[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [activeDatapointId, setActiveDatapointId] = React.useState<string>("");

  const fetchDataset = useCallback(async () => {
    setLoading(true);
    const res = await axios.get(`/api/v1/datasets/${datasetId}`);
    setDataset(res.data);
    setLoading(false);
  }, [datasetId, setDataset, setLoading]);

  const fetchDatapoints = useCallback(async () => {
    setLoading(true);
    const response = await axios.get("/api/v1/datapoints", {
      params: {
        datasetId,
      },
    });
    setDatapoints(response.data);
    setLoading(false);
  }, [datasetId, setDatapoints, setLoading]);

  useEffect(() => {
    fetchDataset();
  }, [fetchDataset]);

  useEffect(() => {
    fetchDatapoints();
  }, [fetchDatapoints]);

  const updateDataset = useCallback(
    async (payload: Partial<DataSet>) => {
      setLoading(true);
      setDataset((prev) => {
        return { ...prev, ...payload };
      });
      await axios.put(`/api/v1/datasets/${datasets.id}`, payload);
      setLoading(false);
    },
    [datasets.id]
  );

  const request = useDebounceCallback(
    async (datapointId: string, payload: Partial<DataPoint>) => {
      await axios.put(`/api/v1/datapoints/${datapointId}`, payload);
      setLoading(false);
    },
    1000
  );

  const updateDatapoint = useCallback(
    async (
      datapointId: string,
      payload: Partial<DataPoint>,
      debouncedMs?: number
    ) => {
      setLoading(true);
      setDatapoints((prev) => {
        return prev.map((d) => {
          if (d.id === datapointId) {
            return { ...d, ...payload };
          }
          return d;
        });
      });

      if (debouncedMs) {
        await request(datapointId, payload);
      } else {
        await axios.put(`/api/v1/datapoints/${datapointId}`, payload);
      }

      setLoading(false);
    },
    [request]
  );

  const deleteDatapoint = useCallback(
    async (datapointId: string) => {
      setLoading(true);
      setDatapoints((prev) => {
        return prev.filter((d) => d.id !== datapointId);
      });
      await axios.delete(`/api/v1/datapoints/${datapointId}`);
      setLoading(false);
    },
    [setDatapoints]
  );

  const activeDatapoint =
    datapoints[
      datapoints.findIndex((datapoint) => datapoint.id === activeDatapointId)
    ];

  const value = useMemo(() => {
    return {
      dataset: datasets,
      fetchDataset,
      datapoints,
      fetchDatapoints,
      updateDataset,
      updateDatapoint,
      loading,
      deleteDatapoint,
      activeDatapointId,
      setActiveDatapointId,
      activeDatapoint,
      setDatapoints,
    };
  }, [
    datasets,
    fetchDataset,
    datapoints,
    fetchDatapoints,
    updateDataset,
    updateDatapoint,
    loading,
    deleteDatapoint,
    activeDatapointId,
    setActiveDatapointId,
    activeDatapoint,
    setDatapoints,
  ]);

  return (
    <DatasetContext.Provider value={value}>{children}</DatasetContext.Provider>
  );
};

export function useDatasetContext(): DatasetContextType {
  const context = React.useContext(DatasetContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a Project Provider");
  }

  return context;
}

export default DatasetProvider;
