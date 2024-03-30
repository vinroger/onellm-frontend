"use client";

import { Card } from "@/components/ui/card";
import ModelChart from "./modelchart";

export default function Home() {
  return (
    <div className="p-7">
      <p className="text-lg font-semibold mb-5">Dashboard</p>
      <Card className="p-7 w-1/3 h-[200px]">
        <p className="font-semibold">Models</p>
        <ModelChart />
      </Card>
    </div>
  );
}
