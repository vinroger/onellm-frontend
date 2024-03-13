import React from "react";
import { Metadata } from "next";
import Dataset from "./dataset";

export const metadata: Metadata = {
  title: "OneLLM - Dataset",
};

function Index() {
  return <Dataset />;
}

export default Index;
