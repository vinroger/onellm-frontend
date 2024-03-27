"use client";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import Layout from "@/components/TopLayout";
import { Toaster } from "@/components/ui/sonner";

export default function Index({ children }: { children: React.ReactNode }) {
  return (
    <Layout>
      <ErrorBoundary name={"Error"}>{children}</ErrorBoundary>
    </Layout>
  );
}
