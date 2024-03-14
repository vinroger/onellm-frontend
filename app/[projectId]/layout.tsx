"use client";

import Layout from "@/components/TopLayout";
import { Toaster } from "@/components/ui/sonner";
import ProjectProvider from "@/utils/contexts/useProject";
import { useParams } from "next/navigation";

export default function Index({ children }: { children: React.ReactNode }) {
  const { projectId } = useParams<{ projectId: string }>() as {
    projectId: string;
  };

  return (
    <ProjectProvider projectId={projectId}>
      {children}
      <Toaster />
    </ProjectProvider>
  );
}
