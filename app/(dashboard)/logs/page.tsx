import { Metadata } from "next";
import Logs from "./logs";

export const metadata: Metadata = {
  title: "OneLLM - LLM Logs",
};

export default function Page() {
  return (
    <div>
      <Logs />
    </div>
  );
}
