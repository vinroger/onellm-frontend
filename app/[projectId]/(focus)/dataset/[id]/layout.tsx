"use client";

import TopNavbar from "@/components/topnavbar";
import { DataSet } from "@/types/table";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { useProjectContext } from "@/utils/contexts/useProject";
import DatasetProvider from "@/utils/contexts/useDataset";

// const NAVBAR_WIDTH = "220px";

const fetchDataset = async (id: string) => {
  const response = await axios.get(`/api/v1/datasets/${id}`);
  return response.data[0];
};

const updateDatasetName = async (id: string, name: string) => {
  const response = await axios.put(`/api/v1/datasets/${id}`, { name });
  return response.data;
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const id = useMemo(() => pathname?.split("/dataset/")[1], [pathname]);

  const { projectId } = useProjectContext();

  const [dataset, setDataset] = useState<DataSet>();
  if (!id) {
    throw new Error("No id");
  }

  const loadDataset = async () => {
    const fetchedDataset = await fetchDataset(id);

    setDataset(fetchedDataset);
  };

  useEffect(() => {
    loadDataset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const breadcrumbs = [
    { link: `/${projectId}/dashboard`, title: "Home", type: "link" },
    { link: `/${projectId}/dataset`, title: "Dataset", type: "link" },
    {
      title: dataset?.name ?? "",
      type: "editable",
      onEdit: (text: string) => {
        updateDatasetName(id, text);
      },
    },
  ];

  return (
    <div className="flex flex-col w-screen max-h-screen min-h-screen">
      <TopNavbar breadcrumbs={breadcrumbs} />
      <div className="flex flex-1 overflow-scroll bg-neutral-50">
        <DatasetProvider datasetId={id}>{children}</DatasetProvider>
      </div>
      <Toaster />
    </div>
  );
}
