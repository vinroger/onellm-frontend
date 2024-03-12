"use client";

import Layout from "@/components/TopLayout";
import { Toaster } from "@/components/ui/sonner";

export default function Index({ children }: { children: React.ReactNode }) {
  return (
    <Layout>
      {children}
      <Toaster />
    </Layout>
  );
}
