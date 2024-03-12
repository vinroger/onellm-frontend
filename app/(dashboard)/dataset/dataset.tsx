"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DataSet } from "@/types/table";
import { toHumanDateString } from "@/utils/functions/date";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function DatasetCard({
  datasetName,
  description,
  lastEdited,
  datasetId,
}: {
  datasetName: string;
  description: string | null;
  lastEdited: string;
  datasetId: string;
}) {
  const router = useRouter();
  return (
    <Card
      className="p-4 cursor-pointer hover:bg-neutral-100"
      onClick={() => {
        router.push(`/dataset/${datasetId}`);
      }}
    >
      <div className="space-y-1">
        <h1 className="p-0 m-0 font-semibold text-md">{datasetName}</h1>
        <p className="p-0 m-0 text-sm text-neutral-600">{description}</p>
        <p className="p-0 m-0 mb-2 text-sm text-neutral-600">
          Last Edited at {lastEdited}
        </p>
      </div>
    </Card>
  );
}

const fetchDataset = async () => {
  const response = await axios.get("/api/v1/datasets/");
  return response.data;
};

function Dataset() {
  const [datasets, setDatasets] = useState<DataSet[]>();

  const loadDataset = async () => {
    const fetchedDatasets = await fetchDataset();
    console.log(
      "%capp/(dashboard)/dataset/dataset.tsx:49 fetchedDatasets",
      "color: #007acc;",
      fetchedDatasets
    );
    setDatasets(fetchedDatasets);
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
          <Button> + Create New Dataset</Button>
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
            />
          ))
        ) : (
          <>Loading</>
        )}
      </div>
    </div>
  );
}

export default Dataset;
