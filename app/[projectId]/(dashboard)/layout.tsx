"use client";

import { ErrorBoundary } from "@/components/errorboundary";
import Layout from "@/components/TopLayout";
import { Toaster } from "@/components/ui/sonner";
import { useProjectContext } from "@/utils/contexts/useProject";

export default function Index({ children }: { children: React.ReactNode }) {
  const { name: projectId } = useProjectContext();

  return (
    <Layout>
      <ErrorBoundary name={"Error"}>
        {children}
        <Toaster />
      </ErrorBoundary>
    </Layout>
  );
}
