"use client";

import TopNavbar from "@/components/topnavbar";
import { DataSet, Evaluation } from "@/types/table";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { useProjectContext } from "@/utils/contexts/useProject";
import EvaluationProvider from "@/utils/contexts/useEvaluation";

// const NAVBAR_WIDTH = "220px";

const fetchDataset = async (id: string) => {
  const response = await axios.get(`/api/v1/evaluations/${id}`);
  return response.data;
};

const updateDatasetName = async (id: string, title: string) => {
  const response = await axios.put(`/api/v1/evaluations/${id}`, { title });
  return response.data;
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const id = pathname?.split("/experiment/")[1];

  const { projectId } = useProjectContext();

  const [experiment, setExperiment] = useState<Evaluation>();
  if (!id) {
    throw new Error("No id");
  }

  const loadDataset = async () => {
    const fetchedDataset = await fetchDataset(id);

    setExperiment(fetchedDataset);
  };

  useEffect(() => {
    loadDataset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const breadcrumbs = [
    { link: `/${projectId}/dashboard`, title: "Home", type: "link" },
    { link: `/${projectId}/experiment`, title: "Experiment", type: "link" },
    {
      title: experiment?.title ?? "",
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
        <EvaluationProvider evaluationId={id}>{children}</EvaluationProvider>
      </div>
      <Toaster />
    </div>
  );
}
