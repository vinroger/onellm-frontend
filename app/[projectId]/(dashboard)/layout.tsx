"use client";

import Layout from "@/components/TopLayout";
import { Toaster } from "@/components/ui/sonner";
import { useProjectContext } from "@/utils/contexts/useProject";

export default function Index({ children }: { children: React.ReactNode }) {
  const { name: projectId } = useProjectContext();

  return (
    <Layout>
      {children}
      <Toaster />
    </Layout>
  );
}
