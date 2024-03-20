import React from "react";
import { Metadata } from "next";
import Experiment from "./experiment";

export const metadata: Metadata = {
  title: "OneLLM - Experiments",
};

function Index() {
  return <Experiment />;
}

export default Index;
