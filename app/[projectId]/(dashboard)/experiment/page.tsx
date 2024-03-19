import { Metadata } from "next";

import Experiment from "./experiment";

export const metadata: Metadata = {
  title: "OneLLM - Experiment",
};

export default function Page() {
  return (
    <div>
      <Experiment />
    </div>
  );
}
