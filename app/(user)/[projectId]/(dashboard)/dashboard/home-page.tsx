"use client";

import ModelChartComponent from "./(components)/modelchart";
import RequestChartComponent from "./(components)/requestchart";

export default function Home() {
  return (
    <div className="p-7">
      <p className="text-lg font-semibold mb-5">Dashboard</p>
      <div
        className="grid grid-cols-12 gap-4"
        // style={{ height: "calc(100vh - 100px)" }}
      >
        <ModelChartComponent className="p-7 col-span-3 max-h-[450px] min-h-[150px]" />
        <RequestChartComponent className="p-7 col-span-12 h-[450px]" />
      </div>
    </div>
  );
}
